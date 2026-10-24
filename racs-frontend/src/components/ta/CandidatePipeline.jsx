import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  User,
} from 'lucide-react';

export function CandidatePipeline({ onNavigate, onSelectCandidate }) {
  const { candidates, jobPostings, requisitions } = useAuth();
  const { isDark } = useTheme();
  const allReqs = jobPostings || requisitions || [];
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedReqFilter, setSelectedReqFilter] = useState('ALL');

  const getStatus = (c) => c.pipeline_status || c.status || 'Screening';

  const stages = [
    { id: 'ALL', label: 'All Candidates', count: candidates.length },
    { id: 'Screening', label: 'Screening', count: candidates.filter((c) => getStatus(c) === 'Screening').length },
    { id: 'HM Review', label: 'HM Review', count: candidates.filter((c) => getStatus(c) === 'HM Review').length },
    { id: 'Interview Completed', label: 'Interview Completed', count: candidates.filter((c) => getStatus(c) === 'Interview Completed').length },
    { id: 'Ready for Offer Authorization', label: 'Offer Ready', count: candidates.filter((c) => getStatus(c) === 'Ready for Offer Authorization').length },
    { id: 'Offer Dispatched & Awaiting Signature', label: 'Offer Dispatched', count: candidates.filter((c) => getStatus(c) === 'Offer Dispatched & Awaiting Signature').length },
  ];

  const filteredCandidates = candidates.filter((c) => {
    const cStatus = getStatus(c);
    const req = allReqs.find((r) => (r.job_id || r.id) === (c.job_id || c.targetRequisitionId));
    const reqTitle = req?.job_title || req?.title || c.requisitionTitle || '';
    const candName = c.candidate_name || c.name || '';
    const candTitle = c.currentTitle || '';

    const matchesSearch =
      candName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      reqTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candTitle.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage = selectedStage === 'ALL' || cStatus === selectedStage;
    const reqId = c.job_id || c.targetRequisitionId;
    const matchesReq = selectedReqFilter === 'ALL' || reqId === selectedReqFilter;

    return matchesSearch && matchesStage && matchesReq;
  });

  const handleExportCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Candidate ID,Name,Requisition,Match %,Status,Experience,Location']
        .concat(
          filteredCandidates.map((c) => {
            const req = allReqs.find((r) => (r.job_id || r.id) === (c.job_id || c.targetRequisitionId));
            const rTitle = req?.job_title || req?.title || c.requisitionTitle || 'Engineering';
            return `"${c.candidate_id || c.id}","${c.candidate_name || c.name}","${rTitle}",${c.overallMatch}%,"${getStatus(c)}","${c.experienceYears}y","${c.location}"`;
          })
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RACS_AI_Pipeline_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            <span>Talent Pipeline Ledger &bull; Real-time AI Tracking</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Candidate Pipeline & Match Ranking
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Filter by recruitment stage, inspect explainable match scores, and export compliant CSV records.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCsv}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border shadow-sm ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-blue-500" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs Bar */}
      <div className={`flex flex-wrap items-center gap-2 border-b pb-3 ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        {stages.map((stage) => {
          const isActive = selectedStage === stage.id;
          return (
            <button
              key={stage.id}
              onClick={() => setSelectedStage(stage.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                isActive
                  ? 'bg-sky-500 text-white font-semibold shadow-md shadow-sky-500/25'
                  : isDark
                    ? 'bg-[#0E1320]/80 border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
              }`}
            >
              <span>{stage.label}</span>
              <span
                className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] font-mono ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : isDark
                      ? 'bg-white/[0.04] text-slate-400'
                      : 'bg-slate-100 text-slate-600'
                }`}
              >
                {stage.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search & Requisition Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search candidate name, title, or skills..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isDark
                ? 'bg-[#0E1320]/80 border-white/[0.08] text-white placeholder-slate-500'
                : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm'
            }`}
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedReqFilter}
            onChange={(e) => setSelectedReqFilter(e.target.value)}
            className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer ${
              isDark
                ? 'bg-[#0E1320] border-white/[0.08] text-slate-300'
                : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <option value="ALL">All Requisitions ({allReqs.length})</option>
            {allReqs.map((req) => {
              const reqId = req.job_id || req.id;
              return (
                <option key={reqId} value={reqId}>
                  {req.job_title || req.title} ({reqId})
                </option>
              );
            })}
          </select>
        </div>
      </div>

      {/* Candidates List / Table */}
      <div className={`rounded-2xl border shadow-xl overflow-hidden transition-colors ${
        isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
      }`}>
        <div className={`p-4 border-b flex items-center justify-between ${
          isDark ? 'border-white/[0.08]' : 'border-slate-100'
        }`}>
          <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Candidates In Pipeline ({filteredCandidates.length})
          </span>
          <span className="text-[11px] font-mono text-slate-500">Live Backend State</span>
        </div>

        <div className="overflow-x-auto">
          {filteredCandidates.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
                <User className="w-6 h-6" />
              </div>
              <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Candidates in Pipeline</h3>
              <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                {candidates.length === 0
                  ? 'No candidate dossiers have been ingested yet. Navigate to "Resume Batch Intake" to upload PDF/DOCX/TXT resumes.'
                  : 'No candidates match the selected stage or search filters.'}
              </p>
              {candidates.length === 0 && (
                <button
                  onClick={() => onNavigate && onNavigate('ta-intake')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white text-xs font-semibold hover:from-sky-500 hover:to-blue-600 transition-all cursor-pointer shadow-md shadow-sky-500/25"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Go to Batch Resume Intake</span>
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className={`text-slate-500 uppercase tracking-wider font-semibold border-b text-[10px] ${
                isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-100'
              }`}>
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Requisition Target</th>
                  <th className="py-3 px-4">AI Score</th>
                  <th className="py-3 px-4">Pipeline Stage</th>
                  <th className="py-3 px-4">Experience</th>
                  <th className="py-3 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-white/[0.05] text-slate-300' : 'divide-slate-100 text-slate-700'
              }`}>
                {filteredCandidates.map((c) => {
                  const candId = c.candidate_id || c.id;
                  const candName = c.candidate_name || c.name;
                  const req = allReqs.find((r) => (r.job_id || r.id) === (c.job_id || c.targetRequisitionId));
                  const reqTitle = req?.job_title || req?.title || c.requisitionTitle || 'Engineering Requisition';
                  const currentStatus = getStatus(c);

                  return (
                    <tr key={candId} className={`transition-colors ${
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                    }`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={c.avatar}
                            alt={candName}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-blue-500/20"
                          />
                          <div>
                            <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{candName}</div>
                            <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{c.currentTitle}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-medium">
                        <div className={isDark ? 'text-slate-200' : 'text-slate-900'}>{reqTitle}</div>
                        <div className="text-[10px] text-sky-600 dark:text-sky-400 font-mono mt-0.5">{c.job_id || c.targetRequisitionId}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-14 h-2 rounded-full overflow-hidden ${
                            isDark ? 'bg-white/[0.08]' : 'bg-slate-200'
                          }`}>
                            <div
                              className="h-full rounded-full bg-sky-500"
                              style={{ width: `${c.overallMatch}%` }}
                            />
                          </div>
                          <span className={`font-mono font-bold text-[11px] ${isDark ? 'text-white' : 'text-slate-900'}`}>{c.overallMatch}%</span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-mono">
                          {currentStatus}
                        </span>
                      </td>

                      <td className={`py-3 px-4 font-mono text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {c.experienceYears} Years
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (onSelectCandidate) onSelectCandidate(candId);
                            if (onNavigate) onNavigate('hm-candidates');
                          }}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-sm shadow-sky-500/20"
                        >
                          <span>Inspect AI</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
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
