import React from 'react';
import { Boxes } from 'lucide-react';
import useThemeClasses from '../../hooks/useThemeClasses.js';
import useAppActions from '../../hooks/useAppActions.js';
import { NAV_ITEMS } from '../../utils/constants.js';

export default function Footer() {
  const { theme, borderClass, subTextClass } = useThemeClasses();
  const { goTo } = useAppActions();

  return (
    <footer className={`border-t ${borderClass} py-8 mt-16 ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <Boxes className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              <span className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>StockPilot</span>
            </div>
            <p className={`text-xs font-semibold ${subTextClass}`}>
              Enterprise Inventory Control Engine
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold">
            {NAV_ITEMS.map((item) => (
              <button key={item.key} onClick={() => goTo(item.key)} className={`hover:text-cyan-700 transition ${subTextClass}`}>
                {item.label}
              </button>
            ))}
          </div>

        </div>

        <div className={`pt-4 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-300'} text-center text-xs font-semibold ${subTextClass}`}>
          © {new Date().getFullYear()} StockPilot Systems Inc. All rights reserved. Secure Multi-Warehouse Platform.
        </div>
      </div>
    </footer>
  );
}
