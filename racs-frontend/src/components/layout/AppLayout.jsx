import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLES } from '../../data/mockData';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { ProtectedRoute } from '../common/ProtectedRoute';
import { AntigravityCanvas } from '../common/AntigravityCanvas';

// View Imports
import { AdminDashboard } from '../admin/AdminDashboard';
import { WorkspaceSettings } from '../admin/WorkspaceSettings';
import { UserManagement } from '../admin/UserManagement';
import { ByokConsole } from '../admin/ByokConsole';
import { SecurityAuditTrail } from '../admin/SecurityAuditTrail';

import { TaDashboard } from '../ta/TaDashboard';
import { ResumeIntake } from '../ta/ResumeIntake';
import { CandidatePipeline } from '../ta/CandidatePipeline';
import { HmRequisitions as TaHmRequisitions } from '../ta/HmRequisitions';

import { HmDashboard } from '../hm/HmDashboard';
import { CandidateEvaluation } from '../hm/CandidateEvaluation';
import { HmRequisitions } from '../hm/HmRequisitions';

import { HrDashboard } from '../hr/HrDashboard';
import { OfferApprovals } from '../hr/OfferApprovals';
import { OperationsAnalytics } from '../hr/OperationsAnalytics';

import { EngagementDashboard } from '../engagement/EngagementDashboard';
import { EmailSequenceConfigurator } from '../engagement/EmailSequenceConfigurator';

export function AppLayout() {
  const { currentRole } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Mapping default initial tab when role switches
  const DEFAULT_TABS = {
    [ROLES.SYSTEM_ADMIN]: 'admin-dashboard',
    [ROLES.TALENT_ACQUISITION]: 'ta-dashboard',
    [ROLES.HIRING_MANAGER]: 'hm-dashboard',
    [ROLES.HR_REPRESENTATIVE]: 'hr-dashboard',
    [ROLES.ENGAGEMENT_SPECIALIST]: 'engagement-dashboard',
  };

  const [currentTab, setCurrentTab] = useState(DEFAULT_TABS[currentRole] || 'ta-dashboard');
  const [selectedCandidateId, setSelectedCandidateId] = useState('CAND-9041');

  // Whenever the active persona changes, route to that persona's home tab
  useEffect(() => {
    setCurrentTab(DEFAULT_TABS[currentRole] || 'ta-dashboard');
  }, [currentRole]);

  const handleNavigate = (tabId) => {
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectCandidate = (candidateId) => {
    setSelectedCandidateId(candidateId);
  };

  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-hidden transition-colors ${
      isDark
        ? 'bg-[#0A0D14] text-slate-100 selection:bg-blue-600 selection:text-white bg-grid-pattern'
        : 'bg-[#F8FAFC] text-slate-900 selection:bg-sky-400 selection:text-white bg-grid-pattern'
    }`}>
      {/* Subtle Antigravity Background (Low-density, non-distracting) */}
      <div className={`fixed inset-0 pointer-events-none z-0 ${isDark ? 'opacity-20' : 'opacity-40'}`}>
        <AntigravityCanvas particleCount={28} interactive={true} />
      </div>

      {/* Atmospheric Ambient Glow */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] blur-3xl pointer-events-none -z-10 ${
        isDark
          ? 'bg-gradient-to-b from-blue-600/10 via-indigo-600/05 to-transparent'
          : 'bg-gradient-to-b from-sky-200/35 via-blue-100/20 to-transparent'
      }`} />

      {/* Top Enterprise Navbar */}
      <Navbar onOpenSearch={() => handleNavigate('ta-pipeline')} />

      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Dynamic RBAC Collapsible Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleNavigate}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area (Spacious editorial padding from Asana / Avea) */}
        <main className="flex-1 overflow-y-auto px-6 py-10 md:px-12 max-w-6xl mx-auto w-full transition-all duration-300">
          {/* System Administrator Routes */}
          {currentTab === 'admin-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Admin Console">
              <AdminDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-workspace' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Workspace Settings">
              <WorkspaceSettings />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-invites' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Role Invitations">
              <UserManagement initialTab="invitations" onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-users' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="User Directory">
              <UserManagement initialTab="users" onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-byok' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="BYOK Cryptographic Enclave">
              <ByokConsole />
            </ProtectedRoute>
          )}
          {currentTab === 'admin-audit' && (
            <ProtectedRoute allowedRoles={[ROLES.SYSTEM_ADMIN]} featureName="Security Audit Trail">
              <SecurityAuditTrail />
            </ProtectedRoute>
          )}

          {/* Talent Acquisition Routes */}
          {currentTab === 'ta-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="TA Velocity Dashboard">
              <TaDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'ta-intake' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="Resume Batch Intake">
              <ResumeIntake onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'ta-pipeline' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="Candidate Pipeline Funnel">
              <CandidatePipeline onSelectCandidate={handleSelectCandidate} onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'ta-requisitions' && (
            <ProtectedRoute allowedRoles={[ROLES.TALENT_ACQUISITION]} featureName="Active Job Requisitions">
              <TaHmRequisitions onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}

          {/* Hiring Manager Routes */}
          {currentTab === 'hm-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]} featureName="Department Overview">
              <HmDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'hm-candidates' && (
            <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]} featureName="AI Candidate Evaluation">
              <CandidateEvaluation
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={handleSelectCandidate}
              />
            </ProtectedRoute>
          )}
          {currentTab === 'hm-requisitions' && (
            <ProtectedRoute allowedRoles={[ROLES.HIRING_MANAGER]} featureName="Manager Requisitions">
              <HmRequisitions />
            </ProtectedRoute>
          )}

          {/* HR Representative Routes */}
          {currentTab === 'hr-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.HR_REPRESENTATIVE]} featureName="HR Executive Governance">
              <HrDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'hr-offers' && (
            <ProtectedRoute allowedRoles={[ROLES.HR_REPRESENTATIVE]} featureName="Executive Offer Approvals">
              <OfferApprovals
                selectedCandidateId={selectedCandidateId}
                onSelectCandidate={handleSelectCandidate}
              />
            </ProtectedRoute>
          )}
          {currentTab === 'hr-analytics' && (
            <ProtectedRoute allowedRoles={[ROLES.HR_REPRESENTATIVE]} featureName="Operations Analytics">
              <OperationsAnalytics />
            </ProtectedRoute>
          )}

          {/* Engagement Specialist Routes */}
          {currentTab === 'engagement-dashboard' && (
            <ProtectedRoute allowedRoles={[ROLES.ENGAGEMENT_SPECIALIST]} featureName="Pre-Boarding Enrollment">
              <EngagementDashboard onNavigate={handleNavigate} />
            </ProtectedRoute>
          )}
          {currentTab === 'engagement-sequences' && (
            <ProtectedRoute allowedRoles={[ROLES.ENGAGEMENT_SPECIALIST]} featureName="Email Cadence Configurator">
              <EmailSequenceConfigurator />
            </ProtectedRoute>
          )}
        </main>
      </div>
    </div>
  );
}
