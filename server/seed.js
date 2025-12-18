// server/seed.js
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const sequelize = require("./db");
const Product = require("./models/Product");

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB connected (seed)");

    await sequelize.sync(); // dev: you can use { alter: true } if schema changes often

    const filePath = path.join(__dirname, "data", "products.seed.json");
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

    await Product.destroy({ where: {}, truncate: true, restartIdentity: true });
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
