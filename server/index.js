// server/index.js
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
console.log("ADMIN_KEY loaded?", !!process.env.ADMIN_KEY, "len:", process.env.ADMIN_KEY?.length);


const { sequelize, Product, Order, OrderItem } = require("./models");

// ✅ import modular routers
const productsRoutes = require("./routes/products");
const ordersRoutes = require("./routes/orders");

const requireAdmin = require("./middleware/requireAdmin");

const app = express();

// ✅ middleware
app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? undefined
      : { origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }
  )
);
app.use(express.json());

// ✅ basic routes
app.get("/", (req, res) => res.send("API is running. Try /health"));
app.get("/health", (req, res) => res.json({ ok: true }));

// ✅ mount routers
app.use("/api/products", productsRoutes({ Product }));
app.use("/api/orders", ordersRoutes({ sequelize, Product, Order, OrderItem }));

// ✅ Serve React build in production (BEFORE 404)
if (process.env.NODE_ENV === "production") {
  const clientDist = path.join(__dirname, "..", "client", "dist");

  app.use(express.static(clientDist));

  // SPA fallback (don’t hijack /api routes)
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 3001;

async function start() {
  await sequelize.authenticate();
  console.log("DB connected");

  await sequelize.sync();
  console.log("Tables synced");

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error("Failed to start:", e);
  process.exit(1);
});
