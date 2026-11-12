import React, { useState } from 'react';
import { Bot, Sliders, RotateCcw, Edit3, ShieldAlert, Check } from 'lucide-react';
import AiPolicyModal from './AiPolicyModal';

export default function AdminAiQuotaTab({
  metrics,
  policies = {
    maxRecordMinutes: 90,
    maxSummaryTokens: 16000,
    retentionDays: 30,
  },
  onSavePolicies,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm('Khôi phục chính sách hạn ngạch AI về mặc định của trường VKU?')) {
      onSavePolicies &&
        onSavePolicies({
          maxRecordMinutes: 90,
          maxSummaryTokens: 16000,
          retentionDays: 30,
        });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-5">
        {/* Top Header & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5 text-white font-bold text-base">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3>Quản trị Định mức Tài nguyên AI (Whisper STT & Gemini LLM)</h3>
              <p className="text-xs text-slate-400 font-normal">
                Kiểm soát ngân sách token API và thời lượng lưu trữ tệp âm thanh
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại</span>
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Chỉnh sửa chính sách</span>
            </button>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Tổng thời lượng Whisper STT</div>
            <div className="text-xl font-extrabold text-white">{metrics.totalWhisperHours}</div>
            <div className="text-[11px] text-emerald-400">Tỷ lệ chính xác tiếng Việt: 98.4%</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Tokens Gemini 1.5 Pro đã dùng</div>
            <div className="text-xl font-extrabold text-white">{metrics.geminiTokensUsed}</div>
            <div className="text-[11px] text-purple-400">Hạn mức miễn phí: 15 RPM</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="text-xs text-slate-400">Dung lượng ổ cứng lưu trữ Audio</div>
            <div className="text-xl font-extrabold text-white">
              {metrics.storageUsed} / {metrics.storageLimit}
            </div>
            <div className="text-[11px] text-blue-400">Định dạng file: WAV 16kHz Mono</div>
          </div>
        </div>

        {/* Policy Settings with Edit action */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-white">
              Chính sách & Giới hạn sử dụng AI cho sinh viên VKU
            </h4>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-mono">
              <Check className="w-3 h-3" /> Policy Enforced
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="space-y-0.5">
                <span className="font-medium text-slate-200">Thời lượng ghi âm tối đa cho mỗi cuộc họp:</span>
                <p className="text-[11px] text-slate-500">Giới hạn thời gian thu âm trực tiếp của micro trình duyệt</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-white font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {policies.maxRecordMinutes} phút / phòng
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Chỉnh sửa hạn mức"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="space-y-0.5">
                <span className="font-medium text-slate-200">Hạn mức Token tóm tắt tối đa cho 1 biên bản:</span>
                <p className="text-[11px] text-slate-500">Ngăn chặn tràn context window của Google Gemini 1.5 Pro</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-white font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {policies.maxSummaryTokens.toLocaleString()} Tokens
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Chỉnh sửa hạn mức"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900 border border-slate-800">
              <div className="space-y-0.5">
                <span className="font-medium text-slate-200">Tự động giải phóng file âm thanh cũ sau:</span>
                <p className="text-[11px] text-slate-500">Bảo toàn văn bản tóm tắt và xóa các file audio WAV dung lượng lớn</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-white font-mono bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
                  {policies.retentionDays} ngày
                </span>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                  title="Chỉnh sửa hạn mức"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal chỉnh sửa chính sách */}
      <AiPolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        policies={policies}
        onSave={(newP) => {
          onSavePolicies && onSavePolicies(newP);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
