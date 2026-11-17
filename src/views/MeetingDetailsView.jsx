import React from 'react';
import useMeetingDetailsController from '../controllers/useMeetingDetailsController';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Calendar,
  Users,
  FileText,
  Download,
  Copy,
  Check,
  Play,
  Pause,
  Volume2,
  CheckCircle2,
  Circle,
  Search,
  Bot,
  Cpu,
  FileAudio,
  Share2,
} from 'lucide-react';

export default function MeetingDetailsView({
  meetingId = 'asm-8f2k1q',
  audioResult = null,
  onBack,
}) {
  const {
    meeting,
    activeTab,
    setActiveTab,
    actionItems,
    toggleActionItem,
    transcriptSearch,
    setTranscriptSearch,
    filteredTranscript,
    isPlaying,
    audioProgress,
    playbackSpeed,
    togglePlayAudio,
    cyclePlaybackSpeed,
    copied,
    handleCopySummary,
    handleExportPDF,
    handleExportWord,
  } = useMeetingDetailsController(meetingId, audioResult);

  if (!meeting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500">Không tìm thấy thông tin cuộc họp.</p>
      </div>
    );
  }

  // Tạo waveform thanh sóng âm giả lập 36 cột
  const waveformHeights = [
    25, 45, 70, 35, 80, 95, 60, 40, 75, 90, 50, 65, 85, 100, 70, 45, 30, 60,
    80, 95, 75, 55, 40, 85, 90, 65, 45, 80, 60, 40, 70, 85, 50, 35, 60, 30,
  ];

  return (
    <div className="min-h-screen bg-slate-50/70 font-sans text-slate-800 pb-16">
      {/* Top sticky bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Back button & Breadcrumb */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Dashboard</span>
            </button>
            <span className="text-slate-300">/</span>
            <span className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium">
              {meeting.id}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>AI Minutes ready</span>
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportPDF}
              className="px-3 py-1.5 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100 text-rose-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Xuất PDF</span>
            </button>

            <button
              onClick={handleExportWord}
              className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" />
              <span>Xuất Word (.docx)</span>
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 pt-6 space-y-6">
        {/* Meeting Header Card */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                <Bot className="w-3.5 h-3.5" />
                <span>Biên bản họp tự động tạo bởi AI Secretary</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {meeting.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{meeting.date}</span>
                </div>
                <span className="text-slate-300">•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>{meeting.time} ({meeting.duration})</span>
                </div>
                <span className="text-slate-300">•</span>
                <div>
                  Host: <span className="font-semibold text-slate-700">{meeting.host}</span>
                </div>
              </div>
            </div>

            {/* Attendees Avatar Stack */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex items-center gap-3 self-start">
              <div className="flex -space-x-2">
                {meeting.attendees?.slice(0, 4).map((att, idx) => (
                  <div
                    key={idx}
                    title={`${att.name} (${att.role})`}
                    className="w-8 h-8 rounded-full bg-blue-800 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-2xs"
                  >
                    {att.avatar}
                  </div>
                ))}
                {meeting.attendees?.length > 4 && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center border-2 border-white shadow-2xs">
                    +{meeting.attendees.length - 4}
                  </div>
                )}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-slate-800">
                  {meeting.attendees?.length} Thành viên
                </div>
                <div className="text-[11px] text-slate-500">Đã tham dự họp</div>
              </div>
            </div>
          </div>

          {/* Audio Waveform Player Bar */}
          <div className="mt-6 pt-6 border-t border-slate-100">
            <div className="bg-slate-900 rounded-2xl p-4 text-white flex flex-col sm:flex-row items-center gap-4 shadow-lg shadow-slate-900/10">
              {/* Play/Pause Button */}
              <button
                onClick={togglePlayAudio}
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md transition-all active:scale-95 flex-shrink-0"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                )}
              </button>

              {/* Time display */}
              <div className="text-xs font-mono text-slate-300 flex-shrink-0">
                <span className="font-bold text-white">08:15</span> / {meeting.duration}
              </div>

              {/* Waveform simulation */}
              <div className="flex-1 flex items-center gap-1 w-full overflow-hidden h-9 px-2">
                {waveformHeights.map((h, i) => {
                  const isPassed = i < Math.floor((waveformHeights.length * audioProgress) / 100);
                  return (
                    <div
                      key={i}
                      style={{ height: `${h}%` }}
                      className={`flex-1 min-w-[3px] rounded-full transition-all duration-200 ${
                        isPassed ? 'bg-blue-400' : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Speed & Volume controls */}
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <button
                  onClick={cyclePlaybackSpeed}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono font-semibold text-slate-200 transition-colors"
                >
                  {playbackSpeed}x
                </button>
                {audioResult?.audioUrl && (
                  <a
                    href={audioResult.audioUrl}
                    download={`record-${meeting?.id || 'meeting'}.webm`}
                    className="p-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    title="Tải tệp ghi âm cuộc họp"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                )}
                <div className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1">
                  <Volume2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200/80 pb-px">
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all border-b-2 -mb-px ${
              activeTab === 'summary'
                ? 'bg-white text-blue-900 border-blue-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-blue-700" />
            <span>AI Smart Minutes (Biên bản thông minh)</span>
          </button>

          <button
            onClick={() => setActiveTab('transcript')}
            className={`flex items-center gap-2 px-5 py-3 rounded-t-2xl font-bold text-sm transition-all border-b-2 -mb-px ${
              activeTab === 'transcript'
                ? 'bg-white text-blue-900 border-blue-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <FileText className="w-4 h-4 text-slate-600" />
            <span>Full Transcript (Lời thoại Whisper)</span>
            <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
              {meeting.transcript?.length || 0}
            </span>
          </button>
        </div>

        {/* Main Content Area: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tab details */}
          <div className="lg:col-span-8 space-y-6">
            {activeTab === 'summary' ? (
              <>
                {/* 1. Tóm tắt tổng quan */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-base">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <h3>1. Tóm tắt tổng quan (Executive Summary)</h3>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed bg-blue-50/50 border border-blue-100/80 rounded-2xl p-4">
                    {meeting.aiSummary?.overview}
                  </p>
                </div>

                {/* 2. Các điểm thảo luận chính */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                  <h3 className="text-slate-900 font-bold text-base">
                    2. Các nội dung thảo luận cốt lõi (Key Points)
                  </h3>
                  <div className="space-y-2.5">
                    {meeting.aiSummary?.keyPoints?.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 text-sm text-slate-700"
                      >
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Các quyết định chính */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-base">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <h3>3. Quyết định đã thống nhất (Key Decisions)</h3>
                  </div>
                  <div className="space-y-2.5">
                    {meeting.aiSummary?.decisions?.map((dec, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-sm text-emerald-950"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{dec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Việc cần làm (Action Items) */}
                <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-slate-900 font-bold text-base">
                      4. Việc cần làm (Action Items)
                    </h3>
                    <span className="text-xs text-slate-500 font-medium">
                      Tick chọn để cập nhật tiến độ
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {actionItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => toggleActionItem(item.id)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                          item.completed
                            ? 'bg-slate-50/80 border-slate-200 text-slate-400'
                            : 'bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-sm text-slate-800'
                        }`}
                      >
                        <button className="mt-0.5 text-blue-700 flex-shrink-0">
                          {item.completed ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-semibold leading-snug ${
                              item.completed ? 'line-through text-slate-400' : 'text-slate-900'
                            }`}
                          >
                            {item.task}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                            <span className="text-slate-600">
                              Người phụ trách:{' '}
                              <strong className="text-slate-800">{item.assignee}</strong>
                            </span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500">
                              Hạn chót: <strong>{item.dueDate}</strong>
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                item.priority === 'High'
                                  ? 'bg-rose-100 text-rose-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {item.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* TAB 2: FULL TRANSCRIPT */
              <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
                {/* Search bar inside transcript */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={transcriptSearch}
                    onChange={(e) => setTranscriptSearch(e.target.value)}
                    placeholder="Tìm kiếm nội dung lời thoại hoặc tên người nói..."
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-inner/10"
                  />
                </div>

                {/* Timeline dialog list */}
                <div className="space-y-4 pt-2">
                  {filteredTranscript.length === 0 ? (
                    <p className="text-center py-8 text-slate-400 text-sm">
                      Không tìm thấy đoạn hội thoại nào phù hợp.
                    </p>
                  ) : (
                    filteredTranscript.map((line) => (
                      <div
                        key={line.id}
                        className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 hover:bg-blue-50/30 transition-colors space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-800 text-white font-bold text-[10px] flex items-center justify-center">
                              {line.speaker[0]}
                            </span>
                            <span className="font-bold text-xs text-slate-900">
                              {line.speaker}
                            </span>
                          </div>
                          <span className="font-mono text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md font-semibold cursor-pointer hover:bg-blue-100">
                            {line.time}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 leading-relaxed pl-8">
                          {line.text}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: AI Specs & Attendees Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Model Specs Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                <Cpu className="w-4 h-4 text-blue-700" />
                <h4>Thông số xử lý AI (Lõi Đề tài)</h4>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Mô hình Nhận dạng (STT):</span>
                  <span className="font-semibold text-slate-800">OpenAI Whisper (medium)</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Mô hình Tóm tắt (LLM):</span>
                  <span className="font-semibold text-slate-800">Google Gemini 1.5 Pro</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Độ chính xác tiếng Việt:</span>
                  <span className="font-semibold text-emerald-700">~98.4%</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Thời gian tạo tóm tắt:</span>
                  <span className="font-semibold text-slate-800">1.8 giây</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-500">Tệp ghi âm gốc:</span>
                  <span className="font-mono font-medium text-blue-800 flex items-center gap-1">
                    <FileAudio className="w-3.5 h-3.5" />
                    <span>recording_45m.wav</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Attendees List Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                  <Users className="w-4 h-4 text-blue-700" />
                  <h4>Thành viên tham gia</h4>
                </div>
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-semibold">
                  {meeting.attendees?.length}
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                {meeting.attendees?.map((att, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-blue-800 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {att.avatar}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {att.name}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {att.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

