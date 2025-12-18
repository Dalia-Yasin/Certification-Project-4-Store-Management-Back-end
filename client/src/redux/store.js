import { configureStore } from '@reduxjs/toolkit'
import pageReducer from './slices/pageSlice'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'
import filtersReducer from './slices/filtersSlice'

// Change to default export
export default configureStore({
  reducer: {
    page: pageReducer,
    products: productsReducer,
    cart: cartReducer,
    filters: filtersReducer,
  },
})