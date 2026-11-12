import React from 'react';
import { Users, Video, Cpu, Bot } from 'lucide-react';

export default function AdminOverviewTab({
  metrics,
  activeMeetings,
  aiEngineStats,
  onForceEndMeeting,
}) {
  return (
    <div className="space-y-6">
      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Tổng người dùng</span>
            <div className="w-8 h-8 rounded-xl bg-blue-950/60 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {metrics.totalUsers}{' '}
            <span className="text-xs font-normal text-slate-500">tài khoản</span>
          </div>
          <p className="text-[11px] text-purple-400 font-medium">
            3 Admin · 12 Host · 33 Member
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Phòng họp trực tiếp</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-950/60 text-emerald-400 flex items-center justify-center">
              <Video className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {activeMeetings.length}{' '}
            <span className="text-xs font-normal text-slate-500">phòng P2P</span>
          </div>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>Đang kết nối không qua server</span>
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Whisper STT đã xử lý</span>
            <div className="w-8 h-8 rounded-xl bg-amber-950/60 text-amber-400 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {metrics.totalWhisperHours}
          </div>
          <p className="text-[11px] text-slate-400 font-medium">
            156 tệp ghi âm ({metrics.storageUsed})
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Gemini LLM Tokens</span>
            <div className="w-8 h-8 rounded-xl bg-purple-950/60 text-purple-400 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {metrics.geminiTokensUsed}
          </div>
          <p className="text-[11px] text-emerald-400 font-medium">
            Chi phí ước tính: {metrics.aiCostEst}
          </p>
        </div>
      </div>

      {/* Grid 2 Columns: Live Meetings & AI Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Meetings Monitor */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
              <h3 className="font-bold text-white text-base">
                Các phòng họp WebRTC P2P đang trực tiếp
              </h3>
            </div>
            <span className="text-xs text-slate-400 bg-slate-900 px-2.5 py-1 rounded-full font-mono">
              {activeMeetings.length} phòng đang chạy
            </span>
          </div>

          <div className="space-y-3">
            {activeMeetings.length === 0 ? (
              <p className="text-center py-8 text-slate-500 text-xs">
                Hiện không có phòng họp nào đang diễn ra.
              </p>
            ) : (
              activeMeetings.map((room) => (
                <div
                  key={room.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{room.title}</span>
                      <span className="text-[11px] font-mono text-purple-400 bg-purple-950/70 px-2 py-0.5 rounded-md border border-purple-800/40">
                        {room.id}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span>
                        Host: <strong className="text-slate-300">{room.host}</strong>
                      </span>
                      <span>•</span>
                      <span className="text-emerald-400">{room.peersCount} peers</span>
                      <span>•</span>
                      <span className="font-mono text-slate-500">{room.duration}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onForceEndMeeting && onForceEndMeeting(room.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-300 hover:bg-rose-900 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Đóng phòng
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: AI Specs Card */}
        <div className="lg:col-span-5 bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h3>Hiệu năng Lõi AI & Mô hình</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Nhận dạng giọng nói (STT):</span>
              <span className="font-semibold text-white">{aiEngineStats.sttModel}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Độ chính xác tiếng Việt:</span>
              <span className="font-semibold text-emerald-400">{aiEngineStats.accuracy}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Tốc độ xử lý Whisper:</span>
              <span className="font-semibold text-white">{aiEngineStats.avgTranscribeTime}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Mô hình tóm tắt (LLM):</span>
              <span className="font-semibold text-purple-400">{aiEngineStats.llmModel}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/80">
              <span className="text-slate-400">Thời gian tạo biên bản:</span>
              <span className="font-semibold text-white">{aiEngineStats.avgSummaryTime}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-400">Tỉ lệ thành công hệ thống:</span>
              <span className="font-bold text-emerald-400">{aiEngineStats.successRate}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
