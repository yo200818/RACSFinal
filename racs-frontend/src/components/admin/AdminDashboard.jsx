import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import { AntigravityCanvas } from '../common/AntigravityCanvas';
import {
  Shield,
  UserPlus,
  KeyRound,
  FileText,
  Lock,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';

export function AdminDashboard({ onNavigate }) {
  const {
    workspace,
    byokConfig,
    users,
    invitations = [],
    generateInvitation,
    auditLogs = [],
    candidates = [],
    jobPostings = [],
    loadDemoData,
    addToast,
  } = useAuth();
  const { isDark } = useTheme();

  const [selectedRole, setSelectedRole] = useState(ROLES.TALENT_ACQUISITION);
  const [targetEmail, setTargetEmail] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [lastGeneratedLink, setLastGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const activeInvites = invitations.filter(
    (inv) => !inv.is_used && new Date(inv.expires_at) > new Date()
  );

  const isCleanWorkspace = users.length <= 1 && candidates.length === 0 && jobPostings.length === 0;

  const handleCreateInvite = async (e) => {
    e.preventDefault();
    if (!targetEmail || !targetEmail.includes('@')) {
      addToast('Validation Error', 'Please enter a valid corporate email address.', 'error');
      return;
    }

    setIsGenerating(true);
    const createdInvite = await generateInvitation({
      targetRole: selectedRole,
      email: targetEmail.trim(),
      department: department.trim(),
    });
    setIsGenerating(false);

    if (createdInvite) {
      const token = createdInvite.invite_token || createdInvite.inviteToken;
      const fullUrl = `${window.location.origin}/?token=${token}`;
      setLastGeneratedLink(fullUrl);
      setTargetEmail('');
    }
  };

  const handleCopy = (link) => {
    navigator.clipboard.writeText(link || lastGeneratedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Copied', 'Role invitation link copied to clipboard.', 'info');
  };

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl">
      {/* Editorial Header */}
      <div
        className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pb-6 border-b transition-colors ${
          isDark ? 'border-white/[0.08]' : 'border-slate-200'
        }`}
      >
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-sky-400">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
            <span>ROOT SECURITY &bull; WORKSPACE ISOLATION</span>
          </div>
          <h1 className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            System Administration
          </h1>
          <p
            className={`text-sm leading-relaxed ${
              isDark ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            Manage organization membership, issue 48-hour role invitations, configure tenant inference keys, and monitor verified cryptographic audit trails for{' '}
            <span className="font-semibold text-sky-600 dark:text-sky-400">
              {workspace.company_name || workspace.companyName || 'your enterprise'}
            </span>.
          </p>
        </div>

        <div className="flex items-center space-x-3 flex-shrink-0">
          <button
            onClick={() => onNavigate('admin-byok')}
            className={`inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-sky-500" />
            <span>Configure BYOK</span>
          </button>
          <button
            onClick={() => onNavigate('admin-invites')}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>View All Invites ({activeInvites.length})</span>
          </button>
        </div>
      </div>

      {/* Editorial Stat Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-2">
        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Active Collaborators
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{users.length}</div>
          <div className="text-[11px] text-slate-500 font-mono">RBAC Isolated Members</div>
        </div>

        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Pending Invitations
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{activeInvites.length}</div>
          <div className="text-[11px] text-slate-500 font-mono">48h Token Validity</div>
        </div>

        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            BYOK AI Enclave
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {byokConfig.encrypted_api_key && !byokConfig.encrypted_api_key.includes('No key')
              ? 'AES-256'
              : 'Ready'}
          </div>
          <div className="text-[11px] text-sky-600 dark:text-sky-400 font-mono">
            {byokConfig.encrypted_api_key && !byokConfig.encrypted_api_key.includes('No key')
              ? 'Encrypted in MySQL'
              : 'Awaiting Secret Key'}
          </div>
        </div>

        <div className="space-y-1">
          <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Audit Ledger Events
          </div>
          <div className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{auditLogs.length}</div>
          <div className="text-[11px] text-slate-500 font-mono">SHA-256 Tamper Sealed</div>
        </div>
      </div>

      {/* Antigravity Interactive Security Visualizer */}
      <div
        className={`relative rounded-3xl overflow-hidden border p-6 sm:p-8 transition-colors ${
          isDark
            ? 'border-white/[0.08] bg-gradient-to-b from-white/[0.03] to-transparent'
            : 'border-slate-200 bg-gradient-to-b from-sky-50/40 to-white shadow-sm'
        }`}
      >
        <div className="absolute inset-0 opacity-40 pointer-events-auto">
          <AntigravityCanvas particleCount={36} interactive={true} />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pointer-events-none">
          <div className="space-y-1 max-w-lg">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-600 dark:text-sky-400">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
              <span>LIVE TENANT ENCLAVE MESH</span>
            </div>
            <h2 className={`text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Hardware Security & Cryptographic Boundary
            </h2>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Move your cursor across the canvas to interact with cryptographic node filaments. Workspace data is strictly isolated within MySQL using tenant-scoped UUID foreign keys and AES-256 encryption.
            </p>
          </div>

          <div className="flex items-center space-x-3 pointer-events-auto">
            {isCleanWorkspace && (
              <button
                onClick={loadDemoData}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center space-x-1.5 ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Load Sample Data</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('admin-audit')}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center space-x-1.5 ${
                isDark
                  ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/[0.08]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>Inspect Ledger</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Feature: Cryptographic Role Invitation Generator */}
      <div
        className={`rounded-3xl border p-6 sm:p-8 space-y-6 transition-colors ${
          isDark
            ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-xl shadow-black/30'
            : 'border-slate-200 bg-white shadow-sm'
        }`}
      >
        <div
          className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b ${
            isDark ? 'border-white/[0.06]' : 'border-slate-200'
          }`}
        >
          <div>
            <h3 className={`text-base font-semibold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Role-Based Member Invitation
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Generate one-time 48-hour invite links to onboard team members directly into isolated role dashboards.
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Enforces Zero Public Registration
          </span>
        </div>

        {/* Form Controls */}
        <form onSubmit={handleCreateInvite} className="space-y-5">
          {/* Persona Selection Pills */}
          <div>
            <label className={`block text-xs font-semibold mb-2.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Select Target Workspace Role
            </label>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {[
                { role: ROLES.TALENT_ACQUISITION, name: 'Talent Acquisition', desc: 'Resume OCR & Pipeline' },
                { role: ROLES.HIRING_MANAGER, name: 'Hiring Manager', desc: 'Scorecards & Reqs' },
                { role: ROLES.HR_REPRESENTATIVE, name: 'HR Representative', desc: 'Offers & Pay Parity' },
                { role: ROLES.ENGAGEMENT_SPECIALIST, name: 'Engagement', desc: 'Pre-boarding Sequences' },
              ].map((item) => (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => setSelectedRole(item.role)}
                  className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                    selectedRole === item.role
                      ? isDark
                        ? 'bg-blue-600/15 border-blue-500 text-white shadow-sm ring-1 ring-blue-500/20'
                        : 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm ring-1 ring-sky-300'
                      : isDark
                        ? 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                  }`}
                >
                  <div className="text-xs font-semibold">{item.name}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Inputs Row */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-6">
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Recipient Work Email
              </label>
              <input
                type="email"
                required
                value={targetEmail}
                onChange={(e) => setTargetEmail(e.target.value)}
                placeholder="colleague@enterprise.com"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="sm:col-span-4">
              <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Assigned Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Platform Engineering"
                className={`w-full px-3.5 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400 transition-all ${
                  isDark
                    ? 'bg-white/[0.03] border-white/[0.08] text-white placeholder-slate-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div className="sm:col-span-2 flex items-end">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold transition-all shadow-md shadow-sky-500/25 cursor-pointer disabled:opacity-50 h-[38px] flex items-center justify-center space-x-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>{isGenerating ? 'Generating...' : 'Issue Invite'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Generated Invite Token Result Card */}
        {lastGeneratedLink && (
          <div
            className={`p-4 rounded-2xl border space-y-2 animate-fadeIn ${
              isDark
                ? 'bg-blue-500/10 border-blue-500/20'
                : 'bg-sky-50 border-sky-200'
            }`}
          >
            <div className="flex items-center justify-between text-xs">
              <span className="text-sky-600 dark:text-sky-400 font-semibold flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-sky-500" />
                <span>One-Time Invitation Link Generated</span>
              </span>
              <span className="text-slate-500 font-mono text-[11px]">Valid 48 Hours</span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                readOnly
                value={lastGeneratedLink}
                className={`flex-1 px-3 py-2 rounded-xl border text-xs font-mono focus:outline-none ${
                  isDark
                    ? 'bg-black/40 border-white/[0.08] text-blue-300'
                    : 'bg-white border-slate-200 text-slate-900'
                }`}
              />
              <div className="flex items-center space-x-2 flex-shrink-0">
                <button
                  onClick={() => handleCopy()}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1.5 shadow-md shadow-sky-500/25"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Link'}</span>
                </button>
                <a
                  href={lastGeneratedLink}
                  target="_blank"
                  rel="noreferrer"
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isDark
                      ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                      : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                  }`}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
