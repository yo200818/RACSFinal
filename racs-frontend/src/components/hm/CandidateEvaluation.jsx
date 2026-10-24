import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  FileText,
  Lock,
  ThumbsUp,
  ArrowRight,
} from 'lucide-react';

function renderStructuredSynthesis(text, isDark) {
  if (!text) {
    return (
      <p className={`text-xs leading-relaxed p-3.5 rounded-xl border italic ${
        isDark ? 'bg-black/40 border-white/[0.05] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        "Candidate evaluation dossier synthesized across verified competencies and role requirements."
      </p>
    );
  }

  const sections = text.split(/###\s+/).filter(Boolean);
  if (sections.length <= 1) {
    return (
      <p className={`text-xs leading-relaxed p-4 rounded-xl border whitespace-pre-line ${
        isDark ? 'bg-black/40 border-white/[0.05] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
      }`}>
        {text.replace(/^["']|["']$/g, '')}
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {sections.map((sec, idx) => {
        const lines = sec.trim().split('\n');
        const title = lines[0];
        const body = lines.slice(1).join('\n').trim();
        return (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border space-y-1.5 transition-all ${
              isDark ? 'bg-white/[0.02] border-white/[0.06]' : 'bg-slate-50/70 border-slate-200'
            }`}
          >
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
              <span>{title}</span>
            </h5>
            <div className={`text-xs leading-relaxed whitespace-pre-line ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {body}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function CandidateEvaluation({ initialCandidateId, onNavigate }) {
  const { candidates, submitHmRecommendation, addToast } = useAuth();
  const { isDark } = useTheme();
  const [selectedId, setSelectedId] = useState(
    initialCandidateId || candidates[0]?.candidate_id || candidates[0]?.id || ''
  );
  const [debriefText, setDebriefText] = useState('Demonstrates exceptional mastery of required stack and engineering fundamentals. Strong hire recommendation.');

  if (candidates.length === 0) {
    return (
      <div className="space-y-6 max-w-4xl py-12 text-center animate-fadeIn">
        <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto shadow-sm">
          <Sparkles className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-light tracking-tight">Candidate Evaluation Queue Empty</h2>
        <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          No candidates have been ingested yet. Ingest applicant resumes from the Talent Acquisition portal to generate AI match scorecards.
        </p>
        <button
          onClick={() => onNavigate && onNavigate('ta-intake')}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold transition-all shadow-md shadow-sky-500/25 cursor-pointer inline-flex items-center space-x-2"
        >
          <span>Go to Resume Intake</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const candidate = candidates.find((c) => (c.candidate_id || c.id) === selectedId) || candidates[0] || {};
  const candId = candidate.candidate_id || candidate.id;
  const isImmutable = Boolean(candidate.cryptographicSeal);

  const matchedSkills = candidate.skillsMatched || candidate.matched_skills || [
    'React', 'Redux', 'Apollo Client', 'GraphQL'
  ];
  const missingSkills = candidate.skillsMissing || candidate.missing_skills || [];
  const overallScore = candidate.overallMatch || candidate.match_score_percent || 88;

  const handleSealAndSubmit = () => {
    if (isImmutable) return;
    submitHmRecommendation(candId, 'STRONG_HIRE', debriefText);
    addToast('Recommendation Sealed', `${candidate.name || candidate.candidate_name}'s technical dossier is now locked and routed to HR.`, 'success');
  };

  return (
    <div className="space-y-10 max-w-5xl animate-fadeIn">
      {/* Editorial Header */}
      <div className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b ${
        isDark ? 'border-white/[0.07]' : 'border-slate-200'
      }`}>
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-sky-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>HIRING MANAGER &bull; EXPLAINABLE AI EVALUATION</span>
          </div>
          <h1 className="text-3xl font-light tracking-tight">
            Candidate Technical Dossier
          </h1>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Explainable AI match scorecards splitting overall role-fit into verified matched skills and critical missing gaps, backed by immutable technical debrief notes.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onNavigate && onNavigate('hm-dashboard')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <span>Department Requisitions</span>
          </button>
        </div>
      </div>

      {/* Split Queue & Dossier */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Candidate Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Candidates for Review ({candidates.length})
          </div>

          <div className="space-y-2 max-h-[65vh] overflow-y-auto pr-1">
            {candidates.map((cand) => {
              const currentId = cand.candidate_id || cand.id;
              const isSelected = currentId === candId;
              const score = cand.overallMatch || cand.match_score_percent || 0;
              const name = cand.candidate_name || cand.name;

              return (
                <button
                  key={currentId}
                  onClick={() => setSelectedId(currentId)}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    isSelected
                      ? isDark
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/30'
                        : 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm ring-1 ring-sky-300'
                      : isDark
                        ? 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.04]'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold truncate max-w-[170px]">{name}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400">
                      {score}%
                    </span>
                  </div>
                  <div className={`text-[11px] mt-1 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{cand.email || cand.candidate_email}</div>
                  <div className={`mt-2 text-[10px] font-mono flex items-center justify-between ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    <span>{cand.pipeline_status || cand.status || 'Screening'}</span>
                    {cand.cryptographicSeal && <span className="text-emerald-500 font-semibold">&bull; Sealed</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Explainable Scorecard & Dossier */}
        <div className="lg:col-span-8 space-y-6">
          {/* Candidate Dossier Overview Card */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 ${
            isDark ? 'bg-[#0E1320]/80 border-white/[0.08]' : 'bg-white border-slate-200'
          }`}>
            <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
              isDark ? 'border-white/[0.06]' : 'border-slate-100'
            }`}>
              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  {candidate.candidate_name || candidate.name}
                </h2>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {candidate.email || candidate.candidate_email} &bull; Applied for{' '}
                  <span className="font-semibold text-sky-600 dark:text-sky-400">{candidate.roleApplied || 'Lead Systems Architect'}</span>
                </p>
              </div>

              {/* Luminous Match Meter */}
              <div className="flex items-center space-x-3 flex-shrink-0">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 48 48">
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
                      strokeWidth="3"
                      fill="none"
                    />
                    <circle
                      cx="24"
                      cy="24"
                      r="20"
                      stroke={overallScore >= 80 ? '#10B981' : '#F59E0B'}
                      strokeWidth="3.2"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 20}
                      strokeDashoffset={2 * Math.PI * 20 * (1 - overallScore / 100)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute font-mono text-xs font-bold">{overallScore}%</span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold">AI Match Score</div>
                  <div className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Calibrated via BYOK</div>
                </div>
              </div>
            </div>

            {/* Explainable Skill Lists: Green Matched vs Red Missing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Green Matched Skills */}
              <div className="p-4 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Matched Competencies ({matchedSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {matchedSkills.map((s) => (
                    <span
                      key={s}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-500/25 text-xs font-mono font-medium"
                    >
                      +{s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Red Missing Skills */}
              <div className="p-4 rounded-2xl bg-rose-500/[0.06] border border-rose-500/25 space-y-2">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-rose-700 dark:text-rose-400">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Missing Gaps Identified ({missingSkills.length})</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {missingSkills.length > 0 ? (
                    missingSkills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 border border-rose-500/25 text-xs font-mono font-medium"
                      >
                        -{s}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-500 italic">No missing critical skills identified.</span>
                  )}
                </div>
              </div>
            </div>

            {/* AI Summary Dossier */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className={`text-xs font-semibold flex items-center space-x-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  <span>Explainable AI Technical Synthesis</span>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  {candidate.engine || 'BYOK Deep Inference Enclave'}
                </span>
              </div>
              {renderStructuredSynthesis(candidate.summary || candidate.reasoning, isDark)}
            </div>

            {/* Verbatim Debrief Notes & Cryptographic Seal */}
            <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
              <div className="flex items-center justify-between">
                <label className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Hiring Manager Debrief Notes & Recommendation
                </label>
                {isImmutable && (
                  <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                    <Lock className="w-3 h-3" />
                    <span>Cryptographically Sealed</span>
                  </span>
                )}
              </div>

              <textarea
                rows="3"
                disabled={isImmutable}
                value={debriefText}
                onChange={(e) => setDebriefText(e.target.value)}
                placeholder="Enter technical interview feedback, whiteboard notes, and final recommendation..."
                className={`w-full p-3 text-xs rounded-xl border focus:outline-none focus:border-blue-500 transition-all ${
                  isDark
                    ? 'bg-black/50 border-white/[0.08] text-white disabled:opacity-60'
                    : 'bg-slate-50 border-slate-200 text-slate-900 disabled:opacity-60'
                }`}
              />

              {!isImmutable && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleSealAndSubmit}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all flex items-center space-x-2 cursor-pointer hover:scale-[1.02]"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span>Seal Technical Recommendation & Route to HR</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
