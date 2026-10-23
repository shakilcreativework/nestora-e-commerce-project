import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nestora_db",
});

async function seedCoupons() {
  const client = await pool.connect();
  try {
    const existing = await client.query("SELECT code FROM coupons WHERE code IN ('WELCOME10', 'AUTUMN25', 'ARTISAN50')");
    if (existing.rows.length === 0) {
      await client.query(`
        INSERT INTO coupons (code, description, discount_type, discount_value, min_order_amount, usage_limit, is_active)
        VALUES 
          ('WELCOME10', '10% off your curated artisan collection', 'PERCENTAGE', 10, 0, 500, true),
          ('AUTUMN25', '$25 off seasonal small-batch orders over $150', 'FIXED', 2500, 15000, 200, true),
          ('ARTISAN50', '$50 off premium masterwork orders over $300', 'FIXED', 5000, 30000, 100, true);
      `);
      console.log("Seed coupons inserted successfully!");
    } else {
      console.log("Seed coupons already exist:", existing.rows.map(r => r.code));
    }
  } finally {
    client.release();
    await pool.end();
  }
}

seedCoupons().catch(console.error);
