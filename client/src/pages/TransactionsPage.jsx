import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import useThemeClasses from '../hooks/useThemeClasses.js';
import { logClientAction } from '../store/slices/auditSlice.js';
import { exportToCSV } from '../utils/csv.js';

export default function TransactionsPage() {
  const dispatch = useDispatch();
  const { theme, borderClass, cardBgClass, subTextClass, tableHeaderClass } = useThemeClasses();
  const transactions = useSelector((s) => s.transactions.items);

  const handleExport = () => {
    if (exportToCSV(transactions, 'stock_transactions')) {
      dispatch(logClientAction({ action: 'CSV_EXPORT', details: 'Exported stock_transactions dataset' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Stock Movements Ledger
          </h1>
          <p className={`text-sm font-medium ${subTextClass}`}>
            Immutable transactional ledger of stock receipts, dispatches, and adjustments.
          </p>
        </div>

        <button
          onClick={handleExport}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border ${borderClass} ${cardBgClass} text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition`}
        >
          <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      <div className={`rounded-xl border ${borderClass} overflow-hidden shadow-sm ${cardBgClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`border-b ${tableHeaderClass}`}>
              <tr>
                <th className="py-3.5 px-4">Txn ID</th>
                <th className="py-3.5 px-4">Item Details</th>
                <th className="py-3.5 px-4">Movement Type</th>
                <th className="py-3.5 px-4">Quantity Change</th>
                <th className="py-3.5 px-4">Authorized Operator</th>
                <th className="py-3.5 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {transactions.map((t) => (
                <tr key={t.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3.5 px-4 font-mono font-bold text-xs text-cyan-700 dark:text-cyan-400">
                    {t.id}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-white">{t.name}</div>
                    <div className={`text-xs font-mono font-semibold ${subTextClass}`}>{t.sku}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      t.type === 'STOCK_IN'
                        ? 'bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800'
                        : t.type === 'STOCK_OUT'
                        ? 'bg-rose-100 text-rose-900 dark:bg-rose-950 dark:text-rose-400 border border-rose-300 dark:border-rose-800'
                        : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-400 border border-amber-300 dark:border-amber-800'
                    }`}>
                      {t.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {t.qty > 0 ? `+${t.qty}` : t.qty}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 dark:text-slate-200">{t.user}</div>
                    <div className={`text-xs ${subTextClass}`}>{t.role}</div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {t.timestamp}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
