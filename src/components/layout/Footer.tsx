import Link from "next/link";
import Image from "next/image";

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
    </svg>
  );
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-brand-surface border-t border-brand-border mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <Image
              src="/images/logo-white.png"
              alt="Lost and Found Wines"
              width={160}
              height={44}
              className="object-contain mb-6"
            />
            <p className="text-brand-muted text-sm leading-relaxed">
              A journey of discovery through the wines and regions of Aotearoa New Zealand.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://www.instagram.com/lostandfoundwinenz/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://www.facebook.com/LostandFoundWineNZ/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-muted hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon size={20} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-white mb-6">Explore</h3>
            <div className="flex flex-col gap-3">
              <FooterLink href="/collections">Collections</FooterLink>
              <FooterLink href="/shop/origin">Origin</FooterLink>
              <FooterLink href="/shop/uncharted">Uncharted</FooterLink>
              <FooterLink href="/wines/ad-astra-nv">Ad Astra</FooterLink>
              <FooterLink href="/shop">Shop All</FooterLink>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-xs tracking-[0.2em] uppercase text-white mb-6">Contact</h3>
            <div className="flex flex-col gap-3">
              <FooterLink href="/team">Our Team</FooterLink>
              <FooterLink href="/contact">Get in Touch</FooterLink>
              <a
                href="mailto:info@lostandfoundwine.co.nz"
                className="text-brand-muted text-sm hover:text-white transition-colors"
              >
                info@lostandfoundwine.co.nz
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-brand-border pt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="text-brand-muted text-xs leading-relaxed max-w-2xl">
            Alcohol is supplied under Best Wine Company Ltd&apos;s license 007/OFF/42/2024 (expiry 28 February 2027).
            Lost and Found delivers to New Zealand only.
            Please enjoy responsibly.{" "}
            <a href="https://www.drinkaware.co.nz" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">
              drinkaware.co.nz
            </a>
          </p>
          <p className="text-brand-muted text-xs whitespace-nowrap">
            Copyright &copy;2016–2025 Best Wine Company Ltd
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-brand-muted text-sm hover:text-white transition-colors">
      {children}
    </Link>
  );
}
