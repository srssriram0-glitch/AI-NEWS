"use client";

import { useEffect, useState } from "react";
import {
  Newspaper,
  Wrench,
  BookOpen,
  MessageSquare,
  FileText,
  Calendar,
  Briefcase,
  Building2,
  TrendingUp,
  Rss,
  Database,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { adminFetch } from "@/lib/admin-api";

interface Stats {
  news_articles: number;
  ai_tools: number;
  guides: number;
  prompts: number;
  research_papers: number;
  events: number;
  jobs: number;
  companies: number;
}

interface RecentLog {
  id: string;
  feed_name: string;
  status: string;
  articles_found: number;
  articles_added: number;
  started_at: string;
}

const STAT_CARDS = [
  { key: "news_articles", label: "News Articles", icon: Newspaper, color: "text-blue-500" },
  { key: "ai_tools", label: "AI Tools", icon: Wrench, color: "text-violet-500" },
  { key: "guides", label: "Guides", icon: BookOpen, color: "text-green-500" },
  { key: "prompts", label: "Prompts", icon: MessageSquare, color: "text-orange-500" },
  { key: "research_papers", label: "Papers", icon: FileText, color: "text-pink-500" },
  { key: "events", label: "Events", icon: Calendar, color: "text-cyan-500" },
  { key: "jobs", label: "Jobs", icon: Briefcase, color: "text-yellow-500" },
  { key: "companies", label: "Companies", icon: Building2, color: "text-red-500" },
] as const;

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [logs, setLogs] = useState<RecentLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [dbSetup, setDbSetup] = useState<{ running: boolean; results: { step: string; success: boolean; error?: string }[] | null }>({ running: false, results: null });

  const runSetup = async () => {
    setDbSetup({ running: true, results: null });
    try {
      const res = await adminFetch("/api/admin/setup-db", { method: "POST" });
      const data = await res.json();
      setDbSetup({ running: false, results: data.results });
      if (data.success) {
        const [statsRes] = await Promise.all([adminFetch("/api/admin/stats")]);
        if (statsRes.ok) setStats(await statsRes.json());
      }
    } catch {
      setDbSetup({ running: false, results: [{ step: "Connection", success: false, error: "Failed to connect" }] });
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const [statsRes, logsRes] = await Promise.all([
          adminFetch("/api/admin/stats"),
          adminFetch("/api/admin/ingestion-logs"),
        ]);
        if (statsRes.ok) setStats(await statsRes.json());
        if (logsRes.ok) {
          const data = await logsRes.json();
          setLogs(data.slice(0, 5));
        }
      } catch {
        // fallback
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of all content on AI World Hub.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="rounded-xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {card.label}
              </span>
              <card.icon className={`h-5 w-5 ${card.color}`} />
            </div>
            <p className="mt-2 text-3xl font-bold">
              {loading ? "..." : stats?.[card.key] ?? 0}
            </p>
          </div>
        ))}
      </div>

      {/* Database Setup */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Database className="h-5 w-5 text-blue-500" />
          Database Setup
        </h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Create all tables, search indexes, and seed data in Supabase with one click.
        </p>
        <button
          onClick={runSetup}
          disabled={dbSetup.running}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {dbSetup.running ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Setting up...</>
          ) : (
            <><Database className="h-4 w-4" /> Setup Database</>
          )}
        </button>
        {dbSetup.results && (
          <div className="mt-4 space-y-2">
            {dbSetup.results.map((r, i) => (
              <div key={i} className="flex items-center gap-2 text-sm">
                {r.success ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>{r.step}</span>
                {r.error && <span className="text-xs text-red-400">{r.error}</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Quick Actions
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <a
            href="/admin/news?action=create"
            className="rounded-lg border border-border p-4 text-center transition-colors hover:border-blue-500 hover:bg-blue-500/5"
          >
            <Newspaper className="mx-auto mb-2 h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium">Add News Article</span>
          </a>
          <a
            href="/admin/tools?action=create"
            className="rounded-lg border border-border p-4 text-center transition-colors hover:border-violet-500 hover:bg-violet-500/5"
          >
            <Wrench className="mx-auto mb-2 h-6 w-6 text-violet-500" />
            <span className="text-sm font-medium">Add AI Tool</span>
          </a>
          <a
            href="/admin/feeds"
            className="rounded-lg border border-border p-4 text-center transition-colors hover:border-green-500 hover:bg-green-500/5"
          >
            <Rss className="mx-auto mb-2 h-6 w-6 text-green-500" />
            <span className="text-sm font-medium">Manage RSS Feeds</span>
          </a>
          <a
            href="/admin/search-test"
            className="rounded-lg border border-border p-4 text-center transition-colors hover:border-orange-500 hover:bg-orange-500/5"
          >
            <MessageSquare className="mx-auto mb-2 h-6 w-6 text-orange-500" />
            <span className="text-sm font-medium">Test Search</span>
          </a>
        </div>
      </div>

      {/* Recent Ingestion Logs */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Rss className="h-5 w-5 text-green-500" />
          Recent Ingestion Activity
        </h3>
        {logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No ingestion runs yet. Go to RSS Feeds to trigger one.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted-foreground">
                  <th className="pb-2 pr-4">Feed</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2 pr-4">Found</th>
                  <th className="pb-2 pr-4">Added</th>
                  <th className="pb-2">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-border/50">
                    <td className="py-2 pr-4">{log.feed_name}</td>
                    <td className="py-2 pr-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          log.status === "success"
                            ? "bg-green-500/10 text-green-500"
                            : log.status === "error"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2 pr-4">{log.articles_found}</td>
                    <td className="py-2 pr-4">{log.articles_added}</td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(log.started_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
