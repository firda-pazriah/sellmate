import { CardFooter } from "@/components/ui/card";
import { Input } from "@base-ui/react";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Printer, Send } from "lucide-react";

export default function WhatsappOrderCardActions({
  statusVariant,
}: {
  statusVariant:
    | "ready_to_pickup"
    | "pending_packaging"
    | "pending_acceptance"
    | "already_pickup";
}) {
  if (statusVariant === "pending_acceptance") {
    return (
      <CardFooter className="p-0 gap-2">
        <Button className="flex-1" variant="outline">
          <MessageCircle />
          See Chat
        </Button>
        <Button className="flex-1" variant="info">
          <Check />
          Confirm
        </Button>
      </CardFooter>
    );
  }

  if (statusVariant === "pending_packaging") {
    return (
      <CardFooter className="p-0 gap-2">
        <Button className="flex-1" variant="warning">
          <Printer />
          Print document
        </Button>
        <Button className="flex-1">
          <Check />
          Pack
        </Button>
      </CardFooter>
    );
  }

  if (statusVariant === "ready_to_pickup") {
    return (
      <CardFooter className="p-0 gap-2">
        <Button className="flex-1">
          <Send />
          Send
        </Button>
      </CardFooter>
    );
  }

  return (
    <CardFooter className="p-0 gap-2">
      <Input placeholder="Recipt Number" />
      <Button className="flex-1" variant="success">
        <Check />
        Save
      </Button>
    </CardFooter>
  );
}
