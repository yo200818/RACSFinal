import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { ROLE_DEFINITIONS } from '../../data/mockData';
import {
  Search,
  Cpu,
  Command,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';

export function Navbar({ onOpenSearch }) {
  const { currentRole, currentUser, workspace, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const roleDef = ROLE_DEFINITIONS[currentRole] || ROLE_DEFINITIONS.ROLE_TALENT_ACQUISITION;
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className={`sticky top-0 z-30 h-16 backdrop-blur-2xl px-6 lg:px-8 flex items-center justify-between select-none transition-colors border-b ${
      isDark
        ? 'bg-[#0A0D14]/85 border-white/[0.07] text-white'
        : 'bg-white/90 border-sky-100 text-slate-900 shadow-sm'
    }`}>
      {/* Left: Brand & Workspace Identity */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-400 via-sky-500 to-blue-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 ring-1 ring-white/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-sm tracking-tight">RACS AI</span>
            <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">Autonomous Recruiting</span>
          </div>
        </div>

        <div className={`hidden md:flex items-center space-x-2 pl-4 border-l ${isDark ? 'border-white/[0.08]' : 'border-sky-100'}`}>
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs ${
            isDark ? 'bg-white/[0.03] border border-white/[0.07] text-slate-300' : 'bg-sky-50/80 border border-sky-100 text-slate-700'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="font-medium">{workspace.company_name || workspace.companyName || workspace.name}</span>
          </div>
        </div>
      </div>

      {/* Center: Search */}
      <div className="hidden md:flex items-center flex-1 max-w-sm mx-8">
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates, requisitions, audit logs..."
            className={`w-full pl-9 pr-10 py-1.5 text-xs rounded-xl border transition-all ${
              isDark
                ? 'bg-white/[0.03] border-white/[0.07] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500/50'
                : 'bg-slate-50/80 border-slate-200 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400/30 focus:bg-white'
            }`}
            onClick={onOpenSearch}
          />
          <div className={`absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 px-1 py-0.5 rounded text-[9px] font-mono ${
            isDark ? 'bg-white/[0.04] border border-white/[0.08] text-slate-400' : 'bg-slate-200/70 border border-slate-300 text-slate-600'
          }`}>
            <Command className="w-2.5 h-2.5" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right: Controls + Theme Switcher + User Profile */}
      <div className="flex items-center space-x-3">
        {/* Theme Toggle Button (Light/Dark) */}
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className={`p-2 rounded-xl transition-all cursor-pointer border ${
            isDark
              ? 'bg-white/[0.04] border-white/[0.08] text-amber-400 hover:bg-white/[0.08]'
              : 'bg-sky-50/70 border-sky-200/70 text-sky-600 hover:bg-sky-100 hover:text-sky-700'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile Popover & Sign Out */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className={`flex items-center space-x-2.5 py-1 px-2 rounded-xl transition-all cursor-pointer border ${
              isDark
                ? 'hover:bg-white/[0.04] border-transparent hover:border-white/[0.06]'
                : 'hover:bg-sky-50/60 border-transparent hover:border-sky-100'
            }`}
          >
            <img
              src={currentUser?.avatar || roleDef.avatar}
              alt={currentUser?.full_legal_name || currentUser?.name}
              className="w-7 h-7 rounded-full object-cover ring-1 ring-sky-400/40"
            />
            <div className="text-left hidden lg:block">
              <div className="text-xs font-medium leading-none">
                {currentUser?.full_legal_name || currentUser?.name || 'Authorized User'}
              </div>
              <div className="text-[10px] text-sky-500 dark:text-sky-400 mt-1 leading-none font-mono">
                {roleDef.shortName}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl p-2 z-50 animate-fadeIn ${
              isDark ? 'bg-[#0E1320] border-white/[0.1] text-white' : 'bg-white border-slate-200 text-slate-900 shadow-sky-500/10'
            }`}>
              <div className={`p-3 border-b ${isDark ? 'border-white/[0.06]' : 'border-slate-100'}`}>
                <div className="text-xs font-semibold">
                  {currentUser?.full_legal_name || currentUser?.name}
                </div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser?.email}</div>
                <div className="mt-2 inline-flex items-center space-x-1.5 px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-600 border border-sky-500/20 text-[10px] font-mono">
                  <span>{roleDef.name}</span>
                </div>
              </div>

              <div className="p-1">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center space-x-2 px-3 py-2 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
