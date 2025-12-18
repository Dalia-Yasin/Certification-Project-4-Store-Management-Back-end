import React from "react";
import { useSelector, useDispatch } from "react-redux";

import CartList from "./CartList";
import CartTotals from "./CartTotals";
import styles from "./Cart.module.css";

import { selectCartItemCount, selectCartItems } from "../../../redux/slices/cartSlice"; // ✅ add selectCartItems
import { setPage, PAGES } from "../../../redux/slices/pageSlice";

const EMPTY_CART_SVG = "/images/SVG/cart.png";

export default function Cart() {
  const dispatch = useDispatch();

  const cartItems = useSelector(selectCartItems) ?? [];          
  const itemCount = useSelector(selectCartItemCount) ?? 0;
  const isEmpty = cartItems.length === 0;                      

  const containerClasses = [
    styles.cartContainer,
    isEmpty ? styles.emptyContainer : "",
  ].join(" ");

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
          </div>
        </div>
      )}
    </section>
  );
}
