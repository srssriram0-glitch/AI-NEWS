import type { Metadata } from "next";
import Link from "next/link";
import {
  Image,
  Video,
  Code,
  PenTool,
  Megaphone,
  Zap,
  Bot,
  Mic,
  Music,
  Box,
  MessageSquare,
  Search,
  Rocket,
  BarChart3,
  GraduationCap,
  Heart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse AI tools by category.",
};

const iconMap: Record<string, React.ElementType> = {
  Image, Video, Code, PenTool, Megaphone, Zap, Bot, Mic, Music, Box,
  MessageSquare, Search, Rocket, BarChart3, GraduationCap, Heart,
};

export default function CategoriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground">
          Explore AI tools organized by what they do.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map((cat) => {
          const Icon = iconMap[cat.icon] || Zap;
          return (
            <Link key={cat.slug} href={`/categories/${cat.slug}`}>
              <Card className="group h-full transition-all hover:border-border hover:shadow-md">
                <CardContent className="flex flex-col items-center gap-3 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 transition-colors group-hover:from-blue-500/20 group-hover:to-violet-500/20">
                    <Icon className="h-6 w-6 text-blue-500" />
                  </div>
                  <h3 className="font-semibold">{cat.name}</h3>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
