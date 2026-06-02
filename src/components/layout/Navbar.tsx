"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { ShoppingCart, Menu, X, ChevronDown } from "lucide-react";

function InstagramIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}
import { useCart } from "@/lib/cart";

const wineLinks = [
  { label: "All Collections", href: "/collections" },
  { label: "Ad Astra", href: "/wines/ad-astra-nv" },
  { label: "Origin Pinot Gris", href: "/wines/origin-pinot-gris-2022" },
  { label: "Origin Pinot Noir", href: "/wines/origin-pinot-noir-2022" },
  { label: "Uncharted Pinot Gris", href: "/wines/uncharted-pinot-gris-2021" },
  { label: "Uncharted Rosé", href: "/wines/uncharted-rose-2021" },
  { label: "Uncharted Syrah", href: "/wines/uncharted-syrah-2019" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [winesOpen, setWinesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const totalItems = useCart((s) => s.totalItems());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setWinesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-bg/95 backdrop-blur-sm border-b border-brand-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo-white.png"
              alt="Lost and Found Wines"
              width={160}
              height={44}
              className="object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="nav-link">Home</Link>

            {/* Wines dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className="nav-link flex items-center gap-1"
                onClick={() => setWinesOpen((v) => !v)}
                onMouseEnter={() => setWinesOpen(true)}
              >
                Wines <ChevronDown size={14} className={`transition-transform ${winesOpen ? "rotate-180" : ""}`} />
              </button>
              {winesOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-56 bg-brand-surface border border-brand-border"
                  onMouseLeave={() => setWinesOpen(false)}
                >
                  {wineLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-5 py-3 text-xs tracking-[0.1em] uppercase text-brand-text hover:text-white hover:bg-brand-border transition-colors"
                      onClick={() => setWinesOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/team" className="nav-link">Team</Link>
            <Link href="/contact" className="nav-link">Contact</Link>

            {/* Social */}
            <a
              href="https://www.instagram.com/lostandfoundwinenz/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon size={18} />
            </a>
            <a
              href="https://www.facebook.com/LostandFoundWineNZ/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-muted hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <FacebookIcon size={18} />
            </a>

            {/* Cart */}
            <Link href="/cart" className="relative text-brand-muted hover:text-white transition-colors" aria-label="Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-brand-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex lg:hidden items-center gap-4">
            <Link href="/cart" className="relative text-brand-muted hover:text-white" aria-label="Cart">
              <ShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-brand-bg text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="text-brand-text hover:text-white"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-brand-bg border-t border-brand-border">
          <div className="px-6 py-6 flex flex-col gap-1">
            <MobileLink href="/" onClick={() => setMobileOpen(false)}>Home</MobileLink>
            <p className="text-brand-muted text-xs tracking-widest uppercase mt-4 mb-1 px-2">Wines</p>
            {wineLinks.map((link) => (
              <MobileLink key={link.href} href={link.href} onClick={() => setMobileOpen(false)} indent>
                {link.label}
              </MobileLink>
            ))}
            <MobileLink href="/shop" onClick={() => setMobileOpen(false)}>Shop</MobileLink>
            <MobileLink href="/team" onClick={() => setMobileOpen(false)}>Team</MobileLink>
            <MobileLink href="/contact" onClick={() => setMobileOpen(false)}>Contact</MobileLink>
            <div className="flex gap-4 mt-6 px-2">
              <a href="https://www.instagram.com/lostandfoundwinenz/" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-white">
                <InstagramIcon size={20} />
              </a>
              <a href="https://www.facebook.com/LostandFoundWineNZ/" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-white">
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav-link {
          color: #9898b0;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          transition: color 0.2s;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .nav-link:hover {
          color: #ffffff;
        }
      `}</style>
    </nav>
  );
}

function MobileLink({
  href,
  children,
  onClick,
  indent,
}: {
  href: string;
  children: React.ReactNode;
  onClick: () => void;
  indent?: boolean;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block py-2 text-sm tracking-[0.1em] uppercase text-brand-muted hover:text-white transition-colors ${indent ? "pl-4" : "px-2"}`}
    >
      {children}
    </Link>
  );
}
