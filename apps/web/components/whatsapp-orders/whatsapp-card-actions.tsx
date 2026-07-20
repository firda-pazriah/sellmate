"use client";

import { memo, useState } from "react";
import { CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, MessageCircle, Printer, Send } from "lucide-react";
import { WhatsappOrderStatus } from "@/constants/whatsapp-order";

interface WhatsappOrderCardActionsProps {
  statusVariant: WhatsappOrderStatus;
  isSubmitting?: boolean;
  onSeeChat?: () => void;
  onConfirm?: () => void;
  onPrintDocument?: () => void;
  onPack?: () => void;
  onSend?: () => void;
  onSaveReceipt?: (receiptNumber: string) => void;
}

const RECEIPT_NUMBER_PATTERN = /^[A-Za-z0-9-]{1,32}$/;

function WhatsappOrderCardActions({
  statusVariant,
  isSubmitting = false,
  onSeeChat,
  onConfirm,
  onPrintDocument,
  onPack,
  onSend,
  onSaveReceipt,
}: WhatsappOrderCardActionsProps) {
  const [receiptNumber, setReceiptNumber] = useState("");

  if (statusVariant === "fullfilled") return null;

  if (statusVariant === "pending_acceptance") {
    return (
      <CardFooter className="p-0 gap-2">
        <Button
          className="flex-1"
          variant="outline"
          disabled={isSubmitting}
          onClick={onSeeChat}
        >
          <MessageCircle />
          See Chat
        </Button>
        <Button
          className="flex-1"
          variant="info"
          disabled={isSubmitting}
          onClick={onConfirm}
        >
          <Check />
          Confirm
        </Button>
      </CardFooter>
    );
  }

  if (statusVariant === "pending_packaging") {
    return (
      <CardFooter className="p-0 gap-2">
        <Button
          className="flex-1"
          variant="warning"
          disabled={isSubmitting}
          onClick={onPrintDocument}
        >
          <Printer />
          Print document
        </Button>
        <Button className="flex-1" disabled={isSubmitting} onClick={onPack}>
          <Check />
          Pack
        </Button>
      </CardFooter>
    );
  }

  if (statusVariant === "ready_to_pickup") {
    return (
      <CardFooter className="p-0 gap-2">
        <Button className="flex-1" disabled={isSubmitting} onClick={onSend}>
          <Send />
          Send
        </Button>
      </CardFooter>
    );
  }

  // statusVariant === "already_pickup"
  const trimmed = receiptNumber.trim();
  const isReceiptValid = RECEIPT_NUMBER_PATTERN.test(trimmed);

  const handleSave = () => {
    if (!isReceiptValid) return;
    onSaveReceipt?.(trimmed);
  };

  return (
    <CardFooter className="p-0 gap-2">
      <Input
        placeholder="Receipt Number"
        aria-label="Receipt number"
        value={receiptNumber}
        maxLength={32}
        disabled={isSubmitting}
        onChange={(e) => setReceiptNumber(e.target.value)}
      />
      <Button
        className="flex-1"
        variant="success"
        disabled={isSubmitting || !isReceiptValid}
        onClick={handleSave}
      >
        <Check />
        Save
      </Button>
    </CardFooter>
  );
}

export default memo(WhatsappOrderCardActions);
