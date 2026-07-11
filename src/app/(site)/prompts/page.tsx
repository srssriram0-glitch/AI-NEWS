import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareText, Heart, Bookmark, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPrompts } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Prompt Library",
  description:
    "Browse and copy expertly crafted AI prompts for every use case.",
};

export default function PromptsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquareText className="h-6 w-6 text-purple-500" />
          <h1 className="text-3xl font-bold">Prompt Library</h1>
        </div>
        <p className="text-muted-foreground">
          Copy-ready prompts for coding, marketing, writing, education, and
          more. Tested and optimized.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          "All",
          "Coding",
          "Marketing",
          "Writing",
          "Education",
          "Image Generation",
          "Automation",
        ].map((filter) => (
          <Badge
            key={filter}
            variant={filter === "All" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
          >
            {filter}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockPrompts.map((prompt) => (
          <Card
            key={prompt.id}
            className="h-full transition-all hover:border-border hover:shadow-md"
          >
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {prompt.category}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  {prompt.model}
                </Badge>
              </div>
              <CardTitle className="text-lg leading-tight">
                {prompt.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {prompt.description}
              </p>

              <div className="rounded-lg bg-muted p-3">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground line-clamp-4">
                  {prompt.promptText}
                </pre>
              </div>

              {prompt.tips.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium">Tip:</span> {prompt.tips[0]}
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {(prompt.likes / 1000).toFixed(1)}K
                  </span>
                  <span className="flex items-center gap-1">
                    <Bookmark className="h-3 w-3" />
                    {(prompt.saves / 1000).toFixed(1)}K
                  </span>
                </div>
                <Button variant="outline" size="sm" className="text-xs h-7">
                  <Copy className="mr-1 h-3 w-3" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
