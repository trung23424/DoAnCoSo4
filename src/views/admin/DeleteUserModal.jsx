import React from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';

export default function DeleteUserModal({
  isOpen,
  onClose,
  user,
  onConfirm,
}) {
  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Top Warning Banner */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 rounded-3xl bg-rose-950/60 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/40">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-1.5">
            <h3 className="font-extrabold text-white text-lg">
              Xác nhận xóa tài khoản?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hành động này sẽ xóa vĩnh viễn tài khoản của{' '}
              <strong className="text-white font-bold">{user.name}</strong> (
              <span className="font-mono text-purple-400">{user.studentId}</span>) khỏi hệ thống AI SmartMeet.
            </p>
          </div>

          {/* User Preview Box */}
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center">
              {user.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">{user.name}</div>
              <div className="text-[11px] text-slate-400 truncate">{user.email}</div>
              <div className="text-[10px] text-slate-500">{user.faculty} · {user.role}</div>
            </div>
          </div>

          <p className="text-[11px] text-rose-400/90 bg-rose-950/30 border border-rose-800/30 rounded-xl p-2.5">
            ⚠️ Toàn bộ dữ liệu ghi âm, tóm tắt và lịch sử phòng họp liên quan sẽ không thể hoàn tác!
          </p>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30 transition-all cursor-pointer flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Xóa tài khoản vĩnh viễn</span>
          </button>
        </div>
      </div>
    </div>
  );
}
