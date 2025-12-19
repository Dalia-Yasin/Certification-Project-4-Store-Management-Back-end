// src/components/Pages/Confirmation/Confirmation.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Confirmation.module.css";

import { setPage, PAGES } from "../../../redux/slices/pageSlice";
import { selectLastOrder, clearLastOrder } from "../../../redux/slices/ordersSlice";

export default function Confirmation() {
  const dispatch = useDispatch();
  const order = useSelector(selectLastOrder);

  const handleBackHome = () => {
    dispatch(clearLastOrder()); // optional, but nice
    dispatch(setPage(PAGES.HOME));
  };

  // If user refreshes, Redux resets and order might be null
  if (!order?.id) {
    return (
      <main className={styles.container}>
        <h1 className={styles.title}>Order complete</h1>
        <p className={styles.message}>
          We couldn’t load your last order details (this can happen after a refresh).
        </p>
        <button className={styles.homeButton} onClick={handleBackHome}>
          Back to Home
        </button>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Thank you for your purchase!</h1>

      <p className={styles.message}>
        ✅ Order <strong>#{order.id}</strong> placed successfully.
      </p>

      <div className={styles.summaryBox}>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Total:</strong> ${Number(order.total ?? 0).toFixed(2)}
        </p>
      </div>

      <h2 className={styles.subTitle}>Items</h2>
      <ul className={styles.itemsList}>
        {(order.items ?? []).map((it, idx) => (
          <li
            key={it.id ?? `${it.productId}-${it.size ?? ""}-${idx}`}
            className={styles.itemRow}
          >
            <span>
              {it.product?.name ?? `Product #${it.productId}`}{" "}
              {it.size ? `(Size: ${it.size})` : ""}
            </span>
            <span>
              x{it.quantity} • ${Number(it.unitPrice ?? 0).toFixed(2)}
            </span>
          </li>
        ))}
      </ul>

      <button className={styles.homeButton} onClick={handleBackHome}>
        Back to Home
      </button>
    </main>
  );
}
