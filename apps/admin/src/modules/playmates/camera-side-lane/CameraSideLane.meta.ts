import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "camera-side-lane",
  displayName: "Camera Side Lane",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Vertical Side A / Side B column that lists recording cards or an empty drop-target prompt.",
  sectionCategory: "workflow",
  purpose:
    "Hold recordings assigned to one camera side on the Organize board before native drop wiring lands.",
  bestFor: ["organize board", "game recording workspace", "camera side assignment"],
  tone: ["utilitarian", "archive"],
  contentDensity: "high",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["label", "recordings", "empty"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: false,
    supportsCTA: false,
    supportsDarkMode: true,
  },
  tags: ["recording", "camera", "lane", "organize", "admin"],
  dependencies: ["@fe-template/ui"],
  registryDependencies: ["card", "empty", "recording-card"],
  a11y: { keyboardNav: false, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
