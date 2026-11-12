import React from 'react';
import useAuthController from '../controllers/useAuthController';
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Hash,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
  ShieldCheck,
  Bot,
  Radio,
  FileText,
  Loader2,
} from 'lucide-react';

export default function AuthView({ onLoginSuccess }) {
  const {
    mode,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    studentId,
    setStudentId,
    confirmPassword,
    setConfirmPassword,
    rememberMe,
    setRememberMe,
    showPassword,
    setShowPassword,
    error,
    isLoading,
    toggleMode,
    handleQuickFill,
    handleSubmit,
    demoUsers,
    features,
  } = useAuthController({ onLoginSuccess });

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans text-slate-800">
      {/* ================= LEFT COLUMN: AUTH FORM ================= */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-6 sm:p-10 md:p-14 overflow-y-auto">
        {/* Top: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-800 text-white flex items-center justify-center shadow-md shadow-blue-800/20">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="font-bold text-slate-900 text-base tracking-tight leading-tight">
              AI SmartMeet
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              AI Meeting Secretary · VKU
            </div>
          </div>
        </div>

        {/* Center: Form Area */}
        <div className="max-w-md w-full mx-auto my-8 space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {mode === 'signin' ? 'Đăng nhập tài khoản 👋' : 'Đăng ký tài khoản mới 🚀'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
              {mode === 'signin'
                ? 'Nhập email và mật khẩu của bạn để vào không gian phòng họp'
                : 'Đăng ký tài khoản để bắt đầu sử dụng phòng họp P2P và trợ lý AI'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-medium flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Họ và tên (chỉ khi Sign up) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Họ và tên <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="VD: Lê Quốc Cường"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Mã sinh viên (chỉ khi Sign up) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Mã sinh viên (MSSV / Mã cán bộ)
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="24AI009 (tùy chọn)"
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all font-mono"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Địa chỉ Email <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="cuonglq.24ai@vku.udn.vn"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Mật khẩu <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự..."
                  className="w-full pl-10 pr-11 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (chỉ khi Sign up) */}
            {mode === 'signup' && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Xác nhận lại mật khẩu <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu ở trên..."
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password (chỉ khi Sign in) */}
            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 text-blue-600 rounded border-slate-300 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <button
                  type="button"
                  onClick={() =>
                    alert(
                      'Nếu quên mật khẩu, bạn có thể tạo lại tài khoản mới hoặc liên hệ quản trị viên khoa.'
                    )
                  }
                  className="text-blue-800 hover:text-blue-900 font-semibold cursor-pointer"
                >
                  Quên mật khẩu?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer mt-2 disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Đang xử lý với Firebase...</span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'signin' ? 'Đăng nhập vào Workspace' : 'Hoàn tất đăng ký'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Mode */}
          <div className="text-center text-xs text-slate-500 pt-2">
            <span>{mode === 'signin' ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'} </span>
            <button
              onClick={toggleMode}
              className="text-blue-800 hover:text-blue-900 font-bold ml-1 cursor-pointer underline"
            >
              {mode === 'signin' ? 'Đăng ký tài khoản mới' : 'Đăng nhập ngay'}
            </button>
          </div>

          {/* Quick fill demo chips for presentation */}
          <div className="pt-4 border-t border-slate-200">
            <div className="text-[11px] font-semibold text-slate-400 mb-2">
              💡 Điền nhanh tài khoản kiểm thử:
            </div>
            <div className="flex flex-wrap gap-2">
              {demoUsers.map((user) => (
                <button
                  key={user.email}
                  type="button"
                  onClick={() => handleQuickFill(user)}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                >
                  {user.fullName} ({user.role})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="text-[11px] text-slate-400 text-center sm:text-left">
          Đồ án Cơ sở 4 · Khoa Khoa học Máy tính · Trường Đại học CNTT & TT Việt - Hàn (VKU)
        </div>
      </div>

      {/* ================= RIGHT COLUMN: PRODUCT SHOWCASE ================= */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Decorative Grid Circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />

        {/* Top Badge */}
        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit border border-white/10 text-xs font-semibold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Hệ thống phòng họp AI Thông minh</span>
        </div>

        {/* Middle Showcase Content */}
        <div className="space-y-6 max-w-lg z-10">
          <h2 className="text-3xl font-extrabold tracking-tight leading-tight">
            Tự động ghi âm, nhận diện giọng nói tiếng Việt và tạo biên bản cuộc họp.
          </h2>
          <p className="text-slate-300 text-xs leading-relaxed">
            Sử dụng mạng ngang hàng WebRTC P2P Mesh bảo mật, mô hình OpenAI Whisper STT chính xác
            và trợ lý Google Gemini 1.5 Pro tóm tắt quyết định, phân công hành động tự động.
          </p>

          {/* Feature List */}
          <div className="space-y-3 pt-2">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10"
              >
                <div className="p-2 rounded-xl bg-blue-600/30 text-amber-300 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-300 leading-tight mt-0.5">
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="text-xs text-slate-400 z-10 flex items-center justify-between border-t border-white/10 pt-4">
          <span>Nhóm sinh viên: Lê Quốc Cường & Đỗ Quang Trung</span>
          <span>GVHD: ThS. Mai Lam</span>
        </div>
      </div>
    </div>
  );
}
