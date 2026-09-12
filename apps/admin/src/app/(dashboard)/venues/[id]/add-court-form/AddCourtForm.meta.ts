import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "add-court-form",
  displayName: "Add Court Form",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Single-field form to add a named court to a venue.",
  sectionCategory: "form",
  purpose: "Let José add Court 1, Court 2, and later courts without leaving the venue detail.",
  bestFor: ["venue detail", "court setup"],
  tone: ["utilitarian", "archive"],
  contentDensity: "low",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["name"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["court", "form", "admin", "venue"],
  dependencies: ["@fe-template/ui", "react-hook-form", "zod", "@hookform/resolvers", "sonner"],
  registryDependencies: ["form", "input", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
