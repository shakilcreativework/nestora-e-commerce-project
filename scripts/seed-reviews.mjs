import { Pool } from "pg";

const conn = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nestora_db";
const isRemote = conn.includes("render.com") || conn.includes("neon.tech") || conn.includes("sslmode=require");

const pool = new Pool({
  connectionString: conn,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function seedReviews() {
  const client = await pool.connect();
  try {
    const productsRes = await client.query("SELECT id, name FROM products LIMIT 3");
    const usersRes = await client.query("SELECT id, name FROM users LIMIT 2");

    if (productsRes.rows.length === 0 || usersRes.rows.length === 0) {
      console.log("No products or users found to seed reviews.");
      return;
    }

    const p1 = productsRes.rows[0];
    const p2 = productsRes.rows[1] || p1;
    const u1 = usersRes.rows[0];
    const u2 = usersRes.rows[1] || u1;

    const existing = await client.query("SELECT id FROM reviews LIMIT 1");
    if (existing.rows.length === 0) {
      await client.query(`
        INSERT INTO reviews (product_id, user_id, rating, title, comment, is_verified_purchase, status)
        VALUES 
          ($1, $2, 5, 'Exceptional Craftsmanship', 'The wood grain and tactile feel of this object are genuinely breathtaking. It anchors my study with quiet dignity.', true, 'APPROVED'),
          ($1, $3, 5, 'Museum Quality in Daily Life', 'Substantial weight, organic contours, and impeccable finish. Surpassed all expectations.', true, 'APPROVED'),
          ($4, $2, 4, 'Refined and Calming', 'Delightful minimalist silhouette. The ceramic glaze catches the morning light beautifully.', true, 'APPROVED'),
          ($4, $3, 5, 'Arrived in pristine packaging', 'Tracked courier delivery was fast and the eco-packaging felt like opening a thoughtful gift.', true, 'PENDING');
      `, [p1.id, u1.id, u2.id, p2.id]);
      console.log("Seed reviews inserted successfully!");
    } else {
      console.log("Reviews already seeded.");
    }
  } finally {
    client.release();
    await pool.end();
  }
}

seedReviews().catch(console.error);
