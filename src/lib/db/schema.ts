import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  pgEnum,
  jsonb,
} from "drizzle-orm/pg-core";

// Enums
export const userRoleEnum = pgEnum("user_role", ["CUSTOMER", "ADMIN"]);
export const productStatusEnum = pgEnum("product_status", ["DRAFT", "ACTIVE", "ARCHIVED"]);
export const orderStatusEnum = pgEnum("order_status", [
  "PENDING_PAYMENT",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "PAYMENT_FAILED",
  "EXPIRED",
]);
export const paymentStatusEnum = pgEnum("payment_status", ["UNPAID", "PAID", "FAILED", "REFUNDED"]);
export const reviewStatusEnum = pgEnum("review_status", ["PENDING", "APPROVED", "REJECTED"]);
export const discountTypeEnum = pgEnum("discount_type", ["PERCENTAGE", "FIXED"]);
export const inventoryAdjustmentReasonEnum = pgEnum("inventory_adjustment_reason", [
  "RESTOCK",
  "DAMAGED",
  "AUDIT_RECONCILIATION",
  "CUSTOMER_RETURN",
  "CORRECTION",
]);

// Users (Better Auth Compatible with Roles)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  role: userRoleEnum("role").default("CUSTOMER").notNull(),
  isBlocked: boolean("is_blocked").default(false).notNull(),
  phone: text("phone"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Sessions (Better Auth)
export const sessions = pgTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Accounts (Better Auth: Credentials / Passwords & OAuth)
export const accounts = pgTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Verifications (Better Auth: Tokens for verification & password reset)
export const verifications = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Aliases for Better Auth Drizzle Adapter
export const user = users;
export const session = sessions;
export const account = accounts;
export const verification = verifications;

// Categories
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Products (Admin Approval & Status Architecture)
export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  sku: text("sku").notNull().unique(),
  shortDescription: text("short_description").notNull(),
  description: text("description").notNull(),
  categoryId: uuid("category_id")
    .references(() => categories.id, { onDelete: "restrict" })
    .notNull(),
  brand: text("brand").default("NESTORA"),
  price: integer("price").notNull(), // Minor units (e.g., cents: $45.00 -> 4500)
  compareAtPrice: integer("compare_at_price"),
  currency: text("currency").default("USD").notNull(),
  status: productStatusEnum("status").default("DRAFT").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(), // Must be approved by Admin
  isFeatured: boolean("is_featured").default(false).notNull(),
  seoTitle: text("seo_title"),
  seoDescription: text("seo_description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Product Images
export const productImages = pgTable("product_images", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  altText: text("alt_text").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Product Variants (Stock single source of truth)
export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  sku: text("sku").notNull().unique(),
  name: text("name").notNull(), // e.g. "Solid Oak / Large"
  attributes: jsonb("attributes"), // e.g. { finish: "Walnut", size: "Standard" }
  priceOverride: integer("price_override"),
  stockQuantity: integer("stock_quantity").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Orders
export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderNumber: text("order_number").notNull().unique(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "restrict" })
    .notNull(),
  status: orderStatusEnum("status").default("PENDING_PAYMENT").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").default("UNPAID").notNull(),
  currency: text("currency").default("USD").notNull(),
  subtotal: integer("subtotal").notNull(),
  discountAmount: integer("discount_amount").default(0).notNull(),
  shippingAmount: integer("shipping_amount").default(0).notNull(),
  totalAmount: integer("total_amount").notNull(),
  shippingAddressSnapshot: jsonb("shipping_address_snapshot").notNull(),
  customerNote: text("customer_note"),
  couponCode: text("coupon_code"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  paidAt: timestamp("paid_at"),
});

// Order Items (Immutable Snapshots)
export const orderItems = pgTable("order_items", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id")
    .references(() => orders.id, { onDelete: "cascade" })
    .notNull(),
  productId: uuid("product_id").references(() => products.id, { onDelete: "set null" }),
  variantId: uuid("variant_id").references(() => productVariants.id, { onDelete: "set null" }),
  productNameSnapshot: text("product_name_snapshot").notNull(),
  skuSnapshot: text("sku_snapshot").notNull(),
  variantSnapshot: text("variant_snapshot"),
  unitPrice: integer("unit_price").notNull(),
  quantity: integer("quantity").notNull(),
  lineTotal: integer("line_total").notNull(),
});

// Coupons & Promotional Discounts
export const coupons = pgTable("coupons", {
  id: uuid("id").defaultRandom().primaryKey(),
  code: text("code").notNull().unique(), // e.g. "WELCOME10", "AUTUMN25"
  description: text("description"),
  discountType: discountTypeEnum("discount_type").default("PERCENTAGE").notNull(),
  discountValue: integer("discount_value").notNull(), // Percent (e.g. 15 for 15%) OR fixed cents (e.g. 2000 for $20.00)
  minOrderAmount: integer("min_order_amount").default(0).notNull(), // in cents (e.g. 5000 = $50 min spend)
  maxDiscountAmount: integer("max_discount_amount"), // optional cap in cents
  usageLimit: integer("usage_limit"), // null = unlimited
  usageCount: integer("usage_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Product Reviews & Ratings (NESTORA-066)
export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .references(() => products.id, { onDelete: "cascade" })
    .notNull(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  rating: integer("rating").notNull(), // 1 to 5
  title: text("title").notNull(),
  comment: text("comment").notNull(),
  isVerifiedPurchase: boolean("is_verified_purchase").default(false).notNull(),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Inventory Audit Logs (NESTORA-063)
export const inventoryAuditLogs = pgTable("inventory_audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  variantId: uuid("variant_id")
    .references(() => productVariants.id, { onDelete: "cascade" })
    .notNull(),
  previousQuantity: integer("previous_quantity").notNull(),
  newQuantity: integer("new_quantity").notNull(),
  changeAmount: integer("change_amount").notNull(),
  reason: inventoryAdjustmentReasonEnum("reason").notNull(),
  note: text("note"),
  performedBy: text("performed_by").default("Admin").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Customer Saved Addresses (NESTORA-044)
export const addresses = pgTable("addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  fullName: text("full_name").notNull(),
  addressLine1: text("address_line1").notNull(),
  addressLine2: text("address_line2"),
  city: text("city").notNull(),
  stateProvince: text("state_province").notNull(),
  postalCode: text("postal_code").notNull(),
  country: text("country").default("US").notNull(),
  phone: text("phone").notNull(),
  isDefault: boolean("is_default").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

