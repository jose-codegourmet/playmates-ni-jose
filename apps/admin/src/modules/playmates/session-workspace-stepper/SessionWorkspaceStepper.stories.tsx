import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SessionWorkspaceStepper } from "./SessionWorkspaceStepper";
import {
  SESSION_WORKSPACE_STEP_IDS,
  type SessionWorkspaceStepperProps,
  type StepId,
} from "./SessionWorkspaceStepper.types";

function hrefFor(step: StepId): string {
  return `/sessions/ses_1/${step}`;
}

const onDetailsArgs = {
  current: "details",
  completed: [],
  hrefFor,
} satisfies SessionWorkspaceStepperProps;

const meta: Meta<typeof SessionWorkspaceStepper> = {
  title: "Playmates/SessionWorkspaceStepper",
  component: SessionWorkspaceStepper,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
  args: onDetailsArgs,
  decorators: [
    (Story) => (
      <div className="w-[56rem] max-w-full bg-background text-foreground">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionWorkspaceStepper>;

export const OnDetailsNothingCompleted: Story = {
  args: onDetailsArgs,
};

export const MidFlowOrganize: Story = {
  args: {
    current: "organize",
    completed: ["details", "players", "import"],
    hrefFor,
  },
};

export const AllCompletedOnReview: Story = {
  args: {
    current: "review",
    completed: [...SESSION_WORKSPACE_STEP_IDS],
    hrefFor,
  },
};

export const Dark: Story = {
  args: {
    current: "review",
    completed: [...SESSION_WORKSPACE_STEP_IDS],
    hrefFor,
  },
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
