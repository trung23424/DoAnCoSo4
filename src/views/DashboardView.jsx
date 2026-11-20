import React from 'react';
import Sidebar from './components/Sidebar';
import MeetingCard from './components/MeetingCard';
import useDashboardController from '../controllers/useDashboardController';
import { exportMeetingToPDF, exportMeetingToWord } from '../services/exportService';
import {
  Sparkles,
  Search,
  Bell,
  Video,
  Mic,
  ArrowRight,
  Clock,
  Keyboard,
} from 'lucide-react';

export default function DashboardView({
  onViewSummary,
  onStartMeeting,
  onJoinMeeting,
  onNavigate,
  currentUser,
  onLogout,
}) {
  const [joinCode, setJoinCode] = React.useState('');
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    stats,
    filteredMeetings,
    handleStartMeeting,
    handleDeleteMeeting,
  } = useDashboardController(currentUser);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* 1. Sidebar dùng chung */}
      <Sidebar
        currentTab="home"
        onNavigate={onNavigate}
        totalMeetings={stats.totalMeetings}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* 2. Main Content (Bên phải) */}
      <div className="flex-1 h-screen overflow-y-auto bg-slate-50/60">
        {/* Main Header */}
        <header className="px-8 pt-8 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <span>Chào buổi sáng 👋</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              Welcome back, {currentUser?.name || currentUser?.fullName || 'bạn'}
            </h1>
          </div>

          {/* Right Header: Search, Bell, Avatar */}
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm cuộc họp, biên bản..."
                className="w-64 md:w-72 pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent placeholder:text-slate-400 transition-all shadow-sm"
              />
            </div>

            <button className="relative w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors shadow-sm cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            </button>

            <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-blue-100 uppercase">
              {currentUser?.avatar ||
                (currentUser?.name || currentUser?.fullName || 'SV')
                  .slice(0, 2)
                  .toUpperCase()}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="px-8 pb-12 space-y-8">
          {/* ================= HERO BANNER ================= */}
          <section className="rounded-[2rem] p-8 md:p-10 bg-gradient-to-br from-blue-50/80 via-white to-amber-50/50 border border-slate-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-blue-900 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>AI Secretary · Transcription & Smart Minutes</span>
                </div>

                <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15]">
                  <span className="text-slate-900 block">Run better meetings,</span>
                  <span className="text-blue-700 block mt-1">
                    let AI take the notes
                  </span>
                </h2>

                <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                  Giọng nói được nhận dạng thời gian thực, biên bản họp thông minh
                  tự động tạo ngay khi cuộc họp kết thúc — sẵn sàng xuất PDF hoặc
                  Word.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    onClick={onStartMeeting || handleStartMeeting}
                    className="bg-blue-800 hover:bg-blue-900 text-white px-6 py-3 rounded-full font-semibold text-sm flex items-center gap-2.5 shadow-md shadow-blue-800/20 hover:shadow-lg transition-all duration-200 active:scale-95 cursor-pointer"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start New Meeting</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2 text-xs font-medium text-slate-600 bg-white/70 px-3 py-2 rounded-full border border-slate-200/60">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span>3 colleagues are in a meeting now</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Join Card */}
              <div className="lg:col-span-5">
                <div className="bg-white/85 backdrop-blur-xl border border-white/80 shadow-xl rounded-3xl p-6 flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <Keyboard className="w-5 h-5 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        Join a meeting
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Nhập mã cuộc họp bạn được mời
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    <Mic className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && joinCode.trim()) {
                          onJoinMeeting ? onJoinMeeting(joinCode.trim()) : alert(`Tham gia phòng ${joinCode}`);
                        }
                      }}
                      placeholder="e.g. asm-8f2k1q"
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all shadow-sm"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (!joinCode.trim()) {
                        alert('Vui lòng nhập mã cuộc họp bạn muốn tham gia (ví dụ: asm-xxxxxx)');
                        return;
                      }
                      if (onJoinMeeting) {
                        onJoinMeeting(joinCode.trim());
                      }
                    }}
                    className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md active:scale-98 cursor-pointer"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-slate-400 text-center leading-normal">
                    Bằng cách tham gia, bạn đồng ý cho AI Secretary ghi âm và tạo
                    biên bản cuộc họp.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================= MEETING HISTORY SECTION ================= */}
          <section className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-800 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                    Meeting History
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 ml-9">
                  {filteredMeetings.length} meetings this month · AI minutes available
                </p>
              </div>

              {/* Status Filter & "Xem tất cả" button */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === 'all'
                        ? 'bg-white shadow-sm text-slate-900 font-semibold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    All ({stats.totalMeetings})
                  </button>
                  <button
                    onClick={() => setStatusFilter('ready')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === 'ready'
                        ? 'bg-white shadow-sm text-slate-900 font-semibold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    ✨ AI Minutes ({stats.readyCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('processing')}
                    className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                      statusFilter === 'processing'
                        ? 'bg-white shadow-sm text-slate-900 font-semibold'
                        : 'hover:text-slate-900'
                    }`}
                  >
                    ⏳ Processing ({stats.processingCount})
                  </button>
                </div>

                <button
                  onClick={() => onNavigate && onNavigate('history')}
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-800 hover:text-blue-900 transition-colors cursor-pointer"
                >
                  <span>Xem tất cả kho lưu trữ</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Grid of Meeting Cards */}
            {filteredMeetings.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-500 shadow-sm">
                <p className="text-base font-semibold text-slate-800">
                  Không tìm thấy cuộc họp nào.
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Hãy thử tìm kiếm với từ khóa khác hoặc mã phòng họp.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMeetings.map((meeting) => (
                  <MeetingCard
                    key={meeting.id}
                    meeting={meeting}
                    onViewSummary={onViewSummary}
                    onDelete={handleDeleteMeeting}
                    onExportPDF={exportMeetingToPDF}
                    onExportWord={exportMeetingToWord}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
