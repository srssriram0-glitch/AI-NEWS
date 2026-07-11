import type { Metadata } from "next";
import { Sparkles, TrendingUp, Wrench, FileText, Briefcase } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NewsCard } from "@/components/news/news-card";
import { mockNews, mockTools, mockPapers, mockJobs } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Daily Digest",
  description: "Your daily AI digest — top news, tools, papers, and jobs.",
};

export default function DigestPage() {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <Badge variant="secondary" className="mb-3">
          <Sparkles className="mr-1 h-3 w-3" />
          {today}
        </Badge>
        <h1 className="text-3xl font-bold sm:text-4xl">Daily AI Digest</h1>
        <p className="mt-2 text-muted-foreground">
          Everything you need to know about AI today, in one page.
        </p>
      </div>

      {/* Top News */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Top Stories
        </h2>
        <div className="space-y-2">
          {mockNews.slice(0, 5).map((article) => (
            <NewsCard key={article.id} article={article} variant="compact" />
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* New Tools */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
          <Wrench className="h-5 w-5 text-green-500" />
          Tool Updates
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {mockTools.slice(0, 4).map((tool) => (
            <Card key={tool.id} className="transition-all hover:shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-bold">
                  {tool.name.charAt(0)}
                </div>
                <div className="min-w-0">
                  <div className="font-medium">{tool.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{tool.changelog[0]?.changes[0]}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Papers */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
          <FileText className="h-5 w-5 text-red-500" />
          Notable Papers
        </h2>
        <div className="space-y-3">
          {mockPapers.slice(0, 3).map((paper) => (
            <div key={paper.id} className="rounded-lg border p-4">
              <h3 className="font-medium leading-tight">{paper.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{paper.authors.join(", ")}</p>
            </div>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Jobs */}
      <section>
        <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
          <Briefcase className="h-5 w-5 text-teal-500" />
          Featured Jobs
        </h2>
        <div className="space-y-3">
          {mockJobs.slice(0, 3).map((job) => (
            <div key={job.id} className="rounded-lg border p-4">
              <h3 className="font-medium">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company} &middot; {job.location}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
