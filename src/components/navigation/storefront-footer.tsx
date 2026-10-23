import React from "react";
import Link from "next/link";
import { NewsletterForm } from "@/components/ui/newsletter-form";

export function StorefrontFooter() {
  return (
    <footer className="w-full border-t border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] py-10 xs:py-12 sm:py-14 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-10 pb-10 border-b border-black/5 dark:border-white/10">
          {/* Brand Info */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-[#264E3A] dark:bg-[#478466] flex items-center justify-center text-white font-serif font-bold text-xs shadow-2xs">
                N
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-[var(--foreground)]">
                NESTORA
              </span>
            </div>
            <p className="text-xs text-[var(--muted-text)] leading-relaxed">
              A single-vendor home and lifestyle atelier dedicated to ergonomic calmness,
              architectural lighting, and intentional everyday objects.
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-2.5 sm:col-span-1 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Collections
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--muted-text)]">
              <li>
                <Link href="/category/workspace" className="hover:text-[var(--foreground)] transition-colors">
                  Desk & Workspace
                </Link>
              </li>
              <li>
                <Link href="/category/lighting" className="hover:text-[var(--foreground)] transition-colors">
                  Ambient Lighting
                </Link>
              </li>
              <li>
                <Link href="/category/ceramics" className="hover:text-[var(--foreground)] transition-colors">
                  Handcrafted Ceramics
                </Link>
              </li>
              <li>
                <Link href="/category/storage" className="hover:text-[var(--foreground)] transition-colors">
                  Minimal Storage
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-2.5 sm:col-span-1 lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Customer Care
            </p>
            <ul className="space-y-1.5 text-xs text-[var(--muted-text)]">
              <li>
                <Link href="/shipping" className="hover:text-[var(--foreground)] transition-colors">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-[var(--foreground)] transition-colors">
                  30-Day Returns Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[var(--foreground)] transition-colors">
                  Support & Atelier Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-2.5 sm:col-span-2 lg:col-span-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)]">
              Newsletter
            </p>
            <p className="text-xs text-[var(--muted-text)]">
              Receive release notes for seasonal small-batch productions.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--muted-text)]">
          <p>© {new Date().getFullYear()} NESTORA Atelier Inc. All rights reserved.</p>
          <p className="font-mono text-[11px]">Next.js 16 • PostgreSQL • Drizzle ORM • Better Auth</p>
        </div>
      </div>
    </footer>
  );
}
