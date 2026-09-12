import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { ProviderLinkList } from "./ProviderLinkList";
import type { ProviderLinkAsset } from "./ProviderLinkList.types";

const bothProviders: ProviderLinkAsset[] = [
  {
    provider: "google_drive",
    url: "https://drive.google.com/file/d/example-drive/view",
    label: "Game 3 — Side A",
  },
  {
    provider: "youtube",
    url: "https://youtu.be/abcdefghijk",
    label: "Watch on YouTube",
  },
];

const driveOnly: ProviderLinkAsset[] = [
  {
    provider: "google_drive",
    url: "https://drive.google.com/file/d/example-drive/view",
    label: "Full court folder",
  },
];

const youtubeOnly: ProviderLinkAsset[] = [
  {
    provider: "youtube",
    url: "https://www.youtube.com/watch?v=abcdefghijk",
  },
];

function StoryFrame({ children }: { children: ReactNode }) {
  return <div className="w-72 bg-background p-4 text-foreground">{children}</div>;
}

const meta: Meta<typeof ProviderLinkList> = {
  title: "Shared/ProviderLinkList",
  component: ProviderLinkList,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ProviderLinkList>;

export const BothProviders: Story = {
  args: { assets: bothProviders },
  render: (args) => (
    <StoryFrame>
      <ProviderLinkList {...args} />
    </StoryFrame>
  ),
};

export const DriveOnly: Story = {
  args: { assets: driveOnly },
  render: (args) => (
    <StoryFrame>
      <ProviderLinkList {...args} />
    </StoryFrame>
  ),
};

export const YoutubeOnly: Story = {
  args: { assets: youtubeOnly },
  render: (args) => (
    <StoryFrame>
      <ProviderLinkList {...args} />
    </StoryFrame>
  ),
};

export const Empty: Story = {
  args: { assets: [] },
  render: (args) => (
    <StoryFrame>
      <ProviderLinkList {...args} />
    </StoryFrame>
  ),
};

export const Dark: Story = {
  args: { assets: bothProviders },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => (
    <StoryFrame>
      <ProviderLinkList {...args} />
    </StoryFrame>
  ),
};
