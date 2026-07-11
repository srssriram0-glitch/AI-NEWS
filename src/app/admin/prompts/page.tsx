"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-api";

interface PromptRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  prompt_text: string;
  category: string;
  model: string;
  tags: string[];
  use_case: string;
  likes: number;
  saves: number;
}

const EMPTY: PromptRow = {
  id: "", slug: "", title: "", description: "", prompt_text: "",
  category: "", model: "", tags: [], use_case: "", likes: 0, saves: 0,
};

export default function AdminPromptsPage() {
  const [rows, setRows] = useState<PromptRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<PromptRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/prompts");
    if (res.ok) { const json = await res.json(); setRows(json.data); setTotal(json.total); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    const payload = {
      ...editing,
      tags: tagsInput.split(",").map((t) => t.trim()).filter(Boolean),
      slug: editing.slug || editing.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    };
    const method = editing.id ? "PUT" : "POST";
    const res = await adminFetch("/api/admin/prompts", { method, body: JSON.stringify(payload) });
    if (res.ok) { setEditing(null); load(); }
    else { const err = await res.json(); alert(err.error || "Failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prompt?")) return;
    await adminFetch(`/api/admin/prompts?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Prompts</h2>
          <p className="text-sm text-muted-foreground">{total} prompts</p>
        </div>
        <Button onClick={() => { setEditing({ ...EMPTY }); setTagsInput(""); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Prompt
        </Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} Prompt</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="max-h-[60vh] space-y-4 overflow-y-auto pr-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Title *</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Prompt Text *</label>
                <textarea rows={6} className="w-full rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm outline-none focus:border-blue-500" value={editing.prompt_text} onChange={(e) => setEditing({ ...editing, prompt_text: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Model</label>
                  <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.model} onChange={(e) => setEditing({ ...editing, model: e.target.value })} placeholder="e.g. GPT-5 / Claude" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Use Case</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.use_case} onChange={(e) => setEditing({ ...editing, use_case: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
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
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Engagement</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No prompts yet.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border/50">
                  <td className="max-w-xs truncate px-4 py-3 font-medium">{row.title}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-orange-500/10 px-2 py-0.5 text-xs text-orange-500">{row.category}</span></td>
                  <td className="px-4 py-3 text-muted-foreground">{row.model}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 text-muted-foreground">
                      <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{row.likes}</span>
                      <span className="flex items-center gap-1"><Bookmark className="h-3.5 w-3.5" />{row.saves}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => { setEditing({ ...row }); setTagsInput(row.tags?.join(", ") || ""); }} className="rounded p-1.5 hover:bg-accent"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(row.id)} className="rounded p-1.5 text-red-500 hover:bg-red-500/10"><Trash2 className="h-4 w-4" /></button>
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
