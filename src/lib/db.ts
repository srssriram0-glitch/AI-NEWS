import { supabaseAdmin } from "./supabase-admin";
import type {
  NewsArticle,
  AITool,
  Guide,
  Prompt,
  ResearchPaper,
  AIEvent,
  AIJob,
  Company,
} from "./types";
import {
  mockNews,
  mockTools,
  mockGuides,
  mockPrompts,
  mockPapers,
  mockEvents,
  mockJobs,
  mockCompanies,
} from "./mock-data";

function snakeToCamel(row: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(row)) {
    const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
    result[camelKey] = value;
  }
  return result;
}

function rowsToType<T>(rows: Record<string, unknown>[]): T[] {
  return rows.map((r) => snakeToCamel(r) as T);
}

export async function getNews(limit = 20): Promise<NewsArticle[]> {
  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockNews.slice(0, limit);
  return rowsToType<NewsArticle>(data);
}

export async function getNewsBySlug(
  slug: string
): Promise<NewsArticle | null> {
  const { data, error } = await supabaseAdmin
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data)
    return mockNews.find((n) => n.slug === slug) || null;
  return snakeToCamel(data) as NewsArticle;
}

export async function getTools(limit = 20): Promise<AITool[]> {
  const { data, error } = await supabaseAdmin
    .from("ai_tools")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockTools.slice(0, limit);
  return rowsToType<AITool>(data);
}

export async function getToolBySlug(slug: string): Promise<AITool | null> {
  const { data, error } = await supabaseAdmin
    .from("ai_tools")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return mockTools.find((t) => t.slug === slug) || null;
  return snakeToCamel(data) as AITool;
}

export async function getGuides(limit = 20): Promise<Guide[]> {
  const { data, error } = await supabaseAdmin
    .from("guides")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockGuides.slice(0, limit);
  return rowsToType<Guide>(data);
}

export async function getPrompts(limit = 20): Promise<Prompt[]> {
  const { data, error } = await supabaseAdmin
    .from("prompts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockPrompts.slice(0, limit);
  return rowsToType<Prompt>(data);
}

export async function getPapers(limit = 20): Promise<ResearchPaper[]> {
  const { data, error } = await supabaseAdmin
    .from("research_papers")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockPapers.slice(0, limit);
  return rowsToType<ResearchPaper>(data);
}

export async function getEvents(limit = 20): Promise<AIEvent[]> {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("*")
    .order("date", { ascending: true })
    .limit(limit);
  if (error || !data?.length) return mockEvents.slice(0, limit);
  return rowsToType<AIEvent>(data);
}

export async function getJobs(limit = 20): Promise<AIJob[]> {
  const { data, error } = await supabaseAdmin
    .from("jobs")
    .select("*")
    .order("posted_at", { ascending: false })
    .limit(limit);
  if (error || !data?.length) return mockJobs.slice(0, limit);
  return rowsToType<AIJob>(data);
}

export async function getCompanies(limit = 20): Promise<Company[]> {
  const { data, error } = await supabaseAdmin
    .from("companies")
    .select("*")
    .order("name", { ascending: true })
    .limit(limit);
  if (error || !data?.length) return mockCompanies.slice(0, limit);
  return rowsToType<Company>(data);
}

export interface SearchResult {
  id: string;
  type: "news" | "tool" | "guide" | "prompt" | "paper";
  slug: string;
  title: string;
  summary: string;
  category: string;
  rank: number;
}

export async function searchContent(
  query: string,
  limit = 20
): Promise<SearchResult[]> {
  const { data, error } = await supabaseAdmin.rpc("search_all_content", {
    search_query: query,
    max_results: limit,
  });

  if (error || !data?.length) {
    return fallbackSearch(query, limit);
  }

  return data as SearchResult[];
}

function fallbackSearch(query: string, limit: number): SearchResult[] {
  const q = query.toLowerCase();
  const results: SearchResult[] = [];

  for (const n of mockNews) {
    if (
      n.title.toLowerCase().includes(q) ||
      n.summary.toLowerCase().includes(q)
    ) {
      results.push({
        id: n.id,
        type: "news",
        slug: n.slug,
        title: n.title,
        summary: n.summary,
        category: n.category,
        rank: 1,
      });
    }
  }
  for (const t of mockTools) {
    if (
      t.name.toLowerCase().includes(q) ||
      t.tagline.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: t.id,
        type: "tool",
        slug: t.slug,
        title: t.name,
        summary: t.tagline,
        category: t.category,
        rank: 1,
      });
    }
  }
  for (const g of mockGuides) {
    if (
      g.title.toLowerCase().includes(q) ||
      g.summary.toLowerCase().includes(q)
    ) {
      results.push({
        id: g.id,
        type: "guide",
        slug: g.slug,
        title: g.title,
        summary: g.summary,
        category: g.category,
        rank: 1,
      });
    }
  }
  for (const p of mockPrompts) {
    if (
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    ) {
      results.push({
        id: p.id,
        type: "prompt",
        slug: p.slug,
        title: p.title,
        summary: p.description,
        category: p.category,
        rank: 1,
      });
    }
  }
  for (const r of mockPapers) {
    if (
      r.title.toLowerCase().includes(q) ||
      r.abstract.toLowerCase().includes(q)
    ) {
      results.push({
        id: r.id,
        type: "paper",
        slug: r.slug,
        title: r.title,
        summary: r.abstract,
        category: r.category,
        rank: 1,
      });
    }
  }

  return results.slice(0, limit);
}

export async function getContentStats() {
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
    const { count, error } = await supabaseAdmin
      .from(table)
      .select("*", { count: "exact", head: true });
    counts[table] = error ? 0 : (count ?? 0);
  }

  return counts;
}
