import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import type { Metadata } from "next";
import type { TeamMember } from "@/types/database";

export const metadata: Metadata = {
  title: "Our Team — Lost and Found Wines",
  description: "Meet the team behind Lost and Found Wines.",
};

export default async function TeamPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("team_members")
    .select("*")
    .eq("active", true)
    .order("display_order");

  const team = (data as TeamMember[]) ?? [];

  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] uppercase text-brand-muted mb-4">Lost and Found</p>
          <h1 className="text-3xl font-light tracking-[0.15em] uppercase text-white mb-6">Our Team</h1>
          <p className="text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
            Two people, one shared passion for wine, story, and adventure.
          </p>
        </div>

        <div className="space-y-24">
          {team.map((member, idx) => (
            <div
              key={member.id}
              className={`grid grid-cols-1 md:grid-cols-2 gap-12 items-start ${
                idx % 2 === 1 ? "md:[direction:rtl]" : ""
              }`}
            >
              <div className={idx % 2 === 1 ? "md:[direction:ltr]" : ""}>
                <div className="relative aspect-[3/4] bg-brand-surface border border-brand-border">
                  {member.image_url ? (
                    <Image src={member.image_url} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image src="/images/logo-round.png" alt="" width={80} height={80} className="opacity-20 object-contain" />
                    </div>
                  )}
                </div>
              </div>

              <div className={`flex flex-col justify-center ${idx % 2 === 1 ? "md:[direction:ltr]" : ""}`}>
                <p className="text-[10px] tracking-[0.3em] uppercase text-brand-muted mb-3">
                  {member.title}
                </p>
                <h2 className="text-2xl font-light tracking-[0.1em] uppercase text-white mb-8">
                  {member.name}
                </h2>
                <p className="text-brand-text leading-relaxed text-sm">{member.bio}</p>
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="mt-6 text-xs text-brand-muted hover:text-white transition-colors border-b border-brand-muted hover:border-white pb-0.5 self-start"
                  >
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
