"use client";

import React, { useState, useTransition } from "react";
import {
  Users,
  Search,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Ban,
  CheckCircle2,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ArrowUpDown,
  UserCheck,
  UserX,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  type AdminCustomerItem,
  toggleUserBlock,
  toggleUserRole,
} from "@/lib/actions/admin-customers";

interface CustomersTableProps {
  initialCustomers: AdminCustomerItem[];
}

export function CustomersTable({ initialCustomers }: CustomersTableProps) {
  const [customers, setCustomers] = useState<AdminCustomerItem[]>(initialCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<"ALL" | "CUSTOMER" | "ADMIN">("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "BLOCKED">("ALL");
  const [isPending, startTransition] = useTransition();
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Filter logic
  const filteredCustomers = customers.filter((c) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      c.name.toLowerCase().includes(query) ||
      c.email.toLowerCase().includes(query) ||
      (c.phone && c.phone.toLowerCase().includes(query));

    const matchesRole = roleFilter === "ALL" || c.role === roleFilter;
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" && !c.isBlocked) ||
      (statusFilter === "BLOCKED" && c.isBlocked);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleToggleBlock = (customer: AdminCustomerItem) => {
    setFeedbackMessage(null);
    startTransition(async () => {
      const res = await toggleUserBlock(customer.id, customer.isBlocked);
      if (res.success && res.isBlocked !== undefined) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, isBlocked: res.isBlocked } : c))
        );
        setFeedbackMessage({
          type: "success",
          text: `Account for ${customer.name} has been ${res.isBlocked ? "blocked" : "unblocked"}.`,
        });
      } else {
        setFeedbackMessage({
          type: "error",
          text: res.error || "Failed to update account status.",
        });
      }
    });
  };

  const handleToggleRole = (customer: AdminCustomerItem) => {
    setFeedbackMessage(null);
    const newRole = customer.role === "ADMIN" ? "CUSTOMER" : "ADMIN";
    const confirmText =
      newRole === "ADMIN"
        ? `Grant full administrative privileges to ${customer.name}?`
        : `Demote ${customer.name} to a regular customer?`;

    if (!window.confirm(confirmText)) return;

    startTransition(async () => {
      const res = await toggleUserRole(customer.id, newRole);
      if (res.success && res.role) {
        setCustomers((prev) =>
          prev.map((c) => (c.id === customer.id ? { ...c, role: res.role } : c))
        );
        setFeedbackMessage({
          type: "success",
          text: `Role for ${customer.name} updated to ${res.role}.`,
        });
      } else {
        setFeedbackMessage({
          type: "error",
          text: res.error || "Failed to update user role.",
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-medium transition-all ${
            feedbackMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              : "bg-destructive/10 border-destructive/20 text-destructive"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-muted-foreground hover:text-foreground text-xs font-bold px-2 py-0.5"
          >
            ✕
          </button>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl border border-border bg-card/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or telephone..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as "ALL" | "CUSTOMER" | "ADMIN")}
            className="px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Roles</option>
            <option value="CUSTOMER">Customers Only</option>
            <option value="ADMIN">Admins Only</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "ACTIVE" | "BLOCKED")}
            className="px-3 py-2 text-xs rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Accounts</option>
            <option value="BLOCKED">Blocked Accounts</option>
          </select>
        </div>
      </div>

      {/* Customer Directory Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4">Lifetime Spend</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-muted-foreground">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-medium text-xs">No customer accounts match your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((customer) => {
                  const initials = customer.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <tr
                      key={customer.id}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      {/* Customer Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                            {initials || "U"}
                          </div>
                          <div className="space-y-0.5">
                            <p className="font-semibold text-foreground text-xs leading-none">
                              {customer.name}
                            </p>
                            <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                              <Mail className="w-3 h-3 text-muted-foreground/70" />
                              {customer.email}
                            </p>
                            {customer.phone && (
                              <p className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                                <Phone className="w-2.5 h-2.5 text-muted-foreground/70" />
                                {customer.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="py-3.5 px-4">
                        {customer.role === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" />
                            Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                            Customer
                          </span>
                        )}
                      </td>

                      {/* Orders */}
                      <td className="py-3.5 px-4 font-mono font-medium text-foreground">
                        <div className="flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{customer.orderCount}</span>
                        </div>
                      </td>

                      {/* Lifetime Spend */}
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        ${(customer.totalSpent / 100).toFixed(2)}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 text-muted-foreground font-mono text-[11px]">
                        {new Date(customer.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {customer.isBlocked ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                            <Ban className="w-3 h-3" />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          {/* Role Toggle Button */}
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleToggleRole(customer)}
                            title={
                              customer.role === "ADMIN"
                                ? "Demote to regular customer"
                                : "Promote to administrator"
                            }
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer disabled:opacity-50 ${
                              customer.role === "ADMIN"
                                ? "border-amber-500/30 text-amber-600 hover:bg-amber-500/10"
                                : "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                            }`}
                          >
                            {customer.role === "ADMIN" ? (
                              <UserX className="w-3.5 h-3.5" />
                            ) : (
                              <UserCheck className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Block/Unblock Toggle */}
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleToggleBlock(customer)}
                            title={
                              customer.isBlocked
                                ? "Unblock account"
                                : "Block account from ordering"
                            }
                            className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer disabled:opacity-50 ${
                              customer.isBlocked
                                ? "border-emerald-500/30 text-emerald-600 hover:bg-emerald-500/10"
                                : "border-destructive/30 text-destructive hover:bg-destructive/10"
                            }`}
                          >
                            <Ban className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
