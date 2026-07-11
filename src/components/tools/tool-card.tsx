import Link from "next/link";
import { Star, ExternalLink, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AITool } from "@/lib/types";

interface ToolCardProps {
  tool: AITool;
}

export function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={`/tools/${tool.slug}`}>
      <Card className="group h-full transition-all hover:border-border hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-muted to-muted/50 text-lg font-bold">
                {tool.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold group-hover:text-blue-500 transition-colors">
                  {tool.name}
                </h3>
                <p className="text-xs text-muted-foreground">{tool.company}</p>
              </div>
            </div>
            {tool.isTrending && (
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-600 dark:text-green-400 text-[10px]"
              >
                <Zap className="mr-0.5 h-2.5 w-2.5" />
                Trending
              </Badge>
            )}
          </div>

          <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
            {tool.tagline}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {tool.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
              <span className="text-sm font-medium">{tool.rating}</span>
              <span className="text-xs text-muted-foreground">
                ({(tool.reviewCount / 1000).toFixed(0)}K)
              </span>
            </div>
            <Badge
              variant="secondary"
              className={
                tool.pricing.model === "free"
                  ? "bg-green-500/10 text-green-600 dark:text-green-400"
                  : tool.pricing.model === "open-source"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : ""
              }
            >
              {tool.pricing.model === "freemium"
                ? `Freemium · ${tool.pricing.startingPrice}`
                : tool.pricing.model === "paid"
                  ? `From ${tool.pricing.startingPrice}`
                  : tool.pricing.model.charAt(0).toUpperCase() +
                    tool.pricing.model.slice(1)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
