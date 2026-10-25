import { Pool } from "pg";

const conn = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nestora_db";
const isRemote = conn.includes("render.com") || conn.includes("neon.tech") || conn.includes("sslmode=require") || (process.env.NODE_ENV === "production" && !conn.includes("localhost"));

const pool = new Pool({
  connectionString: conn,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function main() {
  console.log("🌱 Connecting to database...");
  const client = await pool.connect();

  try {
    // 1. Categories
    console.log("📁 Seeding categories...");
    const categories = [
      {
        name: "Desk & Workspace",
        slug: "workspace",
        description: "Minimalist desk organizers, solid oak stands, and workspace essentials designed for deep focus.",
        imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Ambient Lighting",
        slug: "lighting",
        description: "Warm architectural lamps, dimmable brass pendants, and sculptural lighting for calm interiors.",
        imageUrl: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Handcrafted Ceramics",
        slug: "ceramics",
        description: "Matte-glazed stoneware, pour-over carafes, and ceramic vessels hand-thrown by master artisans.",
        imageUrl: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Minimal Storage",
        slug: "storage",
        description: "Faceted walnut organizers, linen trays, and modular boxes to bring serene order to your spaces.",
        imageUrl: "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1000&q=80",
      },
    ];

    const categoryMap = new Map();
    for (const cat of categories) {
      const res = await client.query(
        `INSERT INTO categories (name, slug, description, image_url, is_active)
         VALUES ($1, $2, $3, $4, true)
         ON CONFLICT (slug) DO UPDATE SET name = $1, description = $3, image_url = $4
         RETURNING id`,
        [cat.name, cat.slug, cat.description, cat.imageUrl]
      );
      categoryMap.set(cat.slug, res.rows[0].id);
    }
    console.log("✓ Categories seeded.");

    // 2. Products
    console.log("📦 Seeding handcrafted products...");
    const products = [
      {
        name: "Kanso Solid Oak Monitor Riser",
        slug: "kanso-solid-oak-monitor-riser",
        sku: "NST-DSK-001",
        categorySlug: "workspace",
        shortDescription: "Handcrafted from sustainable Japanese white oak with cork-damped feet.",
        description: "Designed to elevate your display to ergonomic eye-level while freeing valuable desk space underneath for notebooks and keyboards. Features clean beveled edges and natural matte oil finish.",
        price: 12500,
        compareAtPrice: 14500,
        imageUrl: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
        stock: 18,
      },
      {
        name: "Akari Ambient Brass Table Lamp",
        slug: "akari-ambient-brass-table-lamp",
        sku: "NST-LGT-001",
        categorySlug: "lighting",
        shortDescription: "Brushed brass cylinder with hand-blown frosted glass sphere.",
        description: "Emits a warm 2700K ambient glow designed to eliminate harsh screen glare. Equipped with a rotary stepless brass dimmer switch on a braided linen cord.",
        price: 18500,
        compareAtPrice: 21000,
        imageUrl: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=1000&q=80",
        stock: 12,
      },
      {
        name: "Hasami Matte Stoneware Pour-Over Carafe",
        slug: "hasami-matte-stoneware-pour-over",
        sku: "NST-CRM-001",
        categorySlug: "ceramics",
        shortDescription: "High-fired Japanese stoneware with raw textured exterior and glazed interior.",
        description: "Crafted using traditional Hasami porcelain techniques. Holds 650ml of brewed coffee. The heat-retaining clay body keeps your morning brew warm without reheating.",
        price: 6800,
        compareAtPrice: 7500,
        imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
        stock: 24,
      },
      {
        name: "Faceted Walnut Catchall Tray",
        slug: "faceted-walnut-catchall-tray",
        sku: "NST-STR-001",
        categorySlug: "storage",
        shortDescription: "Single-block American black walnut carved with geometric compartments.",
        description: "Keep your everyday carry items — keys, timepiece, eyewear, and fountain pens — in an elegant, designated sanctuary. Finished with eco-friendly beeswax.",
        price: 5400,
        compareAtPrice: null,
        imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80",
        stock: 30,
      },
      {
        name: "Precision Anodized Aluminum Pen Dock",
        slug: "precision-anodized-aluminum-pen-dock",
        sku: "NST-DSK-002",
        categorySlug: "workspace",
        shortDescription: "CNC-machined solid aluminum dock with micro-suction silicone base.",
        description: "Substantial 350g weight keeps your favorite writing instrument upright and always accessible. Matte bead-blasted finish resists fingerprints and scratches.",
        price: 4200,
        compareAtPrice: 4800,
        imageUrl: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1000&q=80",
        stock: 22,
      },
      {
        name: "Mori Linen Sculptural Pendant Light",
        slug: "mori-linen-sculptural-pendant-light",
        sku: "NST-LGT-002",
        categorySlug: "lighting",
        shortDescription: "Unbleached organic Belgian linen stretched over a slender steel wire armature.",
        description: "Creates a soft, ethereal diffusion of light reminiscent of traditional Japanese paper lanterns with the durability and rich texture of natural washed linen.",
        price: 24000,
        compareAtPrice: 27500,
        imageUrl: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
        stock: 8,
      },
      {
        name: "Wabi Speckled Ceramic Coffee Tumbler",
        slug: "wabi-speckled-ceramic-coffee-tumbler",
        sku: "NST-CRM-002",
        categorySlug: "ceramics",
        shortDescription: "Double-walled thermal ceramic tumbler with unglazed tactile grip band.",
        description: "Double-wall insulated ceramic keeps 300ml of espresso or pour-over hot while staying comfortably cool to the touch. Each tumbler bears unique kiln speckling.",
        price: 3400,
        compareAtPrice: 3800,
        imageUrl: "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
        stock: 45,
      },
      {
        name: "Organic Woven Linen Nesting Baskets (Set of 3)",
        slug: "organic-woven-linen-nesting-baskets",
        sku: "NST-STR-002",
        categorySlug: "storage",
        shortDescription: "Hand-stitched heavyweight organic linen baskets with vegetable-tanned leather tabs.",
        description: "Modular storage for throws, magazines, or bathroom textiles. Collapsible when not in use yet stands firmly upright when filled.",
        price: 8200,
        compareAtPrice: 9500,
        imageUrl: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1000&q=80",
        stock: 14,
      },
    ];

    for (const p of products) {
      const catId = categoryMap.get(p.categorySlug);
      const prodRes = await client.query(
        `INSERT INTO products (name, slug, sku, description, short_description, category_id, price, compare_at_price, status, is_approved)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'ACTIVE', true)
         ON CONFLICT (slug) DO UPDATE SET name = $1, description = $4, price = $7, is_approved = true
         RETURNING id`,
        [p.name, p.slug, p.sku, p.description, p.shortDescription, catId, p.price, p.compareAtPrice]
      );
      const prodId = prodRes.rows[0].id;

      // Primary Image
      await client.query(
        `INSERT INTO product_images (product_id, url, alt_text, sort_order)
         VALUES ($1, $2, $3, 0)
         ON CONFLICT DO NOTHING`,
        [prodId, p.imageUrl, p.name]
      );

      // Default Variant
      await client.query(
        `INSERT INTO product_variants (product_id, name, sku, stock_quantity, is_active)
         VALUES ($1, 'Standard Edition', $2, $3, true)
         ON CONFLICT (sku) DO UPDATE SET stock_quantity = $3
         RETURNING id`,
        [prodId, p.sku, p.stock]
      );
    }
    console.log("✓ Products and variants seeded.");

    // 3. Coupons
    console.log("🎟️ Seeding promotional coupons...");
    await client.query(`
      INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active)
      VALUES 
        ('WELCOME10', '10% off your curated artisan collection', 'PERCENTAGE', 10, 0, 500, true),
        ('AUTUMN25', '$25 off seasonal artisan pieces on orders over $150', 'FIXED', 2500, 15000, 200, true),
        ('ARTISAN50', '$50 off luxury atelier orders over $300', 'FIXED', 5000, 30000, 100, true)
      ON CONFLICT (code) DO NOTHING
    `);
    console.log("✓ Coupons seeded.");

    console.log("\n🎉 ALL SEEDING COMPLETED SUCCESSFULLY!");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("❌ Seeding error:", err);
  process.exit(1);
});
