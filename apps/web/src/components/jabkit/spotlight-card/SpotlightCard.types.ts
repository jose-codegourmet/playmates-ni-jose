import type { HTMLAttributes, ReactNode } from "react";

export interface SpotlightCardItem {
  id: string;
  kicker?: string;
  title: string;
  body?: string;
}

export interface SpotlightCardProps extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  eyebrow?: string;
  heading?: string;
  description?: string;
  kicker?: string;
  title?: string;
  body?: string;
  cards?: SpotlightCardItem[];
  spotlightSize?: number;
  children?: ReactNode;
}
