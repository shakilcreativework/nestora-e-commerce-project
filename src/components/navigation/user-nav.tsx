"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { User, LogOut, Shield, ChevronDown } from "lucide-react";

export function UserNav() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isPending) {
    return (
      <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
    );
  }

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xs"
      >
        <User className="w-3.5 h-3.5" />
        <span>Sign in</span>
      </Link>
    );
  }

  const user = session.user as typeof session.user & { role?: string };
  const isAdmin = user.role === "ADMIN";
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
    router.refresh();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pl-2 sm:pr-2.5 rounded-full border border-border hover:bg-muted/50 transition-colors"
        aria-label="User menu"
      >
        <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-semibold text-xs flex items-center justify-center">
          {userInitials}
        </div>
        <span className="text-xs font-medium text-foreground max-w-[80px] sm:max-w-[120px] truncate hidden xs:inline-block">
          {user.name?.split(" ")[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-muted-foreground" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-card border border-border shadow-lg py-2 z-50 animate-in fade-in-50 zoom-in-95">
          {/* User info */}
          <div className="px-4 py-2 border-b border-border/60">
            <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
            <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
            {isAdmin && (
              <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <Shield className="w-2.5 h-2.5" />
                Admin
              </span>
            )}
          </div>

          {/* Links */}
          <div className="py-1">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted transition-colors font-medium text-emerald-600 dark:text-emerald-400"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Dashboard
              </Link>
            )}
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2 text-xs text-foreground hover:bg-muted transition-colors"
            >
              <User className="w-3.5 h-3.5 text-muted-foreground" />
              My Account
            </Link>
          </div>

          {/* Sign out */}
          <div className="pt-1 border-t border-border/60">
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-destructive hover:bg-destructive/10 transition-colors text-left font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
