import Link from "next/link";
import {
  ArrowRight,
  Zap,
  TrendingUp,
  Clock,
  Star,
  Newspaper,
  Wrench,
  BookOpen,
  MessageSquareText,
  FileText,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NewsCard } from "@/components/news/news-card";
import { ToolCard } from "@/components/tools/tool-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { mockNews, mockTools, mockGuides, mockPapers } from "@/lib/mock-data";

const heroStats = [
  { label: "AI Tools Tracked", value: "100,000+" },
  { label: "Daily Updates", value: "500+" },
  { label: "Active Users", value: "250K+" },
  { label: "Research Papers", value: "50K+" },
];

const quickAccess = [
  { label: "AI News", href: "/news", icon: Newspaper, color: "text-blue-500" },
  { label: "AI Tools", href: "/tools", icon: Wrench, color: "text-green-500" },
  { label: "Guides", href: "/guides", icon: BookOpen, color: "text-orange-500" },
  { label: "Prompts", href: "/prompts", icon: MessageSquareText, color: "text-purple-500" },
  { label: "Papers", href: "/papers", icon: FileText, color: "text-red-500" },
  { label: "Jobs", href: "/jobs", icon: Briefcase, color: "text-teal-500" },
];

export default function HomePage() {
  const breakingNews = mockNews.slice(0, 3);
  const latestNews = mockNews.slice(0, 6);
  const trendingTools = mockTools.filter((t) => t.isTrending);
  const featuredGuides = mockGuides.slice(0, 4);
  const recentPapers = mockPapers.slice(0, 3);

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Zap className="mr-1 h-3 w-3" />
              Updated every 15 minutes
            </Badge>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Every AI Update.{" "}
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                One Platform.
              </span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Discover the latest AI tools, news, tutorials, prompts, and
              research papers. Stop searching — start building.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/news">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-violet-600 text-white hover:from-blue-700 hover:to-violet-700"
                >
                  Explore AI News
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/tools">
                <Button size="lg" variant="outline">
                  Browse AI Tools
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold sm:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access */}
      <section className="border-b border-border/40 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {quickAccess.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-background p-4 transition-all hover:border-border hover:shadow-sm"
              >
                <item.icon className={`h-5 w-5 ${item.color}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Breaking News */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <h2 className="text-xl font-bold sm:text-2xl">Breaking AI News</h2>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              View all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {breakingNews.map((article) => (
              <NewsCard key={article.id} article={article} variant="featured" />
            ))}
          </div>
        </div>
      </section>

      {/* Latest News + Trending Sidebar */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* News Feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Latest Updates</h2>
                <Link
                  href="/news"
                  className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  All news
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="mt-4 space-y-4">
                {latestNews.map((article) => (
                  <NewsCard key={article.id} article={article} variant="compact" />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Trending Tools */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Trending AI Tools
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {trendingTools.slice(0, 5).map((tool, i) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.slug}`}
                      className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-muted"
                    >
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-muted text-xs font-bold text-muted-foreground">
                        {i + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {tool.name}
                        </div>
                        <div className="truncate text-xs text-muted-foreground">
                          {tool.tagline}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                        {tool.rating}
                      </div>
                    </Link>
                  ))}
                  <Link href="/tools">
                    <Button variant="ghost" size="sm" className="mt-2 w-full">
                      View all tools
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Recent Papers */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-4 w-4 text-blue-500" />
                    Research Papers
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentPapers.map((paper) => (
                    <div key={paper.id} className="space-y-1">
                      <Link
                        href={`/papers/${paper.slug}`}
                        className="text-sm font-medium leading-tight hover:underline"
                      >
                        {paper.title}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{paper.authors[0]}</span>
                        <span>&middot;</span>
                        <span>{paper.citations} citations</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Tools Grid */}
      <section className="border-b border-border/40 bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">
              Featured AI Tools
            </h2>
            <Link
              href="/tools"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Browse all
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {mockTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Guides */}
      <section className="border-b border-border/40">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold sm:text-2xl">Popular Guides</h2>
            <Link
              href="/guides"
              className="flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              All guides
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredGuides.map((guide) => (
              <Link key={guide.id} href={`/guides/${guide.slug}`}>
                <Card className="h-full transition-all hover:border-border hover:shadow-sm">
                  <CardContent className="p-5">
                    <Badge variant="secondary" className="mb-3 text-xs">
                      {guide.difficulty}
                    </Badge>
                    <h3 className="font-semibold leading-tight">
                      {guide.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                      {guide.summary}
                    </p>
                    <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {guide.readTime} min read
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {guide.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-b from-muted/30 to-background">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold sm:text-3xl">
              Never Miss an AI Update
            </h2>
            <p className="mt-3 text-muted-foreground">
              Get the most important AI news, tool launches, and research papers
              delivered to your inbox every morning. Join 50,000+ AI
              professionals.
            </p>
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
