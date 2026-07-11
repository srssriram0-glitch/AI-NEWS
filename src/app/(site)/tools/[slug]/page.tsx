import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Check,
  X,
  Zap,
  Code,
  DollarSign,
  Calendar,
  Users,
  BookOpen,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockTools } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = mockTools.find((t) => t.slug === slug);
  if (!tool) return { title: "Not Found" };
  return {
    title: `${tool.name} — AI Tool`,
    description: tool.tagline,
  };
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = mockTools.find((t) => t.slug === slug);

  if (!tool) notFound();

  const alternatives = mockTools.filter((t) =>
    tool.alternatives.includes(t.slug)
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <Link
        href="/tools"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Tools
      </Link>

      {/* Tool Header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-muted to-muted/50 text-2xl font-bold">
            {tool.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold">{tool.name}</h1>
              {tool.isTrending && (
                <Badge className="bg-green-500/10 text-green-600 dark:text-green-400">
                  <Zap className="mr-0.5 h-3 w-3" />
                  Trending
                </Badge>
              )}
            </div>
            <p className="mt-1 text-lg text-muted-foreground">{tool.tagline}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                <span className="font-medium text-foreground">
                  {tool.rating}
                </span>
                ({(tool.reviewCount / 1000).toFixed(0)}K reviews)
              </span>
              <span>{tool.company}</span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Since {tool.launchDate.split("-")[0]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <a href={tool.websiteUrl} target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
              Visit Website
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </a>
          {tool.apiAvailable && (
            <Button variant="outline">
              <Code className="mr-2 h-4 w-4" />
              API Docs
            </Button>
          )}
        </div>
      </div>

      <Separator className="my-8" />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="changelog">Changelog</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>About {tool.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </CardContent>
              </Card>

              {/* Pros & Cons */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-green-600 dark:text-green-400">
                      Pros
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tool.pros.map((pro) => (
                      <div
                        key={pro}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        {pro}
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-red-600 dark:text-red-400">
                      Cons
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {tool.cons.map((con) => (
                      <div
                        key={con}
                        className="flex items-start gap-2 text-sm"
                      >
                        <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                        {con}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quick Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <Badge variant="outline">{tool.category}</Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pricing</span>
                    <span className="font-medium">
                      {tool.pricing.model.charAt(0).toUpperCase() +
                        tool.pricing.model.slice(1)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">API</span>
                    <span>{tool.apiAvailable ? "Available" : "N/A"}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Company</span>
                    <span>{tool.company}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Founder</span>
                    <span>{tool.founder}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5">
                    {tool.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pricing">
          <div className="grid gap-4 sm:grid-cols-3">
            {tool.pricing.plans.map((plan) => (
              <Card key={plan.name} className="relative">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <div className="text-2xl font-bold">{plan.price}</div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="features">
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tool.features.map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 rounded-lg border p-3"
                  >
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="changelog">
          <div className="space-y-4">
            {tool.changelog.map((entry) => (
              <Card key={entry.version}>
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge>{entry.version}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <ul className="space-y-1">
                    {entry.changes.map((change) => (
                      <li
                        key={change}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                        {change}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="alternatives">
          {alternatives.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {alternatives.map((alt) => (
                <Link key={alt.id} href={`/tools/${alt.slug}`}>
                  <Card className="h-full transition-all hover:border-border hover:shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-lg font-bold">
                          {alt.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold">{alt.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {alt.company}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {alt.tagline}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-medium">{alt.rating}</span>
                        <Badge variant="secondary" className="ml-auto text-xs">
                          {alt.pricing.model}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No alternatives found in our database yet.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
