"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { Wine } from "@/types/database";
import { Pencil, Trash2, Plus } from "lucide-react";

const EMPTY_WINE: Partial<Wine> = {
  slug: "",
  name: "",
  collection: "origin",
  region: "",
  variety: "",
  vintage: undefined,
  description: "",
  tasting_notes: "",
  region_story: "",
  winemakers: "",
  alcohol_pct: undefined,
  image_url: "",
  hero_image_url: "",
  display_order: 0,
  active: true,
};

export default function AdminWinesPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Wine> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("wines").select("*").order("display_order");
    setWines(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");

    const payload = {
      slug: editing.slug!,
      name: editing.name!,
      collection: editing.collection!,
      region: editing.region || null,
      variety: editing.variety || null,
      vintage: editing.vintage || null,
      description: editing.description || null,
      tasting_notes: editing.tasting_notes || null,
      region_story: editing.region_story || null,
      winemakers: editing.winemakers || null,
      alcohol_pct: editing.alcohol_pct || null,
      image_url: editing.image_url || null,
      hero_image_url: editing.hero_image_url || null,
      display_order: editing.display_order ?? 0,
      active: editing.active ?? true,
    };

    const { error: err } = editing.id
      ? await supabase.from("wines").update(payload).eq("id", editing.id)
      : await supabase.from("wines").insert(payload);

    if (err) {
      setError(err.message);
    } else {
      setEditing(null);
      await load();
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this wine?")) return;
    await supabase.from("wines").delete().eq("id", id);
    await load();
  }

  function Field({ label, value, onChange, type = "text", area = false }: {
    label: string;
    value: string | number | undefined;
    onChange: (v: string) => void;
    type?: string;
    area?: boolean;
  }) {
    const cls = "w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-3 py-2 text-sm focus:outline-none focus:border-white transition-colors";
    return (
      <div>
        <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">{label}</label>
        {area ? (
          <textarea value={value as string ?? ""} onChange={(e) => onChange(e.target.value)} rows={3} className={`${cls} resize-none`} />
        ) : (
          <input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} className={cls} />
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
          <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Wines</h1>
        </div>
        <Button onClick={() => setEditing({ ...EMPTY_WINE })} variant="outline" size="sm">
          <Plus size={14} className="mr-1" /> Add Wine
        </Button>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-brand-bg/90 overflow-y-auto">
          <div className="max-w-2xl mx-auto p-6 my-10 border border-brand-border bg-brand-surface">
            <h2 className="text-sm tracking-[0.15em] uppercase text-white mb-6">
              {editing.id ? "Edit Wine" : "New Wine"}
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <Field label="Slug" value={editing.slug} onChange={(v) => setEditing((e) => ({ ...e, slug: v }))} />
              <Field label="Name" value={editing.name} onChange={(v) => setEditing((e) => ({ ...e, name: v }))} />
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">Collection</label>
                <select
                  value={editing.collection ?? "origin"}
                  onChange={(e) => setEditing((prev) => ({ ...prev, collection: e.target.value }))}
                  className="w-full bg-brand-surface border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                >
                  <option value="origin">Origin</option>
                  <option value="uncharted">Uncharted</option>
                  <option value="ad-astra">Ad Astra</option>
                  <option value="gift">Gift</option>
                </select>
              </div>
              <Field label="Region" value={editing.region ?? ""} onChange={(v) => setEditing((e) => ({ ...e, region: v }))} />
              <Field label="Variety" value={editing.variety ?? ""} onChange={(v) => setEditing((e) => ({ ...e, variety: v }))} />
              <Field label="Vintage" value={editing.vintage ?? ""} onChange={(v) => setEditing((e) => ({ ...e, vintage: parseInt(v) || undefined }))} type="number" />
              <Field label="Alcohol %" value={editing.alcohol_pct ?? ""} onChange={(v) => setEditing((e) => ({ ...e, alcohol_pct: parseFloat(v) || undefined }))} type="number" />
              <Field label="Display Order" value={editing.display_order ?? 0} onChange={(v) => setEditing((e) => ({ ...e, display_order: parseInt(v) || 0 }))} type="number" />
            </div>
            <div className="space-y-4 mb-4">
              <Field label="Description" value={editing.description ?? ""} onChange={(v) => setEditing((e) => ({ ...e, description: v }))} area />
              <Field label="Tasting Notes" value={editing.tasting_notes ?? ""} onChange={(v) => setEditing((e) => ({ ...e, tasting_notes: v }))} area />
              <Field label="Region Story" value={editing.region_story ?? ""} onChange={(v) => setEditing((e) => ({ ...e, region_story: v }))} area />
              <Field label="Winemakers" value={editing.winemakers ?? ""} onChange={(v) => setEditing((e) => ({ ...e, winemakers: v }))} />
              <Field label="Image URL" value={editing.image_url ?? ""} onChange={(v) => setEditing((e) => ({ ...e, image_url: v }))} />
              <Field label="Hero Image URL" value={editing.hero_image_url ?? ""} onChange={(v) => setEditing((e) => ({ ...e, hero_image_url: v }))} />
            </div>
            <label className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                checked={editing.active ?? true}
                onChange={(e) => setEditing((prev) => ({ ...prev, active: e.target.checked }))}
                className="accent-white"
              />
              <span className="text-sm text-brand-text">Active</span>
            </label>
            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} size="sm">
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button onClick={() => setEditing(null)} variant="ghost" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Wine list */}
      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <div className="border border-brand-border overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-brand-border">
                {["Name", "Collection", "Vintage", "Region", "Active", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {wines.map((wine) => (
                <tr key={wine.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                  <td className="px-4 py-3 text-brand-text">{wine.name}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs capitalize">{wine.collection}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{wine.vintage ?? "NV"}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{wine.region ?? "—"}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={wine.active ? "text-green-400" : "text-red-400"}>{wine.active ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(wine)} className="text-brand-muted hover:text-white">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(wine.id)} className="text-brand-muted hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
