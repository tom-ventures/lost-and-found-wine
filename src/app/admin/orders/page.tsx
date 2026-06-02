import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types/database";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase as any).from("orders").select("*").order("created_at", { ascending: false });
  const orders = (data as Order[]) ?? [];

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
        <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Orders</h1>
      </div>

      {orders.length > 0 ? (
        <div className="border border-brand-border overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-brand-border">
                {["Order", "Customer", "Email", "Total", "Status", "Age Verified", "Date"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                  <td className="px-4 py-3 text-brand-text text-xs font-mono">#{order.id.slice(0, 8).toUpperCase()}</td>
                  <td className="px-4 py-3 text-brand-text">{order.customer_name}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{order.customer_email}</td>
                  <td className="px-4 py-3 text-brand-text">NZD {order.total_nzd?.toFixed(2)}</td>
                  <td className="px-4 py-3"><StatusBadge status={order.status} /></td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{order.age_verified ? "✓" : "✗"}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">
                    {new Date(order.created_at).toLocaleDateString("en-NZ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-brand-muted">No orders yet.</p>
      )}
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
