import React from 'react';
import {
  Calendar,
  Clock,
  Users,
  Sparkles,
  FileText,
  Download,
  MoreHorizontal,
} from 'lucide-react';

export default function MeetingCard({
  meeting,
  onViewSummary,
  onDelete,
  onExportPDF,
  onExportWord,
}) {
  const isReady = meeting.status === 'ready' || meeting.status === 'completed';

  // Tách ngày / tháng từ format dd/mm/yyyy hoặc dd ThMM, yyyy
  const dateStr = meeting.date || '';
  let day = '12';
  let month = 'TH11';
  if (dateStr.includes('/')) {
    const parts = dateStr.split('/');
    day = parts[0] || '12';
    month = parts[1] ? `TH${parts[1]}` : 'TH11';
  } else {
    const match = dateStr.match(/(\d+)\s+Th(\d+)/i);
    if (match) {
      day = match[1];
      month = `TH${match[2]}`;
    } else {
      day = dateStr.slice(0, 2) || '12';
      month = 'TH11';
    }
  }

  // Lấy tên và chữ cái đầu của Host
  const hostDisplayName = meeting.hostName || meeting.host || 'Host';
  const hostInitial = hostDisplayName
    ? hostDisplayName.trim().split(' ').slice(-1)[0][0]
    : 'H';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/70 p-5 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Top: Date Box, Date/Time & Options */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Date Box */}
            <div className="w-12 h-12 rounded-2xl bg-slate-100/90 border border-slate-200/60 flex flex-col items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-semibold text-slate-500 uppercase leading-none">
                {month}
              </span>
              <span className="text-base font-extrabold text-slate-900 leading-tight">
                {day}
              </span>
            </div>

            {/* Date & Time info */}
            <div className="text-xs space-y-0.5">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {meeting.date} · {meeting.time}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                <span>{meeting.duration}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onDelete && onDelete(meeting.id)}
            title="Tùy chọn / Xóa"
            className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Meeting Title */}
        <h3 className="font-bold text-slate-900 text-base mt-4 mb-2 line-clamp-1">
          {meeting.title}
        </h3>

        {/* Host Information */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px] flex items-center justify-center">
            {hostInitial}
          </div>
          <span className="truncate">
            Host: <span className="font-medium text-slate-700">{hostDisplayName}</span>
          </span>
          <span className="text-slate-300">·</span>
          <span className="font-mono text-slate-400 text-[11px] truncate">
            {meeting.id}
          </span>
        </div>

        {/* Participants & Status Badge */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {Array.isArray(meeting.participants)
                ? meeting.participants.length
                : meeting.participants || 1}{' '}
              participants
            </span>
          </div>

          {isReady ? (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>AI Minutes ready</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
              <span>⏳ Đang xử lý...</span>
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        {/* View AI Summary */}
        <button
          disabled={!isReady}
          onClick={() => isReady && onViewSummary && onViewSummary(meeting.id)}
          className={`w-full py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            isReady
              ? 'bg-blue-800 hover:bg-blue-900 text-white shadow-blue-800/15 cursor-pointer active:scale-98'
              : 'bg-blue-800/50 text-white/80 cursor-not-allowed opacity-60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>View AI Summary</span>
        </button>

        {/* PDF & Word */}
        <div className="flex gap-2">
          <button
            disabled={!isReady}
            onClick={() =>
              onExportPDF
                ? onExportPDF(meeting)
                : alert(`Đang xuất file PDF cho cuộc họp "${meeting.title}"...`)
            }
            className={`flex-1 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isReady
                ? 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                : 'text-slate-400 opacity-50 cursor-not-allowed bg-slate-50/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-red-500" />
            <span>Export PDF</span>
          </button>

          <button
            disabled={!isReady}
            onClick={() =>
              onExportWord
                ? onExportWord(meeting)
                : alert(`Đang xuất file Word (.docx) cho cuộc họp "${meeting.title}"...`)
            }
            className={`flex-1 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isReady
                ? 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                : 'text-slate-400 opacity-50 cursor-not-allowed bg-slate-50/50'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-blue-600" />
            <span>Export Word</span>
          </button>
        </div>
      </div>
    </div>
  );
}
