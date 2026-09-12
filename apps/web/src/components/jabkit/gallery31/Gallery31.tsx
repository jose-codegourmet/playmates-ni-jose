"use client";

import { type MouseEvent, useId, useState } from "react";
import { Badge } from "@/atoms/badge";
import { cn } from "@/components/jabkit/lib/cn";
import type { Gallery31Item, Gallery31Props, Gallery31Span } from "./Gallery31.types";

type Edge = "top" | "right" | "bottom" | "left";

const DEFAULT_KICKER = "New season";
const DEFAULT_TITLE = "Pieces that hold a room.";
const DEFAULT_DESCRIPTION =
  "Five objects from the floor — name and price wait on the overlay, from whichever edge you enter.";

const DEFAULT_ITEMS: Gallery31Item[] = [
  {
    name: "Oak lounge chair",
    price: "$1,240",
    href: "#oak-lounge",
    span: "wide",
    image: {
      src: "/assets/462a1be29787cd8e.webp",
      alt: "Low oak lounge chair on a pale floor",
    },
  },
  {
    name: "Arc floor lamp",
    price: "$480",
    href: "#arc-lamp",
    image: {
      src: "/assets/6cc11e462a9aaded.webp",
      alt: "Arc floor lamp lighting a quiet corner",
    },
  },
  {
    name: "Stone side table",
    price: "$890",
    href: "#stone-table",
    span: "tall",
    image: {
      src: "/assets/488fa5330da1224c.webp",
      alt: "Sculptural stone side table in a sunlit room",
    },
  },
  {
    name: "Linen daybed",
    price: "$2,180",
    href: "#linen-daybed",
    image: {
      src: "/assets/7cb36691e11ed9af.webp",
      alt: "Linen daybed against a plaster wall",
    },
  },
  {
    name: "Ceramic pendant",
    price: "$310",
    href: "#ceramic-pendant",
    span: "wide",
    image: {
      src: "/assets/4f6410f5452c0ba5.webp",
      alt: "Hand-thrown ceramic pendant light",
    },
  },
];

const SPAN_CLASS: Record<Gallery31Span, string> = {
  default: "min-h-[17rem] lg:min-h-[18rem]",
  wide: "min-h-[17rem] md:col-span-2 lg:min-h-[18rem]",
  tall: "min-h-[17rem] lg:row-span-2 lg:min-h-0",
};

const EDGE_HIDDEN: Record<Edge, string> = {
  top: "-translate-y-full",
  right: "translate-x-full",
  bottom: "translate-y-full",
  left: "-translate-x-full",
};

function nearestEdge(event: { clientX: number; clientY: number }, el: HTMLElement): Edge {
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const distances: Record<Edge, number> = {
    top: y,
    right: rect.width - x,
    bottom: rect.height - y,
    left: x,
  };
  return (Object.keys(distances) as Edge[]).reduce((closest, edge) =>
    distances[edge] < distances[closest] ? edge : closest,
  );
}

function ProductTile({ item }: { item: Gallery31Item }) {
  const [edge, setEdge] = useState<Edge>("bottom");
  const [active, setActive] = useState(false);

  const show = () => setActive(true);
  const hide = () => setActive(false);

  const body = (
    <>
      <img
        src={item.image.src}
        alt={item.image.alt}
        className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
      <div
        aria-hidden={!active}
        className={cn(
          "absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-foreground/70 px-5 text-center text-background",
          "transition-transform duration-300 ease-out motion-reduce:transition-opacity motion-reduce:duration-200",
          active
            ? "translate-x-0 translate-y-0 motion-reduce:opacity-100"
            : cn(EDGE_HIDDEN[edge], "motion-reduce:opacity-0"),
        )}
      >
        <p className="text-lg font-semibold tracking-[-0.03em] text-balance sm:text-xl">
          {item.name}
        </p>
        <p className="text-sm font-medium tabular-nums text-background/80">{item.price}</p>
      </div>
    </>
  );

  const className = cn(
    "group relative block h-full min-h-[17rem] overflow-hidden rounded-[1.75rem] bg-muted text-left no-underline outline-none",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  );

  const pointerHandlers = {
    onMouseEnter: (event: MouseEvent<HTMLElement>) => {
      setEdge(nearestEdge(event, event.currentTarget));
      show();
    },
    onMouseLeave: (event: MouseEvent<HTMLElement>) => {
      setEdge(nearestEdge(event, event.currentTarget));
      hide();
    },
    onFocus: show,
    onBlur: hide,
  };

  if (item.href) {
    return (
      <a href={item.href} className={className} {...pointerHandlers}>
        {body}
      </a>
    );
  }

  return (
    <article className={className} {...pointerHandlers}>
      {body}
    </article>
  );
}

export function Gallery31({
  className,
  kicker = DEFAULT_KICKER,
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  items = DEFAULT_ITEMS,
  ...props
}: Gallery31Props) {
  const headingId = useId();

  return (
    <section
      data-slot="gallery31"
      aria-labelledby={headingId}
      className={cn("bg-background text-foreground", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-5 py-16 sm:gap-12 sm:px-8 sm:py-24">
        <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
          {kicker ? (
            <Badge
              variant="outline"
              className="mb-5 h-auto px-3 py-1 text-[0.7rem] font-semibold tracking-[0.16em] uppercase"
            >
              {kicker}
            </Badge>
          ) : null}
          <h2
            id={headingId}
            className="text-4xl font-semibold tracking-[-0.06em] text-balance sm:text-5xl lg:text-6xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>
          ) : null}
        </header>

        <ul className="grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-2 md:gap-4 lg:grid-flow-dense lg:grid-cols-4 lg:auto-rows-[minmax(18rem,1fr)]">
          {items.map((item) => (
            <li key={item.name} className={cn("min-w-0", SPAN_CLASS[item.span ?? "default"])}>
              <ProductTile item={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
