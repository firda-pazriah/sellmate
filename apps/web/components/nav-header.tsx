"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-4 items-center">
          <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            S
          </div>
          <div className="grid">
            <span className="truncate font-medium">Sellmate</span>
            <span className="truncate text-sm">Outfidence</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
