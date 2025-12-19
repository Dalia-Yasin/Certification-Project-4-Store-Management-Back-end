import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API_BASE } from "../../apiBase";

// POST /api/orders
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (items, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      // try to read JSON error if possible
      if (!res.ok) {
        let message = `Checkout failed (${res.status})`;
        try {
          const data = await res.json();
          message = data?.error || message;
        } catch {
          // ignore JSON parse errors
        }
        throw new Error(message);
      }

      return await res.json(); // full order (with items + product)
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Checkout failed");
    }
  }
);

const initialState = {
  loading: false,
  error: null,
  lastOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearLastOrder: (state) => {
      state.lastOrder = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.lastOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearLastOrder } = ordersSlice.actions;

export const selectOrderLoading = (state) => state.orders.loading;
export const selectOrderError = (state) => state.orders.error;
export const selectLastOrder = (state) => state.orders.lastOrder;

export default ordersSlice.reducer;
