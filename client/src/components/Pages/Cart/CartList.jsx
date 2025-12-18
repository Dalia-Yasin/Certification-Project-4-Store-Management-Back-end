import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCartItems } from "../../../redux/slices/cartSlice";
import { selectProducts } from "../../../redux/slices/productsSlice";
import CartItem from "./CartItem";
import styles from "./Cart.module.css";

export default function CartList() {
  const cartItems = useSelector(selectCartItems);
  const allProducts = useSelector(selectProducts);

  const enrichedItems = useMemo(() => {
    return cartItems
      .map(({ productId, quantity, size }) => {
        const product = allProducts.find((p) => p.id === productId);
        if (!product) return null;

        const unitPrice = Number(product.price ?? 0);
        const qty = Number(quantity ?? 0);

        return {
          productId,
          size: size ?? "",
          product,
          quantity: qty,
          lineTotal: unitPrice * qty,
        };
      })
      .filter(Boolean);
  }, [cartItems, allProducts]);

  if (cartItems.length === 0) return null;

  return (
    <ul className={styles.cartItemsList}>
      {enrichedItems.map(({ productId, product, quantity, lineTotal, size }) => (
        <CartItem
          key={`${productId}-${size || "nosize"}`}
          productId={productId}
          product={product}
          quantity={quantity}
          lineTotal={lineTotal}
          size={size}
        />
      ))}
    </ul>
  );
}
