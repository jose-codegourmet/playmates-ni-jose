import type { HTMLAttributes } from "react";

export type SplitTextAlign = "left" | "center" | "right";
export type SplitTextMode = "chars" | "words";
export type SplitTextHeading = "h1" | "h2" | "h3" | "p" | "div";

export interface SplitTextProps extends HTMLAttributes<HTMLElement> {
  text?: string;
  eyebrow?: string;
  description?: string;
  as?: SplitTextHeading;
  splitBy?: SplitTextMode;
  delay?: number;
  stagger?: number;
  duration?: number;
  threshold?: number;
  rootMargin?: string;
  align?: SplitTextAlign;
  replay?: boolean;
  onAnimationComplete?: () => void;
}
