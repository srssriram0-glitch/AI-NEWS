import type { Metadata } from "next";
import Link from "next/link";
import { FileText, ExternalLink, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockPapers } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Research Papers",
  description: "Latest AI research papers from top institutions.",
};

export default function PapersPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-6 w-6 text-red-500" />
          <h1 className="text-3xl font-bold">Research Papers</h1>
        </div>
        <p className="text-muted-foreground">
          The most impactful AI research papers, summarized and categorized.
        </p>
      </div>

      <div className="space-y-4">
        {mockPapers.map((paper) => (
          <Card key={paper.id} className="transition-all hover:shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-xs">
                      {paper.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(paper.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Quote className="h-3 w-3" />
                      {paper.citations} citations
                    </span>
                  </div>
                  <h2 className="text-lg font-semibold leading-tight">
                    {paper.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {paper.authors.join(", ")}
                  </p>
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">
                    {paper.abstract}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {paper.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <a href={paper.arxivUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-xs">
                      arXiv <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </a>
                  <a href={paper.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="text-xs">
                      PDF <ExternalLink className="ml-1 h-3 w-3" />
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
