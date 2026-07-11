import type { Metadata } from "next";
import { Wrench } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ToolCard } from "@/components/tools/tool-card";
import { mockTools } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "AI Tools",
  description:
    "Browse 100,000+ AI tools across every category — image generation, coding, video, writing, and more.",
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-6 w-6 text-green-500" />
          <h1 className="text-3xl font-bold">AI Tools</h1>
        </div>
        <p className="text-muted-foreground">
          Discover and compare the best AI tools for every use case. Updated
          daily.
        </p>
      </div>

      {/* Category filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge
          variant="default"
          className="cursor-pointer px-3 py-1"
        >
          All Tools
        </Badge>
        {CATEGORIES.slice(0, 12).map((cat) => (
          <Badge
            key={cat.slug}
            variant="outline"
            className="cursor-pointer px-3 py-1 transition-colors hover:bg-accent"
          >
            {cat.name}
          </Badge>
        ))}
      </div>

      {/* Pricing filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {["All", "Free", "Freemium", "Paid", "Open Source"].map((filter) => (
          <Badge
            key={filter}
            variant={filter === "All" ? "secondary" : "outline"}
            className="cursor-pointer px-3 py-1 text-xs transition-colors hover:bg-accent"
          >
            {filter}
          </Badge>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
