import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-details-form",
  displayName: "Session Details Form",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Edit session date, title, venue, court, notes, and visibility. Status is shown for prototype convenience; slug is read-only.",
  sectionCategory: "form",
  purpose: "Persist session metadata from the workspace Details step via sessions.update.",
  bestFor: ["session workspace details"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["sessionDate", "title", "venueId", "courtId", "notes", "visibility", "status", "slug"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "form", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "react-hook-form", "zod", "@hookform/resolvers", "sonner"],
  registryDependencies: ["form", "input", "textarea", "native-select", "button", "badge"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
