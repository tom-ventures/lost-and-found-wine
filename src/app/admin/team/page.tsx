"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import type { TeamMember } from "@/types/database";
import { Pencil, Plus } from "lucide-react";

export default function AdminTeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<TeamMember> | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const supabase = createClient();

  async function load() {
    const { data } = await supabase.from("team_members").select("*").order("display_order");
    setTeam(data ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleSave() {
    if (!editing) return;
    setSaving(true);
    setError("");

    const payload = {
      name: editing.name!,
      title: editing.title || null,
      bio: editing.bio || null,
      email: editing.email || null,
      image_url: editing.image_url || null,
      display_order: editing.display_order ?? 0,
      active: editing.active ?? true,
    };

    const { error: err } = editing.id
      ? await supabase.from("team_members").update(payload).eq("id", editing.id)
      : await supabase.from("team_members").insert(payload);

    if (err) setError(err.message);
    else { setEditing(null); await load(); }
    setSaving(false);
  }

  const EMPTY: Partial<TeamMember> = {
    name: "", title: "", bio: "", email: "", image_url: "", display_order: 0, active: true,
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-brand-muted mb-2">Admin</p>
          <h1 className="text-2xl font-light tracking-[0.1em] uppercase text-white">Team</h1>
        </div>
        <Button onClick={() => setEditing(EMPTY)} variant="outline" size="sm">
          <Plus size={14} className="mr-1" /> Add Member
        </Button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-brand-bg/90 overflow-y-auto">
          <div className="max-w-xl mx-auto p-6 my-10 border border-brand-border bg-brand-surface">
            <h2 className="text-sm tracking-[0.15em] uppercase text-white mb-6">
              {editing.id ? "Edit Member" : "New Member"}
            </h2>
            <div className="space-y-4 mb-6">
              {([
                ["Name", "name"],
                ["Title", "title"],
                ["Email", "email"],
                ["Image URL", "image_url"],
              ] as [string, keyof TeamMember][]).map(([label, field]) => (
                <div key={field}>
                  <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">{label}</label>
                  <input
                    type="text"
                    value={(editing[field] as string) ?? ""}
                    onChange={(e) => setEditing((p) => ({ ...p, [field]: e.target.value }))}
                    className="w-full bg-transparent border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">Bio</label>
                <textarea
                  value={editing.bio ?? ""}
                  onChange={(e) => setEditing((p) => ({ ...p, bio: e.target.value }))}
                  rows={6}
                  className="w-full bg-transparent border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white resize-none"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-[0.15em] uppercase text-brand-muted mb-1">Display Order</label>
                <input
                  type="number"
                  value={editing.display_order ?? 0}
                  onChange={(e) => setEditing((p) => ({ ...p, display_order: parseInt(e.target.value) || 0 }))}
                  className="w-full bg-transparent border border-brand-border text-white px-3 py-2 text-sm focus:outline-none focus:border-white"
                />
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editing.active ?? true}
                  onChange={(e) => setEditing((p) => ({ ...p, active: e.target.checked }))}
                  className="accent-white"
                />
                <span className="text-sm text-brand-text">Active</span>
              </label>
            </div>
            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}
            <div className="flex gap-3">
              <Button onClick={handleSave} disabled={saving} size="sm">{saving ? "Saving..." : "Save"}</Button>
              <Button onClick={() => setEditing(null)} variant="ghost" size="sm">Cancel</Button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-brand-muted">Loading...</p>
      ) : (
        <div className="space-y-4">
          {team.map((member) => (
            <div key={member.id} className="border border-brand-border p-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-white font-light">{member.name}</p>
                <p className="text-brand-muted text-xs mt-1">{member.title}</p>
                <p className="text-brand-muted text-xs mt-1">{member.email}</p>
                <p className="text-brand-text text-sm mt-3 line-clamp-2 max-w-lg">{member.bio}</p>
              </div>
              <button onClick={() => setEditing(member)} className="text-brand-muted hover:text-white flex-shrink-0">
                <Pencil size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
