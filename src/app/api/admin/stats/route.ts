import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function checkAdmin(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_SECRET;
}

export async function GET(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tables = [
    "news_articles",
    "ai_tools",
    "guides",
    "prompts",
    "research_papers",
    "events",
    "jobs",
    "companies",
  ] as const;

  const counts: Record<string, number> = {};

  for (const table of tables) {
    const { count } = await supabaseAdmin
      .from(table)
      .select("*", { count: "exact", head: true });
    counts[table] = count ?? 0;
  }

  return Response.json(counts);
}
