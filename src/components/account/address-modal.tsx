"use client";

import React, { useState } from "react";
import { X, MapPin, AlertCircle, Check } from "lucide-react";
import {
  saveCustomerAddress,
  updateCustomerAddress,
  type CustomerSavedAddress,
  type AddressInput,
} from "@/lib/actions/customer";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (address: CustomerSavedAddress) => void;
  initialData?: CustomerSavedAddress | null;
}

export function AddressModal({
  isOpen,
  onClose,
  onSaved,
  initialData,
}: AddressModalProps) {
  const isEditing = !!initialData;

  const [formData, setFormData] = useState<AddressInput>({
    fullName: initialData?.fullName || "",
    addressLine1: initialData?.addressLine1 || "",
    addressLine2: initialData?.addressLine2 || "",
    city: initialData?.city || "",
    stateProvince: initialData?.stateProvince || "",
    postalCode: initialData?.postalCode || "",
    country: initialData?.country || "United States",
    phone: initialData?.phone || "",
    isDefault: initialData?.isDefault ?? false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isEditing && initialData) {
        const res = await updateCustomerAddress(initialData.id, formData);
        if (!res.success) {
          setError(res.error || "Failed to update address");
          setIsSubmitting(false);
          return;
        }
        onSaved({
          ...initialData,
          ...formData,
          addressLine2: formData.addressLine2 || null,
        });
      } else {
        const res = await saveCustomerAddress(formData);
        if (!res.success || !res.address) {
          setError(res.error || "Failed to save address");
          setIsSubmitting(false);
          return;
        }
        onSaved({
          id: res.address.id,
          fullName: res.address.fullName,
          addressLine1: res.address.addressLine1,
          addressLine2: res.address.addressLine2,
          city: res.address.city,
          stateProvince: res.address.stateProvince,
          postalCode: res.address.postalCode,
          country: res.address.country,
          phone: res.address.phone,
          isDefault: res.address.isDefault,
          createdAt: new Date().toISOString(),
        });
      }
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/20 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary border border-primary/20">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                {isEditing ? "Edit Shipping Address" : "Add New Address"}
              </h3>
              <p className="text-xs text-muted-foreground">
                Used for expedited delivery dispatch & receipts
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Street Address *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 742 Evergreen Terrace"
              value={formData.addressLine1}
              onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Apartment / Suite */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Apartment, Suite, Unit (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Apt 4B"
              value={formData.addressLine2 || ""}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* City & State in 2 cols */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                City *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Portland"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                State / Province *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oregon"
                value={formData.stateProvince}
                onChange={(e) => setFormData({ ...formData, stateProvince: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>
          </div>

          {/* Postal Code & Country */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Postal / ZIP Code *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 97201"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                Country *
              </label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full h-10 px-3 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="Germany">Germany</option>
                <option value="Denmark">Denmark</option>
                <option value="Japan">Japan</option>
              </select>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="e.g. +1 (555) 019-2834"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full h-10 px-3.5 rounded-xl bg-background border border-border text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-foreground/20"
            />
          </div>

          {/* Default Address Checkbox */}
          <label className="flex items-center gap-2.5 pt-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              className="w-4 h-4 rounded border-border text-foreground focus:ring-foreground/20"
            />
            <span className="text-xs font-medium text-foreground">
              Set as my default shipping address
            </span>
          </label>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-foreground text-background hover:opacity-90 active:scale-[0.99] transition-all flex items-center gap-2 shadow-xs disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-3.5 h-3.5" />
                  {isEditing ? "Save Changes" : "Save Address"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
