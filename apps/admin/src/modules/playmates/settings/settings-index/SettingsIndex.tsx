import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@fe-template/ui";
import Link from "next/link";

import type { SettingsIndexLink, SettingsIndexProps } from "./SettingsIndex.types";

export const SETTINGS_INDEX_LINKS: SettingsIndexLink[] = [
  {
    href: "/settings/google",
    title: "Google",
    description: "Connect Drive and YouTube later. OAuth is not wired in this prototype.",
  },
  {
    href: "/settings/publishing",
    title: "Publishing",
    description: "Facebook Group URL and default hashtags used when generating post drafts.",
  },
];

function SettingsIndex({ links = SETTINGS_INDEX_LINKS }: SettingsIndexProps) {
  return (
    <div className="mx-auto grid max-w-3xl gap-4 md:grid-cols-2">
      {links.map((link) => (
        <Card
          key={link.href}
          size="sm"
          data-slot="settings-index-card"
          className="gap-0 bg-background text-foreground"
        >
          <CardHeader className="border-b border-border px-(--card-spacing) py-3">
            <CardTitle>{link.title}</CardTitle>
            <CardDescription>{link.description}</CardDescription>
          </CardHeader>
          <CardContent className="px-(--card-spacing) py-3">
            <Button render={<Link href={link.href} />} variant="outline">
              Open {link.title}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export type { SettingsIndexLink, SettingsIndexProps };
export { SettingsIndex };
