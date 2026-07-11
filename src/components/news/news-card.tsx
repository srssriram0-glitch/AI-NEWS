import Link from "next/link";
import { Clock, ExternalLink, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { NewsArticle } from "@/lib/types";

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
}

interface NewsCardProps {
  article: NewsArticle;
  variant?: "featured" | "compact";
}

export function NewsCard({ article, variant = "compact" }: NewsCardProps) {
  if (variant === "featured") {
    return (
      <Link href={`/news/${article.slug}`}>
        <Card className="group h-full overflow-hidden transition-all hover:border-border hover:shadow-md">
          <div className="aspect-video bg-gradient-to-br from-blue-600/20 to-violet-600/20 p-6 flex items-end">
            <Badge className="bg-red-500/90 text-white hover:bg-red-500">
              {article.category}
            </Badge>
          </div>
          <CardContent className="p-5">
            <h3 className="font-semibold leading-tight group-hover:text-blue-500 transition-colors">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {article.summary}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {timeAgo(article.publishedAt)}
                </span>
                <span>{article.source}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {article.impactScore}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/news/${article.slug}`}>
      <div className="group flex gap-4 rounded-lg border border-transparent p-3 transition-all hover:border-border hover:bg-muted/50">
        <div className="hidden sm:block w-2 flex-shrink-0 self-stretch rounded-full bg-gradient-to-b from-blue-500 to-violet-500 opacity-60" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
              {article.category}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {article.source}
            </span>
          </div>
          <h3 className="font-medium leading-snug group-hover:text-blue-500 transition-colors">
            {article.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {article.summary}
          </p>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {timeAgo(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              Impact: {article.impactScore}/100
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
