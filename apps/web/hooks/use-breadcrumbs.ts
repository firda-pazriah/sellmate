"use client";

import { usePathname } from "next/navigation";
import { getBreadcrumb } from "@/lib/navigation";

export function useBreadcrumb() {
  const pathname = usePathname();

  return getBreadcrumb(pathname);
}
