import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES, ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Shield,
  Sliders,
  Users,
  UserPlus,
  KeyRound,
  FileText,
  LayoutDashboard,
  UploadCloud,
  GitBranch,
  Briefcase,
  Layers,
  UserCheck,
  FileSpreadsheet,
  Compass,
  BadgeDollarSign,
  BarChart3,
  Mail,
  Clock,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';

export function Sidebar({ currentTab, onSelectTab, isCollapsed, onToggleCollapse }) {
  const { currentRole, logout, users, invitations = [], jobPostings, candidates, auditLogs, sequences } = useAuth();
  const { isDark } = useTheme();
  const roleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS[ROLES.TALENT_ACQUISITION];

  // Dynamic state counts
  const activeUserCount = users.filter((u) => u.access_status === 'Active').length;
  const activeInvitesCount = invitations.filter((inv) => !inv.is_used && new Date(inv.expires_at) > new Date()).length;
  const activeJobCount = jobPostings.filter((j) => j.status === 'Active').length;
  const totalCandidates = candidates.length;
  const hmPendingCount = candidates.filter((c) => c.pipeline_status === 'HM Review' || c.status === 'HM Review').length;
  const offerReadyCount = candidates.filter((c) => c.pipeline_status === 'Ready for Offer Authorization').length;

  const NAVIGATION_MAP = {
    [ROLES.SYSTEM_ADMIN]: [
      { id: 'admin-dashboard', label: 'Admin Console', icon: Shield },
      { id: 'admin-invites', label: 'Role Invitations', icon: UserPlus, count: activeInvitesCount },
      { id: 'admin-users', label: 'User Directory', icon: Users, count: activeUserCount },
      { id: 'admin-byok', label: 'BYOK AI Keys', icon: KeyRound },
      { id: 'admin-workspace', label: 'Workspace Settings', icon: Sliders },
      { id: 'admin-audit', label: 'Security Audit Trail', icon: FileText, count: auditLogs.length },
    ],
    [ROLES.TALENT_ACQUISITION]: [
      { id: 'ta-dashboard', label: 'Pipeline Velocity', icon: LayoutDashboard },
      { id: 'ta-intake', label: 'Resume Batch Intake', icon: UploadCloud, count: totalCandidates },
      { id: 'ta-pipeline', label: 'Candidate Funnel', icon: GitBranch },
      { id: 'ta-requisitions', label: 'Requisitions', icon: Briefcase, count: activeJobCount },
    ],
    [ROLES.HIRING_MANAGER]: [
      { id: 'hm-dashboard', label: 'Department Overview', icon: Layers },
      { id: 'hm-candidates', label: 'Review & Scorecards', icon: UserCheck, count: hmPendingCount },
      { id: 'hm-requisitions', label: 'My Requisitions', icon: FileSpreadsheet, count: activeJobCount },
    ],
    [ROLES.HR_REPRESENTATIVE]: [
      { id: 'hr-dashboard', label: 'Governance Overview', icon: Compass },
      { id: 'hr-offers', label: 'Offer Approvals', icon: BadgeDollarSign, count: offerReadyCount },
      { id: 'hr-analytics', label: 'Operations Analytics', icon: BarChart3 },
    ],
    [ROLES.ENGAGEMENT_SPECIALIST]: [
      { id: 'engagement-dashboard', label: 'Candidate Onboarding', icon: Mail },
      { id: 'engagement-sequences', label: 'Email Cadences', icon: Clock, count: sequences.length },
    ],
  };

  const activeNavItems = NAVIGATION_MAP[currentRole] || [];

  return (
    <aside
      className={`flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)] border-r transition-all duration-300 ease-in-out select-none relative z-20 ${
        isDark
          ? 'bg-[#0A0D14]/90 backdrop-blur-2xl text-slate-300 border-white/[0.07]'
          : 'bg-gradient-to-b from-sky-50/90 via-blue-50/40 to-white/95 backdrop-blur-2xl text-slate-700 border-sky-100 shadow-[4px_0_24px_-4px_rgba(56,189,248,0.08)]'
      } ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Role Isolation Label / Collapse Toggle */}
      <div className={`p-3 border-b flex items-center justify-between ${isDark ? 'border-white/[0.07]' : 'border-sky-100/70'}`}>
        {!isCollapsed ? (
          <div className="flex items-center space-x-2 px-1">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50 ring-2 ring-sky-300/30" />
            <span className={`text-[11px] font-semibold uppercase tracking-wider truncate ${
              isDark ? 'text-slate-400' : 'text-sky-700/80'
            }`}>
              {roleDef.shortName}
            </span>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <span className="w-2 h-2 rounded-full bg-sky-400 shadow-sm shadow-sky-400/50" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className={`p-1 rounded-lg transition-colors cursor-pointer ${
            isDark
              ? 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
              : 'text-sky-600/70 hover:text-sky-700 hover:bg-sky-100/60'
          }`}
          title={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-2 space-y-1">
        {activeNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 cursor-pointer relative group ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'
              } ${
                isActive
                  ? isDark
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'bg-white/90 text-sky-600 font-semibold shadow-sm border border-sky-200/80 ring-1 ring-sky-400/20'
                  : isDark
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                    : 'text-slate-600 hover:text-sky-600 hover:bg-white/70'
              }`}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-r ${
                  isDark ? 'bg-blue-500' : 'bg-gradient-to-b from-sky-400 to-blue-500 shadow-sm shadow-sky-400/50'
                }`} />
              )}

              <div className="flex items-center space-x-2.5 min-w-0">
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    isActive
                      ? isDark ? 'text-blue-400' : 'text-sky-500'
                      : isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-400 group-hover:text-sky-500'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && item.count !== undefined && item.count > 0 && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? isDark ? 'bg-blue-500/20 text-blue-300' : 'bg-sky-100 text-sky-700 font-semibold'
                      : isDark ? 'bg-white/[0.04] text-slate-400' : 'bg-sky-50/80 text-sky-600/80'
                  }`}
                >
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Minimal Footer */}
      <div className={`p-2 border-t ${isDark ? 'border-white/[0.07]' : 'border-sky-100/70'}`}>
        <button
          onClick={logout}
          className={`w-full flex items-center rounded-xl text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 p-2 transition-colors cursor-pointer ${
            isCollapsed ? 'justify-center' : 'space-x-2.5 px-3'
          }`}
          title="Sign Out"
        >
          <LogOut className="w-3.5 h-3.5 flex-shrink-0" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
