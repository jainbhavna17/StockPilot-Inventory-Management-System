import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice.js';
import uiReducer from './slices/uiSlice.js';
import productsReducer from './slices/productsSlice.js';
import transactionsReducer from './slices/transactionsSlice.js';
import auditReducer from './slices/auditSlice.js';

const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    products: productsReducer,
    transactions: transactionsReducer,
    audit: auditReducer,
  },
});

export default store;
