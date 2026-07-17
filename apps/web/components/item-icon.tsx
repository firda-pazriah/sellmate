import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

type ItemIcon = {
  title: string;
  description: string;
  icon: LucideIcon;
  isDanger?: boolean;
};

export function ItemIcon({
  title,
  description,
  icon: Icon,
  isDanger = false,
}: ItemIcon) {
  return (
    <div className="flex w-full flex-col gap-6">
      <Item variant={isDanger ? "danger" : "outline"}>
        <ItemMedia variant="icon">
          <Icon className={cn(isDanger && "text-red-500")} />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{title}</ItemTitle>
          <ItemDescription className={cn(isDanger && "text-red-500")}>
            {description}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm" variant={isDanger ? "default" : "outline"}>
            Open
          </Button>
        </ItemActions>
      </Item>
    </div>
  );
}
