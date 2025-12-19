// server/routes/orders.js
const express = require("express");

module.exports = ({ sequelize, Product, Order, OrderItem }) => {
  const router = express.Router();

  // POST /api/orders
  router.post("/", async (req, res, next) => {
    const t = await sequelize.transaction();

    try {
      const items = Array.isArray(req.body.items) ? req.body.items : [];

      if (items.length === 0) {
        await t.rollback();
        return res.status(400).json({ error: "items[] is required" });
      }

      // validate payload shape
      for (const it of items) {
        const pid = Number(it.productId);
        const qty = Number(it.quantity);

        if (!Number.isInteger(pid) || !Number.isInteger(qty) || qty < 1) {
          await t.rollback();
          return res.status(400).json({
            error: "Each item must have integer productId and quantity >= 1",
          });
        }
      }

      const productIds = [...new Set(items.map((i) => Number(i.productId)))];

      // lock rows to avoid race conditions
      const products = await Product.findAll({
        where: { id: productIds },
        transaction: t,
        lock: t.LOCK.UPDATE,
      });

      if (products.length !== productIds.length) {
        await t.rollback();
        return res.status(400).json({ error: "One or more products not found" });
      }

      const byId = new Map(products.map((p) => [p.id, p]));

      const toCents = (val) => Math.round(Number(val) * 100);
      let totalCents = 0;

      // stock check + compute total
      for (const it of items) {
        const p = byId.get(Number(it.productId));
        const qty = Number(it.quantity);

        if ((p.stock ?? 0) < qty) {
          await t.rollback();
          return res.status(400).json({
            error: `Not enough stock for "${p.name}". Available: ${p.stock}, requested: ${qty}`,
          });
        }

        totalCents += toCents(p.price) * qty;
      }

      // create order
      const order = await Order.create(
        { status: "paid", total: (totalCents / 100).toFixed(2) },
        { transaction: t }
      );

      // create order items
      const orderItemsPayload = items.map((it) => {
        const p = byId.get(Number(it.productId));
        return {
          orderId: order.id,
          productId: p.id,
          quantity: Number(it.quantity),
          size: it.size ?? "",
          unitPrice: String(p.price), // store price at time of purchase
        };
      });

      await OrderItem.bulkCreate(orderItemsPayload, { transaction: t });

      // decrement stock
      for (const it of items) {
        const p = byId.get(Number(it.productId));
        await p.decrement("stock", { by: Number(it.quantity), transaction: t });
      }

      // fetch full order inside the transaction
      const fullOrder = await Order.findByPk(order.id, {
        transaction: t,
        include: [
          {
            model: OrderItem,
            as: "items",
            include: [{ model: Product, as: "product" }],
          },
        ],
      });

      await t.commit();
      return res.status(201).json(fullOrder);
    } catch (err) {
      if (!t.finished) await t.rollback();
      return next(err);
    }
  });

  return router;
};
