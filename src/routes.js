import express from "express";
import { pool } from "./db.js";
import { redis } from "./redis.js";

const router = express.Router();

// 1. Get total users
router.get("/count", async (req, res) => {
  try {
    res.set("Cache-Control", "no-store");
    let count = await redis.get("user_count");
    if (!count) {
      const result = await pool.query("SELECT COUNT(*) FROM users");
      count = result.rows[0].count;
      await redis.set("user_count", count, "EX", 60);
    }
    res.json({ count: parseInt(count, 10) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 2. Check username
router.get("/check/:username", async (req, res) => {
  const { username } = req.params;
  try {
    const mightExist = await redis.call("BF.EXISTS", "usernames", username);

    if (mightExist === 0) {
      return res.json({ exists: false });
    }

    const result = await pool.query("SELECT 1 FROM users WHERE username=$1 LIMIT 1", [username]);
    res.json({ exists: result.rowCount > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 3. Create username
router.post("/", async (req, res) => {
  const { username } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (username) VALUES ($1) RETURNING id, username",
      [username]
    );

    await redis.call("BF.ADD", "usernames", username);
    await redis.incr("user_count");

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "Username already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
