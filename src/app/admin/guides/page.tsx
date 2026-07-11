"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminFetch } from "@/lib/admin-api";

interface GuideRow {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  difficulty: string;
  read_time: number;
  tags: string[];
  published_at: string;
}

const EMPTY: GuideRow = {
  id: "",
  slug: "",
  title: "",
  summary: "",
  category: "",
  difficulty: "beginner",
  read_time: 10,
  tags: [],
  published_at: new Date().toISOString(),
};

export default function AdminGuidesPage() {
  const [rows, setRows] = useState<GuideRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<GuideRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [tagsInput, setTagsInput] = useState("");

  const load = async () => {
    setLoading(true);
    const res = await adminFetch("/api/admin/guides");
    if (res.ok) {
      const json = await res.json();
      setRows(json.data);
      setTotal(json.total);
    }
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
    const res = await adminFetch("/api/admin/guides", { method, body: JSON.stringify(payload) });
    if (res.ok) { setEditing(null); load(); }
    else { const err = await res.json(); alert(err.error || "Failed"); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this guide?")) return;
    await adminFetch(`/api/admin/guides?id=${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Guides</h2>
          <p className="text-sm text-muted-foreground">{total} guides</p>
        </div>
        <Button onClick={() => { setEditing({ ...EMPTY }); setTagsInput(""); }} className="gap-2">
          <Plus className="h-4 w-4" /> Add Guide
        </Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-20">
          <div className="w-full max-w-2xl rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{editing.id ? "Edit" : "New"} Guide</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title *</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Summary</label>
                <textarea rows={2} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.summary} onChange={(e) => setEditing({ ...editing, summary: e.target.value })} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium">Category</label>
                  <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Difficulty</label>
                  <select className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.difficulty} onChange={(e) => setEditing({ ...editing, difficulty: e.target.value })}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Read Time (min)</label>
                  <input type="number" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={editing.read_time} onChange={(e) => setEditing({ ...editing, read_time: parseInt(e.target.value) || 0 })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Tags (comma separated)</label>
                <input className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editing.id ? "Update" : "Create"}
                </Button>
              </div>
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
              <th className="px-4 py-3 font-medium">Difficulty</th>
              <th className="px-4 py-3 font-medium">Read Time</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No guides yet.</td></tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border/50">
                  <td className="max-w-xs truncate px-4 py-3 font-medium">{row.title}</td>
                  <td className="px-4 py-3"><span className="rounded-full bg-green-500/10 px-2 py-0.5 text-xs text-green-500">{row.category}</span></td>
                  <td className="px-4 py-3 capitalize">{row.difficulty}</td>
                  <td className="px-4 py-3">{row.read_time} min</td>
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
