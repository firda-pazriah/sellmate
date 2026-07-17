"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavigationGroup } from "@/config/navigation";

export function NavMain({ navigation }: { navigation: NavigationGroup[] }) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      {navigation.map((nav) => (
        <SidebarGroup key={nav.group}>
          <SidebarGroupLabel>{nav.group}</SidebarGroupLabel>

          <SidebarMenu>
            {nav.menus.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  render={
                    <a href={item.href}>
                      <item.icon className="size-4" />
                      {item.title}
                    </a>
                  }
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </SidebarGroup>
  );
}
