"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 4000);
  };

  if (isSubscribed) {
    return (
      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs">
        <Check className="w-4 h-4 shrink-0" />
        <span>Thank you for joining our small-batch release list.</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-md">
      <div className="relative flex-1 min-w-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
          required
          className="w-full min-w-0 px-3 xs:px-3.5 py-2 xs:py-2.5 text-xs rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50 text-[var(--foreground)] placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-[#264E3A] transition-all"
        />
      </div>
      <button
        type="submit"
        className="px-3.5 xs:px-4 py-2 xs:py-2.5 rounded-xl bg-[#264E3A] dark:bg-[#478466] text-white text-xs font-semibold hover:opacity-90 active:scale-95 transition-all shrink-0 shadow-xs"
      >
        Join
      </button>
    </form>
  );
}
