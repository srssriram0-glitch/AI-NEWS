"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Loader2,
  Newspaper,
  Wrench,
  BookOpen,
  MessageSquare,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockTools, mockNews } from "@/lib/mock-data";

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
  news: { icon: Newspaper, color: "text-blue-500", bg: "bg-blue-500/10", label: "News", href: "/news" },
  tool: { icon: Wrench, color: "text-violet-500", bg: "bg-violet-500/10", label: "Tool", href: "/tools" },
  guide: { icon: BookOpen, color: "text-green-500", bg: "bg-green-500/10", label: "Guide", href: "/guides" },
  prompt: { icon: MessageSquare, color: "text-orange-500", bg: "bg-orange-500/10", label: "Prompt", href: "/prompts" },
  paper: { icon: FileText, color: "text-pink-500", bg: "bg-pink-500/10", label: "Paper", href: "/papers" },
};

const FILTERS = ["All", "News", "Tools", "Guides", "Prompts", "Papers"];

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searched, setSearched] = useState(false);

  const doSearch = async (q: string, filter?: string) => {
    if (!q.trim()) {
      setResults([]);
      setSearched(false);
      return;
    }

    setSearching(true);
    setSearched(true);

    const typeMap: Record<string, string> = {
      All: "all",
      News: "news",
      Tools: "tool",
      Guides: "guide",
      Prompts: "prompt",
      Papers: "paper",
    };

    const type = typeMap[filter || activeFilter] || "all";
    try {
      const res = await fetch(
        `/api/search?q=${encodeURIComponent(q)}&type=${type}`
      );
      if (res.ok) {
        const json = await res.json();
        setResults(json.results);
      }
    } catch {
      setResults([]);
    }
    setSearching(false);
  };

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query);
  };

  const handleFilterClick = (filter: string) => {
    setActiveFilter(filter);
    if (query.trim()) {
      doSearch(query, filter);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-3xl font-bold">Search Everything AI</h1>
        <form onSubmit={handleSubmit} className="relative mx-auto flex max-w-xl gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search AI tools, news, guides, prompts..."
              className="h-12 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-base outline-none focus:border-blue-500"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-muted-foreground" />
            )}
          </div>
          <button
            type="submit"
            className="h-12 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 px-6 font-medium text-white hover:from-blue-700 hover:to-violet-700"
          >
            Search
          </button>
        </form>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {FILTERS.map((filter) => (
            <Badge
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className="cursor-pointer px-3 py-1"
              onClick={() => handleFilterClick(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {searched && (
        <div className="mb-8">
          <p className="mb-4 text-sm text-muted-foreground">
            {results.length} result{results.length !== 1 ? "s" : ""} for
            &quot;{query}&quot;
          </p>
          {results.length > 0 ? (
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
                            {config.label}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {result.category}
                          </span>
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
          ) : (
            <div className="rounded-xl border border-border p-8 text-center">
              <Search className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
              <p className="font-medium">No results found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try different keywords or browse the sections below
              </p>
            </div>
          )}
        </div>
      )}

      {!searched && (
        <div className="space-y-6">
          <section>
            <h2 className="mb-3 text-lg font-semibold">Popular Tools</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {mockTools.slice(0, 4).map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <Card className="transition-all hover:shadow-sm">
                    <CardContent className="flex items-center gap-3 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium">{tool.name}</div>
                        <div className="truncate text-sm text-muted-foreground">
                          {tool.tagline}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold">Latest News</h2>
            <div className="space-y-2">
              {mockNews.slice(0, 4).map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="block rounded-lg border p-3 transition-all hover:bg-muted/50"
                >
                  <div className="font-medium">{article.title}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {article.source}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
