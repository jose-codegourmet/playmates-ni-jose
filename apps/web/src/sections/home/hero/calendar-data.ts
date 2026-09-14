import { getState } from "@fe-template/mocks";
import { getPublicSession, listPublicSessions } from "@/lib/playmates";
import type { CalendarSession } from "./HomeHeroSection.types";

/** Accept provider links only; never forward arbitrary iframe URLs. */
export function youtubeEmbed(url?: string | null): string | undefined {
  if (!url) return;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return;
    const host = parsed.hostname.replace(/^www\./, "");
    let id: string | null | undefined;
    if (host === "youtu.be") id = parsed.pathname.split("/")[1];
    else if (["youtube.com", "m.youtube.com", "youtube-nocookie.com"].includes(host)) {
      id =
        parsed.pathname === "/watch"
          ? parsed.searchParams.get("v")
          : /^\/(?:embed|shorts|live)\/([^/]+)/.exec(parsed.pathname)?.[1];
    }
    if (id && /^[\w-]{11}$/.test(id)) return `https://www.youtube-nocookie.com/embed/${id}`;
  } catch {
    /* Missing or malformed links render an empty player. */
  }
}

function safeLink(value: string | null | undefined): string | undefined {
  try {
    const url = new URL(value ?? "");
    return url.protocol === "https:" ? url.toString() : undefined;
  } catch {
    return;
  }
}

export async function fetchCalendarSessions(): Promise<CalendarSession[]> {
  const listed = await listPublicSessions();
  const details = await Promise.all(
    listed.map((session) => (session.slug ? getPublicSession(session.slug) : null)),
  );
  const assets = getState().providerAssets;
  return details.flatMap((detail) => {
    if (!detail) return [];
    return [
      {
        id: detail.session.id,
        date: detail.session.sessionDate,
        title: detail.session.title,
        venue: detail.venue?.name ?? "Venue not recorded",
        address: detail.venue?.address ?? null,
        court: detail.court?.name ?? null,
        club: detail.session.clubName ?? null,
        notes: detail.session.notes,
        games: detail.games.map((game) => ({
          id: game.id,
          number: game.gameNumber,
          title: game.title,
          notes: game.notes,
          format:
            game.teams.length === 2 && game.teams.every((team) => team.players.length === 2)
              ? "Doubles"
              : game.teams.length === 2 && game.teams.every((team) => team.players.length === 1)
                ? "Singles"
                : "Format not recorded",
          teams: game.teams.map((team) => ({
            number: team.teamNo,
            label: team.label ?? `Team ${team.teamNo}`,
            players: team.players.map((player) => player.displayName),
          })),
          winnerTeamNo: game.winnerTeamNo,
          scores: game.scores,
          recordings: game.recordings
            .slice()
            .sort((a, b) => a.partNumber - b.partNumber)
            .map((recording) => {
              const links = assets.filter((asset) => asset.recordingId === recording.id);
              const youtube = links.find((asset) => asset.provider === "youtube");
              const drive = links.find((asset) => asset.provider === "google_drive");
              return {
                id: recording.id,
                side: recording.cameraSide,
                part: recording.partNumber,
                youtubeUrl: safeLink(youtube?.url),
                embedUrl: youtubeEmbed(youtube?.url) ?? youtubeEmbed(youtube?.embedUrl),
                driveUrl: safeLink(drive?.url),
              };
            }),
        })),
      },
    ];
  });
}
