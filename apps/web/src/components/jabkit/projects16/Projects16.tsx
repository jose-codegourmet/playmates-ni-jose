import { useId } from "react";
import { Button } from "@/atoms/button";
import { cn } from "@/components/jabkit/lib/cn";
import type { Projects16Aspect, Projects16Image, Projects16Props } from "./Projects16.types";

const defaults = {
  title: "Work from the last two seasons.\nQuiet frames, kept in sequence.",
  description:
    "A small edit of field photographs — still rooms, weather, and the edges of a brief. Nothing moves; the crop does the talking.",
  action: { label: "View all projects", href: "#projects" },
} as const;

const defaultImages: Projects16Image[] = [
  {
    src: "/assets/d3f9bde61c9a29e7.webp",
    alt: "Empty office corridor with glass rooms and daylight",
    aspect: "landscape",
  },
  {
    src: "/assets/462c849dc9a41e59.webp",
    alt: "Sunlit studio desks with plants and open notebooks",
    aspect: "portrait",
  },
  {
    src: "/assets/6cc11e462a9aaded.webp",
    alt: "Arc floor lamp lighting a quiet corner",
    aspect: "portrait",
  },
  {
    src: "/assets/97c532d558fa4fbc.webp",
    alt: "Concrete structure photographed from the ground",
    aspect: "landscape",
  },
];

const FALLBACK_ASPECT: Projects16Aspect[] = ["landscape", "portrait", "portrait", "landscape"];

const ASPECT_CLASS: Record<Projects16Aspect, string> = {
  landscape: "aspect-[4/3]",
  portrait: "aspect-[4/5]",
};

function ArrowRight({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 16 16" className={cn("size-4", className)} fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Photo({
  image,
  fallbackAspect,
}: {
  image: Projects16Image;
  fallbackAspect: Projects16Aspect;
}) {
  const aspect = image.aspect ?? fallbackAspect;

  return (
    <figure className="overflow-hidden rounded-[--radius] bg-muted">
      <img
        src={image.src}
        alt={image.alt}
        className={cn("w-full object-cover", ASPECT_CLASS[aspect])}
      />
    </figure>
  );
}

export function Projects16({
  className,
  title = defaults.title,
  description = defaults.description,
  action = defaults.action,
  images = defaultImages,
  ...props
}: Projects16Props) {
  const headingId = useId();
  const left = images.slice(0, 2);
  const right = images.slice(2, 4);

  return (
    <section
      data-slot="projects16"
      aria-labelledby={headingId}
      className={cn("bg-background text-foreground", className)}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-5 py-16 sm:gap-12 sm:px-8 sm:py-24">
        <header>
          <h2
            id={headingId}
            className="max-w-xl whitespace-pre-line text-3xl font-medium tracking-[-0.04em] text-balance sm:text-4xl lg:text-5xl"
          >
            {title}
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4">
            {left.map((image, index) => (
              <Photo
                key={image.src}
                image={image}
                fallbackAspect={FALLBACK_ASPECT[index] ?? "landscape"}
              />
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4">
            {right.map((image, index) => (
              <Photo
                key={image.src}
                image={image}
                fallbackAspect={FALLBACK_ASPECT[index + 2] ?? "portrait"}
              />
            ))}
          </div>
        </div>

        <div className="flex max-w-md flex-col items-start gap-5">
          {description ? (
            <p className="text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              {description}
            </p>
          ) : null}
          {action ? (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="h-auto gap-1.5 px-0 font-medium underline-offset-4 hover:bg-transparent hover:underline"
            >
              <a href={action.href}>
                {action.label}
                <ArrowRight />
              </a>
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
