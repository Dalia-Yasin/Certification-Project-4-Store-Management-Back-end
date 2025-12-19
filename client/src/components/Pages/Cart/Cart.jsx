import React from "react";
import { useSelector, useDispatch } from "react-redux";

import CartList from "./CartList";
import CartTotals from "./CartTotals";
import styles from "./Cart.module.css";

import {
  selectCartItemCount,
  selectCartItems,
  clearCart, // ✅ make sure your cartSlice exports this (or rename if yours is different)
} from "../../../redux/slices/cartSlice";

import { setPage, PAGES } from "../../../redux/slices/pageSlice";

import {
  createOrder,
  selectOrderLoading,
  selectOrderError,
  selectLastOrder,
} from "../../../redux/slices/ordersSlice";

import { fetchProducts } from "../../../redux/slices/productsSlice";

const EMPTY_CART_SVG = "/images/SVG/cart.png";

export default function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems) ?? [];
  const itemCount = useSelector(selectCartItemCount) ?? 0;

  const orderLoading = useSelector(selectOrderLoading);
  const orderError = useSelector(selectOrderError);
  const lastOrder = useSelector(selectLastOrder);

  const isEmpty = cartItems.length === 0;

  const containerClasses = [
    styles.cartContainer,
    isEmpty ? styles.emptyContainer : "",
  ].join(" ");

  const handleCheckout = async () => {
    // ✅ convert cart shape -> API expects: { items: [{ productId, quantity, size }] }
    const itemsForApi = cartItems.map((it) => ({
      productId: Number(it.productId ?? it.id ?? it.product?.id),
      quantity: Number(it.quantity ?? it.qty ?? 1),
      size: it.size ?? "",
    }));

    try {
      await dispatch(createOrder(itemsForApi)).unwrap();
      dispatch(clearCart());
      dispatch(fetchProducts()); // refresh stock from server
    } catch (e) {
      // error already stored in ordersSlice
      console.error(e);
    }
  };

  return (
    <section className={containerClasses}>
      <header className={styles.cartHeader}>
        <h1 className={styles.title}>Your Cart</h1>
        <p className={styles.itemCount}>
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </p>
      </header>

      {isEmpty ? (
        <div className={styles.emptyState}>
          <img src={EMPTY_CART_SVG} alt="" />
          <p className={styles.emptyMessage}>Your cart is empty.</p>

          <button
            type="button"
            className={styles.continueShopping}
            onClick={() => dispatch(setPage(PAGES.SHOP))}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className={styles.cartContent}>
          <div className={styles.cartListContainer}>
            <CartList />
          </div>

          <div className={styles.orderSummaryContainer}>
            <CartTotals />

            {/* ✅ Checkout status */}
            {orderError && (
              <p style={{ marginTop: 12, color: "crimson" }}>{orderError}</p>
            )}
            {lastOrder?.id && (
              <p style={{ marginTop: 12 }}>✅ Order #{lastOrder.id} created!</p>
            )}

            {/* ✅ Checkout button */}
            <button
              type="button"
              onClick={handleCheckout}
              disabled={orderLoading}
              style={{ marginTop: 12 }}
            >
              {orderLoading ? "Processing..." : "Place Order"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
