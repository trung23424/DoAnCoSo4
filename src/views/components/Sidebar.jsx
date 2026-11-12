import React from 'react';
import { Sparkles, Home, Clock, Settings, ChevronRight, LogOut, ShieldCheck } from 'lucide-react';

export default function Sidebar({
  currentTab = 'home',
  onNavigate,
  totalMeetings = 6,
  currentUser,
  onLogout,
}) {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 flex-shrink-0 select-none h-screen">
      <div>
        {/* Logo */}
        <div className="flex items-center gap-3 px-3 py-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-800 flex items-center justify-center text-white shadow-md shadow-blue-800/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base tracking-tight leading-tight">
              AI SmartMeet
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              AI Meeting Secretary
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="mt-8">
          <div className="text-[11px] font-semibold text-slate-400 tracking-wider px-3 mb-2 uppercase">
            Workspace
          </div>
          <nav className="space-y-1.5">
            {/* Home */}
            <button
              onClick={() => onNavigate && onNavigate('home')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                currentTab === 'home'
                  ? 'bg-blue-50/80 text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Home
                  className={`w-4 h-4 ${
                    currentTab === 'home' ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <span>Home</span>
              </div>
              {currentTab === 'home' && (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
            </button>

            {/* Meeting History */}
            <button
              onClick={() => onNavigate && onNavigate('history')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                currentTab === 'history'
                  ? 'bg-blue-50/80 text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Clock
                  className={`w-4 h-4 ${
                    currentTab === 'history' ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <span>Meeting History</span>
              </div>
              <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                {totalMeetings}
              </span>
            </button>

            {/* Settings */}
            <button
              onClick={() => onNavigate && onNavigate('settings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer ${
                currentTab === 'settings'
                  ? 'bg-blue-50/80 text-blue-900'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings
                  className={`w-4 h-4 ${
                    currentTab === 'settings' ? 'text-blue-700' : 'text-slate-400'
                  }`}
                />
                <span>Settings</span>
              </div>
              {currentTab === 'settings' && (
                <ChevronRight className="w-4 h-4 text-blue-400" />
              )}
            </button>

            {/* Admin Portal (Quản trị hệ thống) */}
            <div className="pt-2 mt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigate && onNavigate('admin')}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-purple-100/80 text-purple-900 shadow-sm border border-purple-200'
                    : 'text-purple-700 hover:bg-purple-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck
                    className={`w-4 h-4 ${
                      currentTab === 'admin' ? 'text-purple-700' : 'text-purple-600'
                    }`}
                  />
                  <span>Admin Portal</span>
                </div>
                <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                  Quản trị
                </span>
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* User Profile Card */}
      <div className="bg-slate-50/90 border border-slate-200/70 rounded-2xl p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs shadow-sm uppercase">
            {currentUser?.avatar ||
              (currentUser?.name || currentUser?.fullName || 'SV')
                .slice(0, 2)
                .toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-slate-900 truncate">
              {currentUser?.name || currentUser?.fullName || 'Thành viên VKU'}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {currentUser?.role
                ? `${currentUser.role} · ${currentUser?.studentId || 'VKU'}`
                : currentUser?.email || 'Thành viên VKU'}
            </div>
          </div>
          {onLogout && (
            <button
              onClick={onLogout}
              title="Đăng xuất khỏi Firebase"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="mt-2.5 bg-emerald-50/80 border border-emerald-200/60 text-emerald-900 px-2.5 py-1 rounded-xl text-[11px] font-medium flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="truncate">{currentUser?.email || 'Đã kết nối Firebase'}</span>
        </div>
      </div>
    </aside>
  );
}
