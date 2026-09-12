import { Button, Card, CardContent, CardHeader, CardTitle } from "@fe-template/ui";
import Link from "next/link";

import type { QuickCreateProps } from "./QuickCreate.types";

function QuickCreate({ href = "/sessions/new" }: QuickCreateProps) {
  return (
    <Card size="sm" data-slot="quick-create" className="gap-0 bg-background text-foreground">
      <CardHeader className="border-b border-border px-(--card-spacing) py-3">
        <CardTitle>Quick create</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3 px-(--card-spacing) py-3">
        <p className="text-sm text-muted-foreground">Start a new session workspace.</p>
        <Button render={<Link href={href} />}>New session</Button>
      </CardContent>
    </Card>
  );
}

export type { QuickCreateProps };
export { QuickCreate };
