// server/models/Product.js
const { DataTypes } = require("sequelize");
const sequelize = require("../db");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: { type: DataTypes.STRING, allowNull: false },

    category: { type: DataTypes.STRING, allowNull: false },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: 0 },
    },

    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: { min: 0 },
    },

    image: { type: DataTypes.TEXT, field: "image_url" },

    // NEW: for clothing sizes + shoe sizes
    sizes: { type: DataTypes.JSONB, allowNull: true, defaultValue: null },
    shoeSizes: {
      type: DataTypes.JSONB,
      field: "shoe_sizes",
      allowNull: true,
      defaultValue: null,
    },

    description: { type: DataTypes.TEXT, allowNull: true },

    isActive: { type: DataTypes.BOOLEAN, field: "is_active", defaultValue: true },
  },
  {
    tableName: "products",
    underscored: true,
  }
);

module.exports = Product;
