"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Play,
  RefreshCw,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-api";

interface FeedRow {
  id: string;
  name: string;
  url: string;
  category: string;
  is_active: boolean;
  last_fetched_at: string | null;
  article_count: number;
}

const EMPTY: FeedRow = {
  id: "",
  name: "",
  url: "",
  category: "General",
  is_active: true,
  last_fetched_at: null,
  article_count: 0,
};

export default function AdminFeedsPage() {
  const [feeds, setFeeds] = useState<FeedRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FeedRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [ingesting, setIngesting] = useState<string | null>(null);
  const [ingestAll, setIngestAll] = useState(false);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/feeds");
    if (res.ok) setFeeds(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const method = editing.id ? "PUT" : "POST";
    const res = await adminFetch("/api/admin/feeds", {
      method,
      body: JSON.stringify(editing),
    });
    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const err = await res.json();
      alert(err.error || "Failed");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this feed?")) return;
    await adminFetch(`/api/admin/feeds?id=${id}`, { method: "DELETE" });
    load();
  };

  const handleIngest = async (feedId?: string) => {
    if (feedId) setIngesting(feedId);
    else setIngestAll(true);
    setLastResult(null);

    const res = await adminFetch("/api/ingest/rss", {
      method: "POST",
      body: JSON.stringify(feedId ? { feed_id: feedId } : {}),
    });

    if (res.ok) {
      const json = await res.json();
      const summary = json.results
        .map(
          (r: { feed: string; status: string; added: number; found: number }) =>
            `${r.feed}: ${r.status} (${r.added}/${r.found} added)`
        )
        .join("\n");
      setLastResult(summary);
      load();
    } else {
      const err = await res.json();
      setLastResult(`Error: ${err.error}`);
    }

    setIngesting(null);
    setIngestAll(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">RSS Feeds</h2>
          <p className="text-sm text-muted-foreground">
            Manage news sources and trigger ingestion
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleIngest()}
            disabled={ingestAll}
            className="gap-2"
          >
            {ingestAll ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Ingest All
          </Button>
          <Button
            onClick={() => setEditing({ ...EMPTY })}
            className="gap-2"
          >
            <Plus className="h-4 w-4" /> Add Feed
          </Button>
        </div>
      </div>

      {/* Ingestion Result */}
      {lastResult && (
        <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4">
          <h4 className="mb-2 flex items-center gap-2 font-medium text-green-500">
            <CheckCircle className="h-4 w-4" /> Ingestion Complete
          </h4>
          <pre className="whitespace-pre-wrap text-sm text-muted-foreground">
            {lastResult}
          </pre>
        </div>
      )}

      {/* Editor Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
          <div className="w-full max-w-lg rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editing.id ? "Edit Feed" : "Add Feed"}
              </h3>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Feed Name *
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                  placeholder="e.g. TechCrunch AI"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  RSS URL *
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editing.url}
                  onChange={(e) =>
                    setEditing({ ...editing, url: e.target.value })
                  }
                  placeholder="https://example.com/feed.xml"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Category
                </label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={editing.is_active}
                  onChange={(e) =>
                    setEditing({ ...editing, is_active: e.target.checked })
                  }
                />
                Active
              </label>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editing.id ? "Update" : "Add Feed"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feeds Table */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">URL</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Articles</th>
              <th className="px-4 py-3 font-medium">Last Fetched</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Loading...
                </td>
              </tr>
            ) : feeds.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No feeds configured. Run the SQL migration first, then add
                  feeds.
                </td>
              </tr>
            ) : (
              feeds.map((feed) => (
                <tr key={feed.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">{feed.name}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">
                    {feed.url}
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">
                      {feed.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {feed.is_active ? (
                      <span className="flex items-center gap-1 text-green-500">
                        <CheckCircle className="h-3.5 w-3.5" /> Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <AlertCircle className="h-3.5 w-3.5" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">{feed.article_count}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {feed.last_fetched_at
                      ? new Date(feed.last_fetched_at).toLocaleString()
                      : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleIngest(feed.id)}
                        disabled={ingesting === feed.id}
                        className="rounded p-1.5 text-green-500 hover:bg-green-500/10"
                        title="Ingest this feed"
                      >
                        {ingesting === feed.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditing({ ...feed })}
                        className="rounded p-1.5 hover:bg-accent"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(feed.id)}
                        className="rounded p-1.5 text-red-500 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
