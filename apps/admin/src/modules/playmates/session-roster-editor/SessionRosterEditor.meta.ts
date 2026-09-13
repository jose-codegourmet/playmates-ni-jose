import type { PlaymatesComponentMeta } from "@fe-template/mocks";

export default {
  name: "session-roster-editor",
  displayName: "Session Roster Editor",
  version: "0.1.0",
  addedAt: "2026-09-13",
  description:
    "Checkbox list of active players for a session roster, with add-player dialog and persist via sessions.setRoster.",
  sectionCategory: "form",
  purpose: "Set which players appear in game pickers for this session.",
  bestFor: ["session workspace players step"],
  tone: ["utilitarian", "archive"],
  contentDensity: "medium",
  visualWeight: "low",
  layout: { type: "stack", alignment: "start" },
  slots: ["helper", "checkboxes", "addPlayer", "save"],
  capabilities: {
    supportsImage: false,
    supportsVideo: false,
    supportsForm: true,
    supportsCTA: true,
    supportsDarkMode: true,
  },
  tags: ["session", "roster", "players", "admin", "workspace"],
  dependencies: ["@fe-template/ui", "sonner"],
  registryDependencies: ["button", "checkbox", "dialog"],
  a11y: { keyboardNav: true, reducedMotion: true },
  preview: { layout: "padded", capture: { themes: ["light", "dark"] } },
} satisfies PlaymatesComponentMeta;
