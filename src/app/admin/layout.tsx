import React from "react";
import { requireAdmin } from "@/lib/auth-guard";
import { AdminShell } from "./admin-shell";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | NESTORA",
  description: "Executive Management Portal for NESTORA Storefront",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Strictly enforce Server-Side RBAC
  const user = await requireAdmin("/admin");

  return (
    <AdminShell
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </AdminShell>
  );
}
