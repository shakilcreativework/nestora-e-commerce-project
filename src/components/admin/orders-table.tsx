"use client";

import React, { useState } from "react";
import { updateOrderStatus } from "@/lib/actions/admin";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  AlertCircle,
  Eye,
  X,
  Search,
  Filter,
  ChevronDown,
  User,
  Calendar,
  CreditCard,
  MapPin,
  ExternalLink,
} from "lucide-react";

export interface AdminOrderRow {
  id: string;
  orderNumber: string;
  userName: string;
  userEmail: string;
  totalAmount: number; // in cents
  currency: string;
  status:
    | "PENDING_PAYMENT"
    | "CONFIRMED"
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    | "PAYMENT_FAILED"
    | "EXPIRED";
  paymentStatus: "UNPAID" | "PAID" | "FAILED" | "REFUNDED";
  itemCount: number;
  shippingAddress: {
    fullName: string;
    email?: string | null;
    address: string;
    apartment?: string | null;
    city: string;
    stateProvince: string;
    postalCode: string;
    country: string;
    phone: string;
    shippingMethod: string;
  };
  customerNote?: string | null;
  createdAt: string;
}

interface OrdersTableProps {
  orders: AdminOrderRow[];
}

function getStatusBadgeStyle(status: AdminOrderRow["status"]) {
  switch (status) {
    case "CONFIRMED":
      return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30";
    case "PROCESSING":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "SHIPPED":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30";
    case "DELIVERED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "CANCELLED":
    case "PAYMENT_FAILED":
    case "EXPIRED":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function getPaymentBadgeStyle(paymentStatus: AdminOrderRow["paymentStatus"]) {
  switch (paymentStatus) {
    case "PAID":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
    case "UNPAID":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
    case "FAILED":
      return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30";
    case "REFUNDED":
      return "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/30";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function OrdersTable({ orders: initialOrders }: OrdersTableProps) {
  const [orderList, setOrderList] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRow | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = orderList.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (
    orderId: string,
    newStatus: AdminOrderRow["status"]
  ) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    setUpdatingId(null);
    if (res.success) {
      setOrderList((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      if (selectedOrder?.id === orderId) {
        setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Status Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-card border border-border/80 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number, customer name, or email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/70"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-border bg-background text-xs font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          >
            <option value="ALL">All Statuses ({orderList.length})</option>
            <option value="CONFIRMED">CONFIRMED</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>
      </div>

      {/* Desktop / Tablet Table View (md:block) */}
      <div className="hidden md:block rounded-2xl bg-card border border-border/80 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[860px]">
            <thead className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-5 whitespace-nowrap">Order ID & Date</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Customer</th>
                <th className="py-3.5 px-4 whitespace-nowrap text-center">Items</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Total Amount</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Payment</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Order Status</th>
                <th className="py-3.5 px-5 whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-muted-foreground">
                    No orders matched your search or filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isUpdating = updatingId === order.id;
                  return (
                    <tr key={order.id} className="hover:bg-muted/30 transition-colors group">
                      {/* Order ID & Date: STRICTLY whitespace-nowrap to prevent hyphen line breaking */}
                      <td className="py-4 px-5 whitespace-nowrap">
                        <span className="font-mono font-semibold text-xs sm:text-sm text-foreground tracking-tight block">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[11px] text-muted-foreground block font-sans mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                      </td>

                      {/* Customer: Name and Email cleanly structured */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <p className="font-semibold text-foreground text-xs sm:text-sm">
                          {order.userName}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{order.userEmail}</p>
                      </td>

                      {/* Items Badge: ALWAYS single horizontal line */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-muted text-foreground border border-border/80">
                          <Package className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>{order.itemCount} {order.itemCount === 1 ? "Item" : "Items"}</span>
                        </span>
                      </td>

                      {/* Total Amount: ALWAYS single line, never breaks USD to line 2 */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-baseline gap-1 font-bold text-foreground text-sm">
                          <span>${(order.totalAmount / 100).toFixed(2)}</span>
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                            {order.currency}
                          </span>
                        </div>
                      </td>

                      {/* Payment Status: Clean pill badge */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPaymentBadgeStyle(
                            order.paymentStatus
                          )}`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {order.paymentStatus}
                        </span>
                      </td>

                      {/* Order Status: Styled interactive selector with chevron */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="relative inline-block">
                          <select
                            disabled={isUpdating}
                            value={order.status}
                            onChange={(e) =>
                              handleStatusChange(
                                order.id,
                                e.target.value as AdminOrderRow["status"]
                              )
                            }
                            className={`appearance-none cursor-pointer pr-7 pl-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${getStatusBadgeStyle(
                              order.status
                            )}`}
                          >
                            <option value="CONFIRMED">CONFIRMED</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                          <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                        </div>
                      </td>

                      {/* Action View Button */}
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setSelectedOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-background hover:bg-muted text-xs font-semibold text-foreground transition-all shadow-2xs hover:border-primary/40"
                        >
                          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View (md:hidden) — Specially crafted for small mobile screens */}
      <div className="md:hidden space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="p-8 rounded-2xl bg-card border border-border text-center text-xs text-muted-foreground">
            No orders found.
          </div>
        ) : (
          filteredOrders.map((order) => {
            const isUpdating = updatingId === order.id;
            return (
              <div
                key={order.id}
                className="p-4 rounded-2xl bg-card border border-border/80 shadow-2xs space-y-3"
              >
                {/* Header: Order ID & Date & View */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div>
                    <span className="font-mono font-bold text-xs text-foreground block">
                      #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-muted-foreground block">
                      {new Date(order.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedOrder(order)}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg border border-border text-xs font-semibold text-foreground bg-muted/60"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                </div>

                {/* Body: Customer & Badges */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Customer:</span>
                    <span className="font-semibold text-foreground">{order.userName}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="text-muted-foreground font-mono text-[11px]">{order.userEmail}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted border border-border/80">
                      <Package className="w-3 h-3 text-muted-foreground" />
                      <span>{order.itemCount} {order.itemCount === 1 ? "Item" : "Items"}</span>
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getPaymentBadgeStyle(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                {/* Footer: Price & Status Selector */}
                <div className="flex items-center justify-between pt-2.5 border-t border-border/60">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase block font-medium">
                      Total
                    </span>
                    <div className="inline-flex items-baseline gap-1 font-bold text-foreground text-sm">
                      <span>${(order.totalAmount / 100).toFixed(2)}</span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {order.currency}
                      </span>
                    </div>
                  </div>

                  <div className="relative inline-block">
                    <select
                      disabled={isUpdating}
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(
                          order.id,
                          e.target.value as AdminOrderRow["status"]
                        )
                      }
                      className={`appearance-none cursor-pointer pr-7 pl-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all ${getStatusBadgeStyle(
                        order.status
                      )}`}
                    >
                      <option value="CONFIRMED">CONFIRMED</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                    <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="relative w-full max-w-xl bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="space-y-0.5">
                <h3 className="font-serif text-lg font-bold text-foreground">
                  Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Customer and Status */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-muted/40 border border-border/60">
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Customer</span>
                  <p className="font-semibold text-foreground">{selectedOrder.userName}</p>
                  <p className="text-[11px] text-muted-foreground">{selectedOrder.userEmail}</p>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground block font-medium">Current Status</span>
                  <span
                    className={`inline-block mt-1 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase border ${getStatusBadgeStyle(
                      selectedOrder.status
                    )}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              {/* Delivery Address Snapshot */}
              <div className="p-4 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                <span className="text-[11px] text-muted-foreground block font-medium">
                  Shipping Address Snapshot
                </span>
                <p className="font-semibold text-foreground">
                  {selectedOrder.shippingAddress.fullName}
                </p>
                <p className="text-muted-foreground">
                  {selectedOrder.shippingAddress.address}
                  {selectedOrder.shippingAddress.apartment &&
                    `, ${selectedOrder.shippingAddress.apartment}`}
                </p>
                <p className="text-muted-foreground">
                  {selectedOrder.shippingAddress.city},{" "}
                  {selectedOrder.shippingAddress.stateProvince}{" "}
                  {selectedOrder.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{selectedOrder.shippingAddress.country}</p>
                <p className="pt-2 text-[11px] text-foreground font-medium">
                  Phone: {selectedOrder.shippingAddress.phone} • Method:{" "}
                  {selectedOrder.shippingAddress.shippingMethod === "EXPRESS"
                    ? "Express Artisan Courier"
                    : "Standard Tracked Shipping"}
                </p>
              </div>

              {/* Order Financials */}
              <div className="flex justify-between items-center p-4 rounded-xl border border-border">
                <span className="font-semibold text-foreground">Total Order Value:</span>
                <span className="font-serif text-lg font-bold text-primary">
                  ${(selectedOrder.totalAmount / 100).toFixed(2)} {selectedOrder.currency}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all"
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
