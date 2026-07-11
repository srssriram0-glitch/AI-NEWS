"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-api";

interface ToolRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  website_url: string;
  category: string;
  subcategory: string;
  company: string;
  founder: string;
  rating: number;
  tags: string[];
  features: string[];
  pros: string[];
  cons: string[];
  is_featured: boolean;
  is_trending: boolean;
  api_available: boolean;
  pricing: { model: string; startingPrice?: string; plans: unknown[] };
}

const EMPTY: ToolRow = {
  id: "",
  slug: "",
  name: "",
  tagline: "",
  description: "",
  website_url: "",
  category: "",
  subcategory: "",
  company: "",
  founder: "",
  rating: 0,
  tags: [],
  features: [],
  pros: [],
  cons: [],
  is_featured: false,
  is_trending: false,
  api_available: false,
  pricing: { model: "free", plans: [] },
};

export default function AdminToolsPage() {
  const [rows, setRows] = useState<ToolRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ToolRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/tools");
    if (res.ok) {
      const json = await res.json();
      setRows(json.data);
      setTotal(json.total);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing({ ...EMPTY });
    setTagsInput("");
    setFeaturesInput("");
  };

  const openEdit = (row: ToolRow) => {
    setEditing({ ...row });
    setTagsInput(row.tags?.join(", ") || "");
    setFeaturesInput(row.features?.join(", ") || "");
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);

    const payload = {
      ...editing,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      features: featuresInput.split(",").map((t) => t.trim()).filter(Boolean),
      slug: editing.slug || editing.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    };

    const method = editing.id ? "PUT" : "POST";
    const res = await adminFetch("/api/admin/tools", {
      method,
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setEditing(null);
      load();
    } else {
      const err = await res.json();
      alert(err.error || "Failed to save");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this tool?")) return;
    await adminFetch(`/api/admin/tools?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI Tools</h2>
          <p className="text-sm text-muted-foreground">{total} tools</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Add Tool
        </Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {editing.id ? "Edit Tool" : "New Tool"}
              </h3>
              <button onClick={() => setEditing(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Name *</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Slug</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editing.slug}
                    onChange={(e) => setEditing({ ...editing, slug: e.target.value })}
                    placeholder="auto-generated"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tagline</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editing.tagline}
                  onChange={(e) => setEditing({ ...editing, tagline: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Website URL</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editing.website_url}
                    onChange={(e) => setEditing({ ...editing, website_url: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editing.category}
                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Company</label>
                  <input
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editing.company}
                    onChange={(e) => setEditing({ ...editing, company: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                    value={editing.rating}
                    onChange={(e) => setEditing({ ...editing, rating: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Features (comma separated)</label>
                <input
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                />
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_featured}
                    onChange={(e) => setEditing({ ...editing, is_featured: e.target.checked })}
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.is_trending}
                    onChange={(e) => setEditing({ ...editing, is_trending: e.target.checked })}
                  />
                  Trending
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={editing.api_available}
                    onChange={(e) => setEditing({ ...editing, api_available: e.target.checked })}
                  />
                  API Available
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {editing.id ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Company</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No tools yet.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">{row.name}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-violet-500/10 px-2 py-0.5 text-xs text-violet-500">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.company}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                      {row.rating}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {row.is_featured && (
                        <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-500">Featured</span>
                      )}
                      {row.is_trending && (
                        <span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-500">Trending</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(row)} className="rounded p-1.5 hover:bg-accent">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(row.id)} className="rounded p-1.5 text-red-500 hover:bg-red-500/10">
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
