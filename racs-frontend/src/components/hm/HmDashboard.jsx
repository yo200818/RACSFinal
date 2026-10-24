import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Layers,
  Users,
  Sparkles,
  ChevronRight,
  Clock,
  ArrowRight,
  CheckCircle2,
  FileText,
  Briefcase,
  Star,
  ExternalLink,
} from 'lucide-react';

export function HmDashboard({ onNavigate, onSelectCandidate }) {
  const { jobPostings, requisitions, candidates } = useAuth();
  const { isDark } = useTheme();

  const allJobs = (jobPostings || requisitions || []).filter((j) => j.status === 'Active');

  const pendingCandidates = candidates.filter(
    (c) =>
      c.pipeline_status === 'HM Review' ||
      c.status === 'HM Review' ||
      c.pipeline_status === 'Screening' ||
      c.status === 'Screening'
  );

  const avgMatch =
    candidates.length > 0
      ? (
          candidates.reduce(
            (sum, c) => sum + (c.overallMatch || c.match_score_percent || 0),
            0
          ) / candidates.length
        ).toFixed(1)
      : '0.0';

  const handleReviewCandidate = (candidateId) => {
    if (onSelectCandidate) {
      onSelectCandidate(candidateId);
    }
    if (onNavigate) {
      onNavigate('hm-candidates');
    }
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl">
      {/* Top Banner */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 transition-colors ${
          isDark
            ? 'bg-[#0E1320]/80 border-white/[0.08]'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-sky-500 dark:bg-sky-400 animate-pulse" />
            <span>Hiring Manager Portal &bull; Department Requisitions & Review Queue</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            My Department Requisitions & Candidates
          </h1>
          <p
            className={`text-xs max-w-xl leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Review AI shortlists delivered by Talent Acquisition, inspect explainable skill scorecards, and record immutable technical debrief notes.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate && onNavigate('hm-candidates')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Review Candidate Dossiers ({pendingCandidates.length})</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Open Roles */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Open Requisitions</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Layers className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{allJobs.length}</span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-mono font-medium">Active Req</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Live requisitions in database</p>
        </div>

        {/* Metric 2: Candidates in Evaluation */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Evaluation Queue</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{pendingCandidates.length}</span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-mono font-medium">Pending Review</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting technical recommendation</p>
        </div>

        {/* Metric 3: Pipeline AI Match % */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Avg Pipeline Match</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{avgMatch}%</span>
            <span className="text-xs text-sky-600 dark:text-sky-400 font-mono font-medium">Calibrated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Dynamic average across dossiers</p>
        </div>

        {/* Metric 4: Time-to-Shortlist SLA */}
        <div
          className={`p-5 rounded-3xl border shadow-xl transition-all ${
            isDark
              ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Time-to-Shortlist</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {candidates.length > 0 ? '2.1d' : '--'}
            </span>
            {candidates.length > 0 ? (
              <span className="text-xs text-sky-600 dark:text-sky-400 font-mono font-medium">Target: 3.0d</span>
            ) : (
              <span className="text-xs text-slate-500 font-mono">Standby</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {candidates.length > 0 ? 'Velocity +30% above SLA' : 'Awaiting candidate pipeline'}
          </p>
        </div>
      </div>

      {/* Prominent Candidate Evaluation Queue (Direct Access for HM) */}
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
          <div className="flex items-center space-x-2.5">
            <div className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <h2 className="text-xs font-mono uppercase tracking-wider font-semibold">
              Candidate Evaluation Queue ({pendingCandidates.length})
            </h2>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Click any candidate to review dossier & debrief
          </span>
        </div>

        {pendingCandidates.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium">No Candidates Pending Review</h3>
            <p
              className={`text-xs max-w-sm mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              All candidate dossiers have been reviewed or Talent Acquisition has not yet delivered new shortlists.
            </p>
          </div>
        ) : (
          <div className={`divide-y border-t ${
            isDark ? 'divide-white/[0.05] border-white/[0.05]' : 'divide-slate-100 border-slate-100'
          }`}>
            {pendingCandidates.map((c) => {
              const cId = c.candidate_id || c.id;
              const name = c.candidate_name || c.name;
              const score = c.overallMatch || c.match_score_percent || 0;
              const roleApplied = c.roleApplied || c.currentTitle || 'Software Engineer';
              const matched = c.skillsMatched || c.matched_skills || [];
              const isHmReview = c.pipeline_status === 'HM Review' || c.status === 'HM Review';

              return (
                <div
                  key={cId}
                  className={`p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isDark
                      ? 'hover:bg-white/[0.02]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={
                        c.avatar ||
                        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
                      }
                      alt={name}
                      className="w-11 h-11 rounded-2xl object-cover border border-sky-400/30 flex-shrink-0"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold text-sm tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30">
                          {score}% AI Match
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                            isHmReview
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-500/20'
                              : 'bg-slate-500/10 text-slate-500 border border-slate-500/20'
                          }`}
                        >
                          {c.pipeline_status || c.status}
                        </span>
                      </div>
                      <p className={`text-xs flex items-center space-x-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        <span>{roleApplied}</span>
                        <span>&bull;</span>
                        <span>{c.candidate_email || c.email}</span>
                      </p>

                      {/* Top Skills Preview */}
                      {matched.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {matched.slice(0, 4).map((s) => (
                            <span
                              key={s}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20"
                            >
                              +{s}
                            </span>
                          ))}
                          {matched.length > 4 && (
                            <span className="text-[10px] font-mono text-slate-400 self-center">
                              +{matched.length - 4} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 self-end md:self-center flex-shrink-0">
                    <button
                      onClick={() => handleReviewCandidate(cId)}
                      className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Review Technical Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Active Requisitions Portfolio Grid */}
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
            Active Requisitions Portfolio ({allJobs.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-500">Department Scope</span>
        </div>

        {allJobs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-blue-500/20">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-medium">No Active Requisitions</h3>
            <p
              className={`text-xs max-w-sm mx-auto ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              Your department does not have any active job requisitions. Coordinate with Talent Acquisition to publish open requisitions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 sm:p-6">
            {allJobs.map((req) => {
              const reqId = req.job_id || req.id;
              const reqCandidates = candidates.filter(
                (c) =>
                  (c.job_id || c.targetRequisitionId) === reqId ||
                  (c.roleApplied &&
                    req.job_title &&
                    c.roleApplied.toLowerCase().includes(req.job_title.toLowerCase().slice(0, 8)))
              );

              return (
                <div
                  key={reqId}
                  className={`p-6 rounded-3xl border transition-all flex flex-col justify-between group ${
                    isDark
                      ? 'bg-black/40 border-white/[0.07] hover:border-blue-500/40 hover:shadow-2xl'
                      : 'bg-slate-50 border-slate-200 hover:border-sky-400 hover:shadow-lg'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono font-medium text-sky-600 dark:text-sky-400 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                        {reqId}
                      </span>
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-mono font-medium">
                        {req.target_headcount || req.targetHeadcount || 1} Target Hires
                      </span>
                    </div>

                    <h3 className="text-base font-medium tracking-tight group-hover:text-sky-500 dark:group-hover:text-sky-400 transition-colors">
                      {req.job_title || req.title}
                    </h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{req.department}</p>

                    <div
                      className={`mt-4 p-3 rounded-2xl border text-xs flex items-center justify-between ${
                        isDark
                          ? 'bg-white/[0.02] border-white/[0.06]'
                          : 'bg-white border-slate-200 shadow-sm'
                      }`}
                    >
                      <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Compensation Band:</span>
                      <span className="font-mono text-sky-600 dark:text-sky-400 font-medium">
                        ${(req.compensation_min || 180000).toLocaleString()} - ${(req.compensation_max || 220000).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`mt-5 pt-4 border-t flex items-center justify-between ${
                      isDark ? 'border-white/[0.06]' : 'border-slate-200'
                    }`}
                  >
                    <span className="text-xs font-mono text-slate-500">
                      <strong className={isDark ? 'text-white' : 'text-slate-900'}>
                        {reqCandidates.length}
                      </strong>{' '}
                      candidates in funnel
                    </span>

                    <button
                      onClick={() => {
                        if (reqCandidates[0] && onSelectCandidate) {
                          onSelectCandidate(reqCandidates[0].candidate_id || reqCandidates[0].id);
                        }
                        if (onNavigate) onNavigate('hm-candidates');
                      }}
                      className="inline-flex items-center space-x-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:text-sky-700 cursor-pointer"
                    >
                      <span>Inspect Candidates</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
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
