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
  MapPin,
} from "lucide-react";
import type { CustomerSavedAddress } from "@/lib/actions/customer";

interface CheckoutViewProps {
  initialUser: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
  } | null;
  savedAddresses?: CustomerSavedAddress[];
}

export function CheckoutView({ initialUser, savedAddresses = [] }: CheckoutViewProps) {
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

  // Sandbox Test Payment Matrix (NESTORA-053 & NESTORA-054)
  const [testCardOption, setTestCardOption] = useState<
    "SUCCESS" | "DECLINE_FUNDS" | "DECLINE_EXPIRED"
  >("SUCCESS");
  const [cardholderName, setCardholderName] = useState(initialUser?.name || "");
  const [idempotencyKey] = useState(
    () => `idem_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  );

  // Auto-populate default saved address if available
  useEffect(() => {
    if (savedAddresses && savedAddresses.length > 0 && !address) {
      const defaultAddr = savedAddresses.find((a) => a.isDefault) || savedAddresses[0];
      if (defaultAddr) {
        setFullName(defaultAddr.fullName);
        setPhone(defaultAddr.phone);
        setAddress(defaultAddr.addressLine1);
        setApartment(defaultAddr.addressLine2 || "");
        setCity(defaultAddr.city);
        setStateProvince(defaultAddr.stateProvince);
        setPostalCode(defaultAddr.postalCode);
        setCountry(defaultAddr.country);
      }
    }
  }, [savedAddresses]);

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
      const testCardNumbers = {
        SUCCESS: "4242 4242 4242 4242",
        DECLINE_FUNDS: "4000 0000 0000 0002",
        DECLINE_EXPIRED: "4000 0000 0000 0003",
      };

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
        cardNumber: testCardNumbers[testCardOption],
        cardholderName: cardholderName || fullName,
        idempotencyKey,
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

            {/* Saved Addresses 1-Click Auto-Fill */}
            {savedAddresses && savedAddresses.length > 0 && (
              <div className="p-3.5 rounded-xl bg-muted/40 border border-border/60 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    Saved Addresses
                  </span>
                  <span className="text-[10px] text-muted-foreground font-medium">1-Click Fast Fill</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {savedAddresses.map((addr) => {
                    const isSelected =
                      address.toLowerCase() === addr.addressLine1.toLowerCase() &&
                      postalCode === addr.postalCode;
                    return (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => {
                          setFullName(addr.fullName);
                          setPhone(addr.phone);
                          setAddress(addr.addressLine1);
                          setApartment(addr.addressLine2 || "");
                          setCity(addr.city);
                          setStateProvince(addr.stateProvince);
                          setPostalCode(addr.postalCode);
                          setCountry(addr.country);
                        }}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary/20"
                            : "border-border/80 bg-background hover:border-foreground/30"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-xs text-foreground truncate">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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

          {/* 4. Isolated Mock Sandbox Payment (NESTORA-053 & NESTORA-054) */}
          <div className="rounded-2xl bg-card border border-border/80 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                  4
                </span>
                Payment Method
              </h2>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Sandbox Test Gateway
              </span>
            </div>

            {/* Sandbox Disclosure Banner (PRD Requirement) */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Portfolio Sandbox Environment</p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                  No real credit card numbers or money are processed. Select a simulated test card scenario below to test real-time approval or decline handling.
                </p>
              </div>
            </div>

            {/* Test Card Matrix Selector */}
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-foreground">
                Select Simulated Test Card:
              </label>

              {/* Scenario 1: Instant Approval */}
              <div
                onClick={() => setTestCardOption("SUCCESS")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  testCardOption === "SUCCESS"
                    ? "border-emerald-600 bg-emerald-500/5 ring-1 ring-emerald-600"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-emerald-600 flex items-center justify-center">
                    {testCardOption === "SUCCESS" && (
                      <div className="w-2 h-2 rounded-full bg-emerald-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      <span className="font-mono text-xs font-semibold text-foreground">
                        4242 •••• •••• 4242
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        Visa • Instant Success
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Simulates successful payment authorization, stock deduction & order confirmation
                    </p>
                  </div>
                </div>
              </div>

              {/* Scenario 2: Decline - Insufficient Balance */}
              <div
                onClick={() => setTestCardOption("DECLINE_FUNDS")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  testCardOption === "DECLINE_FUNDS"
                    ? "border-destructive bg-destructive/5 ring-1 ring-destructive"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-destructive flex items-center justify-center">
                    {testCardOption === "DECLINE_FUNDS" && (
                      <div className="w-2 h-2 rounded-full bg-destructive" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-destructive" />
                      <span className="font-mono text-xs font-semibold text-foreground">
                        4000 •••• •••• 0002
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
                        Simulate Decline (Insufficient Balance)
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Simulates bank rejection. Verifies that stock is NOT decremented upon failure.
                    </p>
                  </div>
                </div>
              </div>

              {/* Scenario 3: Decline - Expired Card */}
              <div
                onClick={() => setTestCardOption("DECLINE_EXPIRED")}
                className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                  testCardOption === "DECLINE_EXPIRED"
                    ? "border-amber-600 bg-amber-500/5 ring-1 ring-amber-600"
                    : "border-border hover:bg-muted/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full border border-amber-600 flex items-center justify-center">
                    {testCardOption === "DECLINE_EXPIRED" && (
                      <div className="w-2 h-2 rounded-full bg-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-amber-600" />
                      <span className="font-mono text-xs font-semibold text-foreground">
                        4000 •••• •••• 0003
                      </span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                        Simulate Decline (Card Expired)
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Simulates invalid card expiration rejection.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cardholder Name Input */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-foreground">
                Cardholder Name
              </label>
              <input
                type="text"
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder={fullName || "Jane Doe"}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs sm:text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
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
