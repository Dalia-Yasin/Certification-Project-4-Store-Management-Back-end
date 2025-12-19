// server/models/OrderItem.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const OrderItem = sequelize.define(
  "OrderItem",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },

    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "order_id",
    },

    productId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "product_id",
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1 },
    },

    size: { type: DataTypes.STRING, allowNull: true },

    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "unit_price",
      validate: { min: 0 },
    },
  },
  { tableName: "order_items", underscored: true }
);

module.exports = OrderItem;
