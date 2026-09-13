"use client";

import { DndContext } from "@dnd-kit/core";
import type { ReactNode } from "react";

function OrganizeDndProvider({ children }: { children: ReactNode }) {
  return <DndContext>{children}</DndContext>;
}

export { OrganizeDndProvider };
