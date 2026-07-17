import { navigation } from "@/config/navigation";

export function getBreadcrumb(pathname: string) {
  for (const group of navigation) {
    const menu = group.menus.find((menu) => menu.href === pathname);

    if (menu) {
      return {
        group: group.group,
        menu,
      };
    }
  }

  return null;
}
