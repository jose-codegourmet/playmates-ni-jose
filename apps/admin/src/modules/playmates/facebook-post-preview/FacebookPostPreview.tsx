"use client";

import { Button, Label, Textarea } from "@fe-template/ui";
import { useId, useSyncExternalStore } from "react";

import type { FacebookPostPreviewProps } from "./FacebookPostPreview.types";

function canWriteClipboard(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
}

function subscribeClipboard() {
  return () => {};
}

export function FacebookPostPreview({ title, body, onChange, onCopy }: FacebookPostPreviewProps) {
  const textareaId = useId();
  const isReadOnly = onChange == null;
  const clipboardAvailable = useSyncExternalStore(
    subscribeClipboard,
    canWriteClipboard,
    () => false,
  );

  async function handleCopy() {
    if (!canWriteClipboard()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(body);
      onCopy();
    } catch {
      // Clipboard permission denied or write failed — do not pretend copy succeeded.
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 bg-background text-foreground">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={textareaId}>{title ?? "Facebook post"}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!clipboardAvailable}
        >
          Copy
        </Button>
      </div>
      <Textarea
        id={textareaId}
        value={body}
        readOnly={isReadOnly}
        onChange={isReadOnly ? undefined : (event) => onChange(event.target.value)}
        placeholder="No Facebook draft yet"
        rows={12}
        className="min-h-48 font-mono text-sm"
      />
    </div>
  );
}

export type { FacebookPostPreviewProps };
