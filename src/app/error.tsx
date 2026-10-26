"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, ShoppingBag } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log unexpected runtime error safely without exposing raw secrets
    console.error("NESTORA Runtime Exception:", error);
  }, [error]);

  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-[var(--background)] text-[var(--foreground)] selection:bg-[#264E3A] selection:text-white dark:selection:bg-[#478466]">
      {/* Top Brand Bar */}
      <header className="w-full border-b border-black/5 dark:border-white/10 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-[#264E3A] dark:bg-[#478466] flex items-center justify-center text-white font-serif font-bold text-base shadow-xs">
            N
          </div>
          <span className="font-serif text-lg font-bold tracking-tight">NESTORA</span>
        </Link>
        <span className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-[var(--muted-text)]">
          System Recovery
        </span>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="max-w-md w-full text-center space-y-6 p-6 sm:p-8 rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-stone-50/50 dark:bg-stone-900/40 shadow-xl">
          {/* Icon Badge */}
          <div className="mx-auto w-14 h-14 rounded-2xl bg-amber-500/10 dark:bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20 shadow-xs">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider rounded-md bg-stone-200/60 dark:bg-stone-800 text-[var(--muted-text)]">
              Status 500 • Atelier Exception
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
              Something went quietly awry
            </h1>
            <p className="text-xs sm:text-sm text-[var(--muted-text)] leading-relaxed">
              An unexpected condition interrupted this view. Your session and cart data remain safe in local memory.
            </p>
          </div>

          {error.digest && (
            <div className="p-2.5 rounded-lg bg-black/5 dark:bg-white/5 font-mono text-[11px] text-[var(--muted-text)] select-all truncate">
              Reference: <span className="text-[var(--foreground)]">{error.digest}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
            <button
              onClick={() => reset()}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[#264E3A] hover:bg-[#1f3f2f] text-white shadow-xs transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Try Again</span>
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-800 text-[var(--foreground)] transition-colors"
            >
              <Home className="w-4 h-4" />
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <footer className="w-full border-t border-black/5 dark:border-white/10 py-4 text-center text-xs text-[var(--muted-text)]">
        &copy; {new Date().getFullYear()} NESTORA Home & Lifestyle Atelier. Built with precision.
      </footer>
    </main>
  );
}
