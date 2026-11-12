import { useState } from 'react';
import authData from '../models/authMock.json';
import { loginWithEmail, registerWithEmail } from '../services/authService';

export default function useAuthController({ onLoginSuccess }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'

  const [email, setEmail] = useState('nhitt.24ai@vku.udn.vn');
  const [password, setPassword] = useState('123456');
  const [fullName, setFullName] = useState('Trần Thị Thảo Nhi');
  const [studentId, setStudentId] = useState('24AI009');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Chuyển đổi giữa Đăng nhập và Đăng ký
  const toggleMode = () => {
    setMode((prev) => (prev === 'signin' ? 'signup' : 'signin'));
    setError(null);
  };

  // Điền nhanh tài khoản demo
  const handleQuickFill = (demoUser) => {
    setEmail(demoUser.email);
    setPassword(demoUser.password || '123456');
    setFullName(demoUser.fullName);
    setStudentId(demoUser.studentId || '24AI009');
    setError(null);
  };

  // Xử lý gửi Form Đăng nhập / Đăng ký qua Firebase Authentication
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu!');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có tối thiểu 6 ký tự!');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setError('Vui lòng nhập họ và tên của bạn!');
        return;
      }
      if (confirmPassword && password !== confirmPassword) {
        setError('Mật khẩu xác nhận không khớp!');
        return;
      }
    }

    setIsLoading(true);

    try {
      let loggedUser;
      if (mode === 'signup') {
        // Đăng ký tài khoản mới bằng Firebase Auth
        loggedUser = await registerWithEmail({
          email,
          password,
          fullName,
          studentId,
        });
      } else {
        // Đăng nhập bằng Email và Password
        loggedUser = await loginWithEmail(email, password);
      }

      setIsLoading(false);
      if (onLoginSuccess) {
        onLoginSuccess(loggedUser);
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.message || 'Đăng nhập không thành công. Vui lòng kiểm tra lại!');
    }
  };

  return {
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
    demoUsers: authData.demoUsers,
    features: authData.features,
  };
}
