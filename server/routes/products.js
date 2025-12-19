// server/routes/products.js
const express = require("express");
const { Op } = require("sequelize");
const requireAdmin = require("../middleware/requireAdmin");

module.exports = ({ Product }) => {
  const router = express.Router();

  // GET /api/products
  router.get("/", async (req, res, next) => {
    try {
      const { search = "", category, sort = "name-asc", inStock } = req.query;

      const where = {};

      if (search.trim()) {
        where[Op.or] = [
          { name: { [Op.iLike]: `%${search.trim()}%` } },
          { description: { [Op.iLike]: `%${search.trim()}%` } },
        ];
      }

      if (category && category !== "all") {
        where.category = { [Op.iLike]: category };
      }

      if (inStock === "true") {
        where.stock = { [Op.gt]: 0 };
      }

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
        default:
          order = [["name", "ASC"]];
      }

      const products = await Product.findAll({ where, order });
      res.json(products);
    } catch (err) {
      next(err);
    }
  });

  // GET /api/products/:id
  router.get("/:id", async (req, res, next) => {
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

  // POST /api/products (protected)
  router.post("/", requireAdmin, async (req, res, next) => {
    try {
      const { name, category, price, stock, image, sizes, shoeSizes, description, isActive } =
        req.body;

      if (!name || !category || price === undefined) {
        return res.status(400).json({ error: "name, category, and price are required" });
      }

      const created = await Product.create({
        name,
        category,
        price,
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

  // PATCH /api/products/:id (protected)
  router.patch("/:id", requireAdmin, async (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });

      const product = await Product.findByPk(id);
      if (!product) return res.status(404).json({ error: "Product not found" });

      const { id: _id, createdAt, updatedAt, ...updates } = req.body;
      await product.update(updates);

      res.json(product);
    } catch (err) {
      next(err);
    }
  });

  // DELETE /api/products/:id (protected)
  router.delete("/:id", requireAdmin, async (req, res, next) => {
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

  return router;
};
