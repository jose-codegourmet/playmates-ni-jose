"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/components/jabkit/lib/cn";
import type { CountUpAlign, CountUpDirection, CountUpItem, CountUpProps } from "./CountUp.types";

const defaults = {
  eyebrow: "Proof in motion",
  description: "A launch metric that ticks into place when it enters the viewport.",
  from: 0,
  to: 100,
  suffix: "%",
  separator: "",
  duration: 2000,
  delay: 0,
  direction: "up" as CountUpDirection,
  startWhen: true,
  threshold: 0.35,
  rootMargin: "0px 0px -8% 0px",
  align: "center" as CountUpAlign,
  replay: false,
};

const alignClass: Record<CountUpAlign, string> = {
  left: "items-start text-left",
  center: "items-center text-center",
  right: "items-end text-right",
};

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

function inferredDecimals(value: number) {
  const text = String(value);
  const index = text.indexOf(".");
  return index === -1 ? 0 : text.length - index - 1;
}

function formatValue(value: number, decimals: number, separator: string): string {
  const negative = value < 0;
  const abs = Math.abs(value);
  const [intPart, fracPart] = abs.toFixed(decimals).split(".");
  const grouped = separator ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator) : intPart;
  const body = decimals > 0 ? `${grouped}.${fracPart}` : grouped;
  return negative ? `-${body}` : body;
}

function resolveItems(props: CountUpProps): CountUpItem[] {
  if (props.items?.length) return props.items;
  return [
    {
      from: props.from,
      to: props.to ?? defaults.to,
      prefix: props.prefix,
      suffix: props.suffix ?? defaults.suffix,
      separator: props.separator,
      decimals: props.decimals,
    },
  ];
}

function CountUpFigure({
  item,
  duration,
  delay,
  direction,
  active,
  reduceMotion,
  onStart,
  onEnd,
}: {
  item: CountUpItem;
  duration: number;
  delay: number;
  direction: CountUpDirection;
  active: boolean;
  reduceMotion: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}) {
  const from = item.from ?? defaults.from;
  const to = item.to;
  const startValue = direction === "down" ? to : from;
  const endValue = direction === "down" ? from : to;
  const decimals = item.decimals ?? inferredDecimals(endValue);
  const separator = item.separator ?? defaults.separator;
  const [value, setValue] = useState(startValue);
  const startedRef = useRef(false);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  onStartRef.current = onStart;
  onEndRef.current = onEnd;

  useEffect(() => {
    if (!active) {
      startedRef.current = false;
      setValue(startValue);
      return;
    }
    if (reduceMotion) {
      setValue(endValue);
      if (!startedRef.current) {
        startedRef.current = true;
        onStartRef.current?.();
        onEndRef.current?.();
      }
      return;
    }

    let frame = 0;
    let startAt = 0;
    const tick = (now: number) => {
      if (!startAt) startAt = now + delay;
      if (now < startAt) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      if (!startedRef.current) {
        startedRef.current = true;
        onStartRef.current?.();
      }
      const elapsed = now - startAt;
      const progress = Math.min(1, elapsed / Math.max(duration, 1));
      const next = startValue + (endValue - startValue) * easeOutCubic(progress);
      setValue(next);
      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
        return;
      }
      setValue(endValue);
      onEndRef.current?.();
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [active, delay, duration, endValue, reduceMotion, startValue]);

  const display = `${item.prefix ?? ""}${formatValue(value, decimals, separator)}${item.suffix ?? ""}`;
  const finalLabel = `${item.prefix ?? ""}${formatValue(endValue, decimals, separator)}${item.suffix ?? ""}${item.label ? ` ${item.label}` : ""}`;

  return (
    <div className="flex min-w-0 flex-col gap-2" data-slot="count-up-item">
      <p
        aria-hidden="true"
        className="font-semibold tracking-[-0.06em] text-foreground tabular-nums text-5xl leading-none sm:text-6xl lg:text-7xl"
        data-slot="count-up-value"
      >
        {display}
      </p>
      <span className="sr-only">{finalLabel}</span>
      {item.label ? (
        <p className="text-sm leading-6 text-muted-foreground sm:text-base">{item.label}</p>
      ) : null}
    </div>
  );
}

export function CountUp({
  className,
  to = defaults.to,
  from = defaults.from,
  prefix,
  suffix = defaults.suffix,
  separator = defaults.separator,
  decimals,
  items,
  eyebrow = defaults.eyebrow,
  description = defaults.description,
  duration = defaults.duration,
  delay = defaults.delay,
  direction = defaults.direction,
  startWhen = defaults.startWhen,
  threshold = defaults.threshold,
  rootMargin = defaults.rootMargin,
  align = defaults.align,
  replay = defaults.replay,
  onStart,
  onEnd,
  ...props
}: CountUpProps) {
  const headingId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const figures = resolveItems({
    to,
    from,
    prefix,
    suffix,
    separator,
    decimals,
    items,
  });
  const active = startWhen && inView;

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

  return (
    <section
      aria-labelledby={headingId}
      className={cn("bg-background text-foreground", className)}
      data-in-view={inView ? "true" : "false"}
      data-slot="count-up"
      {...props}
      ref={rootRef}
    >
      <div
        className={cn(
          "mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-20 sm:px-10 sm:py-24",
          alignClass[align],
        )}
      >
        {eyebrow ? (
          <p
            className="text-xs font-medium tracking-[0.22em] text-muted-foreground uppercase"
            id={headingId}
          >
            {eyebrow}
          </p>
        ) : (
          <span className="sr-only" id={headingId}>
            Count up
          </span>
        )}
        <div
          className={cn(
            "grid w-full gap-10",
            figures.length > 1 ? "sm:grid-cols-3 sm:gap-8" : "justify-items-stretch",
            figures.length === 1 && align === "center" && "justify-items-center",
            figures.length === 1 && align === "right" && "justify-items-end",
          )}
        >
          {figures.map((item, index) => (
            <CountUpFigure
              active={active}
              delay={delay + index * 90}
              direction={direction}
              duration={duration}
              item={{
                ...item,
                separator: item.separator ?? separator,
              }}
              key={`${item.to}-${item.label ?? index}`}
              onEnd={index === 0 ? onEnd : undefined}
              onStart={index === 0 ? onStart : undefined}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>
        {description ? (
          <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
