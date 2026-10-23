import React from "react";
import { getCurrentUser } from "@/lib/auth-guard";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | NESTORA",
  description: "Secure 256-bit encrypted checkout for NESTORA handcrafted home objects.",
};

export default async function CheckoutPage() {
  const currentUser = await getCurrentUser();

  const initialUser = currentUser
    ? {
        name: currentUser.name,
        email: currentUser.email,
        phone: (currentUser as unknown as { phone?: string | null }).phone || null,
      }
    : null;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background text-foreground">
      <StorefrontHeader />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CheckoutView initialUser={initialUser} />
      </main>

      <StorefrontFooter />
    </div>
  );
}
