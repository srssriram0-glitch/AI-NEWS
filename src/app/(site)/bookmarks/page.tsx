import type { Metadata } from "next";
import { Bookmark, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your saved AI tools, articles, and resources.",
};

export default function BookmarksPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
      <div className="flex justify-center mb-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Bookmark className="h-7 w-7 text-muted-foreground" />
        </div>
      </div>
      <h1 className="text-3xl font-bold">Your Bookmarks</h1>
      <p className="mt-3 text-muted-foreground">
        Save articles, tools, prompts, and guides to revisit them later.
      </p>

      <Card className="mt-8 mx-auto max-w-sm">
        <CardContent className="p-8 text-center">
          <LogIn className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
          <h3 className="font-semibold mb-2">Sign in to save bookmarks</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a free account to save and organize your favorite AI
            resources.
          </p>
          <Button className="bg-gradient-to-r from-blue-600 to-violet-600 text-white">
            Sign In
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
