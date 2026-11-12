import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, Shield, Mail, Hash, Building2 } from 'lucide-react';

export default function UserFormModal({
  isOpen,
  onClose,
  mode = 'create', // 'create' | 'edit'
  initialData = null,
  onSubmit,
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    faculty: 'Khoa Khoa học Máy tính',
    role: 'Member',
    status: 'Active',
  });

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        studentId: initialData.studentId || '',
        faculty: initialData.faculty || 'Khoa Khoa học Máy tính',
        role: initialData.role || 'Member',
        status: initialData.status || 'Active',
      });
    } else {
      setFormData({
        name: '',
        email: '',
        studentId: '',
        faculty: 'Khoa Khoa học Máy tính',
        role: 'Member',
        status: 'Active',
      });
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return alert('Vui lòng nhập họ và tên!');
    if (!formData.email.trim()) return alert('Vui lòng nhập email VKU!');
    onSubmit(formData);
  };

  const faculties = [
    'Khoa Khoa học Máy tính',
    'Khoa Kỹ thuật Máy tính & Điện tử',
    'Khoa Kinh tế số & TMĐT',
    'Giảng viên hướng dẫn',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in select-none">
      <div className="w-full max-w-lg bg-slate-950 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              {mode === 'create' ? (
                <UserPlus className="w-5 h-5" />
              ) : (
                <Save className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {mode === 'create' ? 'Cấp tài khoản thành viên mới' : 'Chỉnh sửa thông tin thành viên'}
              </h3>
              <p className="text-xs text-slate-400">
                {mode === 'create'
                  ? 'Thêm sinh viên / giảng viên vào hệ sinh thái AI SmartMeet VKU'
                  : `Cập nhật hồ sơ tài khoản: ${initialData?.name}`}
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 1. Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Họ và tên thành viên <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="VD: Lê Quốc Cường"
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
              required
            />
          </div>

          {/* 2. Email & Student ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-purple-400" />
                <span>Email trường VKU</span> <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="cuonglq.24ai@vku.udn.vn"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-blue-400" />
                <span>Mã số sinh viên (MSSV)</span>
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                placeholder="24AI009"
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 font-mono"
              />
            </div>
          </div>

          {/* 3. Faculty */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Khoa / Bộ môn</span>
            </label>
            <select
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              {faculties.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Role Selection (RBAC) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Phân quyền vai trò hệ thống (RBAC)</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { role: 'Member', label: 'Member', desc: 'Tham gia họp & xem tóm tắt' },
                { role: 'Host', label: 'Host', desc: 'Tạo phòng họp & điều phối' },
                { role: 'Admin', label: 'Admin', desc: 'Toàn quyền quản trị hệ thống' },
              ].map((item) => (
                <button
                  type="button"
                  key={item.role}
                  onClick={() => setFormData({ ...formData, role: item.role })}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    formData.role === item.role
                      ? 'bg-purple-950/70 border-purple-500 text-white shadow-sm shadow-purple-900/40'
                      : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span>{item.label}</span>
                    {formData.role === item.role && (
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 leading-tight">
                    {item.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Status Toggle */}
          <div className="pt-2 flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
            <div>
              <div className="text-xs font-semibold text-white">Kích hoạt tài khoản ngay</div>
              <div className="text-[10px] text-slate-400">
                Cho phép người dùng đăng nhập ngay sau khi tạo
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  status: formData.status === 'Active' ? 'Inactive' : 'Active',
                })
              }
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                formData.status === 'Active' ? 'bg-emerald-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform absolute top-0.5 left-0.5 ${
                  formData.status === 'Active' ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold text-xs border border-slate-800 transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition-all cursor-pointer flex items-center gap-2"
            >
              {mode === 'create' ? <UserPlus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span>{mode === 'create' ? 'Cấp tài khoản mới' : 'Lưu cập nhật'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
