import { AspectRatio } from "@fe-template/ui";
import type { YoutubeEmbedProps } from "./YoutubeEmbed.types";

function resolvedEmbedUrl(embedUrl?: string): string | undefined {
  const href = embedUrl?.trim();
  if (!href) {
    return undefined;
  }

  try {
    const url = new URL(href);
    url.searchParams.delete("autoplay");
    return url.toString();
  } catch {
    return href;
  }
}

export function YoutubeEmbed({ embedUrl, title }: YoutubeEmbedProps) {
  const src = resolvedEmbedUrl(embedUrl);

  return (
    <AspectRatio className="overflow-hidden rounded-lg bg-muted" ratio={16 / 9}>
      {src ? (
        <iframe
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 size-full border-0"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          src={src}
          title={title}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No video yet</p>
        </div>
      )}
    </AspectRatio>
  );
}

export type { YoutubeEmbedProps };
