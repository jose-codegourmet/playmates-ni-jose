import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { currentUserQueryKey } from "@/hooks/use-current-user/query";
import type { CurrentUser } from "@/hooks/use-current-user/types";
import { SidebarProvider } from "@/modules/layout/sidebar/Sidebar";
import { SeededQueryProvider } from "@/storybook/seeded-query";
import { AdminSidebar } from "./AdminSidebar";

const storyAdmin: CurrentUser = {
  email: "ada@local.dev",
  name: "Ada Admin",
  avatarUrl: null,
  role: "ADMIN",
  bio: null,
  createdAt: "2026-01-15T00:00:00.000Z",
};

const meta: Meta<typeof AdminSidebar> = {
  title: "Admin/Layout/AdminSidebar",
  component: AdminSidebar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/dashboard",
      },
    },
  },
  decorators: [
    (Story) => (
      <SeededQueryProvider
        seed={(client) => {
          client.setQueryData(currentUserQueryKey.current(), storyAdmin);
        }}
      >
        <SidebarProvider>
          <div className="flex min-h-svh">
            <Story />
          </div>
        </SidebarProvider>
      </SeededQueryProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AdminSidebar>;

export const DashboardActive: Story = {};

export const SessionsActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/sessions",
      },
    },
  },
};

export const SettingsActive: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/settings/google",
      },
    },
  },
};

export const Collapsed: Story = {
  decorators: [
    (Story) => (
      <SeededQueryProvider
        seed={(client) => {
          client.setQueryData(currentUserQueryKey.current(), storyAdmin);
        }}
      >
        <SidebarProvider defaultOpen={false}>
          <div className="flex min-h-svh">
            <Story />
          </div>
        </SidebarProvider>
      </SeededQueryProvider>
    ),
  ],
};

export const Dark: Story = {
  globals: {
    theme: "dark",
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
