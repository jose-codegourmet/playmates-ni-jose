import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";

import type { GoogleSettingsProps } from "./GoogleSettings.types";

export const GOOGLE_SETTINGS_COPY = "OAuth will be wired later";

function GoogleSettings({ copy = GOOGLE_SETTINGS_COPY }: GoogleSettingsProps) {
  return (
    <Card
      size="sm"
      data-slot="google-settings"
      className="mx-auto max-w-xl gap-0 bg-background text-foreground"
    >
      <CardHeader className="border-b border-border px-(--card-spacing) py-3">
        <CardTitle>Google</CardTitle>
        <CardDescription>{copy}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-start gap-3 px-(--card-spacing) py-3">
        <p className="text-sm text-muted-foreground">
          Drive folders and YouTube uploads stay mock-only until Google OAuth is connected.
        </p>
        <Button type="button" disabled>
          Connect Google
        </Button>
      </CardContent>
    </Card>
  );
}

export type { GoogleSettingsProps };
export { GoogleSettings };
