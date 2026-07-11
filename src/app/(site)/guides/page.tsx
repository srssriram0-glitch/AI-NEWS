import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockGuides } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "How-to Guides",
  description: "Step-by-step AI tutorials and guides for every skill level.",
};

export default function GuidesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-6 w-6 text-orange-500" />
          <h1 className="text-3xl font-bold">How-to Guides</h1>
        </div>
        <p className="text-muted-foreground">
          Step-by-step tutorials for every AI tool and model. From beginner to
          advanced.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Beginner", "Intermediate", "Advanced"].map((filter) => (
          <Badge
            key={filter}
            variant={filter === "All" ? "default" : "outline"}
            className="cursor-pointer px-3 py-1"
          >
            {filter}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockGuides.map((guide) => (
          <Link key={guide.id} href={`/guides/${guide.slug}`}>
            <Card className="h-full transition-all hover:border-border hover:shadow-md">
              <div className="aspect-video bg-gradient-to-br from-orange-500/20 to-red-500/20 p-5 flex items-end">
                <Badge variant="secondary">{guide.difficulty}</Badge>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold leading-tight">{guide.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {guide.summary}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {guide.readTime} min
                  </span>
                  <Badge variant="outline" className="text-xs">
                    {guide.category}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {guide.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-[10px] px-1.5 py-0"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
