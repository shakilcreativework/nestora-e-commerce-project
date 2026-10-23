import React from "react";
import { getCurrentUser } from "@/lib/auth-guard";
import { StorefrontHeader } from "@/components/navigation/storefront-header";
import { StorefrontFooter } from "@/components/navigation/storefront-footer";
import { CheckoutView } from "@/components/checkout/checkout-view";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { CustomerSavedAddress } from "@/lib/actions/customer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout | NESTORA",
  description: "Secure 256-bit encrypted checkout for NESTORA handcrafted home objects.",
};

export default async function CheckoutPage() {
  const currentUser = await getCurrentUser();

  let savedAddresses: CustomerSavedAddress[] = [];

  if (currentUser) {
    const rows = await db
      .select()
      .from(addresses)
      .where(eq(addresses.userId, currentUser.id))
      .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

    savedAddresses = rows.map((a) => ({
      id: a.id,
      fullName: a.fullName,
      addressLine1: a.addressLine1,
      addressLine2: a.addressLine2,
      city: a.city,
      stateProvince: a.stateProvince,
      postalCode: a.postalCode,
      country: a.country,
      phone: a.phone,
      isDefault: a.isDefault,
      createdAt: a.createdAt.toISOString(),
    }));
  }

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
        <CheckoutView
          initialUser={initialUser}
          savedAddresses={savedAddresses}
        />
      </main>

      <StorefrontFooter />
    </div>
  );
}
