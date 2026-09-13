"use client";

import { DndContext } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ReactNode } from "react";

function OrganizeDndProvider({ children }: { children: ReactNode }) {
  return (
    <DndContext>
      <SortableContext items={[]} strategy={verticalListSortingStrategy}>
        {children}
      </SortableContext>
    </DndContext>
  );
}

export { OrganizeDndProvider };
