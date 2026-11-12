import React, { useState } from 'react';
import {
  X,
  Video,
  Sparkles,
  Mic,
  MicOff,
  VideoOff,
  Radio,
  ArrowRight,
  RefreshCw,
  Bot,
  ShieldCheck,
} from 'lucide-react';

export default function CreateMeetingModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  // Tạo ngẫu nhiên một mã phòng họp dạng asm-xxxxxx
  const generateRoomId = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let id = 'asm-';
    for (let i = 0; i < 6; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  };

  const [title, setTitle] = useState('Họp thảo luận tiến độ Sprint 15');
  const [roomId, setRoomId] = useState(generateRoomId);
  const [language, setLanguage] = useState('vi'); // 'vi' | 'en'
  const [autoRecord, setAutoRecord] = useState(true);
  const [initialMic, setInitialMic] = useState(true);
  const [initialCam, setInitialCam] = useState(true);

  const quickTags = [
    'Họp kickoff dự án',
    'Review Sprint tuần',
    'Thảo luận kiến trúc AI',
    'Họp nhóm đồ án VKU',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (onConfirm) {
      onConfirm({
        title: title.trim(),
        roomId,
        language,
        autoRecord,
        initialMic,
        initialCam,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-800 text-white flex items-center justify-center shadow-md shadow-blue-800/20">
              <Video className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight leading-tight">
                Tạo phòng họp trực tuyến mới
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Thiết lập phòng họp WebRTC P2P & Trợ lý AI Secretary
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 1. Tên cuộc họp */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">
              Tên cuộc họp <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập chủ đề hoặc tên cuộc họp..."
              className="w-full px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900 transition-all font-medium"
            />

            {/* Quick Title Tags */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 mr-1">Gợi ý nhanh:</span>
              {quickTags.map((tag, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setTitle(tag)}
                  className="px-2 py-0.5 rounded-lg text-[11px] bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-blue-800 transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Mã phòng họp (Room ID) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Mã phòng họp (Room ID)</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={roomId}
                className="flex-1 px-4 py-2 text-xs font-mono font-bold bg-slate-100 text-blue-900 border border-slate-200 rounded-xl"
              />
              <button
                type="button"
                onClick={() => setRoomId(generateRoomId())}
                title="Đổi mã ngẫu nhiên"
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-800 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3. Cấu hình AI Secretary */}
          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-blue-700" />
                <span className="text-xs font-bold text-blue-950">Trợ lý AI Secretary</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoRecord}
                  onChange={(e) => setAutoRecord(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-800" />
              </label>
            </div>

            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tự động thu âm hội thoại qua <strong>MediaRecorder</strong> và tạo biên bản tóm tắt
              thông minh (Whisper + Gemini API) ngay sau khi cuộc họp kết thúc.
            </p>

            {/* Chọn ngôn ngữ nhận diện */}
            <div className="flex items-center justify-between pt-1 border-t border-blue-100/70 text-xs">
              <span className="text-slate-600 font-medium">Ngôn ngữ nhận dạng:</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    language === 'vi'
                      ? 'bg-blue-800 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  🇻🇳 Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-blue-800 text-white shadow-2xs'
                      : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  🇺🇸 English
                </button>
              </div>
            </div>
          </div>

          {/* 4. Tùy chọn thiết bị ban đầu (Mic & Cam) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Trạng thái thiết bị khi vào phòng</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setInitialMic((prev) => !prev)}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  initialMic
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {initialMic ? <Mic className="w-4 h-4 text-emerald-600" /> : <MicOff className="w-4 h-4" />}
                <span>{initialMic ? 'Micro: Bật' : 'Micro: Tắt'}</span>
              </button>

              <button
                type="button"
                onClick={() => setInitialCam((prev) => !prev)}
                className={`p-3 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition-all cursor-pointer ${
                  initialCam
                    ? 'border-emerald-500 bg-emerald-50/60 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-400'
                }`}
              >
                {initialCam ? <Video className="w-4 h-4 text-emerald-600" /> : <VideoOff className="w-4 h-4" />}
                <span>{initialCam ? 'Camera: Bật' : 'Camera: Tắt'}</span>
              </button>
            </div>
          </div>

          {/* Security Tag */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Kết nối WebRTC P2P Mesh mã hóa E2EE bảo mật tuyệt đối</span>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="bg-blue-800 hover:bg-blue-900 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <span>Bắt đầu cuộc họp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
