"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from "@/lib/store/features/cart-slice";
import { placeOrder, validateCoupon } from "@/lib/actions/checkout";
import {
  ShieldCheck,
  Truck,
  Lock,
  ArrowRight,
  ShoppingBag,
  CreditCard,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
  Tag,
  X,
} from "lucide-react";

interface CheckoutViewProps {
  initialUser: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
}

export function CheckoutView({ initialUser }: CheckoutViewProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartSubtotal = useAppSelector(selectCartSubtotal); // in cents

  const [fullName, setFullName] = useState(initialUser?.name || "");
  const [email, setEmail] = useState(initialUser?.email || "");
  const [phone, setPhone] = useState(initialUser?.phone || "");
  const [address, setAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("United States");
  const [shippingMethod, setShippingMethod] = useState<"STANDARD" | "EXPRESS">("STANDARD");
  const [customerNote, setCustomerNote] = useState("");

  // Promo code state
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    description: string | null;
    discountAmount: number;
  } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calculate live estimates based on current selection and applied coupon
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const discountedSubtotal = Math.max(0, cartSubtotal - discountAmount);
  const isFreeShipping = discountedSubtotal >= 15000;
  const shippingCost = shippingMethod === "EXPRESS" ? 2500 : isFreeShipping ? 0 : 1500;
  const estimatedTax = Math.round(discountedSubtotal * 0.08);
  const grandTotal = discountedSubtotal + shippingCost + estimatedTax;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await validateCoupon(couponInput, cartSubtotal);
      if (res.success && res.coupon) {
        setAppliedCoupon({
          code: res.coupon.code,
          description: res.coupon.description,
          discountAmount: res.coupon.discountAmount,
        });
        setCouponInput("");
      } else {
        setCouponError(res.error || "Invalid coupon code.");
      }
    } catch {
      setCouponError("Failed to apply promo code.");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (cartItems.length === 0) {
      setErrorMessage("Your bag is empty. Please add items before placing an order.");
      return;
    }

    if (!fullName || !email || !phone || !address || !city || !postalCode) {
      setErrorMessage("Please complete all required shipping details.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await placeOrder({
        fullName,
        email,
        phone,
        address,
        apartment,
        city,
        stateProvince,
        postalCode,
        country,
        shippingMethod,
        customerNote,
        couponCode: appliedCoupon?.code,
        items: cartItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      });

      if (!response.success || !response.orderNumber) {
        setErrorMessage(response.error || "Failed to process order. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Order placed successfully!
      // 1. Clear client cart
      dispatch(clearCart());

      // 2. Redirect to dedicated order confirmation page
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(response.orderNumber)}`);
    } catch (err) {
      console.error("Checkout submission error:", err);
      setErrorMessage("A network or server error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  // If bag is empty
  if (cartItems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-foreground">
            Your Bag is Empty
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            You don&apos;t have any items in your cart to checkout. Discover our collection of
            handcrafted artisanal objects.
          </p>
        </div>
        <div>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-md"
          >
            <span>Explore Atelier Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Review your handcrafted items, confirm delivery address, and place your order.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in-50">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* 1. Contact Information */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                1
              </span>
              Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Shakil Ahmed"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Phone Number <span className="text-destructive">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 019-2834"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>
          </div>

          {/* 2. Shipping Address */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                2
              </span>
              Shipping Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Street Address <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Artisan Way"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-foreground">
                  Apartment, Suite, Unit (Optional)
                </label>
                <input
                  type="text"
                  value={apartment}
                  onChange={(e) => setApartment(e.target.value)}
                  placeholder="Suite 4B"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  City <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  State / Province <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={stateProvince}
                  onChange={(e) => setStateProvince(e.target.value)}
                  placeholder="California"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Postal / ZIP Code <span className="text-destructive">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="94103"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">
                  Country <span className="text-destructive">*</span>
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="Japan">Japan</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Delivery Method */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
            <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                3
              </span>
              Delivery Method
            </h2>

            <div className="space-y-3">
              <label
                onClick={() => setShippingMethod("STANDARD")}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === "STANDARD"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                    {shippingMethod === "STANDARD" && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground">
                      Standard Tracked Shipping
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Delivered in 3–5 business days in sustainable packaging
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">
                  {isFreeShipping ? "FREE" : "$15.00"}
                </span>
              </label>

              <label
                onClick={() => setShippingMethod("EXPRESS")}
                className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  shippingMethod === "EXPRESS"
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                    {shippingMethod === "EXPRESS" && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-foreground flex items-center gap-1.5">
                      Express Artisan Courier
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600">
                        Priority
                      </span>
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      Guaranteed 1–2 business day expedited delivery
                    </p>
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-bold text-foreground">$25.00</span>
              </label>
            </div>
          </div>

          {/* 4. Payment Simulation */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                  4
                </span>
                Payment Method
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sandbox Encrypted
              </span>
            </div>

            <div className="p-4 rounded-xl border border-primary/40 bg-primary/5 space-y-3">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-semibold text-foreground">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <span>Sandbox Test Card (Simulated Checkout)</span>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">Demo Mode</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Orders are processed safely in demonstration sandbox mode. Real credit cards are not
                charged, but inventory stock and immutable snapshots are strictly enforced in
                PostgreSQL.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                Delivery Instructions or Gift Note (Optional)
              </label>
              <textarea
                rows={2}
                value={customerNote}
                onChange={(e) => setCustomerNote(e.target.value)}
                placeholder="e.g. Leave with building doorman or ring back bell."
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Order Summary */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <h2 className="font-serif text-lg font-bold text-foreground">Order Summary</h2>
              <span className="text-xs text-muted-foreground font-medium">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Items
              </span>
            </div>

            {/* Item list */}
            <div className="divide-y divide-border/60 max-h-72 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3 text-xs sm:text-sm">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-foreground">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Code & Voucher Section */}
            <div className="pt-2 border-t border-border/60">
              {appliedCoupon ? (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <div>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        {appliedCoupon.description || "Promo code discount applied"}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="p-1 rounded-lg hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 transition-colors"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Promo Code (e.g. WELCOME10)"
                      className="flex-1 px-3 py-2 rounded-xl border border-border bg-background text-xs font-mono tracking-wider text-foreground uppercase placeholder:normal-case placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponInput.trim()}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border transition-all disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      {isValidatingCoupon && <Loader2 className="w-3 h-3 animate-spin" />}
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-500 font-medium">{couponError}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Try <span className="font-mono font-bold text-foreground">WELCOME10</span> (10% off) or{" "}
                    <span className="font-mono font-bold text-foreground">AUTUMN25</span> ($25 off $150+)
                  </p>
                </div>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 pt-4 border-t border-border text-xs sm:text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">
                  ${(cartSubtotal / 100).toFixed(2)}
                </span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    Promo Discount ({appliedCoupon.code})
                  </span>
                  <span>- ${(discountAmount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-muted-foreground/70" />
                  Estimated Delivery
                </span>
                <span className="text-foreground font-medium">
                  {shippingCost === 0 ? "FREE" : `$${(shippingCost / 100).toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Tax (8%)</span>
                <span className="text-foreground font-medium">
                  ${(estimatedTax / 100).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t border-border text-sm sm:text-base font-bold text-foreground">
                <span>Total Due</span>
                <span className="font-serif text-lg text-primary">
                  ${(grandTotal / 100).toFixed(2)} USD
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-primary text-primary-foreground hover:opacity-90 flex items-center justify-center gap-2 transition-all shadow-md group disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Securing Order in Database...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Complete Purchase • ${(grandTotal / 100).toFixed(2)}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 pt-2 text-[10px] sm:text-[11px] text-muted-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>30-Day Calm Return • 256-Bit Encrypted Order Engine</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
