import { useDispatch, useSelector } from 'react-redux';
import { loginDemo, logoutUser } from '../store/slices/authSlice.js';
import { setCurrentPage, setShowLoginModal, setMobileMenuOpen } from '../store/slices/uiSlice.js';
import { fetchProducts, clearProducts } from '../store/slices/productsSlice.js';
import { fetchTransactions, clearTransactions } from '../store/slices/transactionsSlice.js';
import { fetchAuditLogs, clearAudit } from '../store/slices/auditSlice.js';

// Loads everything the console needs once a session exists
export const loadAllData = (dispatch) => {
  dispatch(fetchProducts());
  dispatch(fetchTransactions());
  dispatch(fetchAuditLogs());
};

export default function useAppActions() {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);

  // Navigate between pages; protected pages ask for sign-in first
  const goTo = (page) => {
    if (page !== 'landing' && !isAuthenticated) {
      dispatch(setShowLoginModal(true));
      dispatch(setMobileMenuOpen(false));
      return;
    }
    dispatch(setCurrentPage(page));
  };

  // handleLoginSubmit(userKey) from the original app
  const handleLoginSubmit = async (userKey) => {
    const result = await dispatch(loginDemo(userKey));
    if (loginDemo.fulfilled.match(result)) {
      dispatch(setShowLoginModal(false));
      loadAllData(dispatch);
      dispatch(setCurrentPage('dashboard'));
    } else {
      alert(result.payload || 'Login failed');
    }
  };

  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(clearProducts());
    dispatch(clearTransactions());
    dispatch(clearAudit());
    dispatch(setCurrentPage('landing'));
  };

  return { goTo, handleLoginSubmit, handleLogout };
}
