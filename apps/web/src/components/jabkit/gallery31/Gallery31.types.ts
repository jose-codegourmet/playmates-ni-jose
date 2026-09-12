import type { HTMLAttributes } from "react";

export type Gallery31Span = "default" | "wide" | "tall";

export interface Gallery31Image {
  src: string;
  alt: string;
}

export interface Gallery31Item {
  name: string;
  price: string;
  href?: string;
  image: Gallery31Image;
  span?: Gallery31Span;
}

export interface Gallery31Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  kicker?: string;
  title?: string;
  description?: string;
  items?: Gallery31Item[];
}
