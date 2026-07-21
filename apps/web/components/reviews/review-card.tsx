"use client";

import { memo, useState, type MouseEvent } from "react";
import { Sparkles, Star, StarCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export type Review = {
  id: string;
  rating: number; // 1-5
  tags: string[];
  reviewText: string;
  productName: string;
  productVariant: string;
  draftReply: string;
};

type ReviewCardProps = {
  review: Review;
  isSubmitting?: boolean;
  onSkip?: (reviewId: string) => void;
  onReply?: (reviewId: string, message: string) => void;
};

const MAX_REPLY_LENGTH = 1000;

function ReviewCardImpl({
  review,
  isSubmitting = false,
  onSkip,
  onReply,
}: ReviewCardProps) {
  const [replyMessage, setReplyMessage] = useState(review.draftReply);
  const trimmedReply = replyMessage.trim();

  const handleReply = () => {
    if (!trimmedReply) return;
    onReply?.(review.id, trimmedReply);
  };

  const handleSkip = () => onSkip?.(review.id);

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex gap-2">
        <div className="flex" aria-label={`Rating: ${review.rating} out of 5`}>
          {Array.from({ length: 5 }, (_, i) =>
            i < review.rating ? (
              <StarCheck key={i} size={18} className="text-yellow-500" />
            ) : (
              <Star key={i} size={18} />
            ),
          )}
        </div>
        <div className="flex gap-2">
          {review.tags.map((tag) => (
            <Badge key={tag} variant="destructive">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <blockquote className="italic">
        &quot;{review.reviewText}&quot;
      </blockquote>
      <span className="text-xs">
        {review.productName} –– {review.productVariant}
      </span>
      <Card className="bg-secondary p-2 gap-2">
        <span className="flex gap-2 items-center">
          <Sparkles size={12} /> Draft Reply
        </span>
        <CardContent className="p-0 bg-background rounded-md">
          <Textarea
            value={replyMessage}
            maxLength={MAX_REPLY_LENGTH}
            disabled={isSubmitting}
            aria-label="Draft reply"
            onChange={(e) => setReplyMessage(e.target.value)}
          />
        </CardContent>
      </Card>
      <div className="flex justify-end gap-2 px-0 py-2">
        <Button
          variant="secondary"
          disabled={isSubmitting}
          onClick={handleSkip}
        >
          Skip
        </Button>
        <Button disabled={isSubmitting || !trimmedReply} onClick={handleReply}>
          {isSubmitting ? "Sending…" : "Reply"}
        </Button>
      </div>
      <Separator />
    </div>
  );
}

export default memo(ReviewCardImpl);
