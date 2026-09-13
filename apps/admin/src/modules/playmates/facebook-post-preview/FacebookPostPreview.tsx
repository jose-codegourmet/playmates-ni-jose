"use client";

import { Button, Label, Textarea } from "@fe-template/ui";
import { useId, useRef, useSyncExternalStore } from "react";

import type { FacebookPostPreviewProps } from "./FacebookPostPreview.types";

function canWriteClipboard(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.clipboard?.writeText === "function";
}

function subscribeClipboard() {
  return () => {};
}

export function FacebookPostPreview({ title, body, onChange, onCopy }: FacebookPostPreviewProps) {
  const textareaId = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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

    const currentBody = textareaRef.current?.value ?? body;

    try {
      await navigator.clipboard.writeText(currentBody);
      onCopy();
    } catch {
      // Clipboard permission denied or write failed — do not pretend copy succeeded.
    }
  }

  return (
    <div className="flex w-full flex-col gap-3 bg-background text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Label htmlFor={textareaId}>{title ?? "Facebook post"}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCopy}
          disabled={!clipboardAvailable}
          aria-label="Copy Facebook post"
        >
          Copy Facebook post
        </Button>
      </div>
      <Textarea
        ref={textareaRef}
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
