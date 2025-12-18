import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import { decrementStockLocal, selectProducts } from "../../../redux/slices/productsSlice";
import { clearCart, selectCartItems } from "../../../redux/slices/cartSlice";
import { setPage, PAGES } from "../../../redux/slices/pageSlice";

import styles from "../Cart/Cart.module.css";

const PROVINCES = [
  { id: "BC", label: "British Columbia" },
  { id: "AB", label: "Alberta" },
  { id: "ON", label: "Ontario" },
  { id: "NB", label: "New Brunswick" },
  { id: "NL", label: "Newfoundland & Labrador" },
  { id: "NS", label: "Nova Scotia" },
  { id: "PE", label: "Prince Edward Island" },
  { id: "MB", label: "Manitoba" },
  { id: "SK", label: "Saskatchewan" },
  { id: "QC", label: "Québec" },
];

const SHIPPING_OPTIONS = [
  { id: "standard", name: "Standard Shipping", price: 0 },
  { id: "express", name: "Express Shipping", price: 20.0 },
  { id: "priority", name: "Priority Shipping", price: 35.0 },
];

const calculateProvincialTax = (province, itemLineTotal, product) => {
  if (!product) return 0;

  const isClothingOrFootwear = ["clothing", "footwear"].includes(product.category);
  const isChildrenItem = !!product.isChildrenItem;
  const price = Number(product.price ?? 0);

  switch (province) {
    case "BC":
      return isClothingOrFootwear && !isChildrenItem && price >= 100 ? 0.07 * itemLineTotal : 0;
    case "MB":
      return isClothingOrFootwear && !isChildrenItem ? 0.07 * itemLineTotal : 0;
    case "SK":
      return isClothingOrFootwear && !isChildrenItem ? 0.06 * itemLineTotal : 0;
    case "QC":
      return isClothingOrFootwear && !isChildrenItem ? 0.09975 * itemLineTotal : 0;
    case "ON":
    case "NB":
    case "NL":
    case "NS":
    case "PE":
      return 0.15 * itemLineTotal;
    case "AB":
    default:
      return 0;
  }
};

export default function CartTotals() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems); // [{ productId, quantity, size }]
  const products = useSelector(selectProducts);

  const [errors, setErrors] = useState({
    shippingOption: "",
    shippingProvince: "",
  });

  const [shippingOption, setShippingOption] = useState("");
  const [shippingProvince, setShippingProvince] = useState("");

  const itemCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + Number(item.quantity ?? 0), 0),
    [cartItems]
  );

  const enrichedItems = useMemo(() => {
    return cartItems.map(({ productId, quantity, size }) => {
      const product = products.find((p) => p.id === productId);
      const price = Number(product?.price ?? 0);
      const qty = Number(quantity ?? 0);
  
      return {
        productId,
        size: size ?? "",
        product,
        quantity: qty,
        lineTotal: price * qty,
      };
    });
  }, [cartItems, products]);

  const subtotal = useMemo(() => {
    return enrichedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [enrichedItems]);

  const selectedShipping = SHIPPING_OPTIONS.find((opt) => opt.id === shippingOption);

  const { gstTotal, provincialTotal, totalTax } = useMemo(() => {
    if (!shippingProvince) return { gstTotal: 0, provincialTotal: 0, totalTax: 0 };

    return enrichedItems.reduce(
      (acc, { product, quantity }) => {
        if (!product) return acc;

        const itemLineTotal = Number(product.price ?? 0) * quantity;
        const gst = 0.05 * itemLineTotal;
        const provincialTax = calculateProvincialTax(
          shippingProvince,
          itemLineTotal,
          product
        );

        return {
          gstTotal: acc.gstTotal + gst,
          provincialTotal: acc.provincialTotal + provincialTax,
          totalTax: acc.totalTax + gst + provincialTax,
        };
      },
      { gstTotal: 0, provincialTotal: 0, totalTax: 0 }
    );
  }, [enrichedItems, shippingProvince]);

  const grandTotal = subtotal + (selectedShipping?.price || 0) + totalTax;

  const handlePurchase = () => {
    const newErrors = {
      shippingOption: !shippingOption ? "Please select a shipping option" : "",
      shippingProvince: !shippingProvince ? "Please select a province" : "",
    };
    setErrors(newErrors);

    if (!shippingOption || !shippingProvince) return;

    // Local stock decrement (optional UI feedback)
    cartItems.forEach(({ productId, quantity }) => {
      dispatch(decrementStockLocal({ id: productId, amount: quantity }));
    });
    

    dispatch(clearCart());
    dispatch(setPage(PAGES.CONFIRMATION));
  };

  if (cartItems.length === 0) return null;

  return (
    <div className={styles.totalsContainer}>
      <h2 className={styles.orderSummaryHeader}>Order Summary</h2>

      <div className={styles.orderSummaryRow}>
        <span>
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):
        </span>
        <span>${subtotal.toFixed(2)}</span>
      </div>

      <div className={styles.orderSummaryRow}>
        <span>Shipping:</span>
        <span>${selectedShipping ? selectedShipping.price.toFixed(2) : "0.00"}</span>
      </div>

      <div className={styles.shippingSection}>
        <label htmlFor="shippingOption">Delivery Option:</label>
        <select
          id="shippingOption"
          value={shippingOption}
          onChange={(e) => {
            setShippingOption(e.target.value);
            setErrors((prev) => ({ ...prev, shippingOption: "" }));
          }}
          className={
            errors.shippingOption
              ? `${styles.select} ${styles.selectError}`
              : styles.select
          }
          aria-invalid={!!errors.shippingOption}
          aria-describedby={errors.shippingOption ? "shippingOptionError" : undefined}
        >
          <option value="">Select Delivery Option</option>
          {SHIPPING_OPTIONS.map((opt) => (
            <option key={`shipping-${opt.id}`} value={opt.id}>
              {opt.name} – ${opt.price.toFixed(2)}
            </option>
          ))}
        </select>
        {errors.shippingOption && (
          <p id="shippingOptionError" className={styles.errorText}>
            {errors.shippingOption}
          </p>
        )}
      </div>

      <div className={styles.shippingSection}>
        <label htmlFor="shippingProvince">Shipping Province:</label>
        <select
          id="shippingProvince"
          value={shippingProvince}
          onChange={(e) => {
            setShippingProvince(e.target.value);
            setErrors((prev) => ({ ...prev, shippingProvince: "" }));
          }}
          className={
            errors.shippingProvince
              ? `${styles.select} ${styles.selectError}`
              : styles.select
          }
          aria-invalid={!!errors.shippingProvince}
          aria-describedby={errors.shippingProvince ? "provinceError" : undefined}
        >
          <option value="">Select Province</option>
          {PROVINCES.map((p) => (
            <option key={`province-${p.id}`} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
        {errors.shippingProvince && (
          <p id="provinceError" className={styles.errorText}>
            {errors.shippingProvince}
          </p>
        )}
      </div>

      <div className={styles.orderSummaryRow}>
        <span>GST (5%):</span>
        <span>${gstTotal.toFixed(2)}</span>
      </div>

      <div className={styles.orderSummaryRow}>
        <span>Provincial Tax:</span>
        <span>${provincialTotal.toFixed(2)}</span>
      </div>

      <div className={`${styles.orderSummaryRow} ${styles.grandTotal}`}>
        <span>Grand Total:</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>

      <button onClick={handlePurchase} className={styles.checkoutButton}>
        Complete Purchase
      </button>
    </div>
  );
}
