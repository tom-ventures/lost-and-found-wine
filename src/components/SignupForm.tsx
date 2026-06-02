"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";

export default function SignupForm() {
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to subscribe");
      setStatus("success");
      setMessage("Welcome to the journey. Check your inbox.");
      setForm({ first_name: "", last_name: "", email: "" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <p className="text-white text-sm tracking-wide">{message}</p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="First Name"
          required
          value={form.first_name}
          onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
          className="bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
        />
        <input
          type="text"
          placeholder="Last Name"
          required
          value={form.last_name}
          onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
          className="bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
        />
      </div>
      <input
        type="email"
        placeholder="Email Address"
        required
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
      />
      {status === "error" && (
        <p className="text-red-400 text-xs">{message}</p>
      )}
      <Button type="submit" disabled={status === "loading"} className="w-full">
        {status === "loading" ? "Joining..." : "Join the Journey"}
      </Button>
    </form>
  );
}
