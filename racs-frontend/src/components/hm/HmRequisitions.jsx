import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sliders,
  Sparkles,
  Save,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
} from 'lucide-react';

export function HmRequisitions({ onNavigate }) {
  const { jobPostings, requisitions, setJobPostings, addToast, recordAuditLog } = useAuth();
  const { isDark } = useTheme();
  const allReqs = (jobPostings || requisitions || []).filter((r) => r.status === 'Active');

  const [selectedReqId, setSelectedReqId] = useState(allReqs[0]?.job_id || allReqs[0]?.id || 'REQ-2024-089');

  const selectedReq =
    allReqs.find((r) => (r.job_id || r.id) === selectedReqId) || allReqs[0] || {};

  const defaultWeights = {
    technicalProficiency: 35,
    systemArchitecture: 30,
    frameworkRecency: 20,
    cultureCollaboration: 15,
  };

  const [weights, setWeights] = useState(selectedReq.rubricWeights || defaultWeights);

  const handleWeightChange = (key, val) => {
    setWeights((prev) => ({
      ...prev,
      [key]: parseInt(val, 10),
    }));
  };

  const handleSaveWeights = () => {
    const reqId = selectedReq.job_id || selectedReq.id;
    if (setJobPostings) {
      setJobPostings((prev) =>
        prev.map((r) => ((r.job_id || r.id) === reqId ? { ...r, rubricWeights: weights } : r))
      );
    }
    recordAuditLog(
      `AI Scoring Rubric Calibrated by Hiring Manager`,
      `Requisition ${selectedReq.job_title || selectedReq.title} (${reqId}) - Weights: Tech ${weights.technicalProficiency}%, Arch ${weights.systemArchitecture}%`,
      'RUBRIC_RECALIBRATED'
    );
    addToast(
      'AI Scoring Rubric Updated',
      `Weights recalibrated for ${selectedReq.job_title || selectedReq.title}. Candidate rankings refreshed across active pipeline.`,
      'success'
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`pb-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
            <span>Hiring Manager Enclave &bull; Scoring Model Calibration</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            AI Rubric Calibration & Requisition Portfolio
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Fine-tune generative AI scoring weights to match your team's exact architectural and domain requirements.
          </p>
        </div>
      </div>

      {/* Select Requisition */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {allReqs.map((req) => {
          const reqId = req.job_id || req.id;
          const isSelected = reqId === selectedReqId;
          const compMin = req.compensation_min || 180000;
          const compMax = req.compensation_max || 220000;

          return (
            <button
              key={reqId}
              onClick={() => {
                setSelectedReqId(reqId);
                setWeights(req.rubricWeights || defaultWeights);
              }}
              className={`text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/20 text-white shadow-lg shadow-black/40'
                    : 'bg-sky-50/90 border-sky-400 ring-2 ring-sky-300/40 text-slate-900 shadow-md'
                  : isDark
                    ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18] text-slate-300'
                    : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold mb-1">
                <span>{reqId}</span>
                <span className={`text-[10px] font-normal ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {req.department?.split('-')[0]}
                </span>
              </div>
              <h4 className={`text-xs font-bold truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {req.job_title || req.title}
              </h4>
              <p className={`text-[11px] mt-1 font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                ${compMin.toLocaleString()} - ${compMax.toLocaleString()}
              </p>
            </button>
          );
        })}
      </div>

      {/* Interactive Rubric Calibration Workspace */}
      <div className={`rounded-3xl p-6 border shadow-xl transition-colors ${
        isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/40' : 'bg-white border-slate-200 shadow-slate-200/50'
      }`}>
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
          isDark ? 'border-white/[0.08]' : 'border-slate-200'
        }`}>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/20">
                {selectedReq.job_id || selectedReq.id}
              </span>
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {selectedReq.job_title || selectedReq.title} Rubric Weights
              </h3>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Currently active scoring matrix: <span className="font-mono text-sky-600 dark:text-sky-400 font-medium">{selectedReq.activeAiProfile || 'Autonomous Profile v2.4'}</span>
            </p>
          </div>

          <button
            onClick={handleSaveWeights}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/25 flex items-center space-x-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Re-rank Pipeline</span>
          </button>
        </div>

        {/* Weights Sliders - Clean Sky/Blue Tone Scales */}
        <div className="mt-6 space-y-5">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>Technical Proficiency & Live Coding</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{weights.technicalProficiency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weights.technicalProficiency}
              onChange={(e) => handleWeightChange('technicalProficiency', e.target.value)}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>System Architecture & Scalability</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{weights.systemArchitecture}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.systemArchitecture}
              onChange={(e) => handleWeightChange('systemArchitecture', e.target.value)}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>Framework Recency & Internals</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{weights.frameworkRecency}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="40"
              value={weights.frameworkRecency}
              onChange={(e) => handleWeightChange('frameworkRecency', e.target.value)}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-200' : 'text-slate-800'}>Culture, Collaboration & Mentorship</span>
              <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{weights.cultureCollaboration}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              value={weights.cultureCollaboration}
              onChange={(e) => handleWeightChange('cultureCollaboration', e.target.value)}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
