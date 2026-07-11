import type { Metadata } from "next";
import { NewsCard } from "@/components/news/news-card";
import { mockNews } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Newspaper } from "lucide-react";

export const metadata: Metadata = {
  title: "AI News",
  description:
    "Stay updated with the latest AI news, model releases, product launches, and industry updates.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Newspaper className="h-6 w-6 text-blue-500" />
          <h1 className="text-3xl font-bold">AI News</h1>
          <div className="ml-2 h-2 w-2 animate-pulse rounded-full bg-red-500" />
          <span className="text-sm text-red-500 font-medium">Live</span>
        </div>
        <p className="text-muted-foreground">
          Every important AI update, model release, and product launch — as it
          happens.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {[
          "All",
          "Model Release",
          "Product Launch",
          "Open Source",
          "Research",
          "Benchmark",
          "Product Update",
        ].map((filter) => (
          <Badge
            key={filter}
            variant={filter === "All" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 transition-colors hover:bg-accent"
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Featured */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        {mockNews.slice(0, 3).map((article) => (
          <NewsCard key={article.id} article={article} variant="featured" />
        ))}
      </div>

      {/* All News */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold mb-4">All Updates</h2>
        {mockNews.map((article) => (
          <NewsCard key={article.id} article={article} variant="compact" />
        ))}
      </div>
    </div>
  );
}
