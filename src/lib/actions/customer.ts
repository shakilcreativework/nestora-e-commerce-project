"use server";

import { db } from "@/lib/db";
import { users, addresses } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { requireUser } from "@/lib/auth-guard";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export interface CustomerSavedAddress {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
}

// 1. Profile Update Action
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(70),
  phone: z.string().max(25).optional(),
});

export async function updateCustomerProfile(rawInput: { name: string; phone?: string }) {
  const user = await requireUser("/account");

  const validation = updateProfileSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid profile data",
    };
  }

  const { name, phone } = validation.data;

  try {
    await db
      .update(users)
      .set({
        name: name.trim(),
        phone: phone?.trim() || null,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    revalidatePath("/account");
    return { success: true, name: name.trim(), phone: phone?.trim() || null };
  } catch (err: unknown) {
    console.error("Error updating customer profile:", err);
    return { success: false, error: "Failed to update profile details" };
  }
}

// 2. Address Zod Schema
const addressSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  addressLine1: z.string().min(5, "Street address is required").max(150),
  addressLine2: z.string().max(100).optional(),
  city: z.string().min(2, "City is required").max(80),
  stateProvince: z.string().min(2, "State/Province is required").max(80),
  postalCode: z.string().min(3, "Postal/ZIP code is required").max(20),
  country: z.string().min(2, "Country is required").max(60).default("US"),
  phone: z.string().min(7, "Valid phone number is required").max(25),
  isDefault: z.boolean().default(false),
});

export type AddressInput = z.infer<typeof addressSchema>;

// 3. Fetch User Addresses
export async function getCustomerAddresses(): Promise<CustomerSavedAddress[]> {
  const user = await requireUser("/account");

  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, user.id))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return rows.map((r) => ({
    id: r.id,
    fullName: r.fullName,
    addressLine1: r.addressLine1,
    addressLine2: r.addressLine2,
    city: r.city,
    stateProvince: r.stateProvince,
    postalCode: r.postalCode,
    country: r.country,
    phone: r.phone,
    isDefault: r.isDefault,
    createdAt: r.createdAt.toISOString(),
  }));
}

// 4. Save New Address
export async function saveCustomerAddress(rawInput: AddressInput) {
  const user = await requireUser("/account");

  const validation = addressSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid address data",
    };
  }

  const data = validation.data;

  try {
    const existing = await db
      .select({ id: addresses.id })
      .from(addresses)
      .where(eq(addresses.userId, user.id));

    const shouldBeDefault = data.isDefault || existing.length === 0;

    const result = await db.transaction(async (tx) => {
      if (shouldBeDefault) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(addresses.userId, user.id));
      }

      const [newAddr] = await tx
        .insert(addresses)
        .values({
          userId: user.id,
          fullName: data.fullName.trim(),
          addressLine1: data.addressLine1.trim(),
          addressLine2: data.addressLine2?.trim() || null,
          city: data.city.trim(),
          stateProvince: data.stateProvince.trim(),
          postalCode: data.postalCode.trim(),
          country: data.country.trim() || "US",
          phone: data.phone.trim(),
          isDefault: shouldBeDefault,
        })
        .returning();

      return newAddr;
    });

    revalidatePath("/account");
    revalidatePath("/checkout");

    return { success: true, address: result };
  } catch (err: unknown) {
    console.error("Error saving customer address:", err);
    return { success: false, error: "Failed to save address" };
  }
}

// 5. Update Address
export async function updateCustomerAddress(
  addressId: string,
  rawInput: AddressInput
) {
  const user = await requireUser("/account");

  const validation = addressSchema.safeParse(rawInput);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || "Invalid address data",
    };
  }

  const data = validation.data;

  try {
    const [existing] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, user.id)))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Address not found" };
    }

    await db.transaction(async (tx) => {
      if (data.isDefault) {
        await tx
          .update(addresses)
          .set({ isDefault: false, updatedAt: new Date() })
          .where(eq(addresses.userId, user.id));
      }

      await tx
        .update(addresses)
        .set({
          fullName: data.fullName.trim(),
          addressLine1: data.addressLine1.trim(),
          addressLine2: data.addressLine2?.trim() || null,
          city: data.city.trim(),
          stateProvince: data.stateProvince.trim(),
          postalCode: data.postalCode.trim(),
          country: data.country.trim() || "US",
          phone: data.phone.trim(),
          isDefault: data.isDefault,
          updatedAt: new Date(),
        })
        .where(eq(addresses.id, addressId));
    });

    revalidatePath("/account");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error updating customer address:", err);
    return { success: false, error: "Failed to update address" };
  }
}

// 6. Delete Address
export async function deleteCustomerAddress(addressId: string) {
  const user = await requireUser("/account");

  try {
    const [existing] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, user.id)))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Address not found" };
    }

    await db.transaction(async (tx) => {
      await tx.delete(addresses).where(eq(addresses.id, addressId));

      // If deleted was default, make latest address default
      if (existing.isDefault) {
        const [remaining] = await tx
          .select({ id: addresses.id })
          .from(addresses)
          .where(eq(addresses.userId, user.id))
          .orderBy(desc(addresses.createdAt))
          .limit(1);

        if (remaining) {
          await tx
            .update(addresses)
            .set({ isDefault: true, updatedAt: new Date() })
            .where(eq(addresses.id, remaining.id));
        }
      }
    });

    revalidatePath("/account");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error deleting customer address:", err);
    return { success: false, error: "Failed to delete address" };
  }
}

// 7. Set Default Address
export async function setDefaultCustomerAddress(addressId: string) {
  const user = await requireUser("/account");

  try {
    const [existing] = await db
      .select()
      .from(addresses)
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, user.id)))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Address not found" };
    }

    await db.transaction(async (tx) => {
      await tx
        .update(addresses)
        .set({ isDefault: false, updatedAt: new Date() })
        .where(eq(addresses.userId, user.id));

      await tx
        .update(addresses)
        .set({ isDefault: true, updatedAt: new Date() })
        .where(eq(addresses.id, addressId));
    });

    revalidatePath("/account");
    revalidatePath("/checkout");

    return { success: true };
  } catch (err: unknown) {
    console.error("Error setting default address:", err);
    return { success: false, error: "Failed to set default address" };
  }
}
