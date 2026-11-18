import React from 'react';
import Sidebar from './components/Sidebar';
import useSettingsController from '../controllers/useSettingsController';
import {
  Sparkles,
  Bot,
  Radio,
  Mic,
  Video,
  User,
  Check,
  Eye,
  EyeOff,
  RotateCcw,
  Volume2,
  ShieldCheck,
  Cpu,
  Layers,
  Save,
  CheckCircle2,
  Lock,
  LogOut,
  Sliders,
} from 'lucide-react';

export default function SettingsView({ onNavigate, currentUser, onLogout }) {
  const {
    activeTab,
    setActiveTab,
    whisperModel,
    setWhisperModel,
    aiProvider,
    setAiProvider,
    geminiApiKey,
    setGeminiApiKey,
    openaiApiKey,
    setOpenaiApiKey,
    showApiKey,
    setShowApiKey,
    showOpenaiKey,
    setShowOpenaiKey,
    systemPrompt,
    setSystemPrompt,
    autoRecording,
    setAutoRecording,
    stunServer,
    setStunServer,
    turnServer,
    setTurnServer,
    audioCodec,
    setAudioCodec,
    encryptionEnabled,
    setEncryptionEnabled,
    isTestingMic,
    micLevel,
    isTestingCam,
    testVideoRef,
    toggleTestMic,
    toggleTestCam,
    handleTestSpeaker,
    handleResetPrompt,
    profile,
    setProfile,
    savedToast,
    handleSaveSettings,
  } = useSettingsController();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-800">
      {/* 1. Sidebar dùng chung */}
      <Sidebar
        currentTab="settings"
        onNavigate={onNavigate}
        currentUser={currentUser}
        onLogout={onLogout}
      />

      {/* 2. Main Content: Settings */}
      <div className="flex-1 h-screen overflow-y-auto bg-slate-50/60 px-8 py-8 space-y-6">
        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full w-fit border border-blue-100">
              <Sliders className="w-3.5 h-3.5" />
              <span>Hệ thống & Cấu hình Đồ án AI SmartMeet</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
              Cài đặt Hệ thống & Lõi AI
            </h1>
            <p className="text-xs md:text-sm text-slate-500 mt-1">
              Quản lý mô hình OpenAI Whisper, Google Gemini API, kết nối WebRTC P2P và kiểm tra thiết bị
            </p>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSaveSettings}
            className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-full font-semibold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all self-start sm:self-auto cursor-pointer"
          >
            {savedToast ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>Đã lưu thành công!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </header>

        {/* Setting Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-px overflow-x-auto">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-xs transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
              activeTab === 'ai'
                ? 'bg-white text-blue-900 border-blue-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Bot className="w-4 h-4 text-blue-700" />
            <span>1. Lõi AI & Prompt</span>
          </button>

          <button
            onClick={() => setActiveTab('webrtc')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-xs transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
              activeTab === 'webrtc'
                ? 'bg-white text-blue-900 border-blue-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Radio className="w-4 h-4 text-emerald-600" />
            <span>2. Mạng WebRTC P2P</span>
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-xs transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
              activeTab === 'devices'
                ? 'bg-white text-blue-900 border-blue-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <Mic className="w-4 h-4 text-amber-600" />
            <span>3. Kiểm tra thiết bị</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-3 rounded-t-2xl font-bold text-xs transition-all border-b-2 -mb-px cursor-pointer whitespace-nowrap ${
              activeTab === 'profile'
                ? 'bg-white text-blue-900 border-blue-800 shadow-2xs'
                : 'text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100/60'
            }`}
          >
            <User className="w-4 h-4 text-purple-600" />
            <span>4. Hồ sơ tài khoản</span>
          </button>
        </div>

        {/* Tab 1: AI & Prompt Settings */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            {/* Whisper Model Selection */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Cpu className="w-4 h-4 text-blue-700" />
                <h3>Chọn phiên bản mô hình Speech-to-Text (OpenAI Whisper)</h3>
              </div>
              <p className="text-xs text-slate-500">
                Lõi AI nhận dạng giọng nói tiếng Việt chạy trên Backend Python FastAPI
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                {[
                  {
                    id: 'tiny',
                    name: 'Whisper tiny',
                    params: '39M params',
                    speed: 'Siêu nhanh',
                    acc: 'Độ chính xác cơ bản',
                    badge: 'Nhẹ nhất',
                  },
                  {
                    id: 'base',
                    name: 'Whisper base',
                    params: '74M params',
                    speed: 'Nhanh',
                    acc: 'Chính xác tốt',
                    badge: 'Phổ biến',
                  },
                  {
                    id: 'medium',
                    name: 'Whisper medium',
                    params: '769M params',
                    speed: 'Cân bằng',
                    acc: 'Độ chính xác ~98.4%',
                    badge: 'Khuyên dùng cho Tiếng Việt',
                    recommended: true,
                  },
                  {
                    id: 'large-v3',
                    name: 'Whisper large-v3',
                    params: '1550M params',
                    speed: 'Cần GPU mạnh',
                    acc: 'Chính xác tuyệt đối',
                    badge: 'Yêu cầu VRAM cao',
                  },
                ].map((m) => (
                  <div
                    key={m.id}
                    onClick={() => setWhisperModel(m.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      whisperModel === m.id
                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div>
                      {m.recommended && (
                        <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-800 text-white shadow-2xs">
                          {m.badge}
                        </span>
                      )}
                      <div className="font-bold text-slate-900 text-sm">{m.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{m.params}</div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] space-y-1">
                      <div className="text-slate-600">⚡ {m.speed}</div>
                      <div className="font-semibold text-emerald-700">🎯 {m.acc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* LLM API Key Configuration */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3>Cấu hình API Mô hình Ngôn ngữ Lớn (LLM)</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Gemini Provider */}
                <div
                  onClick={() => setAiProvider('gemini')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    aiProvider === 'gemini'
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Google Gemini API</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Khuyên dùng (Đồ án VKU)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Mô hình Gemini 1.5 Pro xử lý ngữ cảnh dài, tóm tắt tiếng Việt cực tốt
                  </p>
                </div>

                {/* OpenAI Provider */}
                <div
                  onClick={() => setAiProvider('openai')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    aiProvider === 'openai'
                      ? 'border-blue-600 bg-blue-50/40 ring-2 ring-blue-600/20'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">OpenAI API (GPT-4o)</span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      Tùy chọn
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Dùng API OpenAI cho trường hợp cần đồng bộ chung hệ sinh thái
                  </p>
                </div>
              </div>

              {/* API Key Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Gemini LLM Key */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      Google Gemini API Key (Tóm tắt biên bản)
                    </label>
                    <span className="text-[10px] text-blue-700 font-semibold">Tự động Fallback</span>
                  </div>
                  <div className="relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={geminiApiKey}
                      onChange={(e) => setGeminiApiKey(e.target.value)}
                      placeholder="AIzaSy..."
                      className="w-full pl-4 pr-11 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Whisper STT Key (OpenAI hoặc Groq Free) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700">
                      OpenAI Whisper / Groq API Key (STT)
                    </label>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Hỗ trợ Groq Free (gsk_...)
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type={showOpenaiKey ? 'text' : 'password'}
                      value={openaiApiKey}
                      onChange={(e) => setOpenaiApiKey(e.target.value)}
                      placeholder="sk-... (OpenAI) hoặc gsk_... (Groq Free)"
                      className="w-full pl-4 pr-11 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOpenaiKey((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                * Mẹo: Có thể lấy API Key miễn phí 100% không cần thẻ tại{' '}
                <a
                  href="https://console.groq.com/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 underline font-medium hover:text-blue-900"
                >
                  console.groq.com/keys
                </a>{' '}
                để chạy Whisper large-v3 tốc độ cao.
              </p>
            </div>

            {/* Prompt Engineering System Prompt */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Bot className="w-4 h-4 text-blue-700" />
                  <h3>Cấu hình Prompt Engineering (System Prompt)</h3>
                </div>
                <button
                  onClick={handleResetPrompt}
                  className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-900 font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Khôi phục mặc định</span>
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Câu lệnh chỉ đạo LLM phân tích bản transcript và trích xuất cấu trúc biên bản họp (Overview, Decisions, Action Items)
              </p>

              <textarea
                rows={5}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white leading-relaxed text-slate-800"
              />
            </div>
          </div>
        )}

        {/* Tab 2: WebRTC & P2P Settings */}
        {activeTab === 'webrtc' && (
          <div className="space-y-6">
            {/* P2P Architecture Overview */}
            <div className="bg-emerald-950/20 border border-emerald-500/30 rounded-3xl p-6 space-y-3">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <Radio className="w-4 h-4 text-emerald-600" />
                <span>Kiến trúc Mạng Ngang Hàng WebRTC (Full Mesh P2P)</span>
              </div>
              <p className="text-xs text-emerald-900/80 leading-relaxed max-w-3xl">
                Hệ thống kết nối trực tiếp giữa các trình duyệt mà không truyền âm thanh/hình ảnh qua
                server trung gian. Máy chủ Signaling (Node.js/Socket.io hoặc PeerJS) chỉ hỗ trợ bắt tay
                ICE Candidates ban đầu, sau đó kết nối hoàn toàn P2P, bảo mật và giảm tối đa chi phí hạ tầng.
              </p>
            </div>

            {/* STUN / TURN Configuration */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Cấu hình Máy chủ NAT Traversal (STUN / TURN)</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Máy chủ STUN (Public Google)</label>
                  <input
                    type="text"
                    value={stunServer}
                    onChange={(e) => setStunServer(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400">Giúp xác định Public IP của người dùng sau NAT</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Máy chủ TURN (Fallback Relay)</label>
                  <input
                    type="text"
                    value={turnServer}
                    onChange={(e) => setTurnServer(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <p className="text-[11px] text-slate-400">Dự phòng khi mạng chặn kết nối P2P trực tiếp</p>
                </div>
              </div>
            </div>

            {/* Codec & Encryption */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Mã hóa & Chuẩn nén âm thanh</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Bộ giải mã âm thanh (Audio Codec)</label>
                  <select
                    value={audioCodec}
                    onChange={(e) => setAudioCodec(e.target.value)}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="OPUS (16kHz / Mono, tối ưu cho Whisper)">
                      OPUS (16kHz / Mono - Tối ưu cho Whisper)
                    </option>
                    <option value="OPUS (48kHz / Stereo - Nhạc & Phòng họp)">
                      OPUS (48kHz / Stereo)
                    </option>
                    <option value="G.711 (PCMU/PCMA)">G.711 (Legacy)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Mã hóa đầu cuối E2EE (DTLS/SRTP)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Bảo vệ luồng video và voice giữa các peer</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={encryptionEnabled}
                    onChange={(e) => setEncryptionEnabled(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Device Tester */}
        {activeTab === 'devices' && (
          <div className="space-y-6">
            {/* Microphone Test */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Mic className="w-4 h-4 text-blue-700" />
                  <h3>1. Kiểm tra Microphone & Thu âm</h3>
                </div>
                <button
                  onClick={toggleTestMic}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isTestingMic
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-blue-800 text-white shadow-xs hover:bg-blue-900'
                  }`}
                >
                  {isTestingMic ? 'Dừng kiểm tra' : 'Nói thử để kiểm tra'}
                </button>
              </div>

              {/* Volume VU Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>Mức âm lượng thu nhận (Input Volume):</span>
                  <span className="font-mono">{micLevel}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <div
                    style={{ width: `${micLevel}%` }}
                    className={`h-full rounded-full transition-all duration-150 ${
                      micLevel > 75
                        ? 'bg-rose-500'
                        : micLevel > 40
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Camera Test */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Video className="w-4 h-4 text-blue-700" />
                  <h3>2. Kiểm tra Camera (Webcam Preview)</h3>
                </div>
                <button
                  onClick={toggleTestCam}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    isTestingCam
                      ? 'bg-rose-600 text-white'
                      : 'bg-blue-800 text-white hover:bg-blue-900'
                  }`}
                >
                  {isTestingCam ? 'Tắt xem trước' : 'Bật xem trước Camera'}
                </button>
              </div>

              {/* Camera Preview Box */}
              <div className="w-full max-w-md h-56 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden flex items-center justify-center relative shadow-inner">
                {isTestingCam ? (
                  <video
                    ref={testVideoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />
                ) : (
                  <div className="text-center text-slate-500 space-y-1">
                    <Video className="w-8 h-8 mx-auto text-slate-600" />
                    <p className="text-xs font-medium">Bấm "Bật xem trước Camera" để kiểm tra hình ảnh</p>
                  </div>
                )}
              </div>
            </div>

            {/* Speaker Test */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Volume2 className="w-4 h-4 text-blue-700" />
                  <h3>3. Kiểm tra Loa / Tai nghe</h3>
                </div>
                <button
                  onClick={handleTestSpeaker}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                >
                  Phát âm thanh kiểm tra (Beep)
                </button>
              </div>
              <p className="text-xs text-slate-500">
                Nhấn nút phát âm thanh để xác nhận âm thanh phát ra rõ ràng không bị rè
              </p>
            </div>
          </div>
        )}

        {/* Tab 4: Account & Workspace Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Student & Workspace Profile */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Thông tin Sinh viên & Không gian làm việc</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Họ và tên</label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Email trường VKU</label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Mã số sinh viên (MSSV)</label>
                  <input
                    type="text"
                    disabled
                    value={profile.studentId}
                    className="w-full px-4 py-2.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Lớp & Chuyên ngành</label>
                  <input
                    type="text"
                    disabled
                    value={profile.className}
                    className="w-full px-4 py-2.5 text-xs bg-slate-100 text-slate-500 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900 flex items-center justify-between mt-3">
                <div>
                  <span className="font-bold">Gói tài khoản: </span>
                  <span>{profile.workspacePlan} (Dành cho Nghiên cứu & Giảng dạy VKU)</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-800 text-white font-bold text-[10px]">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Logout / Danger Action */}
            <div className="bg-white rounded-3xl border border-rose-100 p-6 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-bold text-rose-900 text-sm">Đăng xuất khỏi phiên làm việc</h4>
                <p className="text-xs text-slate-500 mt-0.5">Xóa session và đưa người dùng về màn hình ban đầu</p>
              </div>
              <button
                onClick={() => (onLogout ? onLogout() : alert('Đã đăng xuất!'))}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
