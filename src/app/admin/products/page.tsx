"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { Product, Wine } from "@/types/database";
import { Pencil } from "lucide-react";
import { formatNZD } from "@/lib/utils";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<(Product & { wines: Wine | null })[]>([]);
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function load() {
    const [{ data: p }, { data: w }] = await Promise.all([
      supabase.from("products").select("*, wines(*)").order("collection"),
      supabase.from("wines").select("id,name,slug").eq("active", true).order("name"),
    ]);
    setProducts((p as (Product & { wines: Wine | null })[]) ?? []);
    setWines((w as Wine[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");

    const payload = {
      wine_id: editing.wine_id || null,
      name: editing.name!,
      sku: editing.sku || null,
      price_nzd: editing.price_nzd!,
      stock_qty: editing.stock_qty ?? 0,
      sold_out: editing.sold_out ?? false,
      collection: editing.collection || null,
      image_url: editing.image_url || null,
      active: editing.active ?? true,
    };

    const { error: err } = editing.id
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);

    if (err) setError(err.message);
    else { setEditing(null); await load(); }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
          <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Products</h1>
        </div>
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-brand-bg/90 overflow-y-auto">
          <div className="max-w-xl mx-auto p-6 my-10 border border-brand-border bg-brand-surface">
            <h2 className="text-sm tracking-[0.15em] uppercase text-white mb-6">Edit Product</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">Wine</label>
                <select
                  value={editing.wine_id ?? ""}
                  onChange={(e) => setEditing((p) => ({ ...p, wine_id: e.target.value || null }))}
                  className="w-full bg-brand-surface border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                >
                  <option value="">— None —</option>
                  {wines.map((w) => (
                    <option key={w.id} value={w.id}>{w.name}</option>
                  ))}
                </select>
              </div>
              {(["name", "sku", "collection", "image_url"] as const).map((field) => (
                <div key={field}>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">{field.replace("_", " ")}</label>
                  <input
                    type="text"
                    value={(editing[field] as string) ?? ""}
                    onChange={(e) => setEditing((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                  />
                </div>
              ))}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">Price (NZD)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editing.price_nzd ?? ""}
                    onChange={(e) => setEditing((p) => ({ ...p, price_nzd: parseFloat(e.target.value) }))}
                    className="w-full bg-transparent border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">Stock Qty</label>
                  <input
                    type="number"
                    value={editing.stock_qty ?? 0}
                    onChange={(e) => setEditing((p) => ({ ...p, stock_qty: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-transparent border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                  />
                </div>
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.sold_out ?? false}
                    onChange={(e) => setEditing((p) => ({ ...p, sold_out: e.target.checked }))}
                    className="accent-white"
                  />
                  <span className="text-sm text-brand-text">Sold Out</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) => setEditing((p) => ({ ...p, active: e.target.checked }))}
                    className="accent-white"
                  />
                  <span className="text-sm text-brand-text">Active</span>
                </label>
              </div>
            </div>
            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} size="sm">{saving ? "Saving..." : "Save"}</Button>
              <Button onClick={() => setEditing(null)} variant="ghost" size="sm">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <div className="border border-brand-border overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-border">
                {["Name", "SKU", "Collection", "Price", "Stock", "Sold Out", "Active", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                  <td className="px-4 py-3 text-brand-text">{product.name}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs font-mono">{product.sku ?? "—"}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs capitalize">{product.collection ?? "—"}</td>
                  <td className="px-4 py-3 text-brand-text">{formatNZD(product.price_nzd)}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{product.stock_qty}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className={product.sold_out ? "text-red-400" : "text-green-400"}>{product.sold_out ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={product.active ? "text-green-400" : "text-red-400"}>{product.active ? "Yes" : "No"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setEditing(product)} className="text-brand-muted hover:text-white">
                      <Pencil size={14} />
                    </button>
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
