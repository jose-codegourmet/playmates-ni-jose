"use client";

import { type CSSProperties, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/components/jabkit/lib/cn";
import type {
  SplitTextAlign,
  SplitTextHeading,
  SplitTextMode,
  SplitTextProps,
} from "./SplitText.types";

const defaults = {
  eyebrow: "Launch copy",
  text: "Make every headline land, letter by letter.",
  description:
    "A marketing headline that splits into glyphs, then rises into place with a staggered ease.",
  as: "h1" as SplitTextHeading,
  splitBy: "chars" as SplitTextMode,
  delay: 80,
  stagger: 28,
  duration: 720,
  threshold: 0.35,
  rootMargin: "0px 0px -8% 0px",
  align: "center" as SplitTextAlign,
  replay: false,
};

type Glyph = { key: string; value: string };

type Piece =
  | { kind: "break"; key: string }
  | { kind: "space"; key: string; value: string }
  | { kind: "word"; key: string; chars: Glyph[] };

function splitGraphemes(value: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    });
    return [...segmenter.segment(value)].map((part) => part.segment);
  }
  return Array.from(value);
}

function glyphStyle(delayMs: number, durationMs: number) {
  return {
    "--jk-split-delay": `${delayMs}ms`,
    "--jk-split-duration": `${durationMs}ms`,
  } as CSSProperties;
}

function tokenize(text: string): Piece[] {
  const pieces: Piece[] = [];
  let nextKey = 0;
  const key = (prefix: string) => `${prefix}-${nextKey++}`;
  const lines = text.split("\n");
  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const parts = lines[lineIndex].split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        pieces.push({
          kind: "space",
          key: key("space"),
          value: part.replace(/ /g, "\u00a0"),
        });
        continue;
      }
      pieces.push({
        kind: "word",
        key: key("word"),
        chars: splitGraphemes(part).map((value) => ({
          key: key("glyph"),
          value,
        })),
      });
    }
    if (lineIndex < lines.length - 1) {
      pieces.push({ kind: "break", key: key("break") });
    }
  }
  return pieces;
}

const alignClass: Record<SplitTextAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

export function SplitText({
  className,
  text = defaults.text,
  eyebrow = defaults.eyebrow,
  description = defaults.description,
  as = defaults.as,
  splitBy = defaults.splitBy,
  delay = defaults.delay,
  stagger = defaults.stagger,
  duration = defaults.duration,
  threshold = defaults.threshold,
  rootMargin = defaults.rootMargin,
  align = defaults.align,
  replay = defaults.replay,
  onAnimationComplete,
  ...props
}: SplitTextProps) {
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const completeRef = useRef(onAnimationComplete);
  completeRef.current = onAnimationComplete;
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const pieces = tokenize(text);
  const Heading = as;
  const unitCount = pieces.reduce((count, piece) => {
    if (piece.kind !== "word") return count;
    return count + (splitBy === "words" ? 1 : piece.chars.length);
  }, 0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    if (reduceMotion) {
      setInView(true);
      completeRef.current?.();
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!replay) observer.disconnect();
          return;
        }
        if (replay) setInView(false);
      },
      { threshold, rootMargin },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion, replay, rootMargin, threshold]);

  useEffect(() => {
    if (!inView || reduceMotion || unitCount === 0) return;
    const total = delay + Math.max(0, unitCount - 1) * stagger + duration;
    const timer = window.setTimeout(() => completeRef.current?.(), total);
    return () => window.clearTimeout(timer);
  }, [delay, duration, inView, reduceMotion, stagger, unitCount]);

  let unitIndex = 0;

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background text-foreground", className)}
      data-in-view={inView ? "true" : "false"}
      data-slot="split-text"
      {...props}
      ref={rootRef}
    >
      <style href="jk-split-text" precedence="default">{`
        @keyframes jk-split-text-rise {
          from {
            opacity: 0;
            transform: translate3d(0, 108%, 0);
          }
          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }
        [data-slot="split-text"] [data-slot="split-text-glyph"] {
          display: inline-block;
          opacity: 0;
          transform: translate3d(0, 108%, 0);
        }
        [data-slot="split-text"][data-in-view="true"] [data-slot="split-text-glyph"] {
          animation: jk-split-text-rise var(--jk-split-duration, 720ms)
            cubic-bezier(0.16, 1, 0.3, 1) both;
          animation-delay: var(--jk-split-delay, 0ms);
        }
        @media (prefers-reduced-motion: reduce) {
          [data-slot="split-text"] [data-slot="split-text-glyph"] {
            animation: none !important;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col gap-5 px-6 py-20 sm:px-10 sm:py-24",
          alignClass[align],
        )}
      >
        {eyebrow ? (
          <p className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
        ) : null}
        <Heading
          className="max-w-4xl text-4xl leading-[1.08] font-semibold tracking-[-0.05em] text-balance sm:text-5xl lg:text-6xl"
          id={headingId}
        >
          <span className="sr-only">{text}</span>
          <span aria-hidden="true">
            {pieces.map((piece) => {
              if (piece.kind === "break") {
                return <br key={piece.key} />;
              }
              if (piece.kind === "space") {
                return <span key={piece.key}>{piece.value}</span>;
              }
              if (splitBy === "words") {
                const index = unitIndex;
                unitIndex += 1;
                return (
                  <span
                    className="inline-block overflow-hidden align-bottom"
                    data-slot="split-text-unit"
                    key={piece.key}
                  >
                    <span
                      data-slot="split-text-glyph"
                      style={glyphStyle(delay + index * stagger, duration)}
                    >
                      {piece.chars.map((glyph) => glyph.value).join("")}
                    </span>
                  </span>
                );
              }
              return (
                <span
                  className="inline-block whitespace-nowrap"
                  data-slot="split-text-word"
                  key={piece.key}
                >
                  {piece.chars.map((glyph) => {
                    const index = unitIndex;
                    unitIndex += 1;
                    return (
                      <span
                        className="inline-block overflow-hidden align-bottom"
                        data-slot="split-text-unit"
                        key={glyph.key}
                      >
                        <span
                          data-slot="split-text-glyph"
                          style={glyphStyle(delay + index * stagger, duration)}
                        >
                          {glyph.value}
                        </span>
                      </span>
                    );
                  })}
                </span>
              );
            })}
          </span>
        </Heading>
        {description ? (
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
