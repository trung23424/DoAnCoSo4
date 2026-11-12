import React, { useState, useEffect } from 'react';
import { X, Sliders, Save, Bot, Clock, HardDrive } from 'lucide-react';

export default function AiPolicyModal({
  isOpen,
  onClose,
  policies,
  onSave,
}) {
  const [formData, setFormData] = useState({
    maxRecordMinutes: 90,
    maxSummaryTokens: 16000,
    retentionDays: 30,
  });

  useEffect(() => {
    if (policies) {
      setFormData({
        maxRecordMinutes: policies.maxRecordMinutes || 90,
        maxSummaryTokens: policies.maxSummaryTokens || 16000,
        retentionDays: policies.retentionDays || 30,
      });
    }
  }, [policies, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                Chỉnh sửa chính sách & Hạn mức AI
              </h3>
              <p className="text-xs text-slate-400">
                Điều chỉnh quota Whisper STT, Gemini LLM và lưu trữ cho sinh viên VKU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Field 1: Max Record Minutes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>Thời lượng ghi âm tối đa mỗi cuộc họp (phút)</span>
            </label>
            <input
              type="number"
              min="15"
              max="240"
              step="15"
              value={formData.maxRecordMinutes}
              onChange={(e) =>
                setFormData({ ...formData, maxRecordMinutes: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              required
            />
            <p className="text-[11px] text-slate-500">Mặc định: 90 phút. Giới hạn tối đa: 240 phút.</p>
          </div>

          {/* Field 2: Max Tokens */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Hạn mức Token Gemini tối đa cho 1 biên bản tóm tắt</span>
            </label>
            <input
              type="number"
              min="4000"
              max="64000"
              step="2000"
              value={formData.maxSummaryTokens}
              onChange={(e) =>
                setFormData({ ...formData, maxSummaryTokens: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
              required
            />
            <p className="text-[11px] text-slate-500">Mặc định: 16,000 Tokens (Gemini 1.5 Pro).</p>
          </div>

          {/* Field 3: Retention Days */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Tự động dọn dẹp file ghi âm cũ sau (ngày)</span>
            </label>
            <input
              type="number"
              min="7"
              max="365"
              step="1"
              value={formData.retentionDays}
              onChange={(e) =>
                setFormData({ ...formData, retentionDays: Number(e.target.value) })
              }
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              required
            />
            <p className="text-[11px] text-slate-500">
              Giúp tối ưu hóa dung lượng ổ cứng lưu trữ 50 GB.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold border border-slate-800 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-lg shadow-amber-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Lưu chính sách</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
