import type {
  GameStatus,
  RecordingStatus,
  SessionStatus,
  UploadJobStatus,
  Visibility,
} from "@fe-template/mocks";

/** Existing `@fe-template/ui` Badge variants only — do not invent colors. */
export type UiBadgeVariant = "default" | "secondary" | "destructive" | "outline" | "ghost" | "link";

export type StatusBadgeProps =
  | { kind: "session"; status: SessionStatus; className?: string }
  | { kind: "game"; status: GameStatus; className?: string }
  | { kind: "recording"; status: RecordingStatus; className?: string }
  | { kind: "upload-job"; status: UploadJobStatus; className?: string };

export type VisibilityBadgeProps = {
  visibility: Visibility;
  className?: string;
};
