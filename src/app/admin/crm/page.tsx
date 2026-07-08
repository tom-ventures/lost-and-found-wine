"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { Customer, Order } from "@/types/database";
import { Search } from "lucide-react";

const COMPLETED_STATUSES = ["paid", "shipped", "delivered"];

interface CustomerRow extends Customer {
  orderCount: number;
  lifetimeSpend: number;
  orders: Order[];
}

export default function AdminCrmPage() {
  const [customers, setCustomers] = useState<CustomerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CustomerRow | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function load() {
    setLoading(true);
    const [{ data: customerData }, { data: orderData }] = await Promise.all([
      supabase.from("customers").select("*"),
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
    ]);

    const orders = (orderData as Order[]) ?? [];
    const rows: CustomerRow[] = ((customerData as Customer[]) ?? []).map((c) => {
      const custOrders = orders.filter((o) => o.customer_email === c.email);
      const lifetimeSpend = custOrders
        .filter((o) => COMPLETED_STATUSES.includes(o.status))
        .reduce((sum, o) => sum + (o.total_nzd ?? 0), 0);
      return { ...c, orders: custOrders, orderCount: custOrders.length, lifetimeSpend };
    });

    rows.sort((a, b) => b.lifetimeSpend - a.lifetimeSpend);
    setCustomers(rows);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) => c.email.toLowerCase().includes(q) || (c.name ?? "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  function openCustomer(c: CustomerRow) {
    setSelected(c);
    setNotesDraft(c.notes ?? "");
  }

  async function saveNotes() {
    if (!selected) return;
    setSaving(true);
    const { error } = await supabase
      .from("customers")
      .update({ notes: notesDraft, updated_at: new Date().toISOString() })
      .eq("email", selected.email);
    setSaving(false);
    if (!error) {
      setSelected(null);
      await load();
    }
  }

  const totalCustomers = customers.length;
  const totalLifetimeSpend = customers.reduce((sum, c) => sum + c.lifetimeSpend, 0);

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
        <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">CRM</h1>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="border border-brand-border p-6">
          <p className="text-3xl text-white mb-1">{totalCustomers}</p>
          <p className="text-xs text-brand-muted uppercase tracking-wide">Customers</p>
        </div>
        <div className="border border-brand-border p-6">
          <p className="text-3xl text-white mb-1">NZD {totalLifetimeSpend.toFixed(2)}</p>
          <p className="text-xs text-brand-muted uppercase tracking-wide">Lifetime Revenue</p>
        </div>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-muted" />
        <input
          type="text"
          placeholder="Search by name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-white transition-colors"
        />
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-brand-muted text-sm">No customers found.</p>
      ) : (
        <div className="border border-brand-border overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-brand-border">
                {["Name", "Email", "Orders", "Lifetime Spend", ""].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.email} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                  <td className="px-4 py-3 text-brand-text text-sm">{c.name || "—"}</td>
                  <td className="px-4 py-3 text-brand-text text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{c.orderCount}</td>
                  <td className="px-4 py-3 text-brand-text text-xs">NZD {c.lifetimeSpend.toFixed(2)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => openCustomer(c)}
                      className="text-xs text-brand-muted hover:text-white transition-colors"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-brand-bg/90 overflow-y-auto">
          <div className="max-w-xl mx-auto p-6 my-10 border border-brand-border bg-brand-surface">
            <h2 className="text-sm tracking-[0.15em] uppercase text-white mb-1">{selected.name || "Unnamed Customer"}</h2>
            <p className="text-brand-muted text-xs mb-6">{selected.email}{selected.phone ? ` · ${selected.phone}` : ""}</p>

            <div className="mb-6">
              <p className="text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-3">
                Order History ({selected.orders.length})
              </p>
              {selected.orders.length === 0 ? (
                <p className="text-brand-muted text-sm">No orders yet.</p>
              ) : (
                <div className="border border-brand-border divide-y divide-brand-border max-h-64 overflow-y-auto">
                  {selected.orders.map((o) => (
                    <div key={o.id} className="px-4 py-3 flex items-center justify-between text-xs">
                      <div>
                        <p className="text-brand-text">#{o.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-brand-muted">{new Date(o.created_at).toLocaleDateString("en-NZ")}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-brand-text">NZD {o.total_nzd?.toFixed(2)}</p>
                        <p className="text-brand-muted capitalize">{o.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-2">Notes</label>
              <textarea
                value={notesDraft}
                onChange={(e) => setNotesDraft(e.target.value)}
                rows={5}
                placeholder="Private notes about this customer..."
                className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-3 py-2 text-sm focus:outline-none focus:border-white resize-none"
              />
            </div>

            <div className="flex gap-3">
              <Button onClick={saveNotes} disabled={saving} size="sm">{saving ? "Saving..." : "Save Notes"}</Button>
              <Button onClick={() => setSelected(null)} variant="ghost" size="sm">Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
