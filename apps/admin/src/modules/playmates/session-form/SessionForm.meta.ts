import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-form",
  displayName: "Session Form",
  version: "0.1.0",
  addedAt: "2026-09-12",
  description:
    "Create a draft session with a required date, optional title, venue/court, notes, and a non-archived player roster.",
  sectionCategory: "form",
  purpose: "Collect Phase 1 session-to-publish fields and persist a draft via mock repositories.",
  bestFor: ["new session page", "quick create from dashboard"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["sessionDate", "title", "venueId", "courtId", "notes", "playerIds"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "form", "admin", "roster"],
  dependencies: ["@fe-template/ui", "react-hook-form", "zod", "@hookform/resolvers", "sonner"],
  registryDependencies: ["form", "input", "textarea", "native-select", "checkbox", "button"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
