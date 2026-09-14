import type { CalendarSession } from "./HomeHeroSection.types";

export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

export function dateValue(value: string): Date {
  return new Date(`${value}T12:00:00`);
}

export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function longDate(value: string): string {
  return dateValue(value).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function startOfWeek(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
}

export function addDays(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + amount);
}

export function addMonths(date: Date, amount: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + amount, date.getDate());
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function weekLabel(date: Date): string {
  const start = startOfWeek(date);
  const end = addDays(start, 6);
  const startText = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const sameMonth =
    start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
  const endText = sameMonth
    ? String(end.getDate())
    : end.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${startText} - ${endText}, ${end.getFullYear()}`;
}

export function dayLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function sessionsOnDay(sessions: CalendarSession[], day: Date): CalendarSession[] {
  const key = dateKey(day);
  return sessions.filter((session) => session.date === key);
}

export function nearestSessionDate(
  sessions: Pick<CalendarSession, "date">[],
  from: Date,
  direction: 1 | -1,
): Date | null {
  const fromKey = dateKey(from);
  const unique = [...new Set(sessions.map((session) => session.date))].sort();
  const match =
    direction === 1
      ? unique.find((key) => key > fromKey)
      : [...unique].reverse().find((key) => key < fromKey);
  return match ? dateValue(match) : null;
}

export function monthGridDays(anchor: Date): Date[] {
  const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const dayCount = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  const weeks = Math.ceil((first.getDay() + dayCount) / 7);
  return Array.from(
    { length: weeks * 7 },
    (_, index) => new Date(anchor.getFullYear(), anchor.getMonth(), index - first.getDay() + 1),
  );
}

export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}
