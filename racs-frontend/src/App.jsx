import React, { useState, useEffect, Component } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './components/auth/LandingPage';
import { InviteRegisterPage } from './components/auth/InviteRegisterPage';
import { ToastContainer } from './components/common/ToastContainer';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Application ErrorBoundary]:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B0F17] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center text-2xl font-bold">
            !
          </div>
          <h1 className="text-2xl font-light tracking-tight">Application Interface Encountered an Exception</h1>
          <p className="text-xs text-slate-400 max-w-md font-mono bg-black/40 p-3 rounded-xl border border-white/[0.08]">
            {this.state.error?.message || 'Unknown runtime error'}
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('racs_auth_session');
              window.location.reload();
            }}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer shadow-lg transition-all"
          >
            Reset Session & Reload Application
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function MainRouter() {
  const { isAuthenticated } = useAuth();
  const [urlToken, setUrlToken] = useState(() => {
    if (typeof window === 'undefined') return null;
    const params = new URLSearchParams(window.location.search);
    return params.get('token') || params.get('invite');
  });

  useEffect(() => {
    // Keep URL clean once token is read
    const params = new URLSearchParams(window.location.search);
    if (params.get('token') || params.get('invite')) {
      // urlToken is already derived in initial state
    }
  }, []);

  if (urlToken) {
    return (
      <InviteRegisterPage
        token={urlToken}
        onCancel={() => {
          window.history.replaceState({}, '', window.location.pathname);
          setUrlToken(null);
        }}
      />
    );
  }

  if (isAuthenticated) {
    return <AppLayout />;
  }

  return <LandingPage onOpenInvite={(token) => setUrlToken(token)} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <MainRouter />
          <ToastContainer />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
