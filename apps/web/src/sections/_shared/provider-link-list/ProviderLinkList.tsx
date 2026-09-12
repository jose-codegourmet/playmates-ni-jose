import type { Provider } from "@fe-template/mocks";
import type { ProviderLinkAsset, ProviderLinkListProps } from "./ProviderLinkList.types";

const PROVIDER_GROUPS: { provider: Provider; heading: string }[] = [
  { provider: "google_drive", heading: "Google Drive" },
  { provider: "youtube", heading: "YouTube" },
];

const DEFAULT_LABEL: Record<Provider, string> = {
  google_drive: "Google Drive",
  youtube: "YouTube",
};

function isPublicHref(url: string): boolean {
  const href = url.trim();
  return href.length > 0 && href !== "#";
}

function publicLinksFor(assets: ProviderLinkAsset[], provider: Provider): ProviderLinkAsset[] {
  return assets.filter((asset) => asset.provider === provider && isPublicHref(asset.url));
}

export function ProviderLinkList({ assets }: ProviderLinkListProps) {
  const groups = PROVIDER_GROUPS.map((group) => ({
    ...group,
    links: publicLinksFor(assets, group.provider),
  })).filter((group) => group.links.length > 0);

  if (groups.length === 0) {
    return <p className="text-sm text-muted-foreground">No public links yet</p>;
  }

  return (
    <div className="flex flex-col gap-4 text-foreground">
      {groups.map((group) => (
        <section key={group.provider} aria-labelledby={`provider-link-list-${group.provider}`}>
          <h3
            className="mb-2 text-sm font-medium text-foreground"
            id={`provider-link-list-${group.provider}`}
          >
            {group.heading}
          </h3>
          <ul className="flex flex-col gap-1.5">
            {group.links.map((asset) => (
              <li key={`${asset.provider}-${asset.url}-${asset.label ?? ""}`}>
                <a
                  className="text-sm text-primary underline-offset-4 hover:underline"
                  href={asset.url.trim()}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {asset.label?.trim() || DEFAULT_LABEL[asset.provider]}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export type { ProviderLinkAsset, ProviderLinkListProps };
