"use client";

import * as React from "react";
import {
  ChartNoAxesColumn,
  Command,
  LayoutGrid,
  MessageCircleMore,
  MessageSquareMore,
  Printer,
  Users,
  Zap,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavHeader } from "./nav-header";
import { NavUser } from "./nav-user";

const data = {
  user: {
    name: "firda",
    email: "firda@example.com",
    avatar: "/avatar/firda.png",
  },
  navMain: [
    {
      title: "Overview",
      items: [
        {
          title: "Daily Digest",
          url: "/dashboard",
          icon: LayoutGrid,
        },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          title: "Instant Orders",
          url: "/instant-orders",
          icon: Zap,
        },
        {
          title: "Whatsapp Orders",
          url: "/whatsapp-orders",
          icon: MessageCircleMore,
        },
        {
          title: "Bulk Print",
          url: "/bulk-print",
          icon: Printer,
        },
      ],
    },
    {
      title: "Customer",
      items: [
        {
          title: "Reviews",
          url: "/reviews",
          icon: MessageSquareMore,
        },
      ],
    },
    {
      title: "Business",
      items: [
        {
          title: "Financial Report",
          url: "/financial-report",
          icon: ChartNoAxesColumn,
        },
        {
          title: "Manage Team",
          url: "/team",
          icon: Users,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="none" className="border-r-0 w-64 h-screen" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain menus={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
