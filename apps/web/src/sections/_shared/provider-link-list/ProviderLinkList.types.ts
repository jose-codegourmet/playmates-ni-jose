import type { Provider } from "@fe-template/mocks";

export type ProviderLinkAsset = {
  provider: Provider;
  url: string;
  label?: string;
};

export type ProviderLinkListProps = {
  assets: ProviderLinkAsset[];
};
