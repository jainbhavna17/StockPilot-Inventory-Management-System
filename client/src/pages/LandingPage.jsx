import React from 'react';
import { useSelector } from 'react-redux';
import { ArrowRight, UserCheck, Zap, ShieldCheck, Package, History, FileText } from 'lucide-react';
import useThemeClasses from '../hooks/useThemeClasses.js';
import useAppActions from '../hooks/useAppActions.js';
import { selectMetrics } from '../store/slices/productsSlice.js';

export default function LandingPage() {
  const { theme, borderClass, cardBgClass, subTextClass } = useThemeClasses();
  const metrics = useSelector(selectMetrics);
  const { goTo, handleLoginSubmit } = useAppActions();

  return (
    <div className="space-y-16 py-4">

      {/* HERO SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-bold ${
            theme === 'dark' ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400' : 'bg-cyan-100 border border-cyan-300 text-cyan-900'
          }`}>
            <Zap className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
            <span>Real-World Inventory Architecture</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Eliminate Capital Lockup & <br />
            <span className="text-cyan-600 dark:text-cyan-400">
              Stock Discrepancies
            </span>
          </h1>

          <p className={`text-lg font-medium leading-relaxed ${subTextClass}`}>
            StockPilot delivers enterprise inventory control across US and EU warehouse nodes. Featuring zero-latency stock tracking, immutable transactional movement ledgers, and role-based protection.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-2">
            <button
              onClick={() => goTo('dashboard')}
              className="flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-cyan-600 text-white font-bold hover:bg-cyan-700 transition shadow-lg shadow-cyan-600/20"
            >
              <span>Open Inventory Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleLoginSubmit('admin')}
              className={`flex items-center space-x-2 px-6 py-3.5 rounded-xl border ${borderClass} ${cardBgClass} ${theme === 'dark' ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-900 hover:bg-slate-100'} font-bold transition`}
            >
              <UserCheck className="w-4 h-4 text-cyan-700 dark:text-cyan-400" />
              <span>Launch Admin Sandbox</span>
            </button>
          </div>

          {/* Key Metrics Quick Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <div className={`p-3 rounded-lg border ${borderClass} ${cardBgClass}`}>
              <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{metrics.totalSKUs}</div>
              <div className={`text-xs font-semibold ${subTextClass}`}>Tracked SKUs</div>
            </div>
            <div className={`p-3 rounded-lg border ${borderClass} ${cardBgClass}`}>
              <div className="text-2xl font-black font-mono text-emerald-700 dark:text-emerald-400">99.98%</div>
              <div className={`text-xs font-semibold ${subTextClass}`}>Stock Precision</div>
            </div>
            <div className={`p-3 rounded-lg border ${borderClass} ${cardBgClass}`}>
              <div className="text-2xl font-black font-mono text-cyan-700 dark:text-cyan-400">1.4k+</div>
              <div className={`text-xs font-semibold ${subTextClass}`}>Ledger Entries</div>
            </div>
            <div className={`p-3 rounded-lg border ${borderClass} ${cardBgClass}`}>
              <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">3</div>
              <div className={`text-xs font-semibold ${subTextClass}`}>Logistics Nodes</div>
            </div>
          </div>

        </div>

        {/* Dynamic Live Ledger Card */}
        <div className="lg:col-span-5">
          <div className={`p-6 rounded-2xl border ${borderClass} ${cardBgClass} shadow-xl relative overflow-hidden`}>
            <div className={`flex justify-between items-center pb-4 mb-4 border-b ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                <span className={`text-xs font-mono font-bold ${subTextClass} ml-2`}>Active Item Status</span>
              </div>
              <span className="text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-100 dark:bg-cyan-500/10 px-2 py-0.5 rounded font-bold">LIVE LEDGER</span>
            </div>

            <div className="space-y-4">
              <div className={`text-xs font-bold uppercase tracking-wider ${subTextClass}`}>Featured Asset Inventory</div>
              <div className={`p-4 rounded-xl border space-y-3 ${
                theme === 'dark' ? 'bg-slate-900/80 border-slate-700' : 'bg-slate-50 border-slate-300'
              }`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className={`font-bold text-lg ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>MacBook Pro 16" M3 Max</div>
                    <div className={`text-xs font-mono font-semibold ${subTextClass}`}>SKU-1001 • Electronics</div>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-900 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/20">
                    42 in stock
                  </span>
                </div>
                <div className={`grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                  <div><span className={subTextClass}>Valuation:</span> <span className={`font-bold ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}`}>$146,958.00</span></div>
                  <div><span className={subTextClass}>Warehouse:</span> <span className="text-cyan-700 dark:text-cyan-400 font-bold">US-East-1</span></div>
                </div>
              </div>

              <div className={`p-3 rounded-lg border flex items-center space-x-3 text-xs font-semibold ${
                theme === 'dark' ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-900'
              }`}>
                <ShieldCheck className="w-5 h-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>Role-Based Access Policy & RBAC Guard Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PROBLEM SOLVED CAPABILITIES GRID */}
      <div className="pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className={`text-3xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Engineered for Operational Bottlenecks</h2>
          <p className={`mt-2 font-medium ${subTextClass}`}>Addressing stock shrinkage, audit ambiguities, capital lockup, and dispatch errors.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl border ${borderClass} ${cardBgClass} space-y-3`}>
            <div className="p-3 bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 rounded-lg w-fit">
              <Package className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Automated Reorder Thresholds</h3>
            <p className={`text-sm font-medium ${subTextClass}`}>Prevents stockout scenarios by dynamic minimum threshold tracking (`minStock`) and high-visibility status tags.</p>
          </div>

          <div className={`p-6 rounded-xl border ${borderClass} ${cardBgClass} space-y-3`}>
            <div className="p-3 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-lg w-fit">
              <History className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Immutable Stock Ledger</h3>
            <p className={`text-sm font-medium ${subTextClass}`}>Eliminates inventory shrinkage by ensuring every unit adjustment creates an unalterable transaction record.</p>
          </div>

          <div className={`p-6 rounded-xl border ${borderClass} ${cardBgClass} space-y-3`}>
            <div className="p-3 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-lg w-fit">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>One-Click CSV Exporting</h3>
            <p className={`text-sm font-medium ${subTextClass}`}>Instantly download sanitized CSV files for accounting teams, 3PL partners, and external audit compliance.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
