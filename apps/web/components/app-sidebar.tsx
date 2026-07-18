"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { NavUser } from "./nav-user";
import { navigation } from "../config/navigation";

const data = {
  user: {
    name: "firda",
    email: "firda@example.com",
    avatar: "/avatar/firda.png",
    avatarFallback: "FP",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" className="border-r-0 w-64 h-screen" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain navigation={navigation} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
