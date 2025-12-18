import { createSlice } from "@reduxjs/toolkit";

// state.cart is an array: [{ productId, quantity, size }]
const initialState = [];

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: {
      reducer: (state, action) => {
        const { productId, quantity, size } = action.payload;
        const pid = Number(productId);
        const qty = Number(quantity);
        const keySize = String(size ?? "");

        const existing = state.find(
          (item) => item.productId === pid && (item.size ?? "") === keySize
        );

        if (existing) {
          existing.quantity = Number(existing.quantity) + qty;
        } else {
          state.push({ productId: pid, quantity: qty, size: keySize });
        }
      },

      // keep call style: dispatch(addToCart(id, qty, size))
      prepare: (productId, quantity = 1, size = "") => ({
        payload: {
          productId: Number(productId),
          quantity: Number(quantity),
          size: String(size ?? ""),
        },
      }),
    },

    removeFromCart: (state, action) => {
      const { productId, size = "" } = action.payload;
      const pid = Number(productId);
      const keySize = String(size ?? "");

      return state.filter(
        (item) => !(item.productId === pid && (item.size ?? "") === keySize)
      );
    },

    updateQuantity: (state, action) => {
      const { productId, quantity, size = "" } = action.payload;
      const pid = Number(productId);
      const keySize = String(size ?? "");

      const item = state.find(
        (i) => i.productId === pid && (i.size ?? "") === keySize
      );

      if (item) {
        item.quantity = Math.max(1, Number(quantity));
      }
    },

    clearCart: () => [],
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart;

export const selectCartItemCount = (state) =>
  state.cart.reduce((total, item) => total + Number(item.quantity), 0);

export const selectCartTotal = (state) => {
  const products = state.products?.items ?? [];
  return state.cart.reduce((total, item) => {
    const product = products.find((p) => Number(p.id) === Number(item.productId));
    const price = Number(product?.price ?? 0); // important if price is "129.99"
    return total + price * Number(item.quantity);
  }, 0);
};

export default cartSlice.reducer;
