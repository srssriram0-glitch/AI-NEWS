import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ToolCard } from "@/components/tools/tool-card";
import { mockTools } from "@/lib/mock-data";
import { CATEGORIES } from "@/lib/constants";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: "Not Found" };
  return { title: `${category.name} AI Tools`, description: `Best AI tools for ${category.name}.` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  const tools = mockTools.filter(
    (t) => t.category === slug || t.tags.some((tag) => tag.toLowerCase().includes(category.name.toLowerCase()))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/categories"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3 w-3" />
        All Categories
      </Link>

      <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
      <p className="text-muted-foreground mb-8">
        Discover the best AI tools for {category.name.toLowerCase()}.
      </p>

      {tools.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">
          No tools found in this category yet. Check back soon!
        </p>
      )}
    </div>
  );
}
