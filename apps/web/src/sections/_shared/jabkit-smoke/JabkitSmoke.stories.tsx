import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Badge } from "@/components/jabkit/badge";
import { Button } from "@/components/jabkit/button";

function JabkitSmoke() {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-background p-6 text-foreground">
      <Badge variant="primary">Published</Badge>
      <Badge variant="secondary">Session</Badge>
      <Button variant="primary">Watch session</Button>
      <Button variant="secondary">Browse archive</Button>
    </div>
  );
}

const meta: Meta<typeof JabkitSmoke> = {
  title: "Shared/JabkitSmoke",
  component: JabkitSmoke,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof JabkitSmoke>;

export const Light: Story = {
  name: "Light (token bridge)",
};

export const Dark: Story = {
  name: "Dark (token bridge)",
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
