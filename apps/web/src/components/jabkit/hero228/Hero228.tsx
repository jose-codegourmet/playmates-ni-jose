"use client";

import { type KeyboardEvent, type PointerEvent, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/components/jabkit/lib/cn";
import type { Hero228HeadlinePart, Hero228Portrait, Hero228Props } from "./Hero228.types";

const DEFAULT_HEADLINE: Hero228HeadlinePart[] = [
  { text: "The people who " },
  { text: "shape", italic: true },
  { text: " what we ship" },
];

const DEFAULT_DESCRIPTION =
  "A tight crew of editors, makers, and operators. They take ambitious briefs and leave finished product.";

const DEFAULT_PORTRAITS: Hero228Portrait[] = [
  {
    name: "Amara Cole",
    src: "/assets/fc2d8371236ac90c.webp",
    alt: "Portrait of Amara Cole",
  },
  {
    name: "Julian Voss",
    src: "/assets/2a364f729e4f7c09.webp",
    alt: "Portrait of Julian Voss",
  },
  {
    name: "Noor Elahi",
    src: "/assets/45dad0903fef5d02.webp",
    alt: "Portrait of Noor Elahi",
  },
  {
    name: "Mateo Ruiz",
    src: "/assets/2bd1b12951fdbdb5.webp",
    alt: "Portrait of Mateo Ruiz",
  },
  {
    name: "Iris Chen",
    src: "/assets/d111cc60a8f2bf68.webp",
    alt: "Portrait of Iris Chen",
  },
];

const TICK_IDLE =
  "repeating-linear-gradient(to right, var(--jk-border) 0 1px, transparent 1px 6px)";
const TICK_ACTIVE =
  "repeating-linear-gradient(to right, var(--jk-foreground) 0 1px, transparent 1px 6px)";
const TICK_MAJOR =
  "repeating-linear-gradient(to right, var(--jk-border) 0 1px, transparent 1px 30px)";
const FALLBACK_TONES = [
  "from-primary/45 via-muted to-accent",
  "from-chart-2/45 via-muted to-secondary",
  "from-chart-4/40 via-muted to-accent",
  "from-chart-3/40 via-muted to-secondary",
  "from-chart-5/40 via-muted to-accent",
] as const;

function wrapIndex(index: number, length: number) {
  return (index + length) % length;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  return reduced;
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function slotClass(offset: -1 | 0 | 1, reduced: boolean) {
  if (offset === 0) return "z-20 scale-100";
  if (reduced) {
    return offset < 0
      ? "z-10 -translate-x-[46%] scale-90 opacity-70"
      : "z-10 translate-x-[46%] scale-90 opacity-70";
  }
  return offset < 0
    ? "z-10 -translate-x-[58%] rotate-[-16deg] scale-[0.82] opacity-75 max-sm:-translate-x-[40%] max-sm:rotate-[-6deg] max-sm:scale-90"
    : "z-10 translate-x-[58%] rotate-[16deg] scale-[0.82] opacity-75 max-sm:translate-x-[40%] max-sm:rotate-[6deg] max-sm:scale-90";
}

export function Hero228({
  className,
  headline = DEFAULT_HEADLINE,
  description = DEFAULT_DESCRIPTION,
  portraits = DEFAULT_PORTRAITS,
  autoplay = true,
  interval = 2800,
  ...props
}: Hero228Props) {
  const labelId = useId();
  const descriptionId = useId();
  const reducedMotion = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [nameVisible, setNameVisible] = useState(true);
  const [displayedName, setDisplayedName] = useState(portraits[0]?.name ?? "");
  const swipe = useRef<{ x: number; pointerId: number } | null>(null);
  const count = portraits.length;
  const current = portraits[index];
  const playing = autoplay && !reducedMotion && !stopped && !hovered && count > 1;

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setIndex((value) => wrapIndex(value + 1, count));
    }, interval);
    return () => window.clearInterval(timer);
  }, [playing, interval, count]);

  useEffect(() => {
    const nextName = current?.name ?? "";
    if (nextName === displayedName) return;
    setNameVisible(false);
    const timer = window.setTimeout(
      () => {
        setDisplayedName(nextName);
        setNameVisible(true);
      },
      reducedMotion ? 0 : 160,
    );
    return () => window.clearTimeout(timer);
  }, [current?.name, displayedName, reducedMotion]);

  const goTo = (next: number) => {
    setStopped(true);
    setIndex(wrapIndex(next, count));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (count < 2) return;
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
    if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      goTo(count - 1);
    }
  };

  const onPointerDown = (event: PointerEvent<HTMLElement>) => {
    swipe.current = { x: event.clientX, pointerId: event.pointerId };
  };

  const onPointerUp = (event: PointerEvent<HTMLElement>) => {
    if (!swipe.current || swipe.current.pointerId !== event.pointerId) return;
    const delta = event.clientX - swipe.current.x;
    swipe.current = null;
    if (Math.abs(delta) < 40 || count < 2) return;
    goTo(delta < 0 ? index + 1 : index - 1);
  };

  const neighborOffsets = (count < 2 ? [0] : count === 2 ? [-1, 0] : [-1, 0, 1]) as Array<
    -1 | 0 | 1
  >;

  return (
    <section
      data-slot="hero228"
      aria-labelledby={labelId}
      aria-describedby={descriptionId}
      className={cn("bg-background px-5 py-16 text-foreground sm:px-8 sm:py-20", className)}
      {...props}
    >
      <style>
        {
          "@keyframes jk-hero228-fill { from { transform: scaleX(0); } to { transform: scaleX(1); } }"
        }
      </style>
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <h1
          id={labelId}
          className="max-w-2xl text-4xl leading-[1.08] font-medium tracking-[-0.04em] text-balance sm:text-5xl md:text-6xl"
        >
          {headline.map((part) => (
            <span
              key={part.text}
              className={part.italic ? "font-serif font-normal italic text-foreground" : undefined}
            >
              {part.text}
            </span>
          ))}
        </h1>
        <p
          id={descriptionId}
          className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8"
        >
          {description}
        </p>
      </div>

      <section
        aria-roledescription="carousel"
        aria-label="Portrait carousel"
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipe.current = null;
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className="mx-auto mt-12 w-full max-w-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:mt-16"
      >
        <div className="relative mx-auto flex h-64 w-full max-w-xl items-center justify-center overflow-visible sm:h-80 md:h-96">
          {neighborOffsets.map((offset) => {
            const portrait = portraits[wrapIndex(index + offset, count)];
            if (!portrait) return null;
            const active = offset === 0;
            return (
              <button
                key={`${portrait.name}-${offset}`}
                type="button"
                aria-label={`Show ${portrait.name}`}
                aria-current={active ? "true" : undefined}
                onClick={() => {
                  if (!active) goTo(index + offset);
                }}
                className={cn(
                  "absolute aspect-[3/4] w-[42%] max-w-56 overflow-hidden rounded-[--radius] border border-border bg-muted shadow-[0_24px_48px_-28px_color-mix(in_oklab,var(--jk-foreground),transparent_45%)] transition-[transform,opacity] duration-500 ease-out motion-reduce:duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  slotClass(offset, reducedMotion),
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-0 grid place-items-center bg-gradient-to-br text-lg font-medium text-foreground/70",
                    FALLBACK_TONES[wrapIndex(index + offset, FALLBACK_TONES.length)],
                  )}
                >
                  {initials(portrait.name)}
                </span>
                <img
                  src={portrait.src}
                  alt={portrait.alt}
                  className="absolute inset-0 size-full object-cover"
                />
              </button>
            );
          })}
        </div>

        <div className="relative mx-auto mt-8 max-w-lg sm:mt-10">
          <div aria-hidden="true" className="relative h-8">
            <div
              className="absolute inset-x-0 bottom-0 h-2.5"
              style={{ backgroundImage: TICK_IDLE }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-4 opacity-70"
              style={{ backgroundImage: TICK_MAJOR }}
            />
            <div
              className="absolute inset-x-0 bottom-0 h-2.5 overflow-hidden transition-[width] duration-500"
              style={{
                width: `${((index + 1) / count) * 100}%`,
                backgroundImage: TICK_ACTIVE,
              }}
            />
          </div>
          {playing ? (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 top-full mt-2 h-px overflow-hidden bg-border"
            >
              <div
                key={index}
                className="h-full origin-left bg-foreground"
                style={{
                  animation: `jk-hero228-fill ${interval}ms linear`,
                }}
              />
            </div>
          ) : null}
          <p
            aria-live="polite"
            className={cn(
              "pointer-events-none absolute top-1/2 left-1/2 min-w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-background/80 px-4 py-1 text-sm font-medium tracking-wide text-foreground backdrop-blur-sm transition-[opacity,filter] duration-200",
              nameVisible ? "opacity-100 blur-0" : "opacity-0 blur-sm",
            )}
          >
            {displayedName}
          </p>
        </div>
      </section>
    </section>
  );
}
