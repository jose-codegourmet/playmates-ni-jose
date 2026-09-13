"use client";

import { usePathname } from "next/navigation";
import { AdminHeader } from "@/modules/layout/AdminHeader";
import { AdminSidebar } from "@/modules/layout/AdminSidebar";
import { SidebarInset, SidebarProvider } from "@/modules/layout/sidebar/Sidebar";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/sessions": "Sessions",
  "/sessions/new": "New session",
  "/players": "Players",
  "/venues": "Venues",
  "/settings": "Settings",
  "/settings/google": "Google",
  "/settings/publishing": "Publishing",
};

function resolveTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.startsWith("/sessions/")) return "Session workspace";
  if (pathname.startsWith("/venues/")) return "Venue";
  return "Admin";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const title = resolveTitle(pathname);

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AdminHeader title={title} />
        <div className="min-w-0 flex-1 overflow-x-clip p-4 md:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
