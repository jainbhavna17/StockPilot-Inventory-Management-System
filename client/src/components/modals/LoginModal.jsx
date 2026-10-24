import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, X } from 'lucide-react';
import useThemeClasses from '../../hooks/useThemeClasses.js';
import useAppActions from '../../hooks/useAppActions.js';
import { setShowLoginModal } from '../../store/slices/uiSlice.js';

export default function LoginModal() {
  const dispatch = useDispatch();
  const showLoginModal = useSelector((s) => s.ui.showLoginModal);
  const { theme, borderClass, cardBgClass, subTextClass } = useThemeClasses();
  const { handleLoginSubmit } = useAppActions();

  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-md p-6 rounded-2xl border ${borderClass} ${cardBgClass} shadow-2xl space-y-4`}>
        <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
            <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Sign In to StockPilot</h3>
          </div>
          <button onClick={() => dispatch(setShowLoginModal(false))} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className={`text-xs font-medium ${subTextClass}`}>Select a demo user role to simulate session authentication permissions:</p>

        <div className="space-y-2">
          <button
            onClick={() => handleLoginSubmit('admin')}
            className={`w-full p-3 rounded-xl border ${borderClass} flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left`}
          >
            <div>
              <div className="font-bold text-slate-900 dark:text-white">John Doe (Admin)</div>
              <div className={`text-xs ${subTextClass}`}>Full read, write, update, delete & audit access</div>
            </div>
            <span className="px-2 py-1 text-xs font-bold rounded bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300">Admin</span>
          </button>

          <button
            onClick={() => handleLoginSubmit('manager')}
            className={`w-full p-3 rounded-xl border ${borderClass} flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left`}
          >
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Sarah Connor (Manager)</div>
              <div className={`text-xs ${subTextClass}`}>Create, update, and manage inventory stock</div>
            </div>
            <span className="px-2 py-1 text-xs font-bold rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">Manager</span>
          </button>

          <button
            onClick={() => handleLoginSubmit('viewer')}
            className={`w-full p-3 rounded-xl border ${borderClass} flex items-center justify-between hover:bg-slate-100 dark:hover:bg-slate-800 transition text-left`}
          >
            <div>
              <div className="font-bold text-slate-900 dark:text-white">Alex Mercer (Viewer)</div>
              <div className={`text-xs ${subTextClass}`}>Read-only access to catalog and metrics</div>
            </div>
            <span className="px-2 py-1 text-xs font-bold rounded bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">Viewer</span>
          </button>
        </div>
      </div>
    </div>
  );
}
