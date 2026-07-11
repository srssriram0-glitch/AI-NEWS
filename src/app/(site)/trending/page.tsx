import type { Metadata } from "next";
import { TrendingUp, Flame } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/tools/tool-card";
import { NewsCard } from "@/components/news/news-card";
import { mockTools, mockNews } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Trending",
  description: "Trending AI tools, news, and topics right now.",
};

export default function TrendingPage() {
  const trendingTools = mockTools.filter((t) => t.isTrending);
  const trendingNews = [...mockNews].sort((a, b) => b.impactScore - a.impactScore).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="h-6 w-6 text-green-500" />
          <h1 className="text-3xl font-bold">Trending</h1>
          <Flame className="h-5 w-5 text-orange-500" />
        </div>
        <p className="text-muted-foreground">What&apos;s hot in AI right now.</p>
      </div>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Trending Tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trendingTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Highest Impact News</h2>
        <div className="space-y-2">
          {trendingNews.map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>
    </div>
  );
}
