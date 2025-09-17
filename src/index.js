import express from "express";
import { pool } from "./db.js";
import { redis } from "./redis.js";
import routes from "./routes.js";

const app = express();
app.use(express.json());

// routes
app.use("/users", routes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
