import React from 'react';
import {
  ShieldCheck,
  Activity,
  Users,
  Video,
  Bot,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react';

export default function AdminSidebar({
  adminTab,
  setAdminTab,
  totalUsers = 48,
  activeMeetingsCount = 0,
  onBackToUserApp,
}) {
  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between p-4 flex-shrink-0 select-none">
      <div>
        {/* Logo with Admin Portal Badge */}
        <div className="px-3 py-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold shadow-md shadow-purple-600/30">
              <ShieldCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight leading-tight flex items-center gap-1.5">
                <span>AI SmartMeet</span>
              </div>
              <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">
                Admin Portal
              </div>
            </div>
          </div>
        </div>

        {/* Admin Navigation Menu */}
        <div className="mt-8">
          <div className="text-[11px] font-semibold text-slate-500 tracking-wider px-3 mb-2 uppercase">
            Quản trị hệ thống
          </div>
          <nav className="space-y-1.5">
            {/* Tab 1: Overview */}
            <button
              onClick={() => setAdminTab('overview')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                adminTab === 'overview'
                  ? 'bg-purple-900/50 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Activity className="w-4 h-4 text-purple-400" />
                <span>Tổng quan hệ thống</span>
              </div>
              {adminTab === 'overview' && (
                <ChevronRight className="w-3.5 h-3.5 text-purple-400" />
              )}
            </button>

            {/* Tab 2: Users & RBAC */}
            <button
              onClick={() => setAdminTab('users')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                adminTab === 'users'
                  ? 'bg-purple-900/50 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-blue-400" />
                <span>Người dùng & Phân quyền</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {totalUsers}
              </span>
            </button>

            {/* Tab 3: Live Meetings */}
            <button
              onClick={() => setAdminTab('meetings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                adminTab === 'meetings'
                  ? 'bg-purple-900/50 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Video className="w-4 h-4 text-emerald-400" />
                <span>Giám sát P2P Trực tiếp</span>
              </div>
              {activeMeetingsCount > 0 ? (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              ) : (
                <span className="text-[10px] text-slate-600 font-mono">0</span>
              )}
            </button>

            {/* Tab 4: AI Quota & Logs */}
            <button
              onClick={() => setAdminTab('ai-quota')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-colors cursor-pointer ${
                adminTab === 'ai-quota'
                  ? 'bg-purple-900/50 text-purple-200 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-amber-400" />
                <span>Lõi AI & Định mức Tokens</span>
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom: Return to User Workspace & Super Admin card */}
      <div className="space-y-3">
        <button
          onClick={onBackToUserApp}
          className="w-full py-2.5 px-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Về Không gian cá nhân</span>
        </button>

        <div className="p-3 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-purple-700 text-white font-bold text-xs flex items-center justify-center shadow-inner">
            AD
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">Super Admin</div>
            <div className="text-[10px] text-purple-400 font-mono">Khoa KHMT - VKU</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
