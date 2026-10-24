import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Mail,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Send,
  Eye,
  Sliders,
  Play,
  Pause,
  ArrowRight,
  Calendar,
  Layers,
} from 'lucide-react';

export function EmailSequenceConfigurator() {
  const { sequences, toggleSequence, addToast } = useAuth();
  const { isDark } = useTheme();
  const [selectedSeqId, setSelectedSeqId] = useState('SEQ-101');
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  const selectedSeq = sequences.find((s) => s.id === selectedSeqId) || sequences[0];
  const activeStep = selectedSeq.steps[selectedStepIdx] || selectedSeq.steps[0];

  const [emailSubject, setEmailSubject] = useState(activeStep.subject);
  const [emailBody, setEmailBody] = useState(activeStep.snippet);

  const handleSelectStep = (idx) => {
    setSelectedStepIdx(idx);
    setEmailSubject(selectedSeq.steps[idx].subject);
    setEmailBody(selectedSeq.steps[idx].snippet);
  };

  const handleSaveTemplate = () => {
    addToast('Cadence Template Updated', `Step on Day ${activeStep.day} saved and synced to active enrollments.`, 'success');
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
            <span>Automated Cadence & Nurture Engine</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Automated Email Sequence Configurator
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Design multi-touch onboarding cadences, set timing intervals (7-day cadence), and toggle active pre-boarding triggers.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => toggleSequence(selectedSeq.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
              selectedSeq.active
                ? 'bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white shadow-md shadow-sky-500/20'
                : isDark
                  ? 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.08]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
          >
            {selectedSeq.active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{selectedSeq.active ? 'Sequence Active' : 'Sequence Paused'}</span>
          </button>
        </div>
      </div>

      {/* Sequence Selector Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sequences.map((seq) => {
          const isSelected = seq.id === selectedSeqId;
          return (
            <div
              key={seq.id}
              onClick={() => {
                setSelectedSeqId(seq.id);
                setSelectedStepIdx(0);
                setEmailSubject(seq.steps[0].subject);
                setEmailBody(seq.steps[0].snippet);
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? isDark
                    ? 'bg-blue-600/15 border-blue-500 ring-2 ring-blue-500/20 text-white shadow-xl shadow-black/40'
                    : 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 text-slate-900 shadow-md'
                  : isDark
                    ? 'bg-[#0E1320]/80 border-white/[0.08] hover:border-white/[0.18]'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-sky-600 dark:text-blue-400">{seq.id}</span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full font-mono ${
                    seq.active
                      ? 'bg-sky-500/10 dark:bg-blue-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20 dark:border-blue-500/20'
                      : isDark
                        ? 'bg-white/[0.04] text-slate-500 border border-white/[0.08]'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                  }`}
                >
                  {seq.active ? 'Active Cadence' : 'Paused'}
                </span>
              </div>
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{seq.name}</h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{seq.targetRole}</p>
              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-mono ${
                isDark ? 'border-white/[0.06] text-slate-500' : 'border-slate-100 text-slate-500'
              }`}>
                <span>{seq.steps.length} Automated Steps</span>
                <span className="text-sky-600 dark:text-blue-400 font-bold">{seq.totalEnrolled} Candidates Enrolled</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Timeline Node Flow Preview */}
      <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
        isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className={`flex items-center justify-between pb-3 border-b ${
          isDark ? 'border-white/[0.08]' : 'border-slate-100'
        }`}>
          <div>
            <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Cadence Interval Timeline Nodes ({selectedSeq.steps.length} Steps)
            </h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Interactive timeline nodes. Click any step to inspect or edit template copy.
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-sky-600 dark:text-blue-400 bg-sky-500/10 dark:bg-blue-500/10 px-2.5 py-1 rounded-full border border-sky-500/20 dark:border-blue-500/20">
            Cadence: 7-Day Intervals
          </span>
        </div>

        {/* Visual Timeline Nodes with Connecting Line */}
        <div className="relative py-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[700px] relative">
            {/* Horizontal Line */}
            <div className={`absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 -z-0 ${
              isDark ? 'bg-white/[0.08]' : 'bg-slate-200'
            }`} />

            {selectedSeq.steps.map((st, idx) => {
              const isSelected = selectedStepIdx === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectStep(idx)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                >
                  {/* Step Bubble */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-xs transition-all shadow-md ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white ring-4 ring-sky-400/20 scale-110 shadow-lg shadow-sky-500/25'
                        : isDark
                          ? 'bg-[#0A0D14] border-2 border-white/[0.1] text-slate-400 group-hover:border-blue-500/50 group-hover:text-white'
                          : 'bg-white border-2 border-slate-200 text-slate-600 group-hover:border-sky-400 group-hover:text-sky-600 shadow-sm'
                    }`}
                  >
                    Day {st.day}
                  </div>

                  <span className={`text-xs font-bold mt-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Step {idx + 1}
                  </span>
                  <span className={`text-[10px] max-w-[120px] text-center truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {st.trigger}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Step Template Inspector & Live Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor (6 cols) */}
        <div className={`lg:col-span-6 rounded-3xl p-6 border shadow-xl space-y-4 ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}>
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-blue-400 uppercase tracking-wider block font-mono">
                Step {selectedStepIdx + 1} &bull; Day {activeStep.day} Trigger
              </span>
              <h4 className={`text-sm font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Edit Email Template
              </h4>
            </div>
            <span className={`text-xs font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Open Rate: {activeStep.openRate}%</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Subject Line</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className={`w-full p-2.5 rounded-xl border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Email Body Copy</label>
              <textarea
                rows={6}
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className={`w-full p-3 rounded-xl border text-xs leading-relaxed focus:outline-none focus:ring-2 focus:ring-sky-400 resize-none font-sans ${
                  isDark ? 'bg-black/40 border-white/[0.08] text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleSaveTemplate}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-white font-bold hover:from-sky-500 hover:to-blue-600 transition-all shadow-md shadow-sky-500/20 cursor-pointer text-xs"
              >
                Save Template Updates
              </button>
            </div>
          </div>
        </div>

        {/* Live Email Preview (6 cols) */}
        <div className={`lg:col-span-6 rounded-3xl p-6 border shadow-xl space-y-4 ${
          isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}>
            <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <Eye className="w-3.5 h-3.5 text-sky-500 dark:text-blue-400" />
              <span>Candidate Inbox Live Preview</span>
            </h4>
            <span className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>From: onboarding@racsai.enterprise</span>
          </div>

          {/* Email mockup shell */}
          <div className={`rounded-2xl border p-5 shadow-inner space-y-3 ${
            isDark ? 'bg-black/50 border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className={`border-b pb-2.5 ${isDark ? 'border-white/[0.06]' : 'border-slate-200'}`}>
              <span className="text-[10px] text-slate-500 uppercase font-mono block">Subject:</span>
              <div className={`text-sm font-bold tracking-tight mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {emailSubject}
              </div>
            </div>

            <div className={`text-xs leading-relaxed space-y-3 font-sans ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              <p>Hi Marcus,</p>
              <p>{emailBody}</p>
              <p className={`text-[11px] pt-3 border-t ${isDark ? 'border-white/[0.06] text-slate-500' : 'border-slate-200 text-slate-500'}`}>
                Warm regards,<br />
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>RACS AI People Operations & Onboarding Team</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
