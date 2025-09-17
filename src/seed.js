import { pool } from "./db.js";
import { redis } from "./redis.js";

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL
    )
  `);

  console.log("Seeding users...");
  const batch = [];
  for (let i = 0; i < 10000; i++) {  // use 10k for demo (not 100k for free tier)
    batch.push(`('user_${i}')`);
  }
  await pool.query(`INSERT INTO users (username) VALUES ${batch.join(",")} ON CONFLICT DO NOTHING`);

  // create bloom filter
  await redis.call("BF.RESERVE", "usernames", "0.01", "1000000");

  // preload bloom filter
  const result = await pool.query("SELECT username FROM users");
  for (const row of result.rows) {
    await redis.call("BF.ADD", "usernames", row.username);
  }

  // set count
  const count = result.rows.length;
  await redis.set("user_count", count);

  console.log(`Seeded ${count} users`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
