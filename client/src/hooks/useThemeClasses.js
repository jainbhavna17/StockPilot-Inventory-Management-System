import { useSelector } from 'react-redux';

// "High Contrast Design Classes" from the original app, derived from the current theme
export default function useThemeClasses() {
  const theme = useSelector((s) => s.ui.theme);

  return {
    theme,
    bgClass: theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900',
    cardBgClass: theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-300 shadow-sm',
    borderClass: theme === 'dark' ? 'border-slate-800' : 'border-slate-300',
    inputClass:
      theme === 'dark'
        ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500'
        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-500 focus:border-cyan-600',
    subTextClass: theme === 'dark' ? 'text-slate-400' : 'text-slate-700',
    tableHeaderClass:
      theme === 'dark'
        ? 'bg-slate-900/90 text-slate-300 border-slate-800'
        : 'bg-slate-100 text-slate-900 border-slate-300 font-bold',
  };
}
