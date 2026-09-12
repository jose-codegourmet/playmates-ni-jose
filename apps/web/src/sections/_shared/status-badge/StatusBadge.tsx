import type {
  GameStatus,
  RecordingStatus,
  SessionStatus,
  UploadJobStatus,
  Visibility,
} from "@fe-template/mocks";
import { Badge } from "@fe-template/ui";
import type { StatusBadgeProps, UiBadgeVariant, VisibilityBadgeProps } from "./StatusBadge.types";

export const SESSION_STATUS_VARIANT = {
  draft: "outline",
  organizing: "secondary",
  uploading: "secondary",
  ready: "default",
  published: "default",
  archived: "outline",
} as const satisfies Record<SessionStatus, UiBadgeVariant>;

export const GAME_STATUS_VARIANT = {
  draft: "outline",
  ready: "default",
  published: "default",
  archived: "outline",
} as const satisfies Record<GameStatus, UiBadgeVariant>;

export const RECORDING_STATUS_VARIANT = {
  imported: "secondary",
  organized: "secondary",
  ready: "default",
  uploading: "secondary",
  uploaded: "default",
  published: "default",
  failed: "destructive",
  archived: "outline",
} as const satisfies Record<RecordingStatus, UiBadgeVariant>;

export const UPLOAD_JOB_STATUS_VARIANT = {
  queued: "outline",
  initiating: "secondary",
  uploading: "secondary",
  processing: "secondary",
  completed: "default",
  failed: "destructive",
  cancelled: "destructive",
} as const satisfies Record<UploadJobStatus, UiBadgeVariant>;

export const VISIBILITY_VARIANT = {
  private: "outline",
  public: "default",
} as const satisfies Record<Visibility, UiBadgeVariant>;

function formatBadgeLabel(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusVariant(props: StatusBadgeProps): UiBadgeVariant {
  switch (props.kind) {
    case "session":
      return SESSION_STATUS_VARIANT[props.status];
    case "game":
      return GAME_STATUS_VARIANT[props.status];
    case "recording":
      return RECORDING_STATUS_VARIANT[props.status];
    case "upload-job":
      return UPLOAD_JOB_STATUS_VARIANT[props.status];
  }
}

export function StatusBadge(props: StatusBadgeProps) {
  return (
    <Badge variant={statusVariant(props)} className={props.className}>
      {formatBadgeLabel(props.status)}
    </Badge>
  );
}

export function VisibilityBadge({ visibility, className }: VisibilityBadgeProps) {
  return (
    <Badge variant={VISIBILITY_VARIANT[visibility]} className={className}>
      {formatBadgeLabel(visibility)}
    </Badge>
  );
}

export type { StatusBadgeProps, VisibilityBadgeProps };
