import React, { useState } from "react";
import { useDispatch } from "react-redux";

import { addToCart } from "../../../redux/slices/cartSlice";

import styles from "./ProductCard.module.css";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const { id, name, image, price, stock } = product;

  const [isAdding, setIsAdding] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");

  const handleAdd = () => {
    if (stock <= 0) return;

    if ((product.sizes || product.shoeSizes) && !selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }

    setIsAdding(true);

    dispatch(addToCart(id, 1, selectedSize)); // (keep your current signature for now)

    const button = document.getElementById(`add-to-cart-${id}`);
    if (button) {
      button.classList.add(styles.added);
      setTimeout(() => {
        button.classList.remove(styles.added);
      }, 500);
    }

    setIsAdding(false);
  };

  return (
    <div className={styles.card} aria-label={`Product: ${name}`}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt={name}
          className={styles.image}
          onError={(e) => {
            e.target.src = "/images/placeholder-product.jpg";
          }}
        />
        {stock <= 0 && <div className={styles.outOfStock}>Out of Stock</div>}
      </div>

      <div className={styles.details}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.price}>${Number(price).toFixed(2)}</p>
        {stock > 0 && (
          <p className={styles.stock}>
            {stock} {stock === 1 ? "unit" : "units"} available
          </p>
        )}
      </div>

      <div className={styles.actionsContainer}>
        {(product.sizes || product.shoeSizes) && (
          <div className={styles.sizeSelector}>
            <label htmlFor={`size-${id}`}>Select Size</label>
            <select
              id={`size-${id}`}
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className={styles.select}
            >
              <option value="">-- Choose a size --</option>
              {(product.sizes || product.shoeSizes).map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          id={`add-to-cart-${id}`}
          className={`${styles.button} ${isAdding ? styles.loading : ""}`}
          onClick={handleAdd}
          disabled={stock <= 0 || isAdding}
          aria-label={stock > 0 ? `Add ${name} to cart` : `${name} is out of stock`}
        >
          {isAdding ? (
            <span className={styles.spinner} aria-hidden="true" />
          ) : stock > 0 ? (
            "Add to Cart"
          ) : (
            "Sold Out"
          )}
        </button>

  
      </div>
    </div>
  );
}
