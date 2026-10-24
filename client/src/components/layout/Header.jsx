import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Boxes, Sun, Moon, LogIn, LogOut, UserCheck, Menu, X } from 'lucide-react';
import useThemeClasses from '../../hooks/useThemeClasses.js';
import useAppActions from '../../hooks/useAppActions.js';
import { toggleTheme, setShowLoginModal, setMobileMenuOpen } from '../../store/slices/uiSlice.js';
import { NAV_ITEMS } from '../../utils/constants.js';

export default function Header() {
  const dispatch = useDispatch();
  const { theme, borderClass, cardBgClass, subTextClass } = useThemeClasses();
  const { currentPage, mobileMenuOpen } = useSelector((s) => s.ui);
  const { currentUser, isAuthenticated } = useSelector((s) => s.auth);
  const { goTo, handleLoginSubmit, handleLogout } = useAppActions();

  const activeNavClass = theme === 'dark' ? 'bg-slate-800 text-cyan-400' : 'bg-slate-200 text-slate-900';

  return (
    <header className={`sticky top-0 z-40 backdrop-blur-md border-b ${borderClass} ${theme === 'dark' ? 'bg-slate-950/90' : 'bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => goTo('landing')}>
            <div className="p-2 bg-cyan-600 rounded-lg text-white font-bold shadow-md shadow-cyan-500/20">
              <Boxes className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">
                  StockPilot
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider ${theme === 'dark' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-900 border border-emerald-400'}`}>
                  Enterprise
                </span>
              </div>
              <div className="flex items-center space-x-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className={`text-xs font-semibold ${subTextClass}`}>Multi-Warehouse Active</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => goTo(item.key)}
                className={`px-3 py-1.5 text-sm font-bold rounded-md transition ${currentPage === item.key ? activeNavClass : subTextClass}`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* User Profile & Theme Toggle */}
          <div className="hidden lg:flex items-center space-x-3">
            {isAuthenticated && currentUser && (
              <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg border text-xs font-semibold ${cardBgClass}`}>
                <UserCheck className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
                <select
                  value={currentUser.role.toLowerCase().includes('admin') ? 'admin' : currentUser.role.toLowerCase().includes('manager') ? 'manager' : 'viewer'}
                  onChange={(e) => handleLoginSubmit(e.target.value)}
                  className={`bg-transparent focus:outline-none cursor-pointer ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}
                >
                  <option value="admin" className={theme === 'dark' ? 'bg-slate-900' : ''}>Admin (John)</option>
                  <option value="manager" className={theme === 'dark' ? 'bg-slate-900' : ''}>Manager (Sarah)</option>
                  <option value="viewer" className={theme === 'dark' ? 'bg-slate-900' : ''}>Viewer (Alex)</option>
                </select>
              </div>
            )}

            <button
              onClick={() => dispatch(toggleTheme())}
              className={`p-2 rounded-lg border ${borderClass} hover:bg-slate-200 dark:hover:bg-slate-800 transition`}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-700" />}
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600/10 hover:bg-rose-600 text-rose-700 dark:text-rose-400 hover:text-white border border-rose-300 dark:border-rose-500/30 transition"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => dispatch(setShowLoginModal(true))}
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold rounded-lg bg-cyan-600 text-white hover:bg-cyan-700 transition shadow"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="flex md:hidden items-center space-x-2">
            <button onClick={() => dispatch(toggleTheme())} className={`p-2 rounded-lg border ${borderClass}`}>
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-700" />}
            </button>
            <button onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))} className={`p-2 rounded-lg border ${borderClass}`}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className={`md:hidden border-b ${borderClass} ${cardBgClass} px-4 pt-2 pb-4 space-y-2`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => { goTo(item.key); dispatch(setMobileMenuOpen(false)); }}
              className="block w-full text-left py-2 px-3 rounded font-bold hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-300 dark:border-slate-700 flex justify-between items-center">
            {isAuthenticated ? (
              <button onClick={handleLogout} className="text-rose-600 font-bold text-sm">Sign Out</button>
            ) : (
              <button onClick={() => { dispatch(setShowLoginModal(true)); dispatch(setMobileMenuOpen(false)); }} className="text-cyan-700 font-bold text-sm">Sign In</button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
