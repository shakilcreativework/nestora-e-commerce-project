import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nestora_db",
});

async function seedAddresses() {
  const client = await pool.connect();
  try {
    const usersRes = await client.query("SELECT id, name, email FROM users LIMIT 2");
    if (usersRes.rows.length === 0) {
      console.log("No users found to seed addresses.");
      return;
    }

    const check = await client.query("SELECT id FROM addresses LIMIT 1");
    if (check.rows.length === 0) {
      for (const u of usersRes.rows) {
        await client.query(`
          INSERT INTO addresses (user_id, full_name, address_line1, address_line2, city, state_province, postal_code, country, phone, is_default)
          VALUES ($1, $2, '742 Evergreen Terrace', 'Apt 4B', 'Portland', 'Oregon', '97201', 'United States', '+1 (555) 019-2834', true),
                 ($1, $2, '120 Ocean View Blvd', NULL, 'San Francisco', 'California', '94102', 'United States', '+1 (555) 987-6543', false)
        `, [u.id, u.name]);
      }
      console.log("Seeded initial saved addresses successfully.");
    } else {
      console.log("Addresses already exist in database.");
    }
  } catch (err) {
    console.error("Error seeding addresses:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

seedAddresses();
