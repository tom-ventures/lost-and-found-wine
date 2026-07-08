"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Order, EmailSubscriber, CartItem } from "@/types/database";

const COMPLETED_STATUSES = ["paid", "shipped", "delivered"];

function monthKey(dateStr: string) {
  return dateStr.slice(0, 7); // "YYYY-MM"
}

function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleDateString("en-NZ", { month: "long", year: "numeric" });
}

function pctDelta(current: number, previous: number) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const [{ data: orderData }, { data: subData }] = await Promise.all([
        supabase.from("orders").select("*"),
        supabase.from("email_subscribers").select("*"),
      ]);
      setOrders((orderData as Order[]) ?? []);
      setSubscribers((subData as EmailSubscriber[]) ?? []);
      setLoading(false);
    }
    load();
  }, []);

  const prevMonth = shiftMonth(month, -1);

  const stats = useMemo(() => {
    function computeFor(m: string) {
      const monthOrders = orders.filter((o) => monthKey(o.created_at) === m);
      const completed = monthOrders.filter((o) => COMPLETED_STATUSES.includes(o.status));
      const revenue = completed.reduce((sum, o) => sum + (o.total_nzd ?? 0), 0);
      const orderCount = completed.length;
      const aov = orderCount ? revenue / orderCount : 0;
      return { revenue, orderCount, aov };
    }

    const current = computeFor(month);
    const previous = computeFor(prevMonth);

    // Top products by quantity sold (completed orders only)
    const completedThisMonth = orders.filter(
      (o) => monthKey(o.created_at) === month && COMPLETED_STATUSES.includes(o.status)
    );
    const productMap = new Map<string, { name: string; quantity: number; revenue: number }>();
    completedThisMonth.forEach((o) => {
      const items = (o.line_items as unknown as CartItem[]) ?? [];
      items.forEach((item) => {
        const key = item.sku || item.product_id || item.product_name;
        const existing = productMap.get(key) ?? { name: item.product_name, quantity: 0, revenue: 0 };
        existing.quantity += item.quantity;
        existing.revenue += item.price_nzd * item.quantity;
        productMap.set(key, existing);
      });
    });
    const topProducts = Array.from(productMap.values()).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

    // New subscribers this month
    const newSubscribers = subscribers.filter((s) => monthKey(s.subscribed_at) === month).length;

    // New customers this month: earliest order per email falls in this month
    const firstOrderByEmail = new Map<string, string>();
    orders.forEach((o) => {
      const existing = firstOrderByEmail.get(o.customer_email);
      if (!existing || o.created_at < existing) firstOrderByEmail.set(o.customer_email, o.created_at);
    });
    const newCustomers = Array.from(firstOrderByEmail.values()).filter((d) => monthKey(d) === month).length;

    return { current, previous, topProducts, newSubscribers, newCustomers };
  }, [orders, subscribers, month, prevMonth]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
          <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Reports</h1>
        </div>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="bg-transparent border border-brand-border text-white px-4 py-2 text-sm focus:outline-none focus:border-white [color-scheme:dark]"
        />
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <>
          <p className="text-xs tracking-[0.15em] uppercase text-brand-slate mb-4">
            {formatMonthLabel(month)}
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <StatCard
              label="Revenue"
              value={`NZD ${stats.current.revenue.toFixed(2)}`}
              delta={pctDelta(stats.current.revenue, stats.previous.revenue)}
            />
            <StatCard
              label="Orders"
              value={String(stats.current.orderCount)}
              delta={pctDelta(stats.current.orderCount, stats.previous.orderCount)}
            />
            <StatCard
              label="Average Order Value"
              value={`NZD ${stats.current.aov.toFixed(2)}`}
              delta={pctDelta(stats.current.aov, stats.previous.aov)}
            />
            <StatCard label="New Subscribers" value={String(stats.newSubscribers)} />
            <StatCard label="New Customers" value={String(stats.newCustomers)} />
          </div>

          <div>
            <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-6">Top Products</h2>
            {stats.topProducts.length === 0 ? (
              <p className="text-brand-muted text-sm">No completed orders this month.</p>
            ) : (
              <div className="border border-brand-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-brand-border">
                      {["Product", "Units Sold", "Revenue"].map((h) => (
                        <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {stats.topProducts.map((p) => (
                      <tr key={p.name} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                        <td className="px-4 py-3 text-brand-text">{p.name}</td>
                        <td className="px-4 py-3 text-brand-text">{p.quantity}</td>
                        <td className="px-4 py-3 text-brand-text">NZD {p.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value, delta }: { label: string; value: string; delta?: number }) {
  const showDelta = delta !== undefined && isFinite(delta);
  const positive = (delta ?? 0) >= 0;
  return (
    <div className="border border-brand-border p-6">
      <p className="text-2xl text-white mb-1">{value}</p>
      <p className="text-xs text-brand-muted uppercase tracking-wide mb-2">{label}</p>
      {showDelta && (
        <p className={`text-xs ${positive ? "text-green-400" : "text-red-400"}`}>
          {positive ? "+" : ""}
          {delta!.toFixed(0)}% vs last month
        </p>
      )}
    </div>
  );
}
