import type { HTMLAttributes } from "react";

export interface Hero228HeadlinePart {
  text: string;
  italic?: boolean;
}

export interface Hero228Portrait {
  name: string;
  src: string;
  alt: string;
}

export interface Hero228Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  headline?: Hero228HeadlinePart[];
  description?: string;
  portraits?: Hero228Portrait[];
  autoplay?: boolean;
  interval?: number;
}
