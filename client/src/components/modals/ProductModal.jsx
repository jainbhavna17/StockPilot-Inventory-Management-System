import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { X } from 'lucide-react';
import useThemeClasses from '../../hooks/useThemeClasses.js';
import { closeProductModal } from '../../store/slices/uiSlice.js';
import { saveProduct } from '../../store/slices/productsSlice.js';
import { fetchAuditLogs } from '../../store/slices/auditSlice.js';
import { CATEGORIES, WAREHOUSES } from '../../utils/constants.js';

export default function ProductModal() {
  const dispatch = useDispatch();
  const productModal = useSelector((s) => s.ui.productModal);
  const { theme, borderClass, cardBgClass, inputClass, subTextClass } = useThemeClasses();

  if (!productModal.open) return null;

  const close = () => dispatch(closeProductModal());

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const values = {
      name: formData.get('name'),
      category: formData.get('category'),
      stock: parseInt(formData.get('stock'), 10) || 0,
      minStock: parseInt(formData.get('minStock'), 10) || 0,
      unitPrice: parseFloat(formData.get('unitPrice')) || 0,
      warehouse: formData.get('warehouse'),
    };

    const result = await dispatch(
      saveProduct({ mode: productModal.mode, id: productModal.item?.id, values })
    );

    if (saveProduct.fulfilled.match(result)) {
      dispatch(fetchAuditLogs());
      close();
    } else {
      alert(result.payload || 'Unable to save item');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className={`w-full max-w-lg p-6 rounded-2xl border ${borderClass} ${cardBgClass} shadow-2xl`}>
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
          <h3 className={`text-lg font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {productModal.mode === 'add' ? 'Add New Product SKU' : `Edit SKU (${productModal.item?.id})`}
          </h3>
          <button onClick={close} className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
          <div>
            <label className={`block font-bold text-xs mb-1 ${subTextClass}`}>Product Name</label>
            <input
              type="text"
              name="name"
              defaultValue={productModal.item?.name || ''}
              required
              placeholder="e.g. Ergonomic Office Chair"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none font-medium ${inputClass}`}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={`block font-bold text-xs mb-1 ${subTextClass}`}>Category</label>
              <select
                name="category"
                defaultValue={productModal.item?.category || 'Electronics'}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none font-bold ${inputClass}`}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={`block font-bold text-xs mb-1 ${subTextClass}`}>Warehouse Location</label>
              <select
                name="warehouse"
                defaultValue={productModal.item?.warehouse || 'US-East-1'}
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none font-bold ${inputClass}`}
              >
                {WAREHOUSES.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={`block font-bold text-xs mb-1 ${subTextClass}`}>Current Stock</label>
              <input
                type="number"
                name="stock"
                min="0"
                defaultValue={productModal.item?.stock ?? 10}
                required
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none font-mono font-bold ${inputClass}`}
              />
            </div>

            <div>
              <label className={`block font-bold text-xs mb-1 ${subTextClass}`}>Reorder Min</label>
              <input
                type="number"
                name="minStock"
                min="0"
                defaultValue={productModal.item?.minStock ?? 5}
                required
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none font-mono font-bold ${inputClass}`}
              />
            </div>

            <div>
              <label className={`block font-bold text-xs mb-1 ${subTextClass}`}>Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                name="unitPrice"
                min="0"
                defaultValue={productModal.item?.unitPrice ?? 99.99}
                required
                className={`w-full px-3 py-2 rounded-lg border focus:outline-none font-mono font-bold ${inputClass}`}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={close}
              className={`px-4 py-2 rounded-lg border ${borderClass} font-bold hover:bg-slate-200 dark:hover:bg-slate-800`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold transition shadow"
            >
              Save Item SKU
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
