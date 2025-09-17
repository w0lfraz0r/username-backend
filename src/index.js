import express from "express";
import routes from "./routes.js";
import cors from "cors";

const app = express();
app.use(express.json());

app.use(cors({
  origin: '*',
}));

// routes
app.use("/users", routes);

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
