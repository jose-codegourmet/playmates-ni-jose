import type { ReactNode } from "react";

/** Serializable preview row. Parents never pass a browser `File` back in. */
export type RecordingDropzoneFileMeta = {
  name: string;
  sizeBytes: number;
  durationSeconds?: number;
};

export type RecordingDropzoneProps = {
  /** Parent-owned list of selected names/sizes. The dropzone does not store `File`s. */
  filesMeta?: RecordingDropzoneFileMeta[];
  /** Alternative parent-owned preview; takes precedence over `filesMeta`. */
  children?: ReactNode;
  onFiles: (files: File[]) => void;
  /** Override internal drag-over state (used by Storybook). */
  dragActive?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
};
