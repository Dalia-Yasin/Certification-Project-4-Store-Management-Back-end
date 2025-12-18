import { createSlice } from '@reduxjs/toolkit';

export const PAGES = {
  HOME:  'home',
  SHOP:  'shop',
  ABOUT: 'about',
  CART:  'cart',
  CONFIRMATION: 'confirmation'    //
};

const initialState = PAGES.HOME;

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: {
      reducer: (state, action) =>
        Object.values(PAGES).includes(action.payload)
          ? action.payload
          : state,
      prepare: (page) => ({
        payload: Object.values(PAGES).includes(page) ? page : PAGES.HOME,
        meta: { timestamp: Date.now() }
      })
    }
  }
});

export const { setPage } = pageSlice.actions;

// ← Add this selector export:
export const selectCurrentPage = (state) => state.page;

export default pageSlice.reducer;
