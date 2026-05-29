// server/seed.js
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { sequelize, Product, Order, OrderItem } = require("./models");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected (seed)");

    // Ensure tables exist
    await sequelize.sync();

    // Load seed data
    const filePath = path.join(__dirname, "data", "products.seed.json");
    if (!fs.existsSync(filePath)) {
      throw new Error(`Seed file not found: ${filePath}`);
    }

    const items = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const cleaned = items.map(({ id, ...p }) => ({
      name: p.name,
      category: p.category,
      price: String(p.price),
      stock: p.stock ?? 0,
      image: p.image ? p.image.replace(/^\/public/, "") : null,
      sizes: p.sizes ?? null,
      shoeSizes: p.shoeSizes ?? null,
      description: p.description ?? null,
      isActive: p.isActive ?? true,
    }));

 
// ✅ Clear tables in one TRUNCATE (FK-safe in Postgres)
await sequelize.query(`
  TRUNCATE TABLE "order_items", "orders", "products"
  RESTART IDENTITY
  CASCADE;
`);



    // Re-insert products
    await Product.bulkCreate(cleaned, { validate: true });

    console.log(`✅ Seeded ${cleaned.length} products`);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
    console.log("✅ Done");
  }
}

seed();
