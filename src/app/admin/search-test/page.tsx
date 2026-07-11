"use client";

import { useState } from "react";
import { Search, Loader2, Newspaper, Wrench, BookOpen, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SearchResult {
  id: string;
  type: "news" | "tool" | "guide" | "prompt" | "paper";
  slug: string;
  title: string;
  summary: string;
  category: string;
  rank: number;
}

const TYPE_CONFIG = {
  news: { icon: Newspaper, color: "text-blue-500", bg: "bg-blue-500/10", href: "/news" },
  tool: { icon: Wrench, color: "text-violet-500", bg: "bg-violet-500/10", href: "/tools" },
  guide: { icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10", href: "/guides" },
  prompt: { icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10", href: "/prompts" },
  paper: { icon: FileText, color: "text-pink-500", bg: "bg-pink-500/10", href: "/papers" },
};

export default function AdminSearchTest() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchTime, setSearchTime] = useState<number | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setSearching(true);
    const start = performance.now();

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    if (res.ok) {
      const json = await res.json();
      setResults(json.results);
    }

    setSearchTime(Math.round(performance.now() - start));
    setSearching(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Search Test</h2>
        <p className="text-sm text-muted-foreground">
          Test PostgreSQL full-text search across all content
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for AI tools, news, guides..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <Button type="submit" disabled={searching}>
          {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {searchTime !== null && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>{results.length} results</span>
          <span>{searchTime}ms</span>
        </div>
      )}

      <div className="space-y-3">
        {results.map((result) => {
          const config = TYPE_CONFIG[result.type];
          const Icon = config.icon;
          return (
            <Link
              key={`${result.type}-${result.id}`}
              href={`${config.href}/${result.slug}`}
              className="block rounded-xl border border-border p-4 transition-colors hover:border-blue-500/50 hover:bg-accent/50"
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 rounded-lg ${config.bg} p-2`}>
                  <Icon className={`h-4 w-4 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium uppercase ${config.color}`}>
                      {result.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {result.category}
                    </span>
                    {result.rank > 0 && (
                      <span className="text-xs text-muted-foreground">
                        rank: {result.rank.toFixed(4)}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-1 font-medium">{result.title}</h4>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                    {result.summary}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
