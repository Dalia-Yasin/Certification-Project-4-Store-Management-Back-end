const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Op } = require("sequelize");


const sequelize = require("./db");
const Product = require("./models/Product");

const app = express();

// middleware
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send("API is running Try /health");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/products", async (req, res, next) => {
  try {
    const {
      search = "",
      category,
      sort = "name-asc",
      inStock,
    } = req.query;

    const where = {};

    // SEARCH (name OR description)
    if (search.trim()) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search.trim()}%` } },
        { description: { [Op.iLike]: `%${search.trim()}%` } },
      ];
    }

    // CATEGORY (ignore "all")
    if (category && category !== "all") {
      where.category = { [Op.iLike]: category }; // case-insensitive exact match
    }

    // IN STOCK FILTER
    if (inStock === "true") {
      where.stock = { [Op.gt]: 0 };
    }

    // SORT
    let order = [["name", "ASC"]];
    switch (sort) {
      case "name-desc":
        order = [["name", "DESC"]];
        break;
      case "price-asc":
        order = [["price", "ASC"]];
        break;
      case "price-desc":
        order = [["price", "DESC"]];
        break;
      case "stock-asc":
        order = [["stock", "ASC"]];
        break;
      case "stock-desc":
        order = [["stock", "DESC"]];
        break;
      case "name-asc":
      default:
        order = [["name", "ASC"]];
        break;
    }

    const products = await Product.findAll({ where, order });
    res.json(products);
  } catch (err) {
    next(err);
  }
});


// GET one product by id
app.get("/api/products/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    res.json(product);
  } catch (err) {
    next(err);
  }
});

// CREATE product
app.post("/api/products", async (req, res, next) => {
  try {
    const { name, category, price, stock, image, sizes, shoeSizes, description, isActive } = req.body;

    if (!name || !category || price === undefined) {
      return res.status(400).json({ error: "name, category, and price are required" });
    }

    const created = await Product.create({
      name,
      category,
      price, // ok as "19.99" or 19.99
      stock: stock ?? 0,
      image: image ?? null,
      sizes: sizes ?? null,
      shoeSizes: shoeSizes ?? null,
      description: description ?? null,
      isActive: isActive ?? true,
    });

    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// UPDATE product (partial update)
app.patch("/api/products/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: "Product not found" });

    // prevent changing id fields
    const { id: _id, createdAt, updatedAt, ...updates } = req.body;

    await product.update(updates);
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

    const deletedCount = await Product.destroy({ where: { id } });
    if (!deletedCount) return res.status(404).json({ error: "Product not found" });

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

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
  await sequelize.authenticate(); // connects to Postgres
  console.log("DB connected");

  await sequelize.sync(); // creates tables if they don't exist 
  console.log(" Tables synced");

  app.listen(PORT, () => { // starts listening to the port
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((e) => {
  console.error("Failed to start:", e);
  process.exit(1);
});
