// server/models/index.js
const sequelize = require("../db");

const Product = require("./Product");
const Order = require("./Order");
const OrderItem = require("./OrderItem");

// Order ↔ OrderItem
Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, {
  foreignKey: "orderId",
  as: "order",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Product ↔ OrderItem
Product.hasMany(OrderItem, { foreignKey: "productId", as: "orderItems" });
OrderItem.belongsTo(Product, {
  foreignKey: "productId",
  as: "product",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

module.exports = { sequelize, Product, Order, OrderItem };
