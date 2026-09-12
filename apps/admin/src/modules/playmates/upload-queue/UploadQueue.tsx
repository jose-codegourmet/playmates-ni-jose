import { Card, CardContent, CardHeader, Empty, EmptyHeader, EmptyTitle } from "@fe-template/ui";

import { UploadProviderStatus } from "../upload-provider-status/UploadProviderStatus";
import type { UploadQueueProps } from "./UploadQueue.types";

function UploadQueue({ items }: UploadQueueProps) {
  if (items.length === 0) {
    return (
      <Empty className="min-h-0 p-4" data-slot="upload-queue">
        <EmptyHeader>
          <EmptyTitle className="font-normal text-muted-foreground">
            No recordings in the upload queue.
          </EmptyTitle>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ul data-slot="upload-queue" className="flex flex-col gap-3 bg-background text-foreground">
      {items.map((item) => (
        <li key={item.recordingLabel}>
          <Card size="sm" className="gap-0 bg-background text-foreground">
            <CardHeader className="border-b border-border px-(--card-spacing) py-2">
              <h3 className="font-heading text-sm font-medium leading-snug">
                {item.recordingLabel}
              </h3>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 px-(--card-spacing) py-3">
              <UploadProviderStatus {...item.drive} />
              <UploadProviderStatus {...item.youtube} />
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}

export type { UploadQueueItem, UploadQueueProps } from "./UploadQueue.types";
export { UploadQueue };
