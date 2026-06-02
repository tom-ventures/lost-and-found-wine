"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wine,
  Package,
  ShoppingBag,
  Mail,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/wines", label: "Wines", icon: Wine },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
  { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
  { href: "/admin/team", label: "Team", icon: Users },
  { href: "/admin/content", label: "Content", icon: FileText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  function isActive(item: { href: string; exact?: boolean }) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-brand-border">
        <Image src="/images/logo-white.png" alt="Lost and Found Wines" width={120} height={34} className="object-contain" />
        <p className="text-[10px] tracking-[0.2em] uppercase text-brand-muted mt-2">Admin</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-xs tracking-[0.1em] uppercase transition-colors ${
                  isActive(item)
                    ? "text-white bg-brand-border"
                    : "text-brand-muted hover:text-white hover:bg-brand-border/50"
                }`}
              >
                <item.icon size={16} />
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-brand-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-xs tracking-[0.1em] uppercase text-brand-muted hover:text-white transition-colors w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 bg-brand-surface border border-brand-border p-2 text-white"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:flex-col bg-brand-surface border-r border-brand-border">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="flex flex-col w-64 bg-brand-surface border-r border-brand-border">
            <SidebarContent />
          </div>
          <div className="flex-1 bg-brand-bg/80" onClick={() => setMobileOpen(false)} />
        </div>
      )}
    </>
  );
}
