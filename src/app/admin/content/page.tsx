"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

const CONTENT_KEYS = [
  { key: "hero_title", label: "Hero Title", area: false },
  { key: "hero_subtitle", label: "Hero Subtitle", area: true },
  { key: "hero_cta", label: "Hero CTA Button Text", area: false },
  { key: "about_text", label: "About Text", area: true },
  { key: "collections_intro", label: "Collections Intro", area: true },
  { key: "signup_title", label: "Signup Section Title", area: false },
  { key: "signup_subtitle", label: "Signup Section Subtitle", area: true },
  { key: "hero_bg_image_url", label: "Homepage Hero Background Image URL", area: false },
  { key: "contact_bg_image_url", label: "Contact Page Background Image URL", area: false },
];

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("site_content").select("key,value");
      const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value ?? ""]));
      setContent(map);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(key: string) {
    setSaving(key);
    await supabase
      .from("site_content")
      .upsert({ key, value: content[key], updated_at: new Date().toISOString() }, { onConflict: "key" });
    setSaving(null);
    setSaved(key);
    setTimeout(() => setSaved(null), 2000);
  }

  return (
    <div>
      <div className="mb-8">
        <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
        <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Site Content</h1>
      </div>

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <div className="space-y-6">
          {CONTENT_KEYS.map(({ key, label, area }) => (
            <div key={key} className="border border-brand-border p-6">
              <label className="block text-xs tracking-[0.15em] uppercase text-brand-muted mb-3">{label}</label>
              {area ? (
                <textarea
                  value={content[key] ?? ""}
                  onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                  rows={3}
                  className="w-full bg-transparent border border-brand-border text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors resize-none mb-3"
                />
              ) : (
                <input
                  type="text"
                  value={content[key] ?? ""}
                  onChange={(e) => setContent((c) => ({ ...c, [key]: e.target.value }))}
                  className="w-full bg-transparent border border-brand-border text-white px-4 py-3 text-sm focus:outline-none focus:border-white transition-colors mb-3"
                />
              )}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => handleSave(key)}
                  disabled={saving === key}
                  size="sm"
                  variant="outline"
                >
                  {saving === key ? "Saving..." : saved === key ? "Saved ✓" : "Save"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
