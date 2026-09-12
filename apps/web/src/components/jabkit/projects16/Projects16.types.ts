import type { HTMLAttributes } from "react";

export type Projects16Aspect = "landscape" | "portrait";

export interface Projects16Image {
  src: string;
  alt: string;
  aspect?: Projects16Aspect;
}

export interface Projects16Action {
  label: string;
  href: string;
}

export interface Projects16Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: string;
  description?: string;
  action?: Projects16Action;
  images?: Projects16Image[];
}
