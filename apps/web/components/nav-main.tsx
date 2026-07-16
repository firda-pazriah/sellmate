"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, LucideIcon, MoreHorizontalIcon } from "lucide-react";

type Menu = {
  title: string;
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
  }[];
};
export function NavMain({ menus }: { menus: Menu[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {menus.map((group) => (
        <SidebarGroup key={group.title}>
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>

          <SidebarMenu>
            {group.items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton>
                  <item.icon className="size-4" />
                  {item.title}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarGroup>
  );
}
