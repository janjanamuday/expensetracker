import { configureStore } from '@reduxjs/toolkit';
import transactionReducer from './slices/transactionSlice.js';

export const store = configureStore({
  reducer: {
    transactions: transactionReducer,
  },
});