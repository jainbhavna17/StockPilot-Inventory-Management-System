import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useThemeClasses from './hooks/useThemeClasses.js';
import { loadAllData } from './hooks/useAppActions.js';
import { fetchMe } from './store/slices/authSlice.js';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import ProductModal from './components/modals/ProductModal.jsx';
import LoginModal from './components/modals/LoginModal.jsx';

import LandingPage from './pages/LandingPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import TransactionsPage from './pages/TransactionsPage.jsx';
import AuditPage from './pages/AuditPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';

export default function App() {
  const dispatch = useDispatch();
  const { theme, bgClass } = useThemeClasses();
  const currentPage = useSelector((s) => s.ui.currentPage);
  const { sessionToken, bootstrapped } = useSelector((s) => s.auth);

  // Keep Tailwind's `dark:` variants in sync with the theme toggle
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  // Restore an existing JWT session on first load
  useEffect(() => {
    if (sessionToken && !bootstrapped) {
      dispatch(fetchMe()).then((res) => {
        if (fetchMe.fulfilled.match(res)) loadAllData(dispatch);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${bgClass}`}>
      <Header />

      {/* MAIN VIEWPORT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'landing' && <LandingPage />}
        {currentPage === 'dashboard' && <DashboardPage />}
        {currentPage === 'transactions' && <TransactionsPage />}
        {currentPage === 'audit' && <AuditPage />}
        {currentPage === 'analytics' && <AnalyticsPage />}
      </main>

      <ProductModal />
      <LoginModal />
      <Footer />
    </div>
  );
}
