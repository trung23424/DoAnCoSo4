import React, { useState, useEffect } from 'react';
import DashboardView from './views/DashboardView';
import MeetingHistoryView from './views/MeetingHistoryView';
import MeetingDetailsView from './views/MeetingDetailsView';
import MeetingRoomView from './views/MeetingRoomView';
import SettingsView from './views/SettingsView';
import AuthView from './views/AuthView';
import AdminView from './views/AdminView';
import CreateMeetingModal from './views/components/CreateMeetingModal';
import { subscribeAuth, logoutUser } from './services/authService';
import { createMeetingInFirestore } from './services/meetingsService';

function App() {
  // 'home' | 'history' | 'settings' | 'admin' | 'meeting-room' | 'meeting-details' | 'auth'
  const [currentView, setCurrentView] = useState('home');
  const [selectedMeetingId, setSelectedMeetingId] = useState('asm-8f2k1q');

  // Thông tin người dùng đăng nhập hiện tại
  const [currentUser, setCurrentUser] = useState(null);

  // Lắng nghe phiên đăng nhập thực tế từ Firebase Authentication (F5 không mất nick)
  useEffect(() => {
    const unsubscribe = subscribeAuth((user) => {
      if (user) {
        setCurrentUser(user);
        // Nếu đang ở màn hình auth thì chuyển vào home
        setCurrentView((prev) => (prev === 'auth' ? 'home' : prev));
      } else {
        setCurrentUser(null);
        setCurrentView('auth');
      }
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  // Modal tạo phòng họp mới
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeRoomConfig, setActiveRoomConfig] = useState(null);

  // Chuyển hướng Tab trên Sidebar
  const handleNavigate = (tab) => {
    if (
      tab === 'home' ||
      tab === 'history' ||
      tab === 'settings' ||
      tab === 'admin' ||
      tab === 'auth'
    ) {
      setCurrentView(tab);
    }
  };

  // Đăng xuất -> Gọi Firebase signOut và chuyển về AuthView
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.warn('Lỗi khi đăng xuất:', e);
    }
    setCurrentUser(null);
    setCurrentView('auth');
  };

  // Đăng nhập thành công -> Cập nhật User và đưa về Home
  const handleLoginSuccess = (user) => {
    if (user) {
      setCurrentUser(user);
    }
    setCurrentView('home');
  };

  // Mở màn hình biên bản cuộc họp
  const handleOpenSummary = (meetingId) => {
    setSelectedMeetingId(meetingId || 'asm-8f2k1q');
    setCurrentView('meeting-details');
  };

  // Mở Modal Tạo phòng họp mới
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  // Xác nhận tạo phòng họp từ Modal -> Lưu vào Firestore và vào phòng họp ngay
  const handleConfirmCreateMeeting = async (config) => {
    const fullConfig = { ...config, isHost: true };
    try {
      await createMeetingInFirestore(fullConfig, currentUser);
    } catch (err) {
      console.warn('Lỗi khi lưu cuộc họp vào Firestore:', err);
    }
    setActiveRoomConfig(fullConfig);
    setIsCreateModalOpen(false);
    setCurrentView('meeting-room');
  };

  // Tham gia phòng họp bằng mã ID đã có (Vai trò Guest/Callee)
  const handleJoinMeeting = (roomId) => {
    if (!roomId || !roomId.trim()) return;
    const config = {
      roomId: roomId.trim(),
      title: `Phòng họp ${roomId.trim()}`,
      isHost: false,
      initialMic: true,
      initialCam: true,
      autoRecord: true,
    };
    setActiveRoomConfig(config);
    setCurrentView('meeting-room');
  };

  // Khi kết thúc họp và AI xử lý xong -> Chuyển sang xem biên bản họp
  const handleMeetingFinished = (meetingId) => {
    setSelectedMeetingId(meetingId || 'asm-8f2k1q');
    setCurrentView('meeting-details');
  };

  // Quay lại màn hình trước (mặc định về home)
  const handleBackToDashboard = () => {
    setCurrentView('home');
  };

  return (
    <>
      {/* 1. Màn hình Đăng nhập / Đăng ký */}
      {currentView === 'auth' && (
        <AuthView onLoginSuccess={handleLoginSuccess} />
      )}

      {/* 2. Màn hình Home Dashboard */}
      {currentView === 'home' && (
        <DashboardView
          onNavigate={handleNavigate}
          onViewSummary={handleOpenSummary}
          onStartMeeting={handleOpenCreateModal}
          onJoinMeeting={handleJoinMeeting}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 3. Màn hình Kho Lịch sử Cuộc họp */}
      {currentView === 'history' && (
        <MeetingHistoryView
          onNavigate={handleNavigate}
          onViewSummary={handleOpenSummary}
          onStartMeeting={handleOpenCreateModal}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 4. Màn hình Cài đặt Hệ thống & Lõi AI */}
      {currentView === 'settings' && (
        <SettingsView
          onNavigate={handleNavigate}
          currentUser={currentUser}
          onLogout={handleLogout}
        />
      )}

      {/* 5. Màn hình Quản trị viên Admin Portal (RBAC & Giám sát hệ thống) */}
      {currentView === 'admin' && (
        <AdminView onBackToUserApp={() => handleNavigate('home')} />
      )}

      {/* 6. Màn hình Phòng họp trực tuyến WebRTC P2P */}
      {currentView === 'meeting-room' && (
        <MeetingRoomView
          onMeetingFinished={handleMeetingFinished}
          roomConfig={activeRoomConfig}
          currentUser={currentUser}
        />
      )}

      {/* 6. Màn hình Chi tiết biên bản họp & AI Summary */}
      {currentView === 'meeting-details' && (
        <MeetingDetailsView
          meetingId={selectedMeetingId}
          onBack={handleBackToDashboard}
        />
      )}

      {/* Popup / Modal Tạo phòng họp mới */}
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onConfirm={handleConfirmCreateMeeting}
      />
    </>
  );
}

export default App;
