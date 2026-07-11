import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, ExternalLink, TrendingUp, Share2, Bookmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockNews, mockTools } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = mockNews.find((a) => a.slug === slug);
  if (!article) return { title: "Not Found" };
  return {
    title: article.title,
    description: article.summary,
  };
}

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

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = mockNews.find((a) => a.slug === slug);

  if (!article) notFound();

  const relatedTools = mockTools.filter((t) =>
    article.relatedTools.includes(t.slug)
  );
  const relatedNews = mockNews
    .filter((a) => a.id !== article.id && a.category === article.category)
    .slice(0, 3);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/news"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to News
      </Link>

      {/* Article Header */}
      <article>
        <div className="flex items-center gap-2 mb-4">
          <Badge>{article.category}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo(article.publishedAt)}
          </span>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Impact: {article.impactScore}/100
          </span>
        </div>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Source: {article.source}</span>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 hover:underline"
            >
              Visit <ExternalLink className="h-3 w-3" />
            </a>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Article Body */}
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <p className="text-lg leading-relaxed">{article.summary}</p>
          <p className="mt-4 text-muted-foreground">
            This article is sourced from {article.source}. Full content and
            analysis will be available through our content pipeline. Visit the
            original source for the complete article.
          </p>
        </div>

        {/* Tags */}
        <div className="mt-8 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </article>

      <Separator className="my-8" />

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Related AI Tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {relatedTools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.slug}`}>
                <Card className="transition-all hover:border-border hover:shadow-sm">
                  <CardContent className="flex items-center gap-3 p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold">
                      {tool.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{tool.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {tool.tagline}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4">Related News</h2>
          <div className="space-y-3">
            {relatedNews.map((news) => (
              <Link
                key={news.id}
                href={`/news/${news.slug}`}
                className="block rounded-lg border p-4 transition-all hover:border-border hover:bg-muted/50"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-xs">
                    {news.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(news.publishedAt)}
                  </span>
                </div>
                <h3 className="font-medium">{news.title}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
