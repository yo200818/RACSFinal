import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Users,
  UserPlus,
  ShieldAlert,
  Trash2,
  CheckCircle2,
  Lock,
  Mail,
  Building,
  Copy,
  Check,
  AlertTriangle,
  X,
  ExternalLink,
  Shield,
  Clock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

export function UserManagement({ initialTab = 'users', onNavigate }) {
  const { users, invitations = [], generateInvitation, revokeUserAccess, addToast, refreshWorkspaceData } = useAuth();
  const { isDark } = useTheme();
  const [activeSubTab, setActiveSubTab] = useState(initialTab);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [revokeUserTarget, setRevokeUserTarget] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  const handleManualSync = async () => {
    if (!refreshWorkspaceData) return;
    setIsSyncing(true);
    await refreshWorkspaceData();
    setTimeout(() => setIsSyncing(false), 400);
    addToast('Directory Synchronized', 'Team directory and active invitation tokens reloaded from database.', 'info');
  };

  React.useEffect(() => {
    if (refreshWorkspaceData) refreshWorkspaceData();
  }, [refreshWorkspaceData]);

  // Sync if initialTab changes
  React.useEffect(() => {
    setActiveSubTab(initialTab);
  }, [initialTab]);

  // Invite form state
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState(ROLES.TALENT_ACQUISITION);
  const [inviteDept, setInviteDept] = useState('Engineering & Product');
  const [generatedInviteLink, setGeneratedInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) {
      addToast('Validation Error', 'Please enter a valid corporate email.', 'error');
      return;
    }

    setIsGenerating(true);
    const createdInvite = await generateInvitation({
      targetRole: inviteRole,
      email: inviteEmail.trim(),
      department: inviteDept.trim(),
    });
    setIsGenerating(false);

    if (createdInvite) {
      const token = createdInvite.invite_token || createdInvite.inviteToken;
      const fullUrl = `${window.location.origin}/?token=${token}`;
      setGeneratedInviteLink(fullUrl);
      setInviteEmail('');
    }
  };

  const handleCopyLink = (linkToCopy) => {
    navigator.clipboard.writeText(linkToCopy || generatedInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast('Copied to Clipboard', 'Cryptographic invite URL copied.', 'info');
  };

  const confirmRevoke = () => {
    if (!revokeUserTarget) return;
    revokeUserAccess(revokeUserTarget.user_id || revokeUserTarget.id);
    setRevokeUserTarget(null);
  };

  const activeInvitesCount = invitations.filter((inv) => {
    const isUsed = Boolean(inv.is_used || inv.isUsed || inv.used);
    const expiresAt = inv.expires_at || inv.expiresAt;
    return !isUsed && new Date(expiresAt) > new Date();
  }).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`pb-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
            <span>Identity & Access Management (IAM) &bull; Spring Boot Controller Aligned</span>
          </div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            User Management & Cryptographic Role Invitations
          </h1>
          <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Non-admin personas cannot self-register publicly. Generate 48-hour role invite tokens, monitor active workspace collaborators, and enforce revocation boundaries.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className={`inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDark
                ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
            }`}
            title="Reload live team directory and invitation token statuses from MySQL database"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-sky-500 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing...' : 'Sync Database'}</span>
          </button>
          <button
            onClick={() => {
              setActiveSubTab('invitations');
              setGeneratedInviteLink('');
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold shadow-md shadow-sky-500/25 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Generate Role Invite</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className={`flex items-center space-x-2 border-b pb-3 ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <button
          onClick={() => setActiveSubTab('users')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'users'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
              : isDark
                ? 'bg-[#0E1320]/80 text-slate-400 hover:text-white border border-white/[0.08]'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Workspace Team Directory ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('invitations')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSubTab === 'invitations'
              ? 'bg-sky-500 text-white shadow-md shadow-sky-500/25'
              : isDark
                ? 'bg-[#0E1320]/80 text-slate-400 hover:text-white border border-white/[0.08]'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 shadow-sm'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Role Invitations & Tokens ({activeInvitesCount} Active / {invitations.length})</span>
        </button>
      </div>

      {/* INLINE ROLE INVITATION GENERATOR (Prominently shown on Invitations Tab) */}
      {activeSubTab === 'invitations' && (
        <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
          isDark ? 'bg-[#0E1320]/90 border-blue-500/30 shadow-black/40' : 'bg-white border-sky-200 shadow-slate-200/50'
        }`}>
          <div className={`flex items-center justify-between pb-3 border-b ${
            isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <h3 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Generate Role-Based Cryptographic Invite Link</h3>
                <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Issues a signed one-time registration link valid for 48 hours for the chosen role.</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold">
              48-Hour TTL Enforced
            </span>
          </div>

          <form onSubmit={handleGenerateInvite} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-end">
            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Target Persona Role <span className="text-blue-500">*</span>
              </label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${
                  isDark ? 'bg-[#0A0D14] border-white/[0.1] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              >
                <option value={ROLES.TALENT_ACQUISITION}>Talent Acquisition (TA Lead)</option>
                <option value={ROLES.HIRING_MANAGER}>Hiring Manager (HM Lead)</option>
                <option value={ROLES.HR_REPRESENTATIVE}>HR Representative (Governance)</option>
                <option value={ROLES.ENGAGEMENT_SPECIALIST}>Engagement Specialist (Pre-Boarding)</option>
              </select>
            </div>

            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Recipient Corporate Email <span className="text-blue-500">*</span>
              </label>
              <input
                type="email"
                required
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="collaborator@enterprise.internal"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-[#0A0D14] border-white/[0.1] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <label className={`block text-[11px] font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Department
              </label>
              <input
                type="text"
                value={inviteDept}
                onChange={(e) => setInviteDept(e.target.value)}
                placeholder="e.g. Engineering Platforms"
                className={`w-full px-3 py-2 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isDark ? 'bg-[#0A0D14] border-white/[0.1] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2 px-4 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold transition-all shadow-md shadow-sky-500/25 flex items-center justify-center space-x-1.5 cursor-pointer h-[38px]"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Generate Token Link</span>
              </button>
            </div>
          </form>

          {/* Generated Link Display */}
          {generatedInviteLink && (
            <div className={`pt-3 border-t space-y-2 animate-fadeIn ${
              isDark ? 'border-white/[0.08]' : 'border-slate-100'
            }`}>
              <span className="text-xs font-semibold text-sky-600 dark:text-sky-400 flex items-center space-x-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Invite Link Created Successfully</span>
              </span>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedInviteLink}
                  className={`flex-1 px-3 py-2 rounded-xl border text-[11px] font-mono focus:outline-none ${
                    isDark ? 'bg-black/50 border-white/[0.1] text-sky-300' : 'bg-sky-50/70 border-sky-200 text-sky-950'
                  }`}
                />
                <div className="flex items-center space-x-2 flex-shrink-0">
                  <button
                    onClick={() => handleCopyLink()}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 shadow-md shadow-sky-500/25"
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy Link'}</span>
                  </button>
                  <a
                    href={generatedInviteLink}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer flex items-center space-x-1 ${
                      isDark ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Simulate Open</span>
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Collaborator Directory Table (Shown on 'users' tab) */}
      {activeSubTab === 'users' && (
        <div className={`rounded-2xl border shadow-xl overflow-hidden transition-colors ${
          isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}>
            <div className="flex items-center space-x-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Workspace Team Directory ({users.length})
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-blue-400 text-[10px] font-mono border border-sky-500/20">
                Database: users
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">Strict RBAC Isolation Enforced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className={`text-slate-500 uppercase tracking-wider font-semibold border-b text-[10px] ${
                isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-100'
              }`}>
                <tr>
                  <th className="py-3 px-4">Collaborator</th>
                  <th className="py-3 px-4">Role & Persona</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">FIDO2 / MFA</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${
                isDark ? 'divide-white/[0.05] text-slate-300' : 'divide-slate-100 text-slate-700'
              }`}>
                {users.map((u) => {
                  const roleDef = ROLE_DEFINITIONS[u.role] || { name: u.role, shortName: u.role };
                  const isRevoked = u.access_status === 'Revoked';

                  return (
                    <tr key={u.user_id || u.id} className={`transition-colors ${
                      isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                    }`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                            alt={u.full_legal_name || u.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-sky-500/30 dark:ring-blue-500/20"
                          />
                          <div>
                            <div className={`font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{u.full_legal_name || u.name}</div>
                            <div className={`text-[11px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{u.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20">
                          {roleDef.name}
                        </span>
                      </td>

                      <td className={`py-3 px-4 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {u.department || 'Operations'}
                      </td>

                      <td className="py-3 px-4">
                        {isRevoked ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                            <X className="w-3 h-3" />
                            <span>Revoked</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center space-x-1 text-[11px] text-slate-400">
                          <Lock className="w-3 h-3 text-sky-500 dark:text-blue-400" />
                          <span>FIDO2 Enforced</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        {u.role !== ROLES.SYSTEM_ADMIN && !isRevoked ? (
                          <button
                            onClick={() => setRevokeUserTarget(u)}
                            className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline cursor-pointer"
                          >
                            Revoke Access
                          </button>
                        ) : (
                          <span className={`text-[11px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            {isRevoked ? 'Deprovisioned' : 'Root Immutable'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cryptographic Invitations Table (Shown on 'invitations' tab) */}
      {activeSubTab === 'invitations' && (
        <div className={`rounded-2xl border shadow-xl overflow-hidden transition-colors ${
          isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
        }`}>
          <div className={`p-4 border-b flex items-center justify-between ${
            isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}>
            <div className="flex items-center space-x-2">
              <h3 className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Cryptographic Role Invitations ({invitations.length})
              </h3>
              <span className="px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 dark:text-blue-400 text-[10px] font-mono border border-sky-500/20">
                Database: invitations
              </span>
            </div>
            <span className="text-[11px] font-mono text-slate-500">48-Hour One-Time Cryptographic Tokens</span>
          </div>

          <div className="overflow-x-auto">
            {invitations.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-blue-400 flex items-center justify-center mx-auto border border-sky-500/20">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h4 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>No Invitations Generated Yet</h4>
                <p className={`text-xs max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Use the form above to issue your first role-specific invite token for Talent Acquisition, Hiring Managers, or HR.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className={`text-slate-500 uppercase tracking-wider font-semibold border-b text-[10px] ${
                  isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-100'
                }`}>
                  <tr>
                    <th className="py-3 px-4">Invited Email</th>
                    <th className="py-3 px-4">Target Role</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Token</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  isDark ? 'divide-white/[0.05] text-slate-300' : 'divide-slate-100 text-slate-700'
                }`}>
                  {invitations.map((inv) => {
                    const roleKey = inv.target_role || inv.invitedRole || ROLES.TALENT_ACQUISITION;
                    const roleDef = ROLE_DEFINITIONS[roleKey] || { name: roleKey };
                    const expiresAt = inv.expires_at || inv.expiresAt;
                    const isExpired = new Date(expiresAt) < new Date();
                    const isUsed = Boolean(inv.is_used || inv.isUsed || inv.used);
                    const token = inv.invite_token || inv.inviteToken || '';
                    const invitedEmail = inv.invited_email || inv.invitedEmail || inv.email || 'Direct Invite';
                    const dept = inv.department || 'Operations';
                    const inviteUrl = `${window.location.origin}/?token=${token}`;

                    return (
                      <tr key={inv.invite_id || inv.inviteId || token} className={`transition-colors ${
                        isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'
                      }`}>
                        <td className={`py-3 px-4 font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>{invitedEmail}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20">
                            {roleDef.name}
                          </span>
                        </td>
                        <td className={`py-3 px-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{dept}</td>
                        <td className="py-3 px-4 font-mono text-[11px] text-sky-600 dark:text-blue-400">
                          {token ? `${token.slice(0, 16)}...` : 'Active Token'}
                        </td>
                        <td className="py-3 px-4">
                          {isUsed ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-white/[0.04] text-slate-500 border border-slate-200 dark:border-white/[0.08]">
                              Redeemed
                            </span>
                          ) : isExpired ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              Expired
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-blue-400 border border-sky-500/20">
                              Active &bull; 48h
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          {!isUsed && (
                            <>
                              <button
                                onClick={() => handleCopyLink(inviteUrl)}
                                className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-all cursor-pointer text-[11px] ${
                                  isDark
                                    ? 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border-white/[0.08]'
                                    : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200 shadow-sm'
                                }`}
                              >
                                <Copy className="w-3 h-3 text-sky-500 dark:text-blue-400" />
                                <span>Copy Link</span>
                              </button>
                              <a
                                href={inviteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 transition-all cursor-pointer text-[11px] shadow-sm shadow-sky-500/20"
                              >
                                <ExternalLink className="w-3 h-3" />
                                <span>Simulate Open</span>
                              </a>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Revocation Confirmation Modal */}
      {revokeUserTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`border rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 ${
            isDark ? 'bg-[#0A0D14] border-red-500/40 text-white' : 'bg-white border-red-300 text-slate-900'
          }`}>
            <div className="flex items-center space-x-3 text-red-500">
              <ShieldAlert className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-base font-bold">Revoke User Access</h3>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Are you sure you want to revoke access for{' '}
              <strong className={isDark ? 'text-white' : 'text-slate-900'}>{revokeUserTarget.full_legal_name || revokeUserTarget.name}</strong> (
              {revokeUserTarget.email})?
            </p>
            <p className="text-[11px] text-slate-500">
              User status will be marked <code>Revoked</code>. Historical jobs and uploaded candidate dossiers will remain strictly intact in the database.
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setRevokeUserTarget(null)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={confirmRevoke}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors shadow-md shadow-red-600/30 cursor-pointer"
              >
                Confirm Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
