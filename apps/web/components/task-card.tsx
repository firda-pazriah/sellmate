import { LucideIcon } from "lucide-react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type TaskItemProps = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  variant?: "default" | "danger";
  className?: string;
};

export function TaskItem({
  title,
  subtitle,
  icon: Icon,
  variant = "default",
  className,
}: TaskItemProps) {
  const isDanger = variant === "danger";

  return (
    <Item variant={isDanger ? "danger" : "outline"} className={cn(className)}>
      <ItemMedia variant="icon">
        <Icon className={cn("size-5", isDanger && "text-red-500")} />
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{title}</ItemTitle>

        <ItemDescription className={cn(isDanger && "text-red-500")}>
          {subtitle}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <Button variant={variant === "danger" ? "default" : "outline"}>
          Open
        </Button>
      </ItemActions>
    </Item>
  );
}
