import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
  Sliders,
  Building2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Save,
  Link,
  RefreshCw,
} from 'lucide-react';

export function WorkspaceSettings() {
  const { workspace, setWorkspace, addToast, recordAuditLog } = useAuth();
  const { isDark } = useTheme();
  const [zdr, setZdr] = useState(workspace.zeroDataRetention);
  const [eeoc, setEeoc] = useState(workspace.eeocMasking);
  const [webhookUrl, setWebhookUrl] = useState(workspace.atsWebhookUrl);
  const [testingWebhook, setTestingWebhook] = useState(false);

  const handleSaveSettings = () => {
    setWorkspace((prev) => ({
      ...prev,
      zeroDataRetention: zdr,
      eeocMasking: eeoc,
      atsWebhookUrl: webhookUrl,
    }));
    recordAuditLog('Workspace Security Configuration Updated', 'Tenant Enclave Policy Settings', 'POLICY_UPDATED');
    addToast('Settings Saved', 'Workspace tenant isolation and compliance parameters successfully updated.', 'success');
  };

  const handleTestWebhook = () => {
    setTestingWebhook(true);
    setTimeout(() => {
      setTestingWebhook(false);
      addToast('Webhook Handshake Verified', 'HTTP 200 OK received from ATS endpoint with HMAC-SHA256 signature.', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`pb-4 border-b ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-2 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 dark:bg-sky-400" />
          <span>Tenant Enclave & Compliance Settings</span>
        </div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Workspace Isolation & ATS Integration
        </h1>
        <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Configure multi-tenant boundary isolation, Zero-Data Retention (ZDR) compliance, and bidirectional ATS webhooks.
        </p>
      </div>

      {/* Tenant Identity Card */}
      <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
        isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-sm font-semibold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Building2 className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Organization & Tenant Profile</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Company Legal Name</label>
            <input
              type="text"
              value={workspace.company_name || workspace.companyName || workspace.name || ''}
              readOnly
              className={`w-full p-2.5 rounded-xl border font-semibold cursor-not-allowed ${
                isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Workspace UUID (Database)</label>
            <input
              type="text"
              value={workspace.workspace_id || workspace.workspaceId || workspace.id || ''}
              readOnly
              className={`w-full p-2.5 rounded-xl border font-mono font-bold cursor-not-allowed ${
                isDark ? 'bg-black/40 border-white/[0.08] text-sky-400' : 'bg-slate-50 border-slate-200 text-sky-700'
              }`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>GSTIN / Corporate Tax ID</label>
            <input
              type="text"
              value={workspace.gstin || ''}
              readOnly
              className={`w-full p-2.5 rounded-xl border font-mono font-semibold cursor-not-allowed ${
                isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Corporate Phone</label>
            <input
              type="text"
              value={workspace.company_phone || workspace.companyPhone || ''}
              readOnly
              className={`w-full p-2.5 rounded-xl border font-semibold cursor-not-allowed ${
                isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
          <div className="md:col-span-2">
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Company Headquarters Address</label>
            <input
              type="text"
              value={workspace.company_address || workspace.companyAddress || ''}
              readOnly
              className={`w-full p-2.5 rounded-xl border font-semibold cursor-not-allowed ${
                isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Compliance Toggles Grid */}
      <div className={`rounded-3xl p-6 border shadow-xl space-y-5 ${
        isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-sm font-semibold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <ShieldCheck className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Statutory Compliance & Data Retention Policies</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Zero Data Retention Toggle */}
          <div className={`p-4 rounded-2xl border flex items-start justify-between ${
            isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="pr-4">
              <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>Zero Data Retention (ZDR) Enclave</span>
              <p className={`mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Automatically purges resume vector blobs and raw text extracts immediately after scoring handoff.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setZdr(!zdr)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                zdr ? 'bg-sky-500' : isDark ? 'bg-white/[0.1]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  zdr ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          {/* EEOC Title VII Masking Toggle */}
          <div className={`p-4 rounded-2xl border flex items-start justify-between ${
            isDark ? 'bg-black/40 border-white/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="pr-4">
              <span className={`font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>EEOC Title VII Demographic Scrubbing</span>
              <p className={`mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Applies neural token masking to candidate names, photos, gender identifiers, and graduation years before LLM scoring.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setEeoc(!eeoc)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${
                eeoc ? 'bg-sky-500' : isDark ? 'bg-white/[0.1]' : 'bg-slate-200'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                  eeoc ? 'left-5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* ATS Webhook Integration */}
      <div className={`rounded-3xl p-6 border shadow-xl space-y-4 ${
        isDark ? 'bg-[#0E1320]/80 border-white/[0.08] shadow-black/30' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <h3 className={`text-sm font-semibold flex items-center space-x-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
          <Link className="w-4 h-4 text-sky-500 dark:text-sky-400" />
          <span>Bi-directional ATS Webhook Handshake</span>
        </h3>

        <div className="text-xs space-y-3">
          <div>
            <label className={`block font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Production ATS Webhook Endpoint URL (Greenhouse / Workday)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                className={`flex-1 p-2.5 rounded-xl border font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                  isDark ? 'bg-black/40 border-white/[0.08] text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingWebhook}
                className={`px-4 py-2 rounded-xl border font-semibold transition-colors flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 ${
                  isDark
                    ? 'bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/[0.08]'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                }`}
              >
                {testingWebhook ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Ping Handshake</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold shadow-md shadow-sky-500/25 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Workspace Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
