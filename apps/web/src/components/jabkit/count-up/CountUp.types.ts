import type { HTMLAttributes } from "react";

export type CountUpAlign = "left" | "center" | "right";
export type CountUpDirection = "up" | "down";

export interface CountUpItem {
  to: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimals?: number;
  label?: string;
}

export interface CountUpProps extends HTMLAttributes<HTMLElement> {
  to?: number;
  from?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimals?: number;
  items?: CountUpItem[];
  eyebrow?: string;
  description?: string;
  duration?: number;
  delay?: number;
  direction?: CountUpDirection;
  startWhen?: boolean;
  threshold?: number;
  rootMargin?: string;
  align?: CountUpAlign;
  replay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
}
