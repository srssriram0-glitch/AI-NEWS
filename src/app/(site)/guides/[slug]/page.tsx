import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Clock, BookOpen, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockGuides, mockTools } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = mockGuides.find((g) => g.slug === slug);
  if (!guide) return { title: "Not Found" };
  return { title: guide.title, description: guide.summary };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = mockGuides.find((g) => g.slug === slug);
  if (!guide) notFound();

  const relatedTools = mockTools.filter((t) =>
    guide.relatedTools.includes(t.slug)
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/guides"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        Back to Guides
      </Link>

      <article>
        <div className="flex items-center gap-2 mb-4">
          <Badge>{guide.difficulty}</Badge>
          <Badge variant="outline">{guide.category}</Badge>
          <span className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {guide.readTime} min read
          </span>
        </div>

        <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
          {guide.title}
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">{guide.summary}</p>

        <div className="mt-4 text-sm text-muted-foreground">
          By {guide.author} &middot;{" "}
          {new Date(guide.publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>

        <Separator className="my-8" />

        {/* Requirements */}
        {guide.requirements.length > 0 && (
          <Card className="mb-8">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {guide.requirements.map((req) => (
                  <li key={req} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    {req}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Steps */}
        <div className="space-y-8">
          {guide.steps.map((step, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-violet-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h2 className="text-xl font-semibold">{step.title}</h2>
              </div>
              <p className="text-muted-foreground ml-11">{step.content}</p>
              {step.codeExample && (
                <pre className="mt-3 ml-11 overflow-x-auto rounded-lg bg-muted p-4 text-sm">
                  <code>{step.codeExample}</code>
                </pre>
              )}
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="mt-10 flex flex-wrap gap-2">
          {guide.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </article>

      {/* Related Tools */}
      {relatedTools.length > 0 && (
        <>
          <Separator className="my-8" />
          <section>
            <h2 className="text-xl font-semibold mb-4">Related Tools</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedTools.map((tool) => (
                <Link key={tool.id} href={`/tools/${tool.slug}`}>
                  <Card className="transition-all hover:shadow-sm">
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
        </>
      )}
    </div>
  );
}
