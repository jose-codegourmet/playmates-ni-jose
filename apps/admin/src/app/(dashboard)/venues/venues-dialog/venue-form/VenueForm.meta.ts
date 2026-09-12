import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "venue-form",
  displayName: "Venue Form",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description: "Create and edit a venue with a required name plus optional address and notes.",
  sectionCategory: "form",
  purpose: "Collect venue identity fields for the admin Venues CRUD dialog.",
  bestFor: ["venue create dialog", "venue edit dialog"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["name", "address", "notes"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["venue", "form", "admin"],
  dependencies: ["@fe-template/ui", "react-hook-form", "zod", "@hookform/resolvers", "sonner"],
  registryDependencies: ["form", "input", "textarea", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
