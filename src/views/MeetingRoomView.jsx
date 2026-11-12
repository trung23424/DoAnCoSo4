import React from 'react';
import useMeetingRoomController from '../controllers/useMeetingRoomController';
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  Users,
  MessageSquare,
  Sparkles,
  Subtitles,
  Copy,
  Check,
  Radio,
  Send,
  X,
  ShieldCheck,
  Activity,
  Bot,
  Layers,
  Volume2,
} from 'lucide-react';

export default function MeetingRoomView({ onMeetingFinished, roomConfig }) {
  const {
    roomTitle,
    roomId,
    networkInfo,
    participants,
    isMicOn,
    isCamOn,
    isScreenSharing,
    isRecording,
    formattedTime,
    showCaptions,
    currentCaption,
    activeSidePanel,
    chatMessages,
    inputChat,
    setInputChat,
    isProcessingAI,
    aiStep,
    userVideoRef,
    toggleMic,
    toggleCam,
    toggleScreenShare,
    toggleRecording,
    toggleCaptions,
    toggleSidePanel,
    handleSendMessage,
    handleEndMeeting,
  } = useMeetingRoomController({ onMeetingFinished, roomConfig });

  const [copiedId, setCopiedId] = React.useState(false);

  const copyRoomId = () => {
    navigator.clipboard?.writeText(roomId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden font-sans select-none relative">
      {/* ================= TOP BAR ================= */}
      <header className="h-16 px-6 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between z-20 flex-shrink-0">
        {/* Left: Room Title, Room ID & P2P Badge */}
        <div className="flex items-center gap-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-800/90 text-white flex items-center justify-center font-bold shadow-md shadow-blue-800/30">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
                {roomTitle}
              </h1>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="font-mono text-slate-300">{roomId}</span>
                <button
                  onClick={copyRoomId}
                  title="Sao chép mã phòng"
                  className="hover:text-white transition-colors"
                >
                  {copiedId ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <span className="text-slate-700">|</span>

          {/* P2P Network Indicator */}
          <button
            onClick={() => toggleSidePanel('p2p')}
            className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-900/50 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{networkInfo.protocol}</span>
            <span className="text-emerald-500/80 text-[10px]">({networkInfo.latency})</span>
          </button>
        </div>

        {/* Center: AI Recording Timer */}
        <div className="flex items-center gap-2.5 bg-slate-800/80 border border-slate-700/60 px-4 py-1.5 rounded-full text-xs font-medium shadow-inner">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
          <span className="text-rose-400 font-bold tracking-wider">REC</span>
          <span className="text-slate-300 font-mono font-semibold">{formattedTime}</span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 flex items-center gap-1 font-semibold text-[11px]">
            <Bot className="w-3.5 h-3.5" />
            <span>AI Secretary Active</span>
          </span>
        </div>

        {/* Right: Security & Participants count */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>DTLS / SRTP E2EE</span>
          </div>

          <button
            onClick={() => toggleSidePanel('participants')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>{participants.length} người</span>
          </button>
        </div>
      </header>

      {/* ================= MAIN CONTENT: VIDEO GRID & SIDE PANEL ================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* VIDEO GRID AREA */}
        <main className="flex-1 p-4 md:p-6 flex flex-col justify-between overflow-hidden relative">
          {/* Grid Layout 2x2 */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 h-full max-h-[calc(100vh-160px)]">
            {participants.map((p) => {
              const isSelf = p.isSelf;
              const hasVideo = isSelf ? isCamOn : p.isCamOn;
              const hasMic = isSelf ? isMicOn : p.isMicOn;
              const speaking = isSelf ? false : p.isSpeaking;

              return (
                <div
                  key={p.id}
                  className={`relative rounded-3xl bg-slate-900 border overflow-hidden flex items-center justify-center transition-all duration-300 shadow-xl ${
                    speaking
                      ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Camera Video Feed or Fallback Avatar */}
                  {isSelf && isCamOn ? (
                    <video
                      ref={userVideoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover transform -scale-x-100"
                    />
                  ) : hasVideo ? (
                    // Giả lập Video Feed của Peer khác
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center relative">
                      <div className="w-24 h-24 rounded-full bg-blue-900/80 border-2 border-blue-500/40 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg shadow-blue-950">
                        {p.avatar}
                      </div>
                      <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-30" />
                    </div>
                  ) : (
                    // Camera OFF state
                    <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center gap-3">
                      <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 text-slate-400 font-extrabold text-2xl flex items-center justify-center">
                        {p.avatar}
                      </div>
                      <span className="text-xs text-slate-500 font-medium">Camera đã tắt</span>
                    </div>
                  )}

                  {/* Top-Right: Connection Quality & P2P Tag */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                      P2P
                    </span>
                    <div className="p-1 rounded-full bg-slate-950/70 backdrop-blur-md text-emerald-400">
                      <Activity className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Speaking Wave Indicator */}
                  {speaking && (
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[11px] font-medium backdrop-blur-md animate-pulse">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Đang phát biểu</span>
                    </div>
                  )}

                  {/* Bottom-Left: Name & Mic status tag */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-slate-800/80 text-xs font-semibold text-white shadow-lg">
                    <span>{p.name}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center ${
                        hasMic ? 'bg-slate-800 text-emerald-400' : 'bg-rose-500/90 text-white'
                      }`}
                    >
                      {hasMic ? (
                        <Mic className="w-3 h-3" />
                      ) : (
                        <MicOff className="w-3 h-3" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Real-time Subtitles (Live Captions Overlay) */}
          {showCaptions && currentCaption && (
            <div className="w-full flex justify-center mt-3 z-10">
              <div className="max-w-2xl px-5 py-2.5 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 text-center shadow-2xl animate-fade-in">
                <p className="text-xs text-slate-200">
                  <span className="font-bold text-amber-300 mr-1.5">
                    ✨ [{currentCaption.speaker}]:
                  </span>
                  <span>{currentCaption.text}</span>
                </p>
              </div>
            </div>
          )}
        </main>

        {/* ================= RIGHT SIDE PANEL (COLLAPSIBLE) ================= */}
        {activeSidePanel && (
          <aside className="w-80 md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col justify-between z-20 shadow-2xl animate-slide-left">
            {/* Panel Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                {activeSidePanel === 'participants' && (
                  <>
                    <Users className="w-4 h-4 text-blue-400" />
                    <span>Người tham gia ({participants.length})</span>
                  </>
                )}
                {activeSidePanel === 'chat' && (
                  <>
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    <span>Trò chuyện trong phòng</span>
                  </>
                )}
                {activeSidePanel === 'p2p' && (
                  <>
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>Thông số kỹ thuật P2P WebRTC</span>
                  </>
                )}
              </div>
              <button
                onClick={() => toggleSidePanel(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {/* 1. PARTICIPANTS LIST */}
              {activeSidePanel === 'participants' && (
                <div className="space-y-2.5">
                  {participants.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 hover:bg-slate-800 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-900 text-white font-bold text-xs flex items-center justify-center">
                          {p.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <span>{p.name}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{p.role}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 text-slate-400">
                        {p.isSelf ? (
                          isMicOn ? (
                            <Mic className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <MicOff className="w-4 h-4 text-rose-400" />
                          )
                        ) : p.isMicOn ? (
                          <Mic className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <MicOff className="w-4 h-4 text-rose-400" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. CHAT MESSAGES */}
              {activeSidePanel === 'chat' && (
                <div className="space-y-3">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className="p-3 rounded-2xl bg-slate-800/70 border border-slate-700/50">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                        <span className="font-bold text-blue-300">{msg.sender}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* 3. P2P & WEBRTC TECH SPECS */}
              {activeSidePanel === 'p2p' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-800/70 border border-slate-700/60 space-y-2.5">
                    <div className="flex justify-between py-1 border-b border-slate-700/50">
                      <span className="text-slate-400">Giao thức mạng:</span>
                      <span className="font-semibold text-emerald-400">{networkInfo.protocol}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/50">
                      <span className="text-slate-400">Độ trễ Round-Trip (RTT):</span>
                      <span className="font-mono font-bold text-white">{networkInfo.latency}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/50">
                      <span className="text-slate-400">Băng thông P2P:</span>
                      <span className="font-mono text-white">{networkInfo.bandwidth}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-700/50">
                      <span className="text-slate-400">Mã hóa luồng:</span>
                      <span className="font-semibold text-emerald-400">{networkInfo.encryption}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Trạng thái ICE:</span>
                      <span className="text-slate-200">{networkInfo.iceState}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-950/40 border border-blue-800/40 text-blue-200 space-y-1.5">
                    <div className="font-bold text-xs flex items-center gap-1.5 text-blue-300">
                      <Radio className="w-3.5 h-3.5" />
                      <span>Cơ chế Peer-to-Peer</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-blue-300/80">
                      Các luồng video và voice truyền trực tiếp giữa các trình duyệt qua WebRTC Mesh.
                      Máy chủ Signaling chỉ đảm nhiệm kết nối ban đầu, không lưu trữ video/voice.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Box (Only for Chat Tab) */}
            {activeSidePanel === 'chat' && (
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
                <input
                  type="text"
                  value={inputChat}
                  onChange={(e) => setInputChat(e.target.value)}
                  placeholder="Gửi tin nhắn..."
                  className="flex-1 px-3.5 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder:text-slate-500"
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </aside>
        )}
      </div>

      {/* ================= BOTTOM CONTROL BAR ================= */}
      <footer className="h-20 bg-slate-900 border-t border-slate-800/80 px-6 flex items-center justify-between z-20 flex-shrink-0">
        {/* Left: AI Recording Quick Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRecording}
            className={`px-3.5 py-2 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
              isRecording
                ? 'bg-rose-950/60 border-rose-600/40 text-rose-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isRecording ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span>{isRecording ? 'AI Secretary Thu âm' : 'Đã dừng thu'}</span>
          </button>
        </div>

        {/* Center: Main Call Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Micro */}
          <button
            onClick={toggleMic}
            title={isMicOn ? 'Tắt Micro (Ctrl+D)' : 'Bật Micro (Ctrl+D)'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isMicOn
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
            }`}
          >
            {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          {/* Camera */}
          <button
            onClick={toggleCam}
            title={isCamOn ? 'Tắt Camera (Ctrl+E)' : 'Bật Camera (Ctrl+E)'}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isCamOn
                ? 'bg-slate-800 hover:bg-slate-700 text-white'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30'
            }`}
          >
            {isCamOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            title="Chia sẻ màn hình"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              isScreenSharing
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white'
            }`}
          >
            <MonitorUp className="w-5 h-5" />
          </button>

          {/* Live Captions Toggle */}
          <button
            onClick={toggleCaptions}
            title="Bật/Tắt Phụ đề AI thời gian thực"
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
              showCaptions
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
            }`}
          >
            <Subtitles className="w-5 h-5" />
          </button>

          {/* END MEETING BUTTON */}
          <button
            onClick={handleEndMeeting}
            className="px-6 h-12 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-rose-600/30 active:scale-95 transition-all ml-2"
          >
            <PhoneOff className="w-4 h-4" />
            <span>Kết thúc cuộc họp</span>
          </button>
        </div>

        {/* Right: Toggle Panels (Chat & Participants) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSidePanel('chat')}
            title="Trò chuyện"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors relative ${
              activeSidePanel === 'chat'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="w-2 h-2 rounded-full bg-blue-400 absolute top-2.5 right-2.5 ring-2 ring-slate-900" />
          </button>

          <button
            onClick={() => toggleSidePanel('participants')}
            title="Danh sách người tham gia"
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
              activeSidePanel === 'participants'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Users className="w-4 h-4" />
          </button>
        </div>
      </footer>

      {/* ================= AI PROCESSING MODAL (KHI KẾT THÚC HỌP) ================= */}
      {isProcessingAI && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-scale-up">
            <div className="w-16 h-16 rounded-3xl bg-blue-800 text-white flex items-center justify-center mx-auto shadow-xl shadow-blue-800/40 relative">
              <Bot className="w-8 h-8 text-amber-300 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div>
              <h3 className="text-lg font-extrabold text-white tracking-tight">
                AI Secretary đang xử lý biên bản
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Đang chuyển đổi luồng hội thoại phòng họp thành biên bản họp thông minh...
              </p>
            </div>

            {/* Steps Progress */}
            <div className="space-y-3 text-left">
              {/* Step 1 */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                  aiStep >= 1
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                    1
                  </span>
                  <span>Xuất file MediaRecorder (WAV 16kHz)</span>
                </div>
                {aiStep > 1 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                )}
              </div>

              {/* Step 2 */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                  aiStep >= 2
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                    2
                  </span>
                  <span>OpenAI Whisper: Nhận diện tiếng Việt (STT)</span>
                </div>
                {aiStep > 2 ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : aiStep === 2 ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                ) : null}
              </div>

              {/* Step 3 */}
              <div
                className={`p-3 rounded-2xl border flex items-center justify-between text-xs transition-colors ${
                  aiStep >= 3
                    ? 'bg-slate-800/80 border-slate-700 text-white'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-blue-900 text-blue-300 font-bold text-[10px] flex items-center justify-center">
                    3
                  </span>
                  <span>Google Gemini LLM: Trích xuất Smart Minutes</span>
                </div>
                {aiStep === 3 ? (
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ) : null}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Tự động chuyển đến biên bản họp sau khi hoàn tất...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

