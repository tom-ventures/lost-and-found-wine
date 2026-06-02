"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Lost and Found</p>
          <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-white mb-6">Contact</h1>
          <p className="text-brand-muted text-sm leading-relaxed">
            Questions about our wines, an order, or just want to say hello? We&apos;d love to hear from you.
          </p>
        </div>

        {status === "success" ? (
          <div className="text-center py-12 border border-brand-border">
            <p className="text-white text-lg font-light mb-2">Message sent.</p>
            <p className="text-brand-muted text-sm">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
            />
            <textarea
              placeholder="Your message"
              required
              rows={6}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
              className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none"
            />
            {status === "error" && (
              <p className="text-red-400 text-xs">{errorMsg}</p>
            )}
            <Button type="submit" disabled={status === "loading"} className="w-full" size="lg">
              {status === "loading" ? "Sending..." : "Send Message"}
            </Button>
          </form>
        )}

        <div className="mt-12 pt-10 border-t border-brand-border text-center">
          <p className="text-brand-muted text-sm mb-2">Or email us directly:</p>
          <a
            href="mailto:info@lostandfoundwine.co.nz"
            className="text-white text-sm hover:text-brand-muted transition-colors"
          >
            info@lostandfoundwine.co.nz
          </a>
        </div>
      </div>
    </div>
  );
}
