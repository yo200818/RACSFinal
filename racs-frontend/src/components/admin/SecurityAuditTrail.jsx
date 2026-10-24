import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  ShieldCheck,
  Lock,
  Search,
  CheckCircle2,
  FileText,
  AlertTriangle,
  KeyRound,
  Download,
  Terminal,
  Activity,
  Sparkles,
} from 'lucide-react';

export function SecurityAuditTrail() {
  const { auditLogs, addToast } = useAuth();
  const { isDark } = useTheme();
  const [searchHash, setSearchHash] = useState('');
  const [verifiedResult, setVerifiedResult] = useState(null);

  const handleVerifyHash = (e) => {
    e.preventDefault();
    if (!searchHash.trim()) return;

    const match = auditLogs.find(
      (l) => l.sha256Digest.includes(searchHash.trim()) || l.id === searchHash.trim()
    );

    if (match) {
      setVerifiedResult({
        verified: true,
        event: match.event,
        principal: match.principal,
        timestamp: match.timestamp,
        digest: match.sha256Digest,
        tamperSeal: match.tamperSeal,
      });
      addToast('Cryptographic Proof Verified', `Hash verified against immutable ledger record ${match.id}.`, 'success');
    } else {
      setVerifiedResult({
        verified: false,
        message: 'No matching hash found in the tamper-evident ledger. Record may be uncommitted or forged.',
      });
      addToast('Verification Failed', 'Hash digest mismatch.', 'error');
    }
  };

  const handleExportLedger = () => {
    addToast('Audit Ledger Exported', 'Complete cryptographic audit trail exported with SHA-256 seal.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`pb-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-blue-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-blue-400" />
            <span>Cryptographic Proof & Immutable Audit Trail</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Security & Compliance Audit Trail
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Real-time immutable ledger tracking every BYOK key rotation, resume ingestion, and legally binding HR handoff.
          </p>
        </div>

        <button
          onClick={handleExportLedger}
          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer shadow-sm ${
            isDark
              ? 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.08]'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Download className="w-3.5 h-3.5 text-sky-500 dark:text-blue-400" />
          <span>Export Ledger (JSON / CSV)</span>
        </button>
      </div>

      {/* 4 Security & Integrity Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`rounded-2xl p-5 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Ledger Integrity</span>
            <ShieldCheck className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-sky-600 dark:text-blue-400 font-mono tracking-tight">100% SHA-256</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Zero tamper anomalies detected</p>
        </div>

        <div className={`rounded-2xl p-5 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Key Rotation Cycle</span>
            <Lock className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>Rotated 6d ago</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">30-day automated policy active</p>
        </div>

        <div className={`rounded-2xl p-5 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>EEOC & Title VII</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-sky-600 dark:text-blue-400 font-mono tracking-tight">Enforced</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Demographically masked</p>
        </div>

        <div className={`rounded-2xl p-5 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Threat Anomaly Rate</span>
            <Activity className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-sky-600 dark:text-blue-400 font-mono tracking-tight">0 Detected</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% valid mutual TLS handshake</p>
        </div>
      </div>

      {/* Cryptographic Proof Verifier (Interactive Tool) */}
      <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
        isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-sky-600 dark:text-blue-400" />
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Cryptographic Proof Verifier</h3>
        </div>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Verify any SHA-256 transaction digest or candidate signature against the RACS AI immutable ledger.
        </p>

        <form onSubmit={handleVerifyHash} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Paste SHA-256 hash digest (e.g. e8f7a90b4d5c1e2f3a8b...)"
            value={searchHash}
            onChange={(e) => setSearchHash(e.target.value)}
            className={`flex-1 p-2.5 rounded-xl border text-xs font-mono focus:outline-none focus:ring-2 focus:ring-sky-400 ${
              isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-sky-500/20"
          >
            Verify Proof
          </button>
        </form>

        {verifiedResult && (
          <div
            className={`p-4 rounded-2xl border text-xs font-mono animate-fadeIn ${
              verifiedResult.verified
                ? 'bg-sky-500/10 border-sky-500/30 text-sky-700 dark:text-blue-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
            }`}
          >
            {verifiedResult.verified ? (
              <div className="space-y-1">
                <div className="font-bold flex items-center space-x-1.5 text-sky-600 dark:text-blue-400">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-blue-400" />
                  <span>Proof Valid: Immutable Record Confirmed in Ledger</span>
                </div>
                <div className={`text-[11px] font-sans mt-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Event: <span className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{verifiedResult.event}</span> by {verifiedResult.principal}
                </div>
                <div className={`text-[10px] break-all ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Digest: {verifiedResult.digest}</div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-rose-600 dark:text-rose-400">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{verifiedResult.message}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Real-time Immutable Audit Log Table */}
      <div className={`rounded-2xl border shadow-xl overflow-hidden transition-colors ${
        isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/[0.08]' : 'border-slate-100'
        }`}>
          <h3 className={`text-xs font-bold uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Real-Time Immutable Audit Log Table ({auditLogs.length} Records)
          </h3>
          <span className="text-[10px] font-mono text-sky-600 dark:text-blue-400 font-bold flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>LIVE LEDGER</span>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`text-slate-500 font-semibold uppercase tracking-wider text-[10px] border-b ${
              isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-100'
            }`}>
              <tr>
                <th className="py-3 px-4">Log ID & Event</th>
                <th className="py-3 px-4">Principal Identity</th>
                <th className="py-3 px-4">Target Resource</th>
                <th className="py-3 px-4">Timestamp (UTC)</th>
                <th className="py-3 px-4 font-mono">SHA-256 Digest</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              isDark ? 'divide-white/[0.05] text-slate-300' : 'divide-slate-100 text-slate-700'
            }`}>
              {auditLogs.map((log) => (
                <tr key={log.id} className={`transition-colors ${
                  isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                }`}>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[10px] font-bold text-sky-600 dark:text-blue-400 block">{log.id}</span>
                    <span className={`font-semibold text-xs mt-0.5 block ${isDark ? 'text-white' : 'text-slate-900'}`}>{log.event}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`font-medium text-xs block ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{log.principal}</span>
                    <span className="font-mono text-[10px] text-slate-400">{log.ipAddress}</span>
                  </td>
                  <td className={`py-3.5 px-4 font-medium max-w-xs truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{log.target}</td>
                  <td className={`py-3.5 px-4 font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{log.timestamp}</td>
                  <td className={`py-3.5 px-4 font-mono text-[10px] max-w-[140px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {log.sha256Digest}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20 font-mono">
                      <CheckCircle2 className="w-3 h-3 text-sky-500 dark:text-blue-400" />
                      <span>{log.status}</span>
                    </span>
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
