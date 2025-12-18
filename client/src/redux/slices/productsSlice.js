// src/redux/slices/productsSlice.js
import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit";


const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ search = "", category = "all", sort = "name-asc", inStock = "true" } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams();

      // only add params when useful
      if (search.trim()) params.set("search", search.trim());
      if (category && category !== "all") params.set("category", category);
      if (sort) params.set("sort", sort);
      if (inStock) params.set("inStock", inStock);

      const url = `${API_BASE}/api/products?${params.toString()}`;

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to load products");
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (payload, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, updates }, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(await res.text());
      return id; // return id so we can remove it from state
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message || "Failed to delete product");
    }
  }
);


// ...your slice (pending/fulfilled/rejected) stays the same


const initialState = {
  items: [],
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    // Optional: keep this ONLY if your UI still needs a local change immediately
    // (Eventually stock updates should come from the backend after purchase.)
    decrementStockLocal: (state, action) => {
      const { id, amount = 1 } = action.payload;
      const product = state.items.find((p) => p.id === id);
      if (product) {
        product.stock = Math.max((product.stock ?? 0) - amount, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.map((p) => ({
          ...p,
          price: Number(p.price ?? 0),
          stock: Number(p.stock ?? 0),
        }));
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  
      // CREATE
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        const created = {
          ...action.payload,
          price: Number(action.payload.price ?? 0),
          stock: Number(action.payload.stock ?? 0),
        };
        state.items.unshift(created);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  
      // UPDATE
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updated = {
          ...action.payload,
          price: Number(action.payload.price ?? 0),
          stock: Number(action.payload.stock ?? 0),
        };
        const idx = state.items.findIndex((p) => p.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
  
      // DELETE
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        state.items = state.items.filter((p) => p.id !== deletedId);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },

});

export const { decrementStockLocal } = productsSlice.actions;

export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.loading;
export const selectProductsError = (state) => state.products.error;

export const selectProductById = createSelector(
  [selectProducts, (_, id) => id],
  (products, id) => products.find((p) => p.id === id)
);

export const selectInStockProducts = createSelector([selectProducts], (products) =>
  products.filter((p) => Number(p.stock ?? 0) > 0)
);

export default productsSlice.reducer;

  