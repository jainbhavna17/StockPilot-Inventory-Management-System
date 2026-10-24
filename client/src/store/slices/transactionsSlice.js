import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http, { errorMessage } from '../../api/http.js';
import { saveProduct } from './productsSlice.js';

export const fetchTransactions = createAsyncThunk('transactions/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await http.get('/transactions');
    return data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    clearTransactions: (state) => {
      state.items = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Saving a SKU also writes a ledger entry on the server; show it immediately
      .addCase(saveProduct.fulfilled, (state, action) => {
        if (action.payload.transaction) state.items = [action.payload.transaction, ...state.items];
      });
  },
});

export const { clearTransactions } = transactionsSlice.actions;
export default transactionsSlice.reducer;
