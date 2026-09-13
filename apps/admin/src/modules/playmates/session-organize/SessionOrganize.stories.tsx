import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionOrganize } from "./SessionOrganize";
import {
  buildSep9OrganizeFixture,
  emptyOrganizeFixture,
  unassignedSideOrganizeFixture,
} from "./session-organize.fixture";

const sep9 = buildSep9OrganizeFixture();

const meta: Meta<typeof SessionOrganize> = {
  title: "Playmates/Sessions/SessionOrganize",
  component: SessionOrganize,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  args: sep9,
  decorators: [
    (Story) => (
      <div className="min-h-svh bg-background p-4 text-foreground md:p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionOrganize>;

export const Sep9Organized: Story = {};

export const EmptySession: Story = {
  args: emptyOrganizeFixture,
};

export const UnassignedSideBucket: Story = {
  args: unassignedSideOrganizeFixture,
};

export const Dark: Story = {
  globals: { theme: "dark" },
  parameters: { backgrounds: { default: "dark" } },
};
