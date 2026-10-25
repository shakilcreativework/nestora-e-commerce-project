const { Pool } = require("pg");

const email = process.argv[2];

if (!email) {
  console.error("❌ Please provide the user email to promote to ADMIN.");
  console.log("Usage: node scripts/promote-admin.js user@example.com");
  process.exit(1);
}

const conn =
  process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nestora_db";
const isRemote = conn.includes("render.com") || conn.includes("neon.tech") || conn.includes("sslmode=require");

const pool = new Pool({
  connectionString: conn,
  ssl: isRemote ? { rejectUnauthorized: false } : undefined,
});

async function promote() {
  try {
    const res = await pool.query(
      "UPDATE users SET role = 'ADMIN' WHERE email = $1 RETURNING id, name, email, role",
      [email]
    );

    if (res.rowCount === 0) {
      console.log(`⚠️ No user found with email: ${email}`);
      console.log("👉 Please register an account first at http://localhost:3000/register");
    } else {
      console.log("🎉 User promoted to ADMIN successfully!");
      console.log(res.rows[0]);
    }
  } catch (error) {
    console.error("Error promoting user:", error.message);
  } finally {
    await pool.end();
  }
}

promote();
