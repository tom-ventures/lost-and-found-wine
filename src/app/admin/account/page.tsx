"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function AdminAccountPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
    }
    load();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);

    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password updated.");
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <div>
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
        <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Account</h1>
      </div>

      <div className="max-w-sm">
        <p className="text-xs tracking-[0.15em] uppercase text-brand-muted mb-2">Logged in as</p>
        <p className="text-white text-sm mb-8">{email}</p>

        <h2 className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-5">Change Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="New password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {success && <p className="text-green-400 text-xs">{success}</p>}
          <Button type="submit" disabled={saving} size="md">
            {saving ? "Saving..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}
