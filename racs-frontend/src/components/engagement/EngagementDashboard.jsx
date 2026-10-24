import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Mail,
  Clock,
  CheckCircle2,
  Users,
  Send,
  Sparkles,
  ArrowRight,
  TrendingUp,
  FileCheck,
  Laptop,
} from 'lucide-react';

export function EngagementDashboard({ onNavigate }) {
  const { sequences, candidates } = useAuth();
  const { isDark } = useTheme();

  const enrolledCandidates = candidates.filter(
    (c) =>
      c.pipeline_status === 'Offer Dispatched & Awaiting Signature' ||
      c.status === 'Offer Dispatched & Awaiting Signature' ||
      c.pipeline_status === 'Ready for Offer Authorization' ||
      c.status === 'Ready for Offer Authorization' ||
      c.offerPackage
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
            <span>Candidate Engagement &bull; Pre-Boarding Nurture</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Pre-Boarding Candidate Nurture & Cadence Control
          </h1>
          <p
            className={`text-xs mt-1 max-w-xl leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Automate post-offer engagement sequences, track equipment delivery milestones, and ensure zero pre-start drop-offs.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate('engagement-sequences')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xs font-semibold hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-500/20 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Configure Email Cadences</span>
          </button>
        </div>
      </div>

      {/* 4 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Enrolled in Pre-Boarding</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-blue-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{enrolledCandidates.length}</span>
            <span className="text-xs text-sky-600 dark:text-blue-400 font-mono font-medium">Finalists</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Live candidates in offer stage</p>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Email Open Rate</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Mail className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold font-mono tracking-tight text-sky-600 dark:text-blue-400`}>
              {enrolledCandidates.length > 0 ? '96.4%' : '--'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {enrolledCandidates.length > 0
              ? 'High engagement across active steps'
              : 'Awaiting candidate onboarding enrollments'}
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Standard Cadence</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 dark:bg-blue-500/10 flex items-center justify-center text-sky-600 dark:text-blue-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {enrolledCandidates.length > 0 ? '7-Day Interval' : '--'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {enrolledCandidates.length > 0
              ? '4 automated milestone touchpoints'
              : 'Configurable cadence sequences'}
          </p>
        </div>

        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Hardware Provisioned</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Laptop className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {enrolledCandidates.length > 0 ? '100%' : '0%'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {enrolledCandidates.length > 0
              ? 'Workstations shipped prior to Day 1'
              : 'Zero hardware shipments pending'}
          </p>
        </div>
      </div>

      {/* Candidate Onboarding Pipeline Tracking Table */}
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
          <h2 className="text-xs font-mono uppercase tracking-wider font-semibold">
            Active Pre-Boarding Candidate Cohort ({enrolledCandidates.length})
          </h2>
          <span className="text-[11px] font-mono text-sky-600 dark:text-blue-400 bg-sky-500/10 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-sky-500/20 dark:border-blue-500/20">
            Zero Pre-Start Drop-offs
          </span>
        </div>

        <div className="overflow-x-auto">
          {enrolledCandidates.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-sky-500/20 dark:border-blue-500/20">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-medium">No Finalists Enrolled in Pre-Boarding</h3>
              <p
                className={`text-xs max-w-sm mx-auto ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                Candidates are automatically enrolled in the pre-boarding nurture pipeline once their offer letters are approved and dispatched by HR Governance.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead
                className={`uppercase tracking-wider font-medium border-b text-[10px] font-mono ${
                  isDark
                    ? 'bg-white/[0.02] text-slate-400 border-white/[0.07]'
                    : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}
              >
                <tr>
                  <th className="py-3 px-5">Candidate Finalist</th>
                  <th className="py-3 px-5">Target Role</th>
                  <th className="py-3 px-5">Anticipated Start Date</th>
                  <th className="py-3 px-5">Active Engagement Step</th>
                  <th className="py-3 px-5">Cadence Health</th>
                </tr>
              </thead>
              <tbody
                className={`divide-y ${
                  isDark
                    ? 'divide-white/[0.05] text-slate-300'
                    : 'divide-slate-100 text-slate-700'
                }`}
              >
                {enrolledCandidates.map((cand, idx) => {
                  const candId = cand.candidate_id || cand.id;
                  const candName = cand.candidate_name || cand.name;
                  const startDate = cand.offerPackage?.anticipatedStartDate || 'Nov 25, 2026';
                  const stepText =
                    idx === 0
                      ? 'Step 2: Hardware Provisioning (ThinkPad P1 / M3 Max)'
                      : idx === 1
                      ? 'Step 1: Welcome & Benefits Guide'
                      : 'Step 1: Culture & Values Handbook';

                  return (
                    <tr
                      key={candId}
                      className={`transition-colors ${
                        isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={cand.avatar}
                            alt={candName}
                            className="w-9 h-9 rounded-xl object-cover ring-1 ring-sky-500/30 dark:ring-blue-500/20 flex-shrink-0"
                          />
                          <div>
                            <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{candName}</div>
                            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                              {cand.currentTitle}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-5 font-mono text-sky-600 dark:text-blue-400">
                        {cand.job_id || cand.targetRequisitionId}
                      </td>

                      <td className="py-4 px-5 font-mono text-sky-600 dark:text-blue-400 font-medium">
                        {startDate}
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center space-x-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-blue-400" />
                          <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{stepText}</span>
                        </span>
                      </td>

                      <td className="py-4 px-5">
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] bg-sky-500/10 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20 dark:border-blue-500/20 font-mono">
                          <CheckCircle2 className="w-3 h-3 text-sky-500 dark:text-blue-400" />
                          <span>On Track (100%)</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
