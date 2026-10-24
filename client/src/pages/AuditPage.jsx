import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Download } from 'lucide-react';
import useThemeClasses from '../hooks/useThemeClasses.js';
import { fetchAuditLogs, logClientAction } from '../store/slices/auditSlice.js';
import { exportToCSV } from '../utils/csv.js';

export default function AuditPage() {
  const dispatch = useDispatch();
  const { theme, borderClass, cardBgClass, subTextClass, tableHeaderClass } = useThemeClasses();
  const auditLogs = useSelector((s) => s.audit.items);

  // Always show the freshest trail when this page opens
  useEffect(() => {
    dispatch(fetchAuditLogs());
  }, [dispatch]);

  const handleExport = () => {
    if (exportToCSV(auditLogs, 'security_audit_logs')) {
      dispatch(logClientAction({ action: 'CSV_EXPORT', details: 'Exported security_audit_logs dataset' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-black ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Security Audit Logs
          </h1>
          <p className={`text-sm font-medium ${subTextClass}`}>
            Authentication signatures, access checks, and administrative security trails.
          </p>
        </div>

        <button
          onClick={handleExport}
          className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg border ${borderClass} ${cardBgClass} text-xs font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition`}
        >
          <Download className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
          <span>Export Audit CSV</span>
        </button>
      </div>

      <div className={`rounded-xl border ${borderClass} overflow-hidden shadow-sm ${cardBgClass}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className={`border-b ${tableHeaderClass}`}>
              <tr>
                <th className="py-3.5 px-4">Log ID</th>
                <th className="py-3.5 px-4">Action Signature</th>
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-100/60 dark:hover:bg-slate-800/50 transition font-mono text-xs">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{log.id}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-300 font-bold border border-cyan-300 dark:border-cyan-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">{log.userId}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{log.ip}</td>
                  <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">{log.timestamp}</td>
                  <td className="py-3.5 px-4 font-sans text-slate-800 dark:text-slate-200 font-medium">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
