"use client";

import {
  Button,
  cn,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@fe-template/ui";
import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CirclePlay,
  MapPin,
  MapPinned,
  Play,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarGroup } from "@/components/jabkit/avatar/Avatar";
import { Button as CalendarButton } from "@/components/jabkit/button";
import type { FullscreenCalendarDay } from "@/components/jabkit/fullscreen-calendar";
import { YoutubeEmbed } from "@/sections/_shared/youtube-embed/YoutubeEmbed";
import type { CalendarGame, CalendarSession, HomeHeroSectionProps } from "./HomeHeroSection.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const dateValue = (value: string) => new Date(`${value}T12:00:00`);
const dateKey = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
const longDate = (value: string) =>
  dateValue(value).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
const matchup = (game: CalendarGame) =>
  game.teams.map((team) => team.players.join(" & ") || team.label).join(" vs ") ||
  "Players not recorded";

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function PlayerAvatar({
  name,
  teamNumber,
  large = false,
}: {
  name: string;
  teamNumber: number;
  large?: boolean;
}) {
  return (
    <Avatar size={large ? "lg" : "default"} aria-label={name}>
      <AvatarFallback
        className={cn(
          "font-display font-bold",
          teamNumber === 1
            ? "bg-primary text-primary-foreground"
            : "bg-secondary text-secondary-foreground",
        )}
      >
        {initials(name)}
      </AvatarFallback>
    </Avatar>
  );
}

function GameLineup({ game }: { game: CalendarGame }) {
  return (
    <div className="flex shrink-0 items-center gap-1.5" aria-hidden="true">
      {game.teams.map((team, index) => (
        <div key={team.number} className="flex items-center gap-1.5">
          {index > 0 && <span className="text-[10px] font-bold text-muted-foreground">VS</span>}
          <AvatarGroup>
            {team.players.map((player) => (
              <PlayerAvatar key={player} name={player} teamNumber={team.number} />
            ))}
          </AvatarGroup>
        </div>
      ))}
    </div>
  );
}

/** Public archive adaptation of JabKit FullscreenCalendar. Registry source stays pristine. */
export function HomeHeroSection({ sessions, today, className }: HomeHeroSectionProps) {
  const [month, setMonth] = useState(
    () => new Date(dateValue(today).getFullYear(), dateValue(today).getMonth(), 1),
  );
  const monthLabel = month.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const first = new Date(month.getFullYear(), month.getMonth(), 1);
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weeks = Math.ceil((first.getDay() + dayCount) / 7);
  const days = Array.from(
    { length: weeks * 7 },
    (_, index) => new Date(month.getFullYear(), month.getMonth(), index - first.getDay() + 1),
  );
  const data: FullscreenCalendarDay[] = days.map((day) => ({
    day,
    events: sessions
      .filter((session) => session.date === dateKey(day))
      .map((session) => ({
        id: session.id,
        name: session.venue,
        time: `${session.games.length} ${session.games.length === 1 ? "game" : "games"}`,
      })),
  }));

  return (
    <section
      data-slot="home-calendar"
      aria-label="Badminton session calendar"
      className={cn(
        "flex min-h-[calc(100svh-4rem)] flex-col border-b bg-background text-foreground",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b px-4 py-5 sm:px-8">
        <h1
          className="font-display text-2xl font-semibold tracking-tight sm:text-3xl"
          aria-live="polite"
        >
          {monthLabel}
        </h1>
        <div className="flex items-center gap-2">
          <CalendarButton
            variant="secondary"
            size="sm"
            onClick={() =>
              setMonth(new Date(dateValue(today).getFullYear(), dateValue(today).getMonth(), 1))
            }
          >
            Today
          </CalendarButton>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Previous month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Next month"
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
          >
            <ChevronRight />
          </Button>
        </div>
      </header>
      <div className="grid grid-cols-7 border-b text-center text-[10px] font-medium uppercase tracking-wider text-muted-foreground sm:text-xs">
        {WEEKDAYS.map((day) => (
          <div key={day} className="border-r py-3 last:border-r-0">
            {day}
          </div>
        ))}
      </div>
      <div
        className="grid flex-1 grid-cols-7"
        style={{ gridTemplateRows: `repeat(${weeks}, minmax(6rem, 1fr))` }}
      >
        {data.map(({ day, events }) => {
          const key = dateKey(day);
          const inMonth = day.getMonth() === month.getMonth();
          return (
            <div
              key={key}
              className={cn(
                "min-w-0 border-r border-b p-1 sm:p-2 [&:nth-child(7n)]:border-r-0",
                !inMonth && "bg-muted/40 text-muted-foreground",
              )}
            >
              <time
                dateTime={key}
                aria-current={key === today ? "date" : undefined}
                className={cn(
                  "mb-2 ml-auto flex size-7 items-center justify-center rounded-full text-xs tabular-nums",
                  key === today && "bg-primary font-bold text-primary-foreground",
                )}
              >
                {day.getDate()}
              </time>
              <div className="flex flex-col gap-1.5">
                {inMonth &&
                  events.map((event) => {
                    const session = sessions.find((item) => item.id === event.id);
                    return session ? <SessionEvent key={event.id} session={session} /> : null;
                  })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function SessionEvent({ session }: { session: CalendarSession }) {
  const [game, setGame] = useState<CalendarGame | null>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Focus follows switches between session and game views.
  useEffect(() => {
    // Announce the new dialog view and reset its scroll position.
    titleRef.current?.focus();
  }, [game]);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setGame(null);
      }}
    >
      <DialogTrigger
        aria-label={`${session.venue}, ${longDate(session.date)}, ${session.games.length} games`}
        className="w-full rounded-md border border-primary/20 bg-primary/10 p-1 text-left transition-colors hover:bg-primary/20 focus-visible:outline-2 focus-visible:outline-ring sm:p-2"
      >
        <span className="block break-words text-[10px] font-semibold leading-snug sm:text-xs">
          {session.venue}
        </span>
        <span className="mt-1 block text-[9px] text-muted-foreground sm:text-[11px]">
          {session.games.length} {session.games.length === 1 ? "game" : "games"}
        </span>
      </DialogTrigger>
      <DialogContent className="max-h-[90svh] max-w-[calc(100vw_-_2rem)] overflow-y-auto border border-border/70 bg-popover p-0 shadow-2xl sm:max-w-3xl">
        {game ? (
          <div>
            <div className="border-b bg-primary/[0.06] px-5 py-5 sm:px-8 sm:py-6">
              <Button variant="ghost" className="mb-4 -ml-2" onClick={() => setGame(null)}>
                <ArrowLeft /> Back to session
              </Button>
              <div className="flex items-start gap-4">
                <div className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground sm:flex">
                  <CirclePlay className="size-6" />
                </div>
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    {game.format} · Game {String(game.number ?? "—").padStart(2, "0")}
                  </p>
                  <DialogTitle
                    ref={titleRef}
                    tabIndex={-1}
                    className="pr-6 font-display text-2xl outline-none sm:text-3xl"
                  >
                    {game.title || matchup(game)}
                  </DialogTitle>
                  <DialogDescription className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {longDate(session.date)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPinned className="size-3.5" />
                      {session.venue}
                      {session.court ? ` · ${session.court}` : ""}
                    </span>
                    {session.club ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {session.club}
                      </span>
                    ) : null}
                  </DialogDescription>
                </div>
              </div>
            </div>
            <div className="space-y-6 px-5 py-6 sm:px-8 sm:py-8">
              <GameDetails key={game.id} game={game} />
            </div>
          </div>
        ) : (
          <div>
            <div className="border-b bg-primary/[0.06] px-5 py-6 sm:px-8 sm:py-8">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Badminton session
              </p>
              <DialogTitle
                ref={titleRef}
                tabIndex={-1}
                className="pr-6 font-display text-2xl outline-none sm:text-3xl"
              >
                {session.title || session.venue}
              </DialogTitle>
              <DialogDescription className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="size-3.5" />
                  {longDate(session.date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {session.venue}
                  {session.court ? ` · ${session.court}` : ""}
                </span>
                {session.club ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="size-3.5" />
                    {session.club}
                  </span>
                ) : null}
              </DialogDescription>
              {session.address && (
                <p className="mt-3 text-sm text-muted-foreground">{session.address}</p>
              )}
            </div>
            <div className="px-5 py-6 sm:px-8">
              {session.notes && (
                <p className="mb-5 whitespace-pre-wrap text-sm text-muted-foreground">
                  {session.notes}
                </p>
              )}
              <div className="mb-3 flex items-end justify-between gap-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Games played
                </h2>
                <span className="font-display text-sm font-bold text-primary">
                  {session.games.length} total
                </span>
              </div>
              <ol className="overflow-hidden rounded-2xl border bg-background/70">
                {session.games.map((item) => (
                  <li key={item.id} className="border-b last:border-b-0">
                    <button
                      type="button"
                      onClick={() => setGame(item)}
                      className="group flex w-full items-center gap-3 px-4 py-4 text-left transition-colors hover:bg-primary/[0.06] focus-visible:outline-2 focus-visible:outline-ring sm:gap-4 sm:px-5"
                    >
                      <span className="font-display text-2xl tabular-nums text-muted-foreground">
                        {String(item.number ?? "—").padStart(2, "0")}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs text-muted-foreground">
                          {item.format}
                          {item.title ? ` · ${item.title}` : ""}
                        </span>
                        <span className="mt-1 block font-medium">{matchup(item)}</span>
                      </span>
                      <GameLineup game={item} />
                      <Play className="hidden size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 sm:block" />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GameDetails({ game }: { game: CalendarGame }) {
  const [side, setSide] = useState<"A" | "B" | "UNASSIGNED">(
    game.recordings.find((recording) => recording.side === "A")?.side ??
      game.recordings[0]?.side ??
      "A",
  );
  const recordings = game.recordings.filter((recording) => recording.side === side);
  return (
    <>
      <div className="relative grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-stretch">
        {game.teams.map((team) => (
          <div
            key={team.number}
            className={cn(
              "rounded-2xl border p-4 sm:p-5",
              game.winnerTeamNo === team.number
                ? "border-primary/40 bg-primary/[0.07]"
                : "bg-muted/35",
              team.number === 2 && "sm:col-start-3",
            )}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                {team.label}
              </p>
              {game.winnerTeamNo === team.number && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                  <Trophy className="size-3" />
                  Winner
                </span>
              )}
            </div>
            <div className="space-y-3">
              {team.players.map((player) => (
                <div key={player} className="flex items-center gap-3">
                  <PlayerAvatar name={player} teamNumber={team.number} large />
                  <p className="font-display text-base font-semibold sm:text-lg">{player}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <span className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-[10px] font-black text-muted-foreground shadow-sm sm:flex">
          VS
        </span>
      </div>
      {game.scores?.length ? (
        <p className="text-sm">
          Scores (Team 1–Team 2):{" "}
          {game.scores.map((score) => `${score.team1}–${score.team2}`).join(", ")}
        </p>
      ) : null}
      {game.notes && (
        <p className="whitespace-pre-wrap text-sm text-muted-foreground">{game.notes}</p>
      )}
      <fieldset className="rounded-2xl border bg-muted/25 p-2" aria-label="Court camera view">
        <legend className="px-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Choose camera view
        </legend>
        <div className="flex flex-wrap items-center gap-2">
          {(
            [
              "A",
              "B",
              ...(game.recordings.some((recording) => recording.side === "UNASSIGNED")
                ? ["UNASSIGNED"]
                : []),
            ] as const
          ).map((value) => (
            <Button
              key={value}
              variant={side === value ? "default" : "outline"}
              aria-pressed={side === value}
              onClick={() => setSide(value as typeof side)}
            >
              {value === "UNASSIGNED" ? "Other recordings" : `Side ${value}`}
            </Button>
          ))}
          <span className="ml-auto hidden pr-2 text-xs text-muted-foreground sm:inline">
            Both sides of the court
          </span>
        </div>
      </fieldset>
      {recordings.length ? (
        recordings.map((recording) => (
          <div key={recording.id} className="space-y-3">
            {recordings.length > 1 && (
              <h3 className="text-sm font-medium">Part {recording.part}</h3>
            )}
            <YoutubeEmbed
              embedUrl={recording.embedUrl}
              title={`Game ${game.number ?? ""} · Side ${side} · Part ${recording.part}`}
            />
            <div className="flex flex-wrap gap-5 text-sm font-medium text-primary">
              {recording.youtubeUrl && (
                <a
                  href={recording.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  Open on YouTube
                  <ArrowUpRight className="size-4" />
                </a>
              )}
              {recording.driveUrl && (
                <a
                  href={recording.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 underline-offset-4 hover:underline"
                >
                  Google Drive
                  <ArrowUpRight className="size-4" />
                </a>
              )}
            </div>
          </div>
        ))
      ) : (
        <p className="rounded-lg bg-muted p-8 text-center text-sm text-muted-foreground">
          No recording for this court view yet.
        </p>
      )}
    </>
  );
}
