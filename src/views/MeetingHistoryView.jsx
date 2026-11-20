import React from 'react';
import Sidebar from './components/Sidebar';
import MeetingCard from './components/MeetingCard';
import useMeetingHistoryController from '../controllers/useMeetingHistoryController';
import { exportMeetingToPDF, exportMeetingToWord } from '../services/exportService';
import {
  Clock,
  Video,
  Calendar,
  CheckCircle2,
  HardDrive,
  Search,
  LayoutGrid,
  List,
  Sparkles,
  Users,
  Trash2,
  FileText,
  Download,
} from 'lucide-react';

export default function MeetingHistoryView({
  onNavigate,
  onViewSummary,
  onStartMeeting,
  currentUser,
  onLogout,
}) {
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    viewMode,
    setViewMode,
    stats,
    filteredMeetings,
    handleDeleteMeeting,
  } = useMeetingHistoryController(currentUser);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* 1. Sidebar dùng chung */}
      <Sidebar
        currentTab="history"
        onNavigate={onNavigate}
        totalMeetings={stats.totalMeetings}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* 2. Main Content: Meeting History & Archive */}
      <div className="flex-1 h-screen overflow-y-auto bg-slate-50/60 px-8 py-8 space-y-8">
        {/* Header of History View */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit border border-blue-100">
              <Clock className="w-3.5 h-3.5" />
              <span>Kho lưu trữ & Tra cứu Biên bản thông minh</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Meeting History & Archive
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Quản lý và tra cứu toàn bộ biên bản cuộc họp đã được AI tự động tóm tắt
            </p>
          </div>

          {/* Action: Start New Meeting */}
          <button
            onClick={onStartMeeting}
            className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all self-start md:self-auto cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>Start New Meeting</span>
          </button>
        </header>

        {/* 4 Stats Cards Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Stat 1 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Tổng số cuộc họp
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats.totalMeetings}{' '}
              <span className="text-xs font-normal text-slate-500">cuộc họp</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              ↑ 100% đồng bộ WebRTC P2P
            </p>
          </div>

          {/* Stat 2 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Tổng thời lượng họp
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats.totalHours}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Đã chuyển thành văn bản Whisper
            </p>
          </div>

          {/* Stat 3 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Hoàn thành Action Items
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats.actionItemRate}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">
              17 / 20 việc đã được xử lý
            </p>
          </div>

          {/* Stat 4 */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Dung lượng âm thanh lưu
              </span>
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-slate-900">
              {stats.storageUsed}
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Định dạng WAV 16kHz chuẩn
            </p>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên cuộc họp, mã ID hoặc chủ trì..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white placeholder:text-slate-400 transition-all"
            />
          </div>

          {/* Status & Month Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Month filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <button
                onClick={() => setMonthFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  monthFilter === 'all'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Tất cả tháng
              </button>
              <button
                onClick={() => setMonthFilter('11')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  monthFilter === '11'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Tháng 11
              </button>
              <button
                onClick={() => setMonthFilter('10')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  monthFilter === '10'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Tháng 10
              </button>
            </div>

            {/* Status filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Tất cả ({stats.totalMeetings})
              </button>
              <button
                onClick={() => setStatusFilter('ready')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'ready'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                ✨ Sẵn sàng ({stats.readyCount})
              </button>
              <button
                onClick={() => setStatusFilter('processing')}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === 'processing'
                    ? 'bg-white shadow-xs text-slate-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                ⏳ Đang xử lý ({stats.processingCount})
              </button>
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-slate-600">
              <button
                onClick={() => setViewMode('grid')}
                title="Chế độ lưới"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white shadow-xs text-blue-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                title="Chế độ bảng danh sách"
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white shadow-xs text-blue-900 font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content: Grid or Table */}
        {filteredMeetings.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/60 p-12 text-center text-slate-500 shadow-sm">
            <p className="text-base font-semibold text-slate-800">
              Không tìm thấy cuộc họp nào.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Hãy thử điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm.
            </p>
          </div>
        ) : viewMode === 'grid' ? (
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
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-4 px-6">Tên cuộc họp & ID</th>
                    <th className="py-4 px-4">Ngày & Giờ</th>
                    <th className="py-4 px-4">Thời lượng</th>
                    <th className="py-4 px-4">Chủ trì</th>
                    <th className="py-4 px-4">Thành viên</th>
                    <th className="py-4 px-4">Trạng thái AI</th>
                    <th className="py-4 px-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMeetings.map((meeting) => {
                    const isReady = meeting.status === 'ready';

                    return (
                      <tr
                        key={meeting.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        {/* Title & ID */}
                        <td className="py-4 px-6">
                          <div className="font-bold text-slate-900 text-sm">
                            {meeting.title}
                          </div>
                          <span className="font-mono text-[11px] text-slate-400">
                            {meeting.id}
                          </span>
                        </td>

                        {/* Date & Time */}
                        <td className="py-4 px-4">
                          <div className="font-medium text-slate-800">
                            {meeting.date}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            {meeting.time}
                          </div>
                        </td>

                        {/* Duration */}
                        <td className="py-4 px-4 font-mono font-medium text-slate-600">
                          {meeting.duration}
                        </td>

                        {/* Host */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-800 text-white font-bold text-[10px] flex items-center justify-center">
                              {meeting.host.trim().split(' ').slice(-1)[0][0]}
                            </div>
                            <span className="font-medium text-slate-800">
                              {meeting.host}
                            </span>
                          </div>
                        </td>

                        {/* Participants */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Users className="w-3.5 h-3.5 text-slate-400" />
                            <span>{meeting.participants} người</span>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          {isReady ? (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-600" />
                              <span>AI Minutes</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1">
                              <span>⏳ Đang xử lý</span>
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Quick Export PDF */}
                            <button
                              disabled={!isReady}
                              onClick={() => isReady && exportMeetingToPDF(meeting)}
                              title="Xuất PDF"
                              className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                                isReady
                                  ? 'text-rose-600 hover:bg-rose-50 hover:border-rose-300 cursor-pointer'
                                  : 'text-slate-300 cursor-not-allowed border-transparent'
                              }`}
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>

                            {/* Quick Export Word */}
                            <button
                              disabled={!isReady}
                              onClick={() => isReady && exportMeetingToWord(meeting)}
                              title="Xuất Word (.docx)"
                              className={`p-1.5 rounded-lg border border-slate-200 transition-colors ${
                                isReady
                                  ? 'text-blue-600 hover:bg-blue-50 hover:border-blue-300 cursor-pointer'
                                  : 'text-slate-300 cursor-not-allowed border-transparent'
                              }`}
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              disabled={!isReady}
                              onClick={() =>
                                isReady &&
                                onViewSummary &&
                                onViewSummary(meeting.id)
                              }
                              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                                isReady
                                  ? 'bg-blue-800 hover:bg-blue-900 text-white shadow-xs cursor-pointer'
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              Xem biên bản
                            </button>

                            <button
                              onClick={() => handleDeleteMeeting(meeting.id)}
                              title="Xóa cuộc họp"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
