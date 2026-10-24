import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  FileText,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Filter,
  CheckCircle2,
  Sliders,
  ChevronRight,
} from 'lucide-react';

export function TaDashboard({ onNavigate }) {
  const { jobPostings, requisitions, candidates, setCandidates, addToast } = useAuth();
  const { isDark } = useTheme();
  const [matchFilter, setMatchFilter] = useState(75);

  const activeJobs = (jobPostings || requisitions || []).filter((j) => j.status === 'Active');
  const totalCandidates = candidates.length;

  const scoredCandidates = candidates.filter(
    (c) => (c.overallMatch || c.match_score_percent || 0) > 0
  );
  const avgMatchAccuracy =
    scoredCandidates.length > 0
      ? (
          scoredCandidates.reduce(
            (acc, c) => acc + (c.overallMatch || c.match_score_percent || 0),
            0
          ) / scoredCandidates.length
        ).toFixed(1)
      : '0.0';

  const totalHeadcount = activeJobs.reduce(
    (acc, j) => acc + (j.target_headcount || j.targetHeadcount || 1),
    0
  );

  // Dynamic funnel calculations
  const stepIngested = totalCandidates;
  const stepScreened = candidates.filter(
    (c) => (c.overallMatch || c.match_score_percent || 0) >= matchFilter
  ).length;
  const stepHmReview = candidates.filter(
    (c) => c.pipeline_status === 'HM Review' || c.status === 'HM Review'
  ).length;
  const stepOffers = candidates.filter(
    (c) =>
      c.pipeline_status === 'Ready for Offer Authorization' ||
      c.pipeline_status === 'Offer Dispatched & Awaiting Signature'
  ).length;

  const pct = (val) => (totalCandidates > 0 ? ((val / totalCandidates) * 100).toFixed(0) : 0);

  const handlePromoteQualified = () => {
    const qualified = candidates.filter(
      (c) =>
        (c.overallMatch || c.match_score_percent || 0) >= matchFilter &&
        (c.pipeline_status === 'Screening' || c.status === 'Screening')
    );
    if (!qualified.length) {
      addToast(
        'No Pending Candidates',
        `All candidates meeting the ${matchFilter}% threshold are already in HM Review.`,
        'info'
      );
      return;
    }

    setCandidates((prev) =>
      prev.map((c) => {
        const score = c.overallMatch || c.match_score_percent || 0;
        if (
          score >= matchFilter &&
          (c.pipeline_status === 'Screening' || c.status === 'Screening')
        ) {
          return { ...c, pipeline_status: 'HM Review', status: 'HM Review' };
        }
        return c;
      })
    );

    addToast(
      'Candidates Shortlisted',
      `Promoted ${qualified.length} candidate(s) to HM Review.`,
      'success'
    );
  };

  return (
    <div className="space-y-10 max-w-5xl animate-fadeIn">
      {/* Editorial Header */}
      <div
        className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b transition-colors ${
          isDark ? 'border-white/[0.08]' : 'border-slate-200'
        }`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-sky-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>TALENT ACQUISITION &bull; THROUGHPUT & VELOCITY</span>
          </div>
          <h1 className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Pipeline Velocity & Ingestion Stream
          </h1>
          <p
            className={`text-sm leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Real-time candidate ingestion, autonomous OCR parsing, and active requisition tracking connected to database state.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onNavigate('ta-requisitions')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5 text-sky-500" />
            <span>Requisitions ({activeJobs.length})</span>
          </button>
          <button
            onClick={() => onNavigate('ta-intake')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-medium shadow-md shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bulk Resume Intake</span>
          </button>
        </div>
      </div>

      {/* Editorial 4-Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Total Ingested Resumes
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCandidates}</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">Live Database Count</div>
        </div>

        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Average Match Accuracy
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{avgMatchAccuracy}%</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">Calibrated via AI Rubric</div>
        </div>

        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Target Open Headcount
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalHeadcount}</div>
          <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{activeJobs.length} Active Positions</div>
        </div>

        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            In HM Review Queue
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{stepHmReview}</div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">Awaiting HM Feedback</div>
        </div>
      </div>

      {/* Interactive Shortlisting Filter */}
      <div
        className={`p-6 sm:p-8 rounded-3xl border space-y-5 transition-colors ${
          isDark
            ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-xl shadow-black/30'
            : 'border-slate-200 bg-white shadow-sm'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Dynamic AI Shortlist Filter</h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Calibrate the match threshold to see how many candidates qualify for automated shortlisting.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-xs text-sky-600 dark:text-sky-400 font-medium px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20">
              Threshold: {matchFilter}%
            </span>
            <button
              onClick={handlePromoteQualified}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-medium transition-all shadow-md shadow-sky-500/25 cursor-pointer"
            >
              Shortlist Qualified ({stepScreened})
            </button>
          </div>
        </div>

        <input
          type="range"
          min="50"
          max="95"
          step="5"
          value={matchFilter}
          onChange={(e) => setMatchFilter(Number(e.target.value))}
          className="w-full accent-sky-500 cursor-pointer"
        />

        {/* Funnel Visualizer (Consistent Shades of Blue) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] text-slate-500">1. Total Ingested</div>
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stepIngested}</div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-sky-500 rounded-full w-full" />
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] text-slate-500">2. Meets {matchFilter}% Filter</div>
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stepScreened}</div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${pct(stepScreened)}%` }}
              />
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] text-slate-500">3. In HM Review</div>
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stepHmReview}</div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-sky-500 rounded-full transition-all duration-300"
                style={{ width: `${pct(stepHmReview)}%` }}
              />
            </div>
          </div>

          <div
            className={`p-3.5 rounded-2xl border space-y-1 ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[11px] text-slate-500">4. Offer Authorized</div>
            <div className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{stepOffers}</div>
            <div className="w-full h-1.5 bg-slate-200 dark:bg-white/[0.06] rounded-full overflow-hidden mt-1.5">
              <div
                className="h-full bg-blue-400 rounded-full transition-all duration-300"
                style={{ width: `${pct(stepOffers)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Active Requisitions Quick List */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 space-y-4 transition-colors ${
          isDark
            ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-xl shadow-black/30'
            : 'border-slate-200 bg-white shadow-sm'
        }`}
      >
        <div
          className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-white/[0.06]' : 'border-slate-200'
          }`}
        >
          <div>
            <h3 className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Open Job Requisitions</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Positions actively accepting resume intake
            </p>
          </div>
          <button
            onClick={() => onNavigate('ta-requisitions')}
            className="text-xs text-sky-600 dark:text-sky-400 hover:underline font-medium inline-flex items-center space-x-1 cursor-pointer"
          >
            <span>Manage All Requisitions</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {activeJobs.length > 0 ? (
          <div
            className={`divide-y ${
              isDark ? 'divide-white/[0.04]' : 'divide-slate-100'
            }`}
          >
            {activeJobs.slice(0, 4).map((j) => (
              <div
                key={j.job_id || j.id}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{j.job_title || j.title}</div>
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {j.department} &bull; Target: {j.target_headcount || j.targetHeadcount || 1} Headcount
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400">
                    ${((j.compensation_min || 150000) / 1000).toFixed(0)}k - ${((j.compensation_max || 200000) / 1000).toFixed(0)}k
                  </span>
                  <button
                    onClick={() => onNavigate('ta-intake')}
                    className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    Ingest Resumes
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-xs text-slate-500">
            No active requisitions found. Create one in Requisitions to start accepting candidate resumes.
          </div>
        )}
      </div>
    </div>
  );
}
