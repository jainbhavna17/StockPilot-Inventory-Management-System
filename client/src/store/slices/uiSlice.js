import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  theme: 'light',
  currentPage: 'landing',
  showLoginModal: false,
  mobileMenuOpen: false,
  searchTerm: '',
  categoryFilter: 'All',
  stockFilter: 'All',
  productModal: { open: false, mode: 'add', item: null },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setShowLoginModal: (state, action) => {
      state.showLoginModal = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setCategoryFilter: (state, action) => {
      state.categoryFilter = action.payload;
    },
    setStockFilter: (state, action) => {
      state.stockFilter = action.payload;
    },
    openProductModal: (state, action) => {
      state.productModal = { open: true, mode: action.payload.mode, item: action.payload.item || null };
    },
    closeProductModal: (state) => {
      state.productModal = { open: false, mode: 'add', item: null };
    },
  },
});

export const {
  toggleTheme,
  setCurrentPage,
  setShowLoginModal,
  setMobileMenuOpen,
  setSearchTerm,
  setCategoryFilter,
  setStockFilter,
  openProductModal,
  closeProductModal,
} = uiSlice.actions;

export default uiSlice.reducer;
