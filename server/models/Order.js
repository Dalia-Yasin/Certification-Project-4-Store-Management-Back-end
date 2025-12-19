// server/models/Order.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    total: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "paid" },
  },
  { tableName: "orders", underscored: true }
);

module.exports = Order;
