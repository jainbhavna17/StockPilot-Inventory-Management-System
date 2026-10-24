import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import http, { errorMessage } from '../../api/http.js';

export const fetchProducts = createAsyncThunk('products/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await http.get('/products');
    return data;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

// mode: 'add' | 'edit'. Returns { product, transaction }
export const saveProduct = createAsyncThunk(
  'products/save',
  async ({ mode, id, values }, { rejectWithValue }) => {
    try {
      const { data } =
        mode === 'add' ? await http.post('/products', values) : await http.put(`/products/${id}`, values);
      return { mode, ...data };
    } catch (err) {
      return rejectWithValue(errorMessage(err));
    }
  }
);

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await http.delete(`/products/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(errorMessage(err));
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [], status: 'idle', error: null },
  reducers: {
    clearProducts: (state) => {
      state.items = [];
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.items = action.payload;
        state.status = 'succeeded';
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(saveProduct.fulfilled, (state, action) => {
        const { mode, product } = action.payload;
        if (mode === 'add') state.items = [product, ...state.items];
        else state.items = state.items.map((p) => (p.id === product.id ? product : p));
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const { clearProducts } = productsSlice.actions;

// ---- Selectors (same logic as the original useMemo blocks) ----
const selectProducts = (state) => state.products.items;
const selectTransactions = (state) => state.transactions.items;

export const selectFilteredProducts = createSelector(
  [selectProducts, (s) => s.ui.searchTerm, (s) => s.ui.categoryFilter, (s) => s.ui.stockFilter],
  (products, searchTerm, categoryFilter, stockFilter) =>
    products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStock = stockFilter === 'All' || p.status === stockFilter;
      return matchesSearch && matchesCategory && matchesStock;
    })
);

export const selectMetrics = createSelector([selectProducts, selectTransactions], (products, transactions) => {
  const totalValue = products.reduce((acc, curr) => acc + curr.stock * curr.unitPrice, 0);
  const lowStockCount = products.filter((p) => p.status === 'Low Stock' || p.status === 'Out of Stock').length;
  return {
    totalValue,
    lowStockCount,
    totalSKUs: products.length,
    monthlyMovements: 1420 + transactions.length,
  };
});

export default productsSlice.reducer;
