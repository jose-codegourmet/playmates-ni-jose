import type { HTMLAttributes } from "react";

export interface Team17Member {
  src: string;
  alt: string;
  name: string;
  role: string;
}

export interface Team17NamedList {
  label: string;
  names: string[];
}

export interface Team17Culture {
  title: string;
  paragraphs: string[];
}

export interface Team17Props extends Omit<HTMLAttributes<HTMLElement>, "title"> {
  title?: string;
  description?: string;
  members?: Team17Member[];
  alumni?: Team17NamedList;
  collaborators?: Team17NamedList;
  culture?: Team17Culture;
}
