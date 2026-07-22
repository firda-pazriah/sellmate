"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ReviewCard, { type Review } from "@/components/reviews/review-card";
import { StatCard } from "@/components/daily-digest/stat-card";

const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    rating: 1,
    tags: ["Sizing", "Quality"],
    reviewText: "Ukurannya kurang pas padahal udah beli size L",
    productName: "Hava Sweater –– Misty size L",
    productVariant: "Black",
    draftReply:
      "Hi, terimakasih sudah belanja di Outfidence 🙏 Mohon maaf ukurannya kurang pas ya. Kami punya size chart detail di deskripsi produk –– boleh DM untuk bantu cek opsi tukar size ya.",
  },
];

const MOCK_STATS = {
  totalReviews: 1123,
  averageRating: 4.2,
  pendingReplies: 38,
};

export default function Reviews() {
  const [search, setSearch] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const trimmedSearch = search.trim();

  const handleAnalyze = (e: FormEvent) => {
    e.preventDefault();
    if (!trimmedSearch) return;
    setIsAnalyzing(true);
  };

  return (
    <Container className="grid h-full grid-cols-12 gap-4 pb-0">
      <Container className="bg-gray-50 rounded-sm border border-muted col-span-6 space-y-4 min-h-0 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold">Reviews Analytics</h1>
          <form className="flex gap-4" onSubmit={handleAnalyze}>
            <Input
              placeholder="Input product ID"
              aria-label="Product ID"
              value={search}
              disabled={isAnalyzing}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button type="submit" disabled={isAnalyzing || !trimmedSearch}>
              {isAnalyzing ? "Analyzing…" : "Analyze"}
            </Button>
          </form>
          <div className="grid grid-cols-3 gap-4">
            <StatCard title="Total Reviews" value={MOCK_STATS.totalReviews} />
            <StatCard title="Average Rating" value={MOCK_STATS.averageRating} />
            <StatCard
              title="Pending Replies"
              value={MOCK_STATS.pendingReplies}
            />
          </div>
        </div>
      </Container>
      <Container className="space-y-4 col-span-6">
        <Tabs defaultValue="reply">
          <TabsList>
            <TabsTrigger value="reply">Reply Reviews</TabsTrigger>
            <TabsTrigger value="auto-reply">Auto-reply</TabsTrigger>
          </TabsList>
          <TabsContent value="reply">
            {MOCK_REVIEWS.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No reviews to show.
              </p>
            ) : (
              MOCK_REVIEWS.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </TabsContent>
          <TabsContent value="auto-reply">
            <Container className="bg-muted/50 rounded-md">TEMPLATE</Container>
          </TabsContent>
        </Tabs>
      </Container>
    </Container>
  );
}
