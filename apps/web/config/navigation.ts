import {
  Calculator,
  LayoutGrid,
  MessageCircleMore,
  MessageSquareMore,
  Printer,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface Menu {
  title: string;
  href: string;
  icon: LucideIcon;
}

export interface NavigationGroup {
  group: string;
  menus: Menu[];
}

export const navigation: NavigationGroup[] = [
  {
    group: "Overview",
    menus: [
      {
        title: "Daily Digest",
        href: "/overview/daily-digest",
        icon: LayoutGrid,
      },
    ],
  },
  {
    group: "Orders",
    menus: [
      {
        title: "Instant Orders",
        href: "/orders/instant-orders",
        icon: Zap,
      },
      {
        title: "Whatsapp Orders",
        href: "/orders/whatsapp-orders",
        icon: MessageCircleMore,
      },
      {
        title: "Bulk Print Orders",
        href: "/orders/bulk-print-orders",
        icon: Printer,
      },
    ],
  },
  {
    group: "Customer",
    menus: [
      {
        title: "Reviews",
        href: "/customer/reviews",
        icon: MessageSquareMore,
      },
    ],
  },
  {
    group: "Business",
    menus: [
      {
        title: "COGS Calculator",
        href: "/business/cogs-calculator",
        icon: Calculator,
      },
      {
        title: "Manage Team",
        href: "/business/manage-team",
        icon: Users,
      },
    ],
  },
];
