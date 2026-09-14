"use client";

import { Button, cn } from "@fe-template/ui";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button as CalendarButton } from "@/components/jabkit/button";
import {
  addDays,
  addMonths,
  dateKey,
  dateValue,
  dayLabel,
  longDate,
  monthGridDays,
  monthLabel,
  nearestSessionDate,
  sessionsOnDay,
  WEEKDAYS,
  weekDays,
  weekLabel,
} from "./calendar-utils";
import type { CalendarSession, HomeHeroSectionProps } from "./HomeHeroSection.types";
import { SessionDialog } from "./SessionDialog";

const CHIP_CAP = 2;

/** Public archive adaptation of JabKit FullscreenCalendar. Registry source stays pristine. */
export function HomeHeroSection({ sessions, today, className }: HomeHeroSectionProps) {
  const [anchor, setAnchor] = useState(() => dateValue(today));
  const monthDays = monthGridDays(anchor);
  const week = weekDays(anchor);
  const weeks = monthDays.length / 7;
  const daySessions = sessionsOnDay(sessions, anchor);
  const previousSession = nearestSessionDate(sessions, anchor, -1);
  const nextSession = nearestSessionDate(sessions, anchor, 1);

  return (
    <section
      data-slot="home-calendar"
      aria-label="Badminton session calendar"
      className={cn(
        "flex min-h-[calc(100svh-4rem)] flex-col border-b-[3px] border-ink bg-background text-foreground",
        className,
      )}
    >
      <header className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-ink px-4 py-5 sm:px-8">
        <h1 className="font-display text-3xl tracking-tight sm:text-5xl" aria-live="polite">
          <span className="md:hidden">{dayLabel(anchor)}</span>
          <span className="hidden md:inline lg:hidden">{weekLabel(anchor)}</span>
          <span className="hidden lg:inline">{monthLabel(anchor)}</span>
        </h1>
        <div className="flex items-center gap-2">
          <CalendarButton variant="secondary" size="sm" onClick={() => setAnchor(dateValue(today))}>
            Today
          </CalendarButton>
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous day"
              onClick={() => setAnchor(addDays(anchor, -1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next day"
              onClick={() => setAnchor(addDays(anchor, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="hidden items-center gap-2 md:flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous week"
              onClick={() => setAnchor(addDays(anchor, -7))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next week"
              onClick={() => setAnchor(addDays(anchor, 7))}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Previous month"
              onClick={() => setAnchor(addMonths(anchor, -1))}
            >
              <ChevronLeft />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Next month"
              onClick={() => setAnchor(addMonths(anchor, 1))}
            >
              <ChevronRight />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col md:hidden">
        <div className="grid grid-cols-7 border-b-2 border-ink">
          {week.map((day) => {
            const key = dateKey(day);
            const selected = key === dateKey(anchor);
            const hasSessions = sessionsOnDay(sessions, day).length > 0;
            return (
              <button
                key={key}
                type="button"
                aria-label={day.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
                aria-pressed={selected}
                aria-current={key === today ? "date" : undefined}
                onClick={() => setAnchor(day)}
                className={cn(
                  "flex flex-col items-center gap-1 border-r-2 border-ink py-3 last:border-r-0",
                  selected && "border-2 border-ink bg-primary text-primary-foreground",
                )}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  {WEEKDAYS[day.getDay()]?.slice(0, 1)}
                </span>
                <span className="text-sm font-bold tabular-nums">{day.getDate()}</span>
                {hasSessions ? (
                  <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                ) : (
                  <span className="size-1.5" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
        <div className="flex flex-1 flex-col gap-4 px-4 py-5">
          <h2 className="font-display text-2xl tracking-tight">{longDate(dateKey(anchor))}</h2>
          {daySessions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {daySessions.map((session) => (
                <SessionDialog key={session.id} session={session} layout="row" />
              ))}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 py-8">
              <p className="nb-box-sm bg-muted p-8 text-center text-sm text-muted-foreground">
                No session on this day
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {previousSession ? (
                  <CalendarButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setAnchor(previousSession)}
                  >
                    Previous session
                  </CalendarButton>
                ) : null}
                {nextSession ? (
                  <CalendarButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setAnchor(nextSession)}
                  >
                    Jump to next session
                  </CalendarButton>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hidden grid-cols-7 border-b-2 border-ink text-center text-[10px] font-bold uppercase tracking-wider text-ink sm:text-xs md:grid">
        {WEEKDAYS.map((day) => (
          <div key={day} className="border-r-2 border-ink py-3 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="hidden flex-1 grid-cols-7 md:grid lg:hidden">
        {week.map((day) => (
          <DayCell
            key={dateKey(day)}
            day={day}
            today={today}
            inMonth={day.getMonth() === anchor.getMonth()}
            sessions={sessionsOnDay(sessions, day)}
            tall
          />
        ))}
      </div>

      <div
        className="hidden flex-1 grid-cols-7 lg:grid"
        style={{ gridTemplateRows: `repeat(${weeks}, minmax(6rem, 1fr))` }}
      >
        {monthDays.map((day) => {
          const inMonth = day.getMonth() === anchor.getMonth();
          return (
            <DayCell
              key={dateKey(day)}
              day={day}
              today={today}
              inMonth={inMonth}
              sessions={inMonth ? sessionsOnDay(sessions, day) : []}
            />
          );
        })}
      </div>
    </section>
  );
}

function DayCell({
  day,
  today,
  inMonth,
  sessions,
  tall = false,
}: {
  day: Date;
  today: string;
  inMonth: boolean;
  sessions: CalendarSession[];
  tall?: boolean;
}) {
  const key = dateKey(day);
  const visible = sessions.slice(0, CHIP_CAP);
  const extra = sessions.length - visible.length;
  return (
    <div
      className={cn(
        "min-w-0 border-r-2 border-b-2 border-ink p-1 sm:p-2 [&:nth-child(7n)]:border-r-0",
        tall && "min-h-[18rem]",
        !inMonth && "bg-muted/40 text-muted-foreground",
      )}
    >
      <time
        dateTime={key}
        aria-current={key === today ? "date" : undefined}
        className={cn(
          "mb-2 ml-auto flex size-7 items-center justify-center text-xs font-bold tabular-nums",
          key === today && "border-2 border-ink bg-primary text-primary-foreground",
        )}
      >
        {day.getDate()}
      </time>
      <div className="flex flex-col gap-1.5">
        {visible.map((session) => (
          <SessionDialog key={session.id} session={session} layout="chip" />
        ))}
        {extra > 0 ? <p className="px-1 text-[11px] text-muted-foreground">+{extra} more</p> : null}
      </div>
    </div>
  );
}
