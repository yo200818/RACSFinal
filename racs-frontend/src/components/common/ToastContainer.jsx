import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useAuth();
  const { isDark } = useTheme();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-2.5 pointer-events-none max-w-md w-full px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isInfo = toast.type === 'info';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-4 rounded-2xl border shadow-xl transition-all duration-300 animate-fadeIn ${
              isDark
                ? 'bg-[#0E1320]/95 backdrop-blur-xl border-white/[0.1] shadow-black/80'
                : 'bg-white border-slate-200 shadow-slate-300/50'
            }`}
          >
            <div className="flex-shrink-0 mt-0.5">
              {isSuccess ? (
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400 border border-sky-500/30 dark:border-blue-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : isInfo ? (
                <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400 border border-sky-500/30 dark:border-blue-500/30">
                  <Info className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-500 border border-rose-500/30">
                  <AlertCircle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{toast.title}</h4>
              <p className={`text-xs mt-0.5 leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className={`flex-shrink-0 p-1 rounded-lg transition-colors cursor-pointer ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
              }`}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
