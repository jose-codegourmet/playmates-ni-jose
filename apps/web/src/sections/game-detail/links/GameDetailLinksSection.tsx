import type { ProviderAsset } from "@fe-template/mocks";
import { cn } from "@/lib/utils";
import { ProviderLinkList } from "@/sections/_shared/provider-link-list/ProviderLinkList";
import type { ProviderLinkAsset } from "@/sections/_shared/provider-link-list/ProviderLinkList.types";

import type { GameDetailLinksSectionProps } from "./GameDetailLinksSection.types";

export function toGameDetailProviderLinks(assets: ProviderAsset[]): ProviderLinkAsset[] {
  return assets.flatMap((asset) => {
    const url = asset.url?.trim();
    if (!url) {
      return [];
    }
    return [
      {
        provider: asset.provider,
        url,
        label: asset.title?.trim() || undefined,
      },
    ];
  });
}

function GameDetailLinksSection({ className, assets }: GameDetailLinksSectionProps) {
  return (
    <section
      data-slot="game-detail-links-section"
      className={cn("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8", className)}
    >
      <h2 className="font-display text-2xl font-semibold tracking-tight">Links</h2>
      <div className="mt-6">
        <ProviderLinkList assets={assets} />
      </div>
    </section>
  );
}

export type { GameDetailLinksSectionProps };
export { GameDetailLinksSection };
