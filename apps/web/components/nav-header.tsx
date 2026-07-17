"use client";

import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavHeader() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex gap-4 items-center px-4">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            S
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">Sellmate</span>
            <span className="truncate text-xs">Outfidence</span>
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
