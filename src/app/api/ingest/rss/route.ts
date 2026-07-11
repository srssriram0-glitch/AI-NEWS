import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Parser from "rss-parser";

function checkAdmin(request: NextRequest): boolean {
  const key = request.headers.get("x-admin-key");
  return key === process.env.ADMIN_SECRET;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "AI-World-Hub/1.0 RSS Reader",
  },
});

export async function POST(request: NextRequest) {
  if (!checkAdmin(request)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const feedId = body.feed_id as string | undefined;

  let query = supabaseAdmin
    .from("rss_feeds")
    .select("*")
    .eq("is_active", true);

  if (feedId) {
    query = query.eq("id", feedId);
  }

  const { data: feeds, error: feedError } = await query;

  if (feedError || !feeds?.length) {
    return Response.json(
      { error: "No feeds found", details: feedError?.message },
      { status: 404 }
    );
  }

  const results = [];

  for (const feed of feeds) {
    const logEntry = {
      feed_id: feed.id,
      feed_name: feed.name,
      status: "running" as string,
      articles_found: 0,
      articles_added: 0,
      error_message: "",
    };

    const { data: log } = await supabaseAdmin
      .from("ingestion_logs")
      .insert(logEntry)
      .select()
      .single();

    try {
      const parsed = await parser.parseURL(feed.url);
      const items = parsed.items || [];
      logEntry.articles_found = items.length;

      let added = 0;

      for (const item of items.slice(0, 30)) {
        const title = item.title || "Untitled";
        const slug = slugify(title + "-" + Date.now().toString(36));
        const summary = stripHtml(
          item.contentSnippet || item.content || item.summary || ""
        ).slice(0, 500);
        const content = stripHtml(item.content || item.summary || "");
        const pubDate = item.pubDate
          ? new Date(item.pubDate).toISOString()
          : new Date().toISOString();

        const categories = (item.categories || []).map((c: string) =>
          typeof c === "string" ? c : ""
        ).filter(Boolean);

        const { error: insertError } = await supabaseAdmin
          .from("news_articles")
          .insert({
            slug,
            title,
            summary,
            content,
            source: feed.name,
            source_url: item.link || feed.url,
            image_url: item.enclosure?.url || "",
            category: feed.category || "General",
            tags: categories.slice(0, 10),
            impact_score: 50,
            published_at: pubDate,
          });

        if (!insertError) {
          added++;
        }
      }

      logEntry.articles_added = added;
      logEntry.status = "success";

      await supabaseAdmin
        .from("rss_feeds")
        .update({
          last_fetched_at: new Date().toISOString(),
          article_count: (feed.article_count || 0) + added,
        })
        .eq("id", feed.id);
    } catch (err) {
      logEntry.status = "error";
      logEntry.error_message =
        err instanceof Error ? err.message : "Unknown error";
    }

    if (log) {
      await supabaseAdmin
        .from("ingestion_logs")
        .update({
          status: logEntry.status,
          articles_found: logEntry.articles_found,
          articles_added: logEntry.articles_added,
          error_message: logEntry.error_message,
          completed_at: new Date().toISOString(),
        })
        .eq("id", log.id);
    }

    results.push({
      feed: feed.name,
      status: logEntry.status,
      found: logEntry.articles_found,
      added: logEntry.articles_added,
      error: logEntry.error_message || undefined,
    });
  }

  return Response.json({ results });
}
