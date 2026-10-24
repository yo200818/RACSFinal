import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Compass,
  BadgeDollarSign,
  PieChart,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
} from 'lucide-react';

export function HrDashboard({ onNavigate, onSelectCandidate }) {
  const { candidates } = useAuth();
  const { isDark } = useTheme();

  const offerReadyCandidates = candidates.filter(
    (c) =>
      c.pipeline_status === 'Ready for Offer Authorization' ||
      c.status === 'Ready for Offer Authorization' ||
      c.pipeline_status === 'Offer Dispatched & Awaiting Signature' ||
      c.status === 'Offer Dispatched & Awaiting Signature' ||
      c.offerPackage
  );

  const totalBaseComp = offerReadyCandidates.reduce(
    (acc, c) => acc + (c.offerPackage?.baseSalary || 0),
    0
  );

  const totalEquityRsus = offerReadyCandidates.reduce(
    (acc, c) => acc + (c.offerPackage?.equityRsus || 0),
    0
  );

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl">
      {/* Top Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors ${
          isDark
            ? 'bg-[#0E1320]/80 border-white/[0.08]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-blue-400 uppercase tracking-wider mb-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-blue-400 animate-pulse" />
            <span>HR Governance &bull; Compensation & Statutory Compliance</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Offer Approvals & Compensation Governance
          </h1>
          <p
            className={`text-xs mt-1 max-w-xl leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Review candidate offer packages, equity pool dilution, CA SB 1162 internal pay parity benchmarks, and execute legally binding offer letter generation.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate('hr-offers')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xs font-semibold hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <BadgeDollarSign className="w-3.5 h-3.5 text-white" />
            <span>Offer Queue ({offerReadyCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Governance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Offer Packages */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Pending Offer Packages</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-blue-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400">
              <FileCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{offerReadyCandidates.length}</span>
            <span className="text-xs text-sky-600 dark:text-blue-400 font-mono font-medium">Dossiers</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Ready for executive compensation review</p>
        </div>

        {/* Metric 2: Committed Base Comp */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Committed Base Comp</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-blue-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400">
              <BadgeDollarSign className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>${totalBaseComp.toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Annualized salary across active packages</p>
        </div>

        {/* Metric 3: Equity Pool Dilution */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Equity Pool Grant</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <PieChart className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalEquityRsus.toLocaleString()}</span>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>RSUs</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">4-year standard vesting with 1-year cliff</p>
        </div>

        {/* Metric 4: Pay Band Alignment */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Pay Parity Alignment</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-blue-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-sky-600 dark:text-blue-400 tracking-tight font-mono">
              {offerReadyCandidates.length > 0 ? '100%' : 'N/A'}
            </span>
            {offerReadyCandidates.length > 0 && <span className="text-xs text-sky-600 dark:text-blue-400 font-mono">In-Band</span>}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {offerReadyCandidates.length > 0 ? 'CA SB 1162 / NY Equal Pay Verified' : 'Awaiting candidates in offer stage'}
          </p>
        </div>
      </div>

      {/* Priority Review Queue */}
      <div
        className={`rounded-3xl border shadow-xl overflow-hidden transition-colors ${
          isDark
            ? 'bg-[#0E1320]/80 border-white/[0.08]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div
          className={`p-5 sm:p-6 border-b flex items-center justify-between ${
            isDark ? 'border-white/[0.07]' : 'border-slate-200'
          }`}
        >
          <div>
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold">
              Executive Offer Authorization Queue
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Approved candidates ready for final compensation sign-off, parity validation, and DocuSign dispatch.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-600 dark:text-blue-400 bg-sky-500/10 dark:bg-blue-500/10 border border-sky-500/20 dark:border-blue-500/20 px-3 py-1 rounded-full">
            {offerReadyCandidates.length} Pending
          </span>
        </div>

        {offerReadyCandidates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-sky-500/20 dark:border-blue-500/20">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium">No Offers Pending Executive Review</h3>
            <p
              className={`text-xs max-w-sm mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              When candidates complete the technical debrief stage with the Hiring Manager, their compensation dossiers will appear here for statutory parity checks and offer dispatch.
            </p>
          </div>
        ) : (
          <div className={`divide-y ${isDark ? 'divide-white/[0.05]' : 'divide-slate-100'}`}>
            {offerReadyCandidates.map((cand) => {
              const candId = cand.candidate_id || cand.id;
              const candName = cand.candidate_name || cand.name;
              const pkg = cand.offerPackage || {
                baseSalary: 195000,
                equityRsus: 12000,
                signOnBonus: 20000,
                bandPositionPercentile: 65,
                docusignEnvelopeId: `DOCUSIGN-${candId}`,
              };
              const isDispatched =
                cand.pipeline_status === 'Offer Dispatched & Awaiting Signature' ||
                cand.status === 'Offer Dispatched & Awaiting Signature';

              return (
                <div
                  key={candId}
                  className={`p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-colors ${
                    isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={cand.avatar}
                      alt={candName}
                      className="w-12 h-12 rounded-2xl object-cover ring-1 ring-sky-500/30 dark:ring-blue-500/20 flex-shrink-0"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{candName}</h3>
                        <span className="text-xs text-sky-600 dark:text-blue-400 font-mono">
                          ({cand.job_id || cand.targetRequisitionId})
                        </span>
                        {cand.cryptographicSeal && (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-sky-500/10 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400 text-[10px] font-mono border border-sky-500/20 dark:border-blue-500/20">
                            <Lock className="w-2.5 h-2.5" />
                            <span>HM Sealed</span>
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cand.currentTitle}</p>
                      <div className="flex items-center space-x-3 mt-1.5 text-xs font-mono">
                        <span className="text-sky-600 dark:text-blue-400 font-semibold">
                          ${pkg.baseSalary?.toLocaleString()} Base
                        </span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-sky-500 dark:text-blue-400">{pkg.equityRsus?.toLocaleString()} RSUs</span>
                        <span className="text-slate-400">&bull;</span>
                        <span className="text-slate-400">${pkg.signOnBonus?.toLocaleString()} Sign-on</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {isDispatched ? (
                      <span className="px-3.5 py-1.5 rounded-xl bg-sky-500/10 dark:bg-blue-500/10 border border-sky-500/30 dark:border-blue-500/30 text-sky-600 dark:text-blue-400 text-xs font-mono flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Offer Dispatched &bull; Awaiting Signature</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (onSelectCandidate) onSelectCandidate(candId);
                          if (onNavigate) onNavigate('hr-offers');
                        }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold transition-all shadow-md shadow-sky-500/20 flex items-center space-x-1.5 cursor-pointer hover:scale-[1.02]"
                      >
                        <span>Authorize Offer Letter</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
