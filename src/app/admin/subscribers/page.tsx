"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { EmailSubscriber } from "@/types/database";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<EmailSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterSubject, setNewsletterSubject] = useState("");
  const [newsletterBody, setNewsletterBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sendStatus, setSendStatus] = useState("");

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("email_subscribers")
        .select("*")
        .order("subscribed_at", { ascending: false });
      setSubscribers(data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  function downloadCSV() {
    const headers = ["Email", "First Name", "Last Name", "Subscribed At", "Active", "Source"];
    const rows = subscribers.map((s) => [
      s.email,
      s.first_name ?? "",
      s.last_name ?? "",
      new Date(s.subscribed_at).toLocaleDateString("en-NZ"),
      s.active ? "Yes" : "No",
      s.source,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laf-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendNewsletter() {
    if (!newsletterSubject || !newsletterBody) return;
    setSending(true);
    setSendStatus("");
    try {
      const res = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: newsletterSubject, body: newsletterBody }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSendStatus(`Sent to ${data.count} subscribers.`);
      setNewsletterSubject("");
      setNewsletterBody("");
    } catch (err) {
      setSendStatus(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  const activeCount = subscribers.filter((s) => s.active).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
          <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Subscribers</h1>
        </div>
        <Button onClick={downloadCSV} variant="outline" size="sm">
          Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="border border-brand-border p-6">
          <p className="text-3xl text-white mb-1">{subscribers.length}</p>
          <p className="text-xs text-brand-muted uppercase tracking-wide">Total</p>
        </div>
        <div className="border border-brand-border p-6">
          <p className="text-3xl text-white mb-1">{activeCount}</p>
          <p className="text-xs text-brand-muted uppercase tracking-wide">Active</p>
        </div>
      </div>

      {/* Newsletter */}
      <div className="border border-brand-border p-6 mb-10">
        <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-5">Send Newsletter</h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Subject"
            value={newsletterSubject}
            onChange={(e) => setNewsletterSubject(e.target.value)}
            className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
          <textarea
            placeholder="Email body (HTML supported)"
            rows={6}
            value={newsletterBody}
            onChange={(e) => setNewsletterBody(e.target.value)}
            className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none"
          />
          {sendStatus && <p className="text-sm text-green-400">{sendStatus}</p>}
          <Button
            onClick={sendNewsletter}
            disabled={sending || !newsletterSubject || !newsletterBody}
            variant="outline"
            size="sm"
          >
            {sending ? "Sending..." : `Send to ${activeCount} subscribers`}
          </Button>
        </div>
      </div>

      {/* Subscriber table */}
      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <div className="border border-brand-border overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-brand-border">
                {["Email", "Name", "Source", "Joined", "Active"].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] tracking-[0.15em] uppercase text-brand-muted font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-brand-border last:border-0 hover:bg-brand-surface">
                  <td className="px-4 py-3 text-brand-text text-xs">{sub.email}</td>
                  <td className="px-4 py-3 text-brand-text text-sm">
                    {[sub.first_name, sub.last_name].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-brand-muted text-xs">{sub.source}</td>
                  <td className="px-4 py-3 text-brand-muted text-xs">
                    {new Date(sub.subscribed_at).toLocaleDateString("en-NZ")}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <span className={sub.active ? "text-green-400" : "text-red-400"}>
                      {sub.active ? "Active" : "Inactive"}
                    </span>
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
