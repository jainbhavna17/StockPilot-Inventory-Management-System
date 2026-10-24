import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Edit2, Trash2, Search, Filter, Download } from 'lucide-react';
import useThemeClasses from '../hooks/useThemeClasses.js';
import {
  setSearchTerm,
  setCategoryFilter,
  setStockFilter,
  openProductModal,
} from '../store/slices/uiSlice.js';
import {
  deleteProduct,
  selectFilteredProducts,
  selectMetrics,
} from '../store/slices/productsSlice.js';
import { fetchAuditLogs, logClientAction } from '../store/slices/auditSlice.js';
import { exportToCSV } from '../utils/csv.js';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { theme, borderClass, cardBgClass, inputClass, subTextClass, tableHeaderClass } = useThemeClasses();
  const { searchTerm, categoryFilter, stockFilter } = useSelector((s) => s.ui);
  const { currentUser } = useSelector((s) => s.auth);
  const products = useSelector((s) => s.products.items);
  const filteredProducts = useSelector(selectFilteredProducts);
  const metrics = useSelector(selectMetrics);

  const handleExport = () => {
    if (exportToCSV(products, 'inventory_catalog')) {
      dispatch(logClientAction({ action: 'CSV_EXPORT', details: 'Exported inventory_catalog dataset' }));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!currentUser || !currentUser.perms.includes('DELETE')) {
      alert('Access Restriction: Your assigned role lacks permission to delete inventory items.');
      return;
    }
    const result = await dispatch(deleteProduct(id));
    if (deleteProduct.fulfilled.match(result)) {
      dispatch(fetchAuditLogs());
    } else {
      alert(result.payload || 'Unable to delete item');
    }
  };

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Inventory Catalog Management
          </h1>
          <p className={`text-sm font-medium ${subTextClass}`}>
            Real-time stock controls and multi-warehouse SKU records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExport}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border ${borderClass} ${cardBgClass} text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition`}
          >
            <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            <span>Export CSV</span>
          </button>

          {currentUser?.perms.includes('CREATE') && (
            <button
              onClick={() => dispatch(openProductModal({ mode: 'add', item: null }))}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-700 transition shadow"
            >
              <Plus className="w-4 h-4" />
              <span>Add SKU</span>
            </button>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${borderClass} ${cardBgClass} space-y-1`}>
          <div className={`text-xs font-bold ${subTextClass}`}>Total Active Valuation</div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">${metrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          <div className="text-xs text-emerald-700 dark:text-emerald-400 font-bold">Capital Assets</div>
        </div>

        <div className={`p-4 rounded-xl border ${borderClass} ${cardBgClass} space-y-1`}>
          <div className={`text-xs font-bold ${subTextClass}`}>Total Catalog SKUs</div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white">{metrics.totalSKUs}</div>
          <div className={`text-xs font-bold ${subTextClass}`}>3 Warehouse Nodes</div>
        </div>

        <div className={`p-4 rounded-xl border ${borderClass} ${cardBgClass} space-y-1`}>
          <div className={`text-xs font-bold ${subTextClass}`}>Stock Warning Alerts</div>
          <div className="text-2xl font-black font-mono text-amber-700 dark:text-amber-400">{metrics.lowStockCount} SKUs</div>
          <div className="text-xs text-amber-700 dark:text-amber-400 font-bold">Action Needed</div>
        </div>

        <div className={`p-4 rounded-xl border ${borderClass} ${cardBgClass} space-y-1`}>
          <div className={`text-xs font-bold ${subTextClass}`}>Logged Transactions</div>
          <div className="text-2xl font-black font-mono text-cyan-700 dark:text-cyan-400">{metrics.monthlyMovements}</div>
          <div className={`text-xs font-bold ${subTextClass}`}>Audit Trail Intact</div>
        </div>
      </div>

      {/* Filters */}
      <div className={`p-4 rounded-xl border ${borderClass} ${cardBgClass} flex flex-col md:flex-row gap-4 justify-between items-center`}>
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search SKU ID or product name..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm border focus:outline-none font-medium ${inputClass}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className={`text-xs font-bold ${subTextClass}`}>Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => dispatch(setCategoryFilter(e.target.value))}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none ${inputClass}`}
            >
              <option value="All">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Peripherals">Peripherals</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-bold ${subTextClass}`}>Status:</span>
            <select
              value={stockFilter}
              onChange={(e) => dispatch(setStockFilter(e.target.value))}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold focus:outline-none ${inputClass}`}
            >
              <option value="All">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className={`rounded-xl border ${borderClass} overflow-hidden shadow-sm ${cardBgClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`border-b ${tableHeaderClass}`}>
              <tr>
                <th className="py-3.5 px-4">SKU / Item</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Level</th>
                <th className="py-3.5 px-4">Unit Price</th>
                <th className="py-3.5 px-4">Warehouse Node</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-slate-500 font-medium">
                    No matching inventory items found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{p.name}</div>
                      <div className={`text-xs font-mono font-semibold ${subTextClass}`}>{p.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${theme === 'dark' ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-900'}`}>
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold">
                      <span className={p.stock <= p.minStock ? 'text-amber-700 dark:text-amber-400' : 'text-slate-900 dark:text-slate-100'}>
                        {p.stock}
                      </span>
                      <span className={`text-xs ${subTextClass} ml-1 font-sans`}>min: {p.minStock}</span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-slate-100">
                      ${p.unitPrice.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs font-bold text-cyan-700 dark:text-cyan-400">
                      {p.warehouse}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        p.status === 'In Stock'
                          ? (theme === 'dark' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-emerald-100 text-emerald-900 border border-emerald-300')
                          : p.status === 'Low Stock'
                          ? (theme === 'dark' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-amber-100 text-amber-900 border border-amber-300')
                          : (theme === 'dark' ? 'bg-rose-950 text-rose-400 border border-rose-800' : 'bg-rose-100 text-rose-900 border border-rose-300')
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {currentUser?.perms.includes('UPDATE') && (
                        <button
                          onClick={() => dispatch(openProductModal({ mode: 'edit', item: p }))}
                          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
                          title="Edit SKU"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
                      {currentUser?.perms.includes('DELETE') && (
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1.5 rounded hover:bg-rose-100 dark:hover:bg-rose-950 text-rose-600 dark:text-rose-400"
                          title="Delete SKU"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
