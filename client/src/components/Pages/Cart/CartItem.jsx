import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { removeFromCart, updateQuantity } from "../../../redux/slices/cartSlice";

import cartStyles from "./Cart.module.css";
import itemStyles from "./CartItem.module.css";

export default function CartItem({ productId, product, quantity, lineTotal, size }) {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  if (!product) return null;

  const { name, image, price, stock } = product;
  const safeSize = size ?? "";

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      dispatch(removeFromCart({ productId, size: safeSize }));
    }, 300);
  };

  const handleQuantityChange = (newQuantity) => {
    const capped = Math.max(1, Math.min(Number(newQuantity), Number(stock ?? 0)));
    dispatch(updateQuantity({ productId, quantity: capped, size: safeSize }));
  };

  return (
    <li className={`${cartStyles.cartItem} ${isRemoving ? itemStyles.removing : ""}`}>
      <img
        src={image}
        alt={name}
        className={cartStyles.productImage}
        onError={(e) => {
          e.currentTarget.src = "/images/placeholder-product.jpg";
        }}
      />

      <div className={cartStyles.itemDetails}>
        <h3 className={cartStyles.productName}>{name}</h3>
        <p className={cartStyles.productPrice}>${Number(price ?? 0).toFixed(2)}</p>

        {!!safeSize && <p className={cartStyles.productSize}>Size: {safeSize}</p>}

        <div className={cartStyles.quantityControls}>
          <button
            className={cartStyles.quantityButton}
            onClick={() => handleQuantityChange(quantity - 1)}
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className={cartStyles.quantity}>{quantity}</span>

          <button
            className={cartStyles.quantityButton}
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={quantity >= Number(stock ?? 0)}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <div className={cartStyles.itemActions}>
        <p className={cartStyles.lineTotal}>${Number(lineTotal ?? 0).toFixed(2)}</p>
        <button onClick={handleRemove} className={cartStyles.removeButton} aria-label={`Remove ${name}`}>
          ×
        </button>
      </div>
    </li>
  );
}
