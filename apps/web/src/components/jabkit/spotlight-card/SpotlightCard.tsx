"use client";

import { type ReactNode, useEffect, useId, useRef } from "react";
import { cn } from "@/components/jabkit/lib/cn";
import type { SpotlightCardItem, SpotlightCardProps } from "./SpotlightCard.types";

const DEFAULT_EYEBROW = "Pointer light";
const DEFAULT_HEADING = "A lamp that stays on the work.";
const DEFAULT_DESCRIPTION =
  "Radial light tracks the pointer across each panel. Quiet when motion is reduced.";
const DEFAULT_KICKER = "Signal";
const DEFAULT_TITLE = "Lock on the active panel";
const DEFAULT_BODY =
  "The highlight follows your hand so the card you are reading is obvious without a heavy border.";
const DEFAULT_SPOTLIGHT_SIZE = 18;

function CardCopy({ item }: { item: SpotlightCardItem }) {
  return (
    <>
      {item.kicker ? (
        <p className="text-[11px] font-medium tracking-[0.18em] text-muted-foreground uppercase">
          {item.kicker}
        </p>
      ) : null}
      <p className="mt-4 text-xl font-semibold tracking-tight text-balance sm:text-2xl">
        {item.title}
      </p>
      {item.body ? (
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:leading-7">{item.body}</p>
      ) : null}
    </>
  );
}

function SpotlightPanel({ size, children }: { size: number; children: ReactNode }) {
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduceMotion = media.matches;
    let frame = 0;
    let pointer: { x: number; y: number } | null = null;
    let x = 0.5;
    let y = 0.5;
    let intensity = 0.32;
    let last = performance.now();

    const apply = () => {
      stage.style.setProperty("--jk-spot-x", String(x));
      stage.style.setProperty("--jk-spot-y", String(y));
      stage.style.setProperty("--jk-spot-i", String(intensity));
    };

    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const targetX = pointer ? pointer.x : 0.5;
      const targetY = pointer ? pointer.y : 0.5;
      const targetI = reduceMotion ? 0.2 : pointer ? 0.92 : 0.34;

      if (reduceMotion) {
        x = 0.5;
        y = 0.5;
        intensity = 0.2;
      } else {
        x += (targetX - x) * Math.min(1, dt * 12);
        y += (targetY - y) * Math.min(1, dt * 12);
        intensity += (targetI - intensity) * Math.min(1, dt * 8);
      }

      apply();
      frame = window.requestAnimationFrame(tick);
    };

    const local = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      return {
        x: Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width)),
        y: Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height)),
      };
    };

    const onMove = (event: PointerEvent) => {
      if (reduceMotion) return;
      pointer = local(event);
    };
    const onLeave = () => {
      pointer = null;
    };
    const onMotion = () => {
      reduceMotion = media.matches;
      if (reduceMotion) pointer = null;
    };

    frame = window.requestAnimationFrame(tick);
    media.addEventListener("change", onMotion);
    stage.addEventListener("pointermove", onMove);
    stage.addEventListener("pointerleave", onLeave);

    return () => {
      window.cancelAnimationFrame(frame);
      media.removeEventListener("change", onMotion);
      stage.removeEventListener("pointermove", onMove);
      stage.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <article
      className="jk-spotlight-card relative isolate h-full overflow-hidden rounded-[calc(var(--radius)+0.35rem)] border border-border bg-card p-6 text-card-foreground sm:p-7"
      data-slot="spotlight-card-panel"
      ref={stageRef}
      style={{ ["--jk-spot-size" as string]: `${size}rem` }}
    >
      <div
        aria-hidden="true"
        className="jk-spotlight-card-glow pointer-events-none absolute inset-0"
      />
      <div
        aria-hidden="true"
        className="jk-spotlight-card-rim pointer-events-none absolute inset-0 rounded-[inherit]"
      />
      <div className="relative z-10">{children}</div>
    </article>
  );
}

export function SpotlightCard({
  className,
  eyebrow = DEFAULT_EYEBROW,
  heading = DEFAULT_HEADING,
  description = DEFAULT_DESCRIPTION,
  kicker = DEFAULT_KICKER,
  title = DEFAULT_TITLE,
  body = DEFAULT_BODY,
  cards,
  spotlightSize = DEFAULT_SPOTLIGHT_SIZE,
  children,
  ...props
}: SpotlightCardProps) {
  const headingId = useId();
  const faces = cards && cards.length > 0 ? cards : [{ id: "featured", kicker, title, body }];
  const custom = Boolean(children) && faces.length === 1;

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background text-foreground", className)}
      data-slot="spotlight-card"
      {...props}
    >
      <style href="jk-spotlight-card" precedence="default">{`
        .jk-spotlight-card {
          --jk-spot-x: 0.5;
          --jk-spot-y: 0.5;
          --jk-spot-i: 0.34;
        }
        .jk-spotlight-card-glow {
          background: radial-gradient(
            var(--jk-spot-size, 18rem) circle at calc(var(--jk-spot-x) * 100%) calc(var(--jk-spot-y) * 100%),
            color-mix(in oklab, var(--jk-primary), transparent 52%),
            transparent 58%
          );
          opacity: var(--jk-spot-i);
          mix-blend-mode: multiply;
        }
        .dark .jk-spotlight-card-glow {
          mix-blend-mode: screen;
          background: radial-gradient(
            var(--jk-spot-size, 18rem) circle at calc(var(--jk-spot-x) * 100%) calc(var(--jk-spot-y) * 100%),
            color-mix(in oklab, var(--jk-primary), transparent 38%),
            transparent 62%
          );
        }
        .jk-spotlight-card-rim {
          box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--jk-border), transparent 20%);
          background: radial-gradient(
            18rem circle at calc(var(--jk-spot-x) * 100%) calc(var(--jk-spot-y) * 100%),
            color-mix(in oklab, var(--jk-ring), transparent 72%),
            transparent 42%
          );
          opacity: calc(var(--jk-spot-i) * 0.55);
          mix-blend-mode: overlay;
        }
        @media (prefers-reduced-motion: reduce) {
          .jk-spotlight-card-glow,
          .jk-spotlight-card-rim {
            background: radial-gradient(
              16rem circle at 50% 50%,
              color-mix(in oklab, var(--jk-primary), transparent 62%),
              transparent 58%
            );
            opacity: 0.22;
          }
        }
      `}</style>
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          {eyebrow ? (
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h2
            className="text-3xl font-semibold tracking-[-0.05em] text-balance sm:text-4xl lg:text-5xl"
            id={headingId}
          >
            {heading}
          </h2>
          {description ? (
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
              {description}
            </p>
          ) : null}
        </header>
        <div
          className={cn(
            "grid items-stretch gap-5 sm:gap-6",
            faces.length > 2
              ? "md:grid-cols-3"
              : faces.length === 2
                ? "md:grid-cols-2"
                : "grid-cols-1",
          )}
        >
          {faces.map((face) => (
            <SpotlightPanel key={face.id} size={spotlightSize}>
              {custom ? children : <CardCopy item={face} />}
            </SpotlightPanel>
          ))}
        </div>
      </div>
    </section>
  );
}
