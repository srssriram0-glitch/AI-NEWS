import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockPapers } from "@/lib/mock-data";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const paper = mockPapers.find((p) => p.slug === slug);
  if (!paper) return { title: "Not Found" };
  return { title: paper.title, description: paper.abstract.slice(0, 160) };
}

export default async function PaperDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const paper = mockPapers.find((p) => p.slug === slug);
  if (!paper) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/papers" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3 w-3" /> Back to Papers
      </Link>

      <div className="flex items-center gap-2 mb-4">
        <Badge>{paper.category}</Badge>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          <Quote className="h-3 w-3" /> {paper.citations} citations
        </span>
      </div>

      <h1 className="text-3xl font-bold leading-tight">{paper.title}</h1>
      <p className="mt-2 text-muted-foreground">{paper.authors.join(", ")}</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Published {new Date(paper.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </p>

      <div className="mt-4 flex gap-2">
        <a href={paper.arxivUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">arXiv <ExternalLink className="ml-1 h-3 w-3" /></Button>
        </a>
        <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">PDF <ExternalLink className="ml-1 h-3 w-3" /></Button>
        </a>
      </div>

      <Separator className="my-8" />

      <h2 className="text-xl font-semibold mb-3">Abstract</h2>
      <p className="text-muted-foreground leading-relaxed">{paper.abstract}</p>

      <div className="mt-8 flex flex-wrap gap-2">
        {paper.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}
      </div>
    </div>
  );
}
