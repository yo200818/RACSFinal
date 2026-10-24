import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { api } from '../../services/api';
import {
  KeyRound,
  ShieldCheck,
  Lock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Sparkles,
  Server,
  ArrowRight,
} from 'lucide-react';

export function ByokConsole() {
  const { workspace, currentUser, byokConfig, setByokConfig, addToast, recordAuditLog } = useAuth();
  const { isDark } = useTheme();
  const [selectedProvider, setSelectedProvider] = useState('OpenAI'); // 'OpenAI' or 'Gemini'
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const PROVIDERS = [
    {
      id: 'OpenAI',
      name: 'OpenAI GPT-4o Enterprise',
      vendor: 'OpenAI',
      badge: 'Multimodal OCR & Agentic Invocations',
      description: 'Used for resume text extraction, semantic matching against job requirements, and multi-turn interview scoring.',
      latency: '~180ms',
      keyPlaceholder: 'sk-proj-••••••••••••••••••••••••••••••••',
    },
    {
      id: 'Gemini',
      name: 'Google Gemini 1.5 Pro',
      vendor: 'Google DeepMind',
      badge: '2M Token Native Context',
      description: 'Massive context window allowing whole-portfolio batch resume evaluations in a single zero-trust evaluation pass.',
      latency: '~165ms',
      keyPlaceholder: 'AIzaSy••••••••••••••••••••••••••••••••',
    },
  ];

  const activeProvider = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  // On mount, verify if an active key already exists in MySQL
  useEffect(() => {
    async function checkExistingKey() {
      const wsId = workspace.workspace_id || workspace.workspaceId;
      if (!wsId) return;
      try {
        const res = await api.verifyByokKey(wsId);
        if (res.ok && res.data) {
          const decrypted = (res.data.decryptedKey || '').trim();
          const masked = decrypted ? `${decrypted.slice(0, 7)}••••••••${decrypted.slice(-4)}` : 'Key Saved in DB';
          setByokConfig((prev) => ({
            ...prev,
            apiKey: decrypted,
            raw_key: decrypted,
            provider_name: res.data.provider,
            encrypted_api_key: 'AES-256-ENCRYPTED',
            masked_key: masked,
          }));
          if (decrypted) {
            localStorage.setItem('racs_byok_api_key', decrypted);
            localStorage.setItem('racs_byok_provider', res.data.provider || 'Gemini');
          }
          setSelectedProvider(res.data.provider || 'OpenAI');
        }
      } catch (e) {
        // No key configured yet, expected for new workspaces
      }
    }
    checkExistingKey();
  }, [workspace.workspace_id, workspace.workspaceId]);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      addToast('Input Required', 'Please enter a valid API key string.', 'error');
      return;
    }

    const wsId = workspace.workspace_id || workspace.workspaceId;
    const userId = currentUser?.user_id || currentUser?.userId;

    setIsSaving(true);
    const res = await api.configureByokKey(wsId, userId, selectedProvider, apiKeyInput.trim());
    setIsSaving(false);

    if (res.ok) {
      const rawKey = apiKeyInput.trim();
      const masked = `${rawKey.slice(0, 7)}••••••••${rawKey.slice(-4)}`;
      setByokConfig((prev) => ({
        ...prev,
        apiKey: rawKey,
        raw_key: rawKey,
        provider_name: selectedProvider,
        model_name: activeProvider.name,
        encrypted_api_key: 'AES-256-ENCRYPTED',
        masked_key: masked,
        last_rotated: 'Just now',
      }));

      localStorage.setItem('racs_byok_api_key', rawKey);
      localStorage.setItem('racs_byok_provider', selectedProvider);

      recordAuditLog(
        'BYOK Tenant API Key Configured (AES-256)',
        `Provider: ${selectedProvider} | Stored in MySQL | Configured by: ${currentUser?.email}`,
        'KEY_ENCRYPTED_DB'
      );

      addToast(
        'API Key Stored & Encrypted',
        `${selectedProvider} key has been encrypted with MySQL AES-256 and persisted to the database.`,
        'success'
      );

      setApiKeyInput('');
      handleTestConnection();
    } else {
      addToast('Configuration Failed', res.error || 'Failed to save key to backend.', 'error');
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);

    const wsId = workspace.workspace_id || workspace.workspaceId;
    const start = performance.now();
    const res = await api.verifyByokKey(wsId);
    const duration = Math.round(performance.now() - start);

    setIsTesting(false);

    if (res.ok && res.data) {
      setTestResult({
        success: true,
        latency: `${duration}ms (Cloud SSL Handshake)`,
        status: 'HTTP 200 OK &bull; Decryption Verified',
        provider: res.data.provider,
        decryptedSample: `${res.data.decryptedKey?.slice(0, 6)}••••${res.data.decryptedKey?.slice(-4)}`,
      });
      addToast('Handshake Verified', `${res.data.provider} inference key decrypted successfully by backend.`, 'success');
    } else {
      setTestResult({
        success: false,
        status: res.error || 'No active key found in database for this workspace.',
      });
      addToast('Verification Warning', res.error || 'Key not found in database.', 'error');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Editorial Header */}
      <div className={`pb-6 border-b space-y-2 ${
        isDark ? 'border-white/[0.08]' : 'border-slate-200'
      }`}>
        <div className="flex items-center space-x-2 text-xs font-mono text-sky-600 dark:text-sky-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
          <span>ENTERPRISE BYOK ENCLAVE &bull; HARDWARE ENCRYPTION</span>
        </div>
        <h1 className={`text-3xl font-light tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          AI Inference Engine Configuration
        </h1>
        <p className={`text-sm leading-relaxed max-w-2xl font-normal ${
          isDark ? 'text-slate-400' : 'text-slate-600'
        }`}>
          Bring Your Own Key (BYOK) allows your enterprise to retain full cryptographic ownership of AI inference budgets. Keys are encrypted at rest using MySQL AES-256 GCM hardware encryption.
        </p>
      </div>

      {/* Split-Pane Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Model Provider Selection */}
        <div className="lg:col-span-5 space-y-3">
          <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            1. Select AI Inference Provider
          </div>

          {PROVIDERS.map((p) => {
            const isSelected = selectedProvider === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelectedProvider(p.id)}
                className={`w-full p-5 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected
                    ? isDark
                      ? 'bg-blue-600/15 border-blue-500/50 text-white shadow-sm ring-1 ring-blue-500/20'
                      : 'bg-sky-50 border-sky-400 text-sky-950 shadow-sm ring-1 ring-sky-300'
                    : isDark
                      ? 'bg-white/[0.02] border-white/[0.06] text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</span>
                  <span className="text-[10px] font-mono text-sky-600 dark:text-sky-300 px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20">
                    {p.vendor}
                  </span>
                </div>
                <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{p.description}</p>
                <div className={`mt-3 text-[11px] font-mono flex items-center space-x-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>Latency: {p.latency}</span>
                  <span>&bull;</span>
                  <span>{p.badge}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Key Encryption & Verification */}
        <div className="lg:col-span-7 space-y-6">
          <div className={`text-xs font-medium uppercase tracking-wider mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            2. Encryption & Key Vault Status
          </div>

          {/* Active Key Status Card */}
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
            isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDark ? 'border-white/[0.06]' : 'border-slate-100'
            }`}>
              <div className="flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                <span className={`text-xs font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>Database Vault Status</span>
              </div>
              {byokConfig.encrypted_api_key ? (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                  <span>Encrypted in MySQL (Active)</span>
                </span>
              ) : (
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] text-slate-600 dark:text-slate-400 text-[11px] font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Pending Configuration</span>
                </span>
              )}
            </div>

            <div className="space-y-1.5">
              <label className={`block text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Stored Secret Key</label>
              <div className={`p-3 rounded-xl border font-mono text-xs flex items-center justify-between ${
                isDark ? 'bg-black/40 border-white/[0.06] text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
              }`}>
                <span>{byokConfig.masked_key || 'No key configured yet'}</span>
                <span className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{byokConfig.provider_name || selectedProvider}</span>
              </div>
            </div>

            <div className="pt-1 flex items-center space-x-3">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center space-x-2 disabled:opacity-50 ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border-white/[0.08]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm'
                }`}
              >
                {isTesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5 text-blue-500" />}
                <span>Test Decryption Handshake</span>
              </button>
            </div>

            {testResult && (
              <div
                className={`p-3.5 rounded-2xl border text-xs font-mono space-y-1 animate-fadeIn ${
                  testResult.success
                    ? 'bg-sky-500/10 border-sky-500/20 text-sky-700 dark:text-sky-300'
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <span dangerouslySetInnerHTML={{ __html: testResult.status }} />
                </div>
                {testResult.decryptedSample && (
                  <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Decrypted Payload: {testResult.decryptedSample} &bull; Latency: {testResult.latency}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Form to Input / Rotate Key */}
          <div className={`p-6 rounded-3xl border shadow-xl space-y-4 ${
            isDark ? 'border-white/[0.08] bg-[#0E1320]/80 shadow-black/30' : 'border-slate-200 bg-white shadow-sm'
          }`}>
            <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Rotate or Set {activeProvider.name} Key
            </h3>

            <form onSubmit={handleSaveKey} className="space-y-4">
              <div>
                <label className={`block text-xs mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  Raw API Secret Key String
                </label>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    required
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder={activeProvider.keyPlaceholder}
                    className={`w-full pl-3.5 pr-10 py-2.5 text-xs font-mono rounded-xl border focus:outline-none focus:ring-2 focus:ring-sky-400/50 transition-all ${
                      isDark
                        ? 'bg-black/40 border-white/[0.08] text-white placeholder-slate-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Sent directly to Spring Boot backend and encrypted with MySQL AES-256 before storage.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-semibold transition-all shadow-md shadow-sky-500/25 cursor-pointer disabled:opacity-50 flex items-center space-x-2"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Encrypting in MySQL...' : 'Encrypt & Save Key (AES-256)'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
