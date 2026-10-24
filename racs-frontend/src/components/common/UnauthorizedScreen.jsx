import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ShieldAlert, KeyRound, Lock, UserCheck, ArrowLeft } from 'lucide-react';

export function UnauthorizedScreen({ allowedRoles = [], featureName = 'Restricted Enclave' }) {
  const { currentRole, currentUser, switchRole } = useAuth();
  const { isDark } = useTheme();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6">
      <div className={`max-w-xl w-full rounded-3xl border border-rose-500/30 shadow-2xl p-8 text-center relative overflow-hidden ${
        isDark ? 'bg-[#0E1320] text-white shadow-rose-950/40' : 'bg-white text-slate-900 shadow-slate-200'
      }`}>
        {/* Luminous background accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-6 shadow-inner">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-[11px] font-semibold uppercase tracking-wider mb-3 font-mono">
          <Lock className="w-3 h-3" />
          <span>RBAC SECURITY BOUNDARY ACTIVE</span>
        </div>

        <h2 className={`text-xl font-bold tracking-tight mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Access Restricted: {featureName}
        </h2>

        <p className={`text-sm max-w-md mx-auto mb-6 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Your active persona <span className="font-semibold">{currentUser?.name || currentUser?.full_legal_name}</span> is assigned to the{' '}
          <span className="font-semibold text-sky-600 dark:text-blue-400 font-mono">[{currentRole}]</span> role. Strict tenant data isolation and compliance boundaries block unauthorized access to this module.
        </p>

        {/* Permitted Roles Matrix */}
        <div className={`rounded-2xl p-4 border text-left mb-6 ${
          isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`text-xs font-semibold uppercase tracking-wider mb-2.5 flex items-center space-x-1.5 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <KeyRound className="w-3.5 h-3.5 text-sky-500 dark:text-blue-400" />
            <span>Authorized Roles for This Enclave Module</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allowedRoles.map((role) => (
              <button
                key={role}
                onClick={() => switchRole(role)}
                className={`group inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                  isDark
                    ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:border-sky-400/60 hover:text-white'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-sky-400 hover:text-sky-600 shadow-sm'
                }`}
                title={`Switch context to ${role}`}
              >
                <UserCheck className="w-3.5 h-3.5 text-sky-500 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                <span>Simulate {role.replace('ROLE_', '').replace(/_/g, ' ')}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={() => window.history.back()}
            className={`px-5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center space-x-2 ${
              isDark ? 'bg-white/[0.08] hover:bg-white/[0.12] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
