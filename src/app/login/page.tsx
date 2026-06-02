"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/admin");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Image
            src="https://images.squarespace-cdn.com/content/v1/5df198c9866fde1a352aa92e/1588209227733-Y5AIO011ZXJLMZQWARYA/LAF+LOGO+WHITE.png"
            alt="Lost and Found Wines"
            width={180}
            height={50}
            className="mx-auto mb-8 object-contain"
          />
          <p className="text-xs tracking-[0.25em] uppercase text-brand-muted">Admin Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent border border-brand-border text-white placeholder-brand-muted px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
