import React from 'react';
import { useSelector } from 'react-redux';
import useThemeClasses from '../hooks/useThemeClasses.js';
import { selectMetrics } from '../store/slices/productsSlice.js';
import { CATEGORIES, WAREHOUSES } from '../utils/constants.js';

export default function AnalyticsPage() {
  const { theme, borderClass, cardBgClass, subTextClass } = useThemeClasses();
  const products = useSelector((s) => s.products.items);
  const metrics = useSelector(selectMetrics);

  return (
    <div className="space-y-6">
      <div>
        <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
          Inventory Capital Analytics
        </h1>
        <p className={`text-sm font-medium ${subTextClass}`}>
          Financial asset distribution and logistics node breakdown.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Asset Valuation Breakdown */}
        <div className={`p-6 rounded-xl border ${borderClass} ${cardBgClass} space-y-4`}>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Asset Valuation by Category
          </h3>
          <div className="space-y-3 pt-2">
            {CATEGORIES.map((cat) => {
              const catItems = products.filter((p) => p.category === cat);
              const val = catItems.reduce((acc, curr) => acc + curr.stock * curr.unitPrice, 0);
              const pct = metrics.totalValue ? Math.round((val / metrics.totalValue) * 100) : 0;
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className={theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}>{cat}</span>
                    <span className="font-mono text-slate-900 dark:text-white">${val.toFixed(2)} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-cyan-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Warehouse Node Distribution */}
        <div className={`p-6 rounded-xl border ${borderClass} ${cardBgClass} space-y-4`}>
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Warehouse Node Stock Totals
          </h3>
          <div className="space-y-3 pt-2">
            {WAREHOUSES.map((wh) => {
              const whItems = products.filter((p) => p.warehouse === wh);
              const totalQty = whItems.reduce((acc, curr) => acc + curr.stock, 0);
              return (
                <div key={wh} className={`p-3 rounded-lg border ${borderClass} flex justify-between items-center`}>
                  <div>
                    <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{wh}</div>
                    <div className={`text-xs ${subTextClass}`}>{whItems.length} SKUs Assigned</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-cyan-700 dark:text-cyan-400">{totalQty} units</div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Operational Node</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
