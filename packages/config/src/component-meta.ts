export type PlaymatesComponentMeta = {
  name: string; // kebab-case, unique in the app
  displayName: string;
  version: string; // start "0.1.0"
  addedAt: string; // ISO date YYYY-MM-DD
  description: string;
  sectionCategory:
    | "layout"
    | "hero"
    | "listing"
    | "detail"
    | "form"
    | "workflow"
    | "media"
    | "status"
    | "social";
  purpose: string;
  bestFor: string[];
  tone: string[];
  contentDensity: "low" | "medium" | "high";
  visualWeight: "low" | "medium" | "high";
  layout: { type: "stack" | "split" | "grid" | "board" | "table"; alignment?: string };
  slots: string[];
  capabilities: {
    supportsImage: boolean;
    supportsVideo: boolean;
    supportsForm: boolean;
    supportsCTA: boolean;
    supportsDarkMode: boolean;
  };
  tags: string[];
  dependencies: string[]; // npm
  registryDependencies: string[]; // jabkit names or @fe-template/ui names
  a11y: { keyboardNav: boolean; reducedMotion: boolean };
  preview: {
    layout: "center" | "fullscreen" | "padded";
    capture: { themes: Array<"light" | "dark"> };
  };
};
