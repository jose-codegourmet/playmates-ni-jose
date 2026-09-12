import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";
import { YoutubeEmbed } from "./YoutubeEmbed";

const SAMPLE_EMBED_URL = "https://www.youtube.com/embed/MOCK00000000";
const SAMPLE_TITLE = "Sep 9, 2026 | Game 3 | Side A";

function StoryFrame({ children }: { children: ReactNode }) {
  return <div className="w-[36rem] max-w-full bg-background p-4 text-foreground">{children}</div>;
}

const meta: Meta<typeof YoutubeEmbed> = {
  title: "Shared/YoutubeEmbed",
  component: YoutubeEmbed,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof YoutubeEmbed>;

export const WithUrl: Story = {
  args: {
    embedUrl: SAMPLE_EMBED_URL,
    title: SAMPLE_TITLE,
  },
  render: (args) => (
    <StoryFrame>
      <YoutubeEmbed {...args} />
    </StoryFrame>
  ),
};

export const WithoutUrl: Story = {
  args: {
    title: SAMPLE_TITLE,
  },
  render: (args) => (
    <StoryFrame>
      <YoutubeEmbed {...args} />
    </StoryFrame>
  ),
};

export const Dark: Story = {
  args: {
    embedUrl: SAMPLE_EMBED_URL,
    title: SAMPLE_TITLE,
  },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
  render: (args) => (
    <StoryFrame>
      <YoutubeEmbed {...args} />
    </StoryFrame>
  ),
};
