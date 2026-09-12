import { formatFacebookBody } from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";

import { FacebookPostPreview } from "./FacebookPostPreview";
import type { FacebookPostPreviewProps } from "./FacebookPostPreview.types";

const GENERATED_BODY = formatFacebookBody({
  date: "2026-09-09",
  gameNumber: 3,
  team1: ["José", "Carlo"],
  team2: ["Mika", "Marco"],
  youtubeUrls: ["https://youtu.be/example-game-3"],
  driveUrls: ["https://drive.google.com/file/d/example-game-3"],
  notes: "Good rallies",
});

function EditablePreview(props: FacebookPostPreviewProps) {
  const [body, setBody] = useState(props.body);

  return (
    <FacebookPostPreview
      {...props}
      body={body}
      onChange={(next) => {
        setBody(next);
        props.onChange?.(next);
      }}
    />
  );
}

const meta: Meta<typeof FacebookPostPreview> = {
  title: "Playmates/FacebookPostPreview",
  component: FacebookPostPreview,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: {
    title: "Game 3 draft",
    body: GENERATED_BODY,
    onChange: () => {},
    onCopy: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[36rem] max-w-full bg-background p-4 text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FacebookPostPreview>;

export const GeneratedBody: Story = {
  render: (args) => <EditablePreview {...args} />,
};

export const EmptyBody: Story = {
  args: {
    body: "",
  },
  render: (args) => <EditablePreview {...args} />,
};

export const ReadOnly: Story = {
  args: {
    onChange: undefined,
  },
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => <EditablePreview {...args} />,
};
