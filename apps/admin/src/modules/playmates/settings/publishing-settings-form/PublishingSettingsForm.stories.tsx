import { DEFAULT_FACEBOOK_HASHTAGS } from "@fe-template/mocks";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { PublishingSettingsForm } from "./PublishingSettingsForm";

const meta: Meta<typeof PublishingSettingsForm> = {
  title: "Playmates/Settings/PublishingSettingsForm",
  component: PublishingSettingsForm,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="w-[28rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PublishingSettingsForm>;

export const Default: Story = {};

export const SavedValues: Story = {
  args: {
    settings: {
      facebookGroupUrl: "https://www.facebook.com/groups/playmatesnijose",
      defaultHashtags: DEFAULT_FACEBOOK_HASHTAGS,
    },
  },
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
