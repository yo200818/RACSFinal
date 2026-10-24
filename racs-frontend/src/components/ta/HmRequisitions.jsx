import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Briefcase,
  Users,
  DollarSign,
  Cpu,
  Layers,
  ArrowRight,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  Link,
  ChevronRight,
  TrendingDown,
  X,
  Building,
} from 'lucide-react';

export function HmRequisitions({ onNavigate }) {
  const { jobPostings, requisitions, candidates, createJobPosting, addToast, recordAuditLog } = useAuth();
  const { isDark } = useTheme();
  const allReqs = (jobPostings || requisitions || []).filter((r) => r.status === 'Active');

  const [stageFilter, setStageFilter] = useState('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Requisition Form state (POST /api/jobs)
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering - Frontend Platform');
  const [newCompMin, setNewCompMin] = useState(180000);
  const [newCompMax, setNewCompMax] = useState(220000);
  const [newHeadcount, setNewHeadcount] = useState(1);

  const filteredRevs = allReqs.filter((r) => {
    if (stageFilter === 'ALL') return true;
    return (r.status || '').toLowerCase().includes(stageFilter.toLowerCase());
  });

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    createJobPosting({
      job_title: newTitle.trim(),
      department: newDept.trim(),
      compensation_min: Number(newCompMin),
      compensation_max: Number(newCompMax),
      target_headcount: Number(newHeadcount),
    });

    setShowCreateModal(false);
    setNewTitle('');
  };

  const handleHandoff = (req) => {
    const reqId = req.job_id || req.id;
    const reqTitle = req.job_title || req.title;
    recordAuditLog(
      `Candidate Batch Handed off to HM Review`,
      `Requisition: ${reqTitle} (${reqId}) - Directed to ${req.requestingHiringManager || 'Hiring Lead'}`,
      'HM_ROUTED_VERIFIED'
    );
    addToast(
      'Handoff Dispatched to Hiring Manager',
      `Candidate shortlist for ${reqTitle} successfully pushed to ${req.requestingHiringManager || 'Hiring Lead'}'s review queue.`,
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
            <span>Talent Acquisition &bull; Hiring Manager Requisitions</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Hiring Manager Requisitions & SLA Calibration
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Manage hiring requests initiated by department leads, review target headcount allocations, and route candidate batches.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Requisition</span>
          </button>
        </div>
      </div>

      {/* Quick-filter Tabs */}
      <div className={`flex items-center space-x-2 pb-2 border-b ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        {[
          { id: 'ALL', label: 'All Requisitions', count: allReqs.length },
          { id: 'Active', label: 'Active Sourcing', count: allReqs.length },
        ].map((tab) => {
          const isActive = stageFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setStageFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/25'
                  : isDark
                    ? 'bg-[#0E1320]/80 border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : isDark
                      ? 'bg-white/[0.04] text-slate-400'
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Requisition Cards */}
      <div className="space-y-4">
        {filteredRevs.map((req) => {
          const reqId = req.job_id || req.id;
          const reqTitle = req.job_title || req.title;
          const reqCandidates = candidates.filter(
            (c) => (c.job_id || c.targetRequisitionId) === reqId
          );
          const screenedCount = reqCandidates.filter(
            (c) => (c.overallMatch || 0) >= 75
          ).length;

          return (
            <div
              key={reqId}
              className={`rounded-2xl p-6 border transition-all ${
                isDark
                  ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18] shadow-xl shadow-black/30'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {/* Top Row: Requisition Metadata & Actions */}
              <div className={`flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-4 border-b ${
                isDark ? 'border-white/[0.08]' : 'border-slate-100'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                      {reqId}
                    </span>
                    <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      {req.department}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-mono">
                      {req.status}
                    </span>
                  </div>
                  <h3 className={`text-lg font-bold tracking-tight mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {reqTitle}
                  </h3>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-2.5">
                  <button
                    onClick={() => onNavigate('ta-intake')}
                    className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                    }`}
                  >
                    Attach Resume Batch
                  </button>
                  <button
                    onClick={() => handleHandoff(req)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xs font-semibold hover:from-sky-500 hover:to-blue-600 shadow-md shadow-sky-500/25 transition-all cursor-pointer flex items-center space-x-1.5"
                  >
                    <span>Handoff to HM Review</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Middle Row: Specs Grid */}
              <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b text-xs ${
                isDark ? 'border-white/[0.08]' : 'border-slate-100'
              }`}>
                <div>
                  <span className={`font-medium block uppercase text-[10px] tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Requesting Lead
                  </span>
                  <span className={`font-bold mt-0.5 block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {req.requestingHiringManager || 'Engineering Lead'}
                  </span>
                </div>

                <div>
                  <span className={`font-medium block uppercase text-[10px] tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Target Headcount
                  </span>
                  <span className={`font-bold mt-0.5 block ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                    {req.target_headcount || req.targetHeadcount || 1} Hires Needed
                  </span>
                </div>

                <div>
                  <span className={`font-medium block uppercase text-[10px] tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Compensation Band
                  </span>
                  <span className="font-bold font-mono text-sky-600 dark:text-sky-400 mt-0.5 block">
                    ${(req.compensation_min || 180000).toLocaleString()} - ${(req.compensation_max || 220000).toLocaleString()}
                  </span>
                </div>

                <div>
                  <span className={`font-medium block uppercase text-[10px] tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Ingestion Funnel
                  </span>
                  <span className="font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">
                    {reqCandidates.length} Ingested &bull; {screenedCount} Qualified
                  </span>
                </div>
              </div>

              {/* Bottom Row: Active AI Scoring Profile */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Active AI Scoring Profile:</span>
                  <span className={`font-mono text-[11px] font-semibold px-2 py-0.5 rounded border ${
                    isDark ? 'bg-white/[0.04] text-blue-300 border-white/[0.08]' : 'bg-sky-50 text-sky-700 border-sky-200'
                  }`}>
                    {req.activeAiProfile || 'Autonomous Profile v2.4'}
                  </span>
                </div>
                <span className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  SLA Target: {req.slaTargetDays || 3.5} Days
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Requisition Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`border rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 ${
            isDark ? 'bg-[#0A0D14] border-white/[0.1] text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-white/[0.08]' : 'border-slate-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-sky-500 dark:text-sky-400" />
                <h3 className="text-sm font-bold">Publish New Job Requisition</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className={`p-1 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-3.5 text-xs">
              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Job Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Staff Distributed Systems Engineer"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.1] text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="e.g. AI Research - Core ML"
                  className={`w-full px-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.1] text-white placeholder-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Min Comp ($)</label>
                  <input
                    type="number"
                    value={newCompMin}
                    onChange={(e) => setNewCompMin(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.1] text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Max Comp ($)</label>
                  <input
                    type="number"
                    value={newCompMax}
                    onChange={(e) => setNewCompMax(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark
                        ? 'bg-white/[0.04] border-white/[0.1] text-white'
                        : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block font-semibold mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target Headcount</label>
                <input
                  type="number"
                  min="1"
                  value={newHeadcount}
                  onChange={(e) => setNewHeadcount(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? 'bg-white/[0.04] border-white/[0.1] text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-bold transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  Publish Requisition (job_postings)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
