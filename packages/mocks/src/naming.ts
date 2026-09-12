/**
 * Pure naming / slug / title / Facebook-body generators (PNJ-016).
 *
 * Examples:
 *   formatSessionFolderName("2026-09-09")
 *     → "2026-09-09"
 *   formatSessionDisplayDate("2026-09-09")
 *     → "Sep 9, 2026"
 *   formatRecordingDisplayName({ gameNumber: 1, side: "A", partNumber: 1, partCount: 1 })
 *     → "Game 1 - Side A"   // no “Part” when partCount === 1
 *   formatRecordingDisplayName({ gameNumber: 4, side: "B", partNumber: 2, partCount: 2 })
 *     → "Game 4 - Side B - Part 2"
 *   formatDriveFilename({ date: "2026-09-09", gameNumber: 2, side: "B", partNumber: 2, partCount: 2, ext: "mov" })
 *     → "2026-09-09 - Game 02 - Side B - Part 02.mov"
 *   formatYoutubeTitle({ date: "2026-09-09", gameNumber: 3, team1: ["José", "Carlo"], team2: ["Mika", "Marco"], sideLabel: "Side A" })
 *     → "Sep 9, 2026 | Game 3 | José & Carlo vs Mika & Marco | Side A"
 *   formatMatchup(["José", "Carlo"], ["Mika", "Marco"])
 *     → "José & Carlo vs Mika & Marco"
 *   formatMatchup([], [])
 *     → "Team 1 vs Team 2"
 *   slugify("José Playmates")
 *     → "jose-playmates"
 *   formatGameSlug("2026-09-09", 3)
 *     → "2026-09-09-game-3"
 *   formatFacebookBody({ date: "2026-09-09", gameNumber: 3, team1: ["José", "Carlo"], team2: ["Mika", "Marco"], youtubeUrls: ["https://example.com/yt/1"], driveUrls: ["https://example.com/drive/1"], notes: "Good rallies" })
 *     → title, players, YouTube links, Drive links, notes, #PlaymatesNiJose #Badminton
 */

import type { CameraSide } from "./types";

const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const DEFAULT_FACEBOOK_HASHTAGS = "#PlaymatesNiJose #Badminton";

export type SessionDateInput = Date | string;

export type RecordingNameInput = {
  gameNumber: number;
  side: CameraSide;
  partNumber: number;
  partCount: number;
};

export type DriveFilenameInput = {
  date: SessionDateInput;
  gameNumber: number;
  side: CameraSide;
  partNumber: number;
  partCount: number;
  ext: string;
};

export type YoutubeTitleInput = {
  date: SessionDateInput;
  gameNumber: number;
  team1?: readonly string[] | null;
  team2?: readonly string[] | null;
  sideLabel?: string | null;
};

export type FacebookBodyInput = {
  date: SessionDateInput;
  gameNumber: number;
  team1?: readonly string[] | null;
  team2?: readonly string[] | null;
  youtubeUrls?: readonly string[] | null;
  driveUrls?: readonly string[] | null;
  notes?: string | null;
  hashtags?: string | null;
};

type CalendarParts = { year: number; month: number; day: number };

function calendarParts(date: SessionDateInput): CalendarParts {
  if (typeof date === "string") {
    const iso = date.trim().slice(0, 10);
    const [year, month, day] = iso.split("-").map((part) => Number.parseInt(part, 10));
    if (Number.isFinite(year) && Number.isFinite(month) && Number.isFinite(day)) {
      return { year, month, day };
    }
  } else if (date instanceof Date && !Number.isNaN(date.getTime())) {
    return {
      year: date.getUTCFullYear(),
      month: date.getUTCMonth() + 1,
      day: date.getUTCDate(),
    };
  }
  return { year: 1970, month: 1, day: 1 };
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function toIsoDate(date: SessionDateInput): string {
  const { year, month, day } = calendarParts(date);
  return `${year}-${pad2(month)}-${pad2(day)}`;
}

function cleanNames(names: readonly string[] | null | undefined): string[] {
  if (!names) return [];
  return names.map((name) => name.trim()).filter((name) => name.length > 0);
}

function joinTeam(names: readonly string[]): string {
  return names.join(" & ");
}

function sideLabelFromCamera(side: CameraSide): string | null {
  if (side === "A" || side === "B") return `Side ${side}`;
  return null;
}

function normalizeExt(ext: string): string {
  const trimmed = ext.trim();
  if (!trimmed) return "";
  return trimmed.startsWith(".") ? trimmed.slice(1) : trimmed;
}

/** Session folder: `2026-09-09`. */
export function formatSessionFolderName(date: SessionDateInput): string {
  return toIsoDate(date);
}

/** Session display date: `Sep 9, 2026`. */
export function formatSessionDisplayDate(date: SessionDateInput): string {
  const { year, month, day } = calendarParts(date);
  const monthLabel = MONTH_SHORT[month - 1] ?? "Jan";
  return `${monthLabel} ${day}, ${year}`;
}

/**
 * Recording display name.
 * Omit “Part” when `partCount === 1`.
 * Game 1 Side A part 1 of 1 → `Game 1 - Side A`
 * Game 4 Side B part 2 of 2 → `Game 4 - Side B - Part 2`
 */
export function formatRecordingDisplayName(input: RecordingNameInput): string {
  const parts = [`Game ${input.gameNumber}`];
  const side = sideLabelFromCamera(input.side);
  if (side) parts.push(side);
  if (input.partCount > 1) parts.push(`Part ${input.partNumber}`);
  return parts.join(" - ");
}

/**
 * Drive filename. Game/part numbers are two digits.
 * Single-part files omit “Part”: `2026-09-09 - Game 01 - Side A.mp4`
 * Multi-part: `2026-09-09 - Game 02 - Side B - Part 02.mov`
 */
export function formatDriveFilename(input: DriveFilenameInput): string {
  const stem = [`${toIsoDate(input.date)} - Game ${pad2(input.gameNumber)}`];
  const side = sideLabelFromCamera(input.side);
  if (side) stem.push(side);
  if (input.partCount > 1) stem.push(`Part ${pad2(input.partNumber)}`);
  const ext = normalizeExt(input.ext);
  return ext ? `${stem.join(" - ")}.${ext}` : stem.join(" - ");
}

/**
 * YouTube title. Missing players omit the matchup (never throw).
 * Known: `Sep 9, 2026 | Game 3 | José & Carlo vs Mika & Marco | Side A`
 * Unknown: `Sep 9, 2026 | Game 3 | Side A`
 */
export function formatYoutubeTitle(input: YoutubeTitleInput): string {
  const segments = [formatSessionDisplayDate(input.date), `Game ${input.gameNumber}`];
  const team1 = cleanNames(input.team1);
  const team2 = cleanNames(input.team2);
  if (team1.length > 0 || team2.length > 0) {
    segments.push(formatMatchup(team1, team2));
  }
  const side = input.sideLabel?.trim();
  if (side) segments.push(side);
  return segments.join(" | ");
}

/** `José & Carlo vs Mika & Marco`, or `Team 1 vs Team 2` when a side is empty. */
export function formatMatchup(
  team1Names: readonly string[] | null | undefined,
  team2Names: readonly string[] | null | undefined,
): string {
  const team1 = cleanNames(team1Names);
  const team2 = cleanNames(team2Names);
  return `${team1.length > 0 ? joinTeam(team1) : "Team 1"} vs ${team2.length > 0 ? joinTeam(team2) : "Team 2"}`;
}

/** Lowercase, hyphenated slug with accents stripped. */
export function slugify(text: string): string {
  const stripped = text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return stripped;
}

/** Public game slug: `2026-09-09-game-3`. */
export function formatGameSlug(sessionDate: SessionDateInput, gameNumber: number): string {
  return `${toIsoDate(sessionDate)}-game-${gameNumber}`;
}

/**
 * Facebook Group draft body: title, players, YouTube links, Drive links, notes, hashtags.
 * Never throws on missing players or empty link lists.
 */
export function formatFacebookBody(input: FacebookBodyInput): string {
  const team1 = cleanNames(input.team1);
  const team2 = cleanNames(input.team2);
  const hasPlayers = team1.length > 0 || team2.length > 0;
  const matchup = hasPlayers ? formatMatchup(team1, team2) : null;

  const titleBits = [formatSessionDisplayDate(input.date), `Game ${input.gameNumber}`];
  if (matchup) titleBits.push(matchup);
  const title = titleBits.join(" | ");

  const blocks: string[] = [title];

  if (matchup) {
    blocks.push("", "Players", matchup);
  }

  const youtubeUrls = (input.youtubeUrls ?? []).map((url) => url.trim()).filter(Boolean);
  if (youtubeUrls.length > 0) {
    blocks.push("", "YouTube", ...youtubeUrls);
  }

  const driveUrls = (input.driveUrls ?? []).map((url) => url.trim()).filter(Boolean);
  if (driveUrls.length > 0) {
    blocks.push("", "Drive", ...driveUrls);
  }

  const notes = input.notes?.trim();
  if (notes) {
    blocks.push("", "Notes", notes);
  }

  const hashtags = input.hashtags?.trim() || DEFAULT_FACEBOOK_HASHTAGS;
  blocks.push("", hashtags);

  return blocks.join("\n");
}
