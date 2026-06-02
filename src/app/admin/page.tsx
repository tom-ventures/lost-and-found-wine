import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import type { Order } from "@/types/database";

export default async function AdminDashboard() {
  const supabase = await createClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabase as any;

  const [
    { count: wineCount },
    { count: productCount },
    { data: recentOrdersData },
    { count: subCount },
    { count: pendingCount },
  ] = await Promise.all([
    db.from("wines").select("*", { count: "exact", head: true }).eq("active", true),
    db.from("products").select("*", { count: "exact", head: true }).eq("active", true),
    db.from("orders").select("id,customer_name,total_nzd,status,created_at").order("created_at", { ascending: false }).limit(5),
    db.from("email_subscribers").select("*", { count: "exact", head: true }).eq("active", true),
    db.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const recentOrders = (recentOrdersData as Order[]) ?? [];

  const stats = [
    { label: "Active Wines", value: wineCount ?? 0, href: "/admin/wines" },
    { label: "Products", value: productCount ?? 0, href: "/admin/products" },
    { label: "Subscribers", value: subCount ?? 0, href: "/admin/subscribers" },
    { label: "Pending Orders", value: pendingCount ?? 0, href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Overview</p>
        <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Dashboard</h1>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="border border-brand-border p-6 hover:border-white transition-colors group"
          >
            <p className="text-3xl text-white mb-2">{stat.value}</p>
            <p className="text-xs tracking-[0.1em] uppercase text-brand-muted group-hover:text-white transition-colors">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-brand-muted hover:text-white transition-colors">
            View all →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="border border-brand-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-border">
                  {["Order", "Customer", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                    <td className="px-4 py-3 text-brand-text text-xs">#{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3 text-brand-text">{order.customer_name}</td>
                    <td className="px-4 py-3 text-brand-text">NZD {order.total_nzd?.toFixed(2)}</td>
                    <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-brand-muted text-xs">
                      {new Date(order.created_at).toLocaleDateString("en-NZ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-brand-muted text-sm">No orders yet.</p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "text-amber-400 border-amber-800",
    paid: "text-green-400 border-green-800",
    shipped: "text-blue-400 border-blue-800",
    delivered: "text-white border-brand-border",
    cancelled: "text-red-400 border-red-800",
  };
  return (
    <span className={`text-[10px] tracking-[0.1em] uppercase border px-2 py-0.5 ${colors[status] ?? "text-brand-muted border-brand-border"}`}>
      {status}
    </span>
  );
}
