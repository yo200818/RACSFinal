import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLE_DEFINITIONS } from '../../data/mockData';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Building,
  KeyRound,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export function InviteRegisterPage({ token, onCancel }) {
  const { validateInviteToken, registerWithInvite, currentUser } = useAuth();
  const { isDark } = useTheme();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [validationState, setValidationState] = useState({
    isValidating: true,
    valid: false,
    invitation: null,
    workspace: null,
    error: '',
  });

  useEffect(() => {
    let isMounted = true;
    async function checkToken() {
      if (!token) {
        if (isMounted) {
          setValidationState({ isValidating: false, valid: false, invitation: null, workspace: null, error: 'No invite token provided.' });
        }
        return;
      }
      try {
        const res = await validateInviteToken(token);
        if (isMounted) {
          if (res.valid) {
            setValidationState({
              isValidating: false,
              valid: true,
              invitation: res.invitation,
              workspace: res.workspace,
              error: '',
            });
            setEmail(res.invitation.invited_email || res.invitation.invitedEmail || '');
          } else {
            setValidationState({
              isValidating: false,
              valid: false,
              invitation: null,
              workspace: null,
              error: res.error || 'Token validation failed.',
            });
          }
        }
      } catch (err) {
        if (isMounted) {
          setValidationState({
            isValidating: false,
            valid: false,
            invitation: null,
            workspace: null,
            error: err.message || 'Error validating token.',
          });
        }
      }
    }
    checkToken();
    return () => { isMounted = false; };
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('Full legal name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid enterprise work email is required.');
      return;
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const result = await registerWithInvite({
      token,
      fullName: fullName.trim(),
      email: email.trim(),
      password,
    });

    setLoading(false);
    if (!result || !result.success) {
      setError(result?.error || 'Failed to complete registration.');
    } else {
      window.history.replaceState({}, '', window.location.pathname);
      if (onCancel) onCancel();
    }
  };

  if (validationState.isValidating) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`max-w-md w-full border rounded-3xl p-8 shadow-2xl text-center space-y-4 ${
          isDark ? 'bg-[#0E1320] border-white/[0.08]' : 'bg-white border-slate-200'
        }`}>
          <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-600 dark:text-blue-400 mx-auto animate-spin">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold tracking-tight">Validating Cryptographic Token</h2>
          <p className="text-xs text-slate-500">Verifying role invitation parameters with Spring Boot MySQL backend...</p>
        </div>
      </div>
    );
  }

  if (!validationState.valid) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 relative ${
        isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`max-w-md w-full border border-red-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-4 ${
          isDark ? 'bg-[#0E1320]' : 'bg-white'
        }`}>
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Invalid or Expired Invite Link</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            {validationState.error || 'This cryptographic token is invalid, expired (exceeding 48 hours), or has already been redeemed.'}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                if (onCancel) onCancel();
                else window.location.href = window.location.origin;
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 text-xs font-semibold text-white hover:from-sky-500 hover:to-blue-600 transition-all cursor-pointer inline-flex items-center space-x-2 shadow-md shadow-sky-500/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Landing</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const invite = validationState.invitation;
  const workspace = validationState.workspace;
  const roleName = invite?.target_role || invite?.invitedRole;
  const roleDef = ROLE_DEFINITIONS[roleName] || {
    name: roleName || 'Enterprise Member',
    shortName: roleName || 'Member',
    description: 'Enterprise workspace member',
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-y-auto ${
      isDark ? 'bg-[#0A0D14] text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Bar */}
      <header className={`h-16 border-b px-6 lg:px-12 flex items-center justify-between backdrop-blur-xl ${
        isDark ? 'border-white/[0.08] bg-[#0A0D14]/80' : 'border-slate-200 bg-white/80'
      }`}>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <span className="font-bold text-base tracking-tight">RACS AI</span>
          <span className="text-[10px] font-mono text-sky-600 dark:text-blue-400 border border-sky-500/30 dark:border-blue-500/30 px-2 py-0.5 rounded-md">
            INVITATION ENCLAVE
          </span>
        </div>

        <button
          onClick={() => {
            if (onCancel) onCancel();
            else window.location.href = window.location.origin;
          }}
          className={`text-xs flex items-center space-x-1.5 transition-colors cursor-pointer ${
            isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Landing</span>
        </button>
      </header>

      {/* Main Registration Container */}
      <div className="flex-1 flex items-center justify-center p-6 py-12">
        <div className={`max-w-lg w-full border rounded-3xl p-8 shadow-2xl relative overflow-hidden ${
          isDark ? 'bg-[#0E1320]/95 border-white/[0.08] shadow-black/60' : 'bg-white border-slate-200 shadow-xl'
        }`}>
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Invitation Badge */}
          <div className={`flex items-center justify-between pb-6 border-b ${
            isDark ? 'border-white/[0.08]' : 'border-slate-100'
          }`}>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[11px] font-semibold text-sky-600 dark:text-blue-400 mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Authorized Cryptographic Token</span>
              </div>
              <h2 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Accept Role Invitation
              </h2>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Complete your profile to join <span className="font-semibold">{workspace?.company_name || workspace?.companyName || 'Enterprise Workspace'}</span>.
              </p>
            </div>
          </div>

          {/* Invited Role & Organization Info Card */}
          <div className={`my-5 p-4 rounded-2xl border space-y-2 ${
            isDark ? 'bg-[#0A0D14] border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Assigned Role:</span>
              <span className="px-2.5 py-0.5 rounded-lg bg-sky-500/10 text-sky-600 dark:text-blue-400 font-bold border border-sky-500/20 text-[11px]">
                {roleDef.name}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Department:</span>
              <span className="font-semibold">{invite?.department || 'Operations'}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className={isDark ? 'text-slate-400' : 'text-slate-600'}>Security Boundary:</span>
              <span className="text-sky-600 dark:text-blue-400 font-mono text-[11px]">RBAC Isolated Enclave</span>
            </div>
          </div>

          {currentUser && (
            <div className="mb-4 p-3 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-blue-300 flex items-center justify-between">
              <span>Active session: <strong>{currentUser.full_legal_name || currentUser.name}</strong>. Completing registration will switch into the invited <strong>{roleDef.shortName}</strong> persona.</span>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Full Legal Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Lin"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                    isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Enterprise Work Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                    isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                  }`}
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wider mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                      isDark ? 'bg-black/40 border-white/[0.08] text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold shadow-md shadow-sky-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
              >
                <span>{loading ? 'Activating Profile...' : 'Complete Registration & Access Workspace'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <p className="mt-4 text-[11px] text-center text-slate-500">
            By accepting, you acknowledge adherence to company IT security policies and RBAC isolation boundaries.
          </p>
        </div>
      </div>
    </div>
  );
}
