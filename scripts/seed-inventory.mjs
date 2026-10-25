import { Pool } from "pg";

const conn = process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nestora_db";
const isRemote = conn.includes("render.com") || conn.includes("neon.tech") || conn.includes("sslmode=require");

const pool = new Pool({
  connectionString: conn,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function seedInventoryAudit() {
  const client = await pool.connect();
  try {
    const variantsRes = await client.query("SELECT id, name, stock_quantity FROM product_variants LIMIT 5");
    if (variantsRes.rows.length === 0) {
      console.log("No product variants found.");
      return;
    }

    const logsCheck = await client.query("SELECT id FROM inventory_audit_logs LIMIT 1");
    if (logsCheck.rows.length === 0) {
      for (const variant of variantsRes.rows) {
        const prev = Math.max(0, variant.stock_quantity - 15);
        const diff = variant.stock_quantity - prev;
        await client.query(`
          INSERT INTO inventory_audit_logs (variant_id, previous_quantity, new_quantity, change_amount, reason, note, performed_by)
          VALUES ($1, $2, $3, $4, 'RESTOCK', 'Initial seasonal intake and warehouse stocking', 'Admin')
        `, [variant.id, prev, variant.stock_quantity, diff]);
      }
      console.log("Seeded initial inventory audit logs successfully.");
    } else {
      console.log("Inventory audit logs already exist.");
    }
  } catch (err) {
    console.error("Error seeding inventory logs:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedInventoryAudit();
