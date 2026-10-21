import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  ShoppingBag,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Sun,
  Moon,
  Laptop,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col justify-between selection:bg-[#264E3A] selection:text-white dark:selection:bg-[#478466]">
      {/* Top Notification Bar */}
      <div className="w-full bg-[#264E3A] dark:bg-[#182C22] text-stone-100 text-[11px] xs:text-xs py-1.5 px-3 xs:px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-[#B2834E] shrink-0" />
        <span>Welcome to NESTORA — Thoughtful essentials for everyday living.</span>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-[var(--background)]/85 border-b border-black/5 dark:border-white/10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-[#264E3A] dark:bg-[#478466] flex items-center justify-center text-white font-serif font-bold text-lg sm:text-xl shadow-sm">
              N
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)]">
                NESTORA
              </span>
              <span className="text-[10px] sm:text-xs tracking-widest uppercase text-[var(--muted-text)] font-mono -mt-1 hidden xs:block">
                Home & Lifestyle
              </span>
            </div>
          </div>

          {/* Quick Search bar (Tablet & Desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--muted-text)]" />
              <input
                type="text"
                placeholder="Search organizers, lighting, ceramics..."
                readOnly
                className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-black/[0.04] dark:bg-white/[0.05] border border-black/5 dark:border-white/10 text-[var(--foreground)] placeholder:text-[var(--muted-text)] focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Header Right Actions */}
          <div className="flex items-center gap-2 xs:gap-3 sm:gap-4">
            {/* Theme Toggle (Light / Dark / System) */}
            <ThemeToggle />

            {/* Wishlist Icon */}
            <button
              type="button"
              aria-label="Wishlist"
              className="p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)] transition-colors relative"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--muted-text)] hover:text-red-500 transition-colors" />
            </button>

            {/* Cart Icon */}
            <button
              type="button"
              aria-label="Cart"
              className="p-2 sm:p-2.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-[var(--foreground)] transition-colors relative flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="inline-flex items-center justify-center text-[10px] font-bold bg-[#264E3A] dark:bg-[#478466] text-white w-4 h-4 rounded-full">
                0
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="flex-1 max-w-7xl mx-auto w-full px-4 xs:px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px] py-10 sm:py-16 md:py-24 flex flex-col justify-center">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#264E3A]/10 dark:bg-[#478466]/20 text-[#264E3A] dark:text-[#67B58E] border border-[#264E3A]/20 dark:border-[#478466]/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Theme System Active: Seamless Light & Dark Mode</span>
          </div>

          <h1 className="font-serif text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] leading-[1.12]">
            Thoughtful living,{" "}
            <span className="italic font-normal text-[#264E3A] dark:text-[#67B58E]">
              quietly refined.
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-[var(--muted-text)] font-sans leading-relaxed max-w-2xl">
            A single-vendor collection of home organizers, lighting, and everyday essentials.
            Engineered with Next.js 16 App Router, Redux Toolkit, and Tailwind CSS.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3 sm:gap-4">
            <a
              href="#explore"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#264E3A] hover:bg-[#1E3E2E] dark:bg-[#478466] dark:hover:bg-[#3B6E54] text-white text-sm sm:text-base font-medium shadow-md hover:shadow-lg transition-all duration-200"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <div className="px-4 py-3 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-xs sm:text-sm text-[var(--muted-text)] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B2834E]" />
              <span>Fullstack TypeScript & PostgreSQL Ready</span>
            </div>
          </div>
        </div>

        {/* Responsive Design & Architecture Badges */}
        <div className="mt-12 sm:mt-16 md:mt-20 pt-8 border-t border-black/5 dark:border-white/10 grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
            <div className="text-xs font-mono text-[#264E3A] dark:text-[#67B58E] font-semibold">
              RESPONSIVE
            </div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              xs, sm, md, lg, xl, 2xl
            </div>
            <p className="text-xs text-[var(--muted-text)]">
              Tailored for all devices from 320px to 1536px+
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
            <div className="text-xs font-mono text-[#264E3A] dark:text-[#67B58E] font-semibold">
              THEME
            </div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              Light & Dark Modes
            </div>
            <p className="text-xs text-[var(--muted-text)]">
              Zero flicker, accessible contrast & persistent preference
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
            <div className="text-xs font-mono text-[#264E3A] dark:text-[#67B58E] font-semibold">
              SECURITY
            </div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              Admin Moderated
            </div>
            <p className="text-xs text-[var(--muted-text)]">
              Only admin-approved active products are visible in UI
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--surface)] border border-black/5 dark:border-white/10 shadow-sm space-y-1">
            <div className="text-xs font-mono text-[#264E3A] dark:text-[#67B58E] font-semibold">
              STATE & DATA
            </div>
            <div className="text-sm font-semibold text-[var(--foreground)]">
              Redux + PostgreSQL
            </div>
            <p className="text-xs text-[var(--muted-text)]">
              Transactional integrity with client-side reactivity
            </p>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="w-full border-t border-black/5 dark:border-white/10 py-6 px-4 text-center text-xs text-[var(--muted-text)]">
        <p>© 2026 NESTORA E-Commerce Platform. Built with Next.js, Redux & TypeScript.</p>
      </footer>
    </main>
  );
}
