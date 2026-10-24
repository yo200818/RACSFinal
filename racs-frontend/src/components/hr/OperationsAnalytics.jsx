import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  DollarSign,
  PieChart,
} from 'lucide-react';

export function OperationsAnalytics() {
  const { addToast } = useAuth();
  const { isDark } = useTheme();
  const [dateRange, setDateRange] = useState('LAST_90_DAYS');

  const handleExport = () => {
    addToast('Report Exported', 'Time-to-hire & operations report exported to CSV.', 'success');
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
            <span>HR Operations &bull; Longitudinal Analytics</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Recruitment Velocity & Time-to-Hire Analytics
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Evaluate cost-per-hire efficiency, statutory compliance audit dockets, and offer acceptance rates.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className={`px-3.5 py-2 text-xs rounded-xl border focus:outline-none cursor-pointer ${
              isDark ? 'bg-[#0E1320] border-white/[0.08] text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-sm'
            }`}
          >
            <option value="LAST_30_DAYS">Last 30 Days</option>
            <option value="LAST_90_DAYS">Last 90 Days (Q4 2026)</option>
            <option value="YEAR_TO_DATE">Year to Date 2026</option>
          </select>

          <button
            onClick={handleExport}
            className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer border shadow-sm ${
              isDark
                ? 'bg-white/[0.04] border-white/[0.08] text-slate-300 hover:bg-white/[0.08] hover:text-white'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-sky-500 dark:text-blue-400" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`rounded-2xl p-6 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Average Time-to-Hire</span>
            <Clock className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>18.2 Days</span>
            <span className="text-xs font-bold text-sky-600 dark:text-blue-400 flex items-center font-mono">
              <TrendingDown className="w-3.5 h-3.5 mr-0.5" />
              -43% vs Industry
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Industry benchmark: 32 days for Senior Engineering</p>
        </div>

        <div className={`rounded-2xl p-6 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Offer Acceptance Rate</span>
            <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>92.4%</span>
            <span className="text-xs font-bold text-sky-600 dark:text-blue-400 flex items-center font-mono">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" />
              +8.1% YoY
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">12 of 13 extended offers signed in Q4</p>
        </div>

        <div className={`rounded-2xl p-6 border shadow-xl ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase">
            <span>Effective Cost-Per-Hire</span>
            <DollarSign className="w-4 h-4 text-sky-500 dark:text-blue-400" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className={`text-3xl font-bold font-mono tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>$1,840</span>
            <span className="text-xs font-bold text-sky-600 dark:text-blue-400 font-mono">71% Savings</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Compared to legacy external agency fees ($6,400+)</p>
        </div>
      </div>

      {/* Stage Breakdown Table */}
      <div className={`rounded-2xl border shadow-xl overflow-hidden transition-colors ${
        isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
      }`}>
        <div className={`p-5 border-b ${isDark ? 'border-white/[0.08]' : 'border-slate-100'}`}>
          <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Stage Turnaround Breakdown</h3>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average days spent by candidates in each pipeline stage.</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>1. Resume Ingestion & AI Scoring</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>0.2 Days (Real-time OCR)</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'}`}>
              <div className="h-full bg-sky-500 rounded-full w-[8%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>2. Hiring Manager Debrief & Technical Loop</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>4.5 Days</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'}`}>
              <div className="h-full bg-sky-400 rounded-full w-[35%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>3. Background Check & Compliance Verification</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>2.1 Days</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'}`}>
              <div className="h-full bg-blue-400 rounded-full w-[20%]" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>4. Executive Compensation Governance & Sign-off</span>
              <span className={`font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>1.4 Days</span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? 'bg-white/[0.08]' : 'bg-slate-200'}`}>
              <div className="h-full bg-blue-400 rounded-full w-[14%]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
