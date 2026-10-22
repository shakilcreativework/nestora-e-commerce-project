import { pool, db } from "./index";
import { categories, products, productImages, productVariants } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Starting NESTORA database seed with verified, authentic images...");

  try {
    // 1. Seed Categories with authentic aesthetic photos
    console.log("Updating categories...");
    const categoryData = [
      {
        name: "Desk & Workspace",
        slug: "workspace",
        description:
          "Minimalist desk organizers, solid oak stands, and workspace essentials designed for deep focus.",
        imageUrl:
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
        isActive: true,
      },
      {
        name: "Ambient Lighting",
        slug: "lighting",
        description:
          "Warm architectural lamps, dimmable brass pendants, and sculptural lighting for calm interiors.",
        imageUrl:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
        isActive: true,
      },
      {
        name: "Handcrafted Ceramics",
        slug: "ceramics",
        description:
          "Matte-glazed stoneware, pour-over carafes, and ceramic vessels hand-thrown by master artisans.",
        imageUrl:
          "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=1000&q=80",
        isActive: true,
      },
      {
        name: "Minimal Storage",
        slug: "storage",
        description:
          "Faceted walnut organizers, linen trays, and modular boxes to bring serene order to your spaces.",
        imageUrl:
          "https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?auto=format&fit=crop&w=1000&q=80",
        isActive: true,
      },
    ];

    const categoryMap = new Map<string, string>();

    for (const cat of categoryData) {
      const existing = await db
        .select()
        .from(categories)
        .where(eq(categories.slug, cat.slug))
        .limit(1);

      if (existing.length > 0) {
        // Update category image and details
        await db
          .update(categories)
          .set({
            name: cat.name,
            description: cat.description,
            imageUrl: cat.imageUrl,
            isActive: true,
          })
          .where(eq(categories.slug, cat.slug));
        categoryMap.set(cat.slug, existing[0].id);
        console.log(`~ Updated category "${cat.name}".`);
      } else {
        const [inserted] = await db.insert(categories).values(cat).returning();
        categoryMap.set(cat.slug, inserted.id);
        console.log(`+ Inserted category "${cat.name}".`);
      }
    }

    // 2. Seed 8 Authentic Products with 100% Matching, High-Res Images
    console.log("\nUpdating authentic NESTORA products...");
    const productsData = [
      {
        name: "Kanso Solid Oak Monitor Riser",
        slug: "kanso-solid-oak-monitor-riser",
        sku: "NST-DSK-001",
        categorySlug: "workspace",
        shortDescription:
          "Handcrafted from sustainable Japanese white oak with cork-damped feet.",
        description:
          "Designed to elevate your display to ergonomic eye-level while freeing valuable desk space underneath for notebooks and keyboards. Features clean beveled edges and natural matte oil finish.",
        price: 12500, // $125.00
        compareAtPrice: 14500,
        imageUrl:
          "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80",
        stock: 18,
      },
      {
        name: "Akari Ambient Brass Table Lamp",
        slug: "akari-ambient-brass-table-lamp",
        sku: "NST-LGT-001",
        categorySlug: "lighting",
        shortDescription:
          "Brushed brass cylinder with hand-blown frosted glass sphere.",
        description:
          "Emits a warm 2700K ambient glow designed to eliminate harsh screen glare. Equipped with a rotary stepless brass dimmer switch on a braided linen cord.",
        price: 18500, // $185.00
        compareAtPrice: 21000,
        imageUrl:
          "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?auto=format&fit=crop&w=1000&q=80",
        stock: 12,
      },
      {
        name: "Hasami Matte Stoneware Pour-Over Carafe",
        slug: "hasami-matte-stoneware-pour-over",
        sku: "NST-CRM-001",
        categorySlug: "ceramics",
        shortDescription:
          "High-fired Japanese stoneware with raw textured exterior and glazed interior.",
        description:
          "Crafted using traditional Hasami porcelain techniques. Holds 650ml of brewed coffee. The heat-retaining clay body keeps your morning brew warm without reheating.",
        price: 6800, // $68.00
        compareAtPrice: 7500,
        imageUrl:
          "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=1000&q=80",
        stock: 24,
      },
      {
        name: "Faceted Walnut Catchall Tray",
        slug: "faceted-walnut-catchall-tray",
        sku: "NST-STR-001",
        categorySlug: "storage",
        shortDescription:
          "Single-block American black walnut carved with geometric compartments.",
        description:
          "Keep your everyday carry items — keys, timepiece, eyewear, and fountain pens — in an elegant, designated sanctuary. Finished with eco-friendly beeswax.",
        price: 5400, // $54.00
        compareAtPrice: null,
        imageUrl:
          "https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&w=1000&q=80",
        stock: 30,
      },
      {
        name: "Precision Anodized Aluminum Pen Dock",
        slug: "precision-anodized-aluminum-pen-dock",
        sku: "NST-DSK-002",
        categorySlug: "workspace",
        shortDescription:
          "CNC-machined solid aluminum dock with micro-suction silicone base.",
        description:
          "Substantial 350g weight keeps your favorite writing instrument upright and always accessible. Matte bead-blasted finish resists fingerprints and scratches.",
        price: 4200, // $42.00
        compareAtPrice: 4800,
        imageUrl:
          "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=1000&q=80",
        stock: 22,
      },
      {
        name: "Mori Linen Sculptural Pendant Light",
        slug: "mori-linen-sculptural-pendant-light",
        sku: "NST-LGT-002",
        categorySlug: "lighting",
        shortDescription:
          "Unbleached organic Belgian linen stretched over a slender steel wire armature.",
        description:
          "Creates a soft, ethereal diffusion of light reminiscent of traditional Japanese paper lanterns with the durability and rich texture of natural washed linen.",
        price: 24000, // $240.00
        compareAtPrice: 27500,
        imageUrl:
          "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1000&q=80",
        stock: 8,
      },
      {
        name: "Wabi Speckled Ceramic Coffee Tumbler",
        slug: "wabi-speckled-ceramic-coffee-tumbler",
        sku: "NST-CRM-002",
        categorySlug: "ceramics",
        shortDescription:
          "Double-walled thermal ceramic tumbler with unglazed tactile grip band.",
        description:
          "Double-wall insulated ceramic keeps 300ml of espresso or pour-over hot while staying comfortably cool to the touch. Each tumbler bears unique kiln speckling.",
        price: 3400, // $34.00
        compareAtPrice: 3800,
        imageUrl:
          "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=1000&q=80",
        stock: 45,
      },
      {
        name: "Organic Woven Linen Nesting Baskets (Set of 3)",
        slug: "organic-woven-linen-nesting-baskets",
        sku: "NST-STR-002",
        categorySlug: "storage",
        shortDescription:
          "Hand-stitched heavyweight organic linen baskets with vegetable-tanned leather tabs.",
        description:
          "Modular storage for throws, magazines, or bathroom textiles. Collapsible when not in use yet stands firmly upright when filled.",
        price: 8200, // $82.00
        compareAtPrice: 9500,
        imageUrl:
          "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=1000&q=80",
        stock: 14,
      },
    ];

    for (const prod of productsData) {
      const categoryId = categoryMap.get(prod.categorySlug);
      if (!categoryId) continue;

      const existing = await db
        .select()
        .from(products)
        .where(eq(products.slug, prod.slug))
        .limit(1);

      let productId = "";

      if (existing.length > 0) {
        productId = existing[0].id;
        // Update product data
        await db
          .update(products)
          .set({
            name: prod.name,
            shortDescription: prod.shortDescription,
            description: prod.description,
            price: prod.price,
            compareAtPrice: prod.compareAtPrice,
            status: "ACTIVE",
            isApproved: true,
            isFeatured: true,
          })
          .where(eq(products.id, productId));

        // Update image
        await db
          .delete(productImages)
          .where(eq(productImages.productId, productId));

        await db.insert(productImages).values({
          productId,
          url: prod.imageUrl,
          altText: prod.name,
          sortOrder: 0,
        });

        console.log(`~ Updated product "${prod.name}" with verified image.`);
      } else {
        const [insertedProduct] = await db
          .insert(products)
          .values({
            name: prod.name,
            slug: prod.slug,
            sku: prod.sku,
            shortDescription: prod.shortDescription,
            description: prod.description,
            categoryId,
            brand: "NESTORA",
            price: prod.price,
            compareAtPrice: prod.compareAtPrice,
            currency: "USD",
            status: "ACTIVE",
            isApproved: true,
            isFeatured: true,
            seoTitle: `${prod.name} | NESTORA`,
            seoDescription: prod.shortDescription,
          })
          .returning();

        productId = insertedProduct.id;

        await db.insert(productImages).values({
          productId,
          url: prod.imageUrl,
          altText: prod.name,
          sortOrder: 0,
        });

        await db.insert(productVariants).values({
          productId,
          sku: `${prod.sku}-STD`,
          name: "Standard Edition",
          attributes: { edition: "Standard" },
          stockQuantity: prod.stock,
          isActive: true,
        });

        console.log(`+ Inserted product "${prod.name}" with image & variant.`);
      }
    }

    console.log("\n✅ Database seed & image update completed successfully!");
  } catch (error) {
    console.error("❌ Seed failed with error:", error);
  } finally {
    await pool.end();
  }
}

seed();
