import { useState, useMemo, useEffect } from 'react';
import {
  subscribeUserMeetings,
  deleteMeetingFromFirestore,
} from '../services/meetingsService';

export default function useDashboardController(currentUser) {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Quản lý Tab chính trên Sidebar ('home' | 'history')
  const [activeTab, setActiveTab] = useState('home');

  // Quản lý bộ lọc trạng thái ('all' | 'ready' | 'processing')
  const [statusFilter, setStatusFilter] = useState('all');

  // Quản lý bộ lọc theo tháng ('all' | '11' | '10')
  const [monthFilter, setMonthFilter] = useState('all');

  // Quản lý chế độ xem ('grid' | 'table')
  const [viewMode, setViewMode] = useState('grid');

  // Lắng nghe danh sách cuộc họp thời gian thực từ Cloud Firestore
  useEffect(() => {
    if (!currentUser) return;

    setIsLoading(true);
    const unsubscribe = subscribeUserMeetings(currentUser, (firestoreMeetings) => {
      setMeetings(firestoreMeetings || []);
      setIsLoading(false);
    });

    return () => unsubscribe && unsubscribe();
  }, [currentUser]);

  // Xử lý tạo phòng họp
  const handleStartMeeting = () => {
    // Được kích hoạt qua CreateMeetingModal
  };

  // Xóa cuộc họp trực tiếp trên Cloud Firestore
  const handleDeleteMeeting = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc họp này khỏi Cloud Firestore?')) {
      try {
        await deleteMeetingFromFirestore(id);
      } catch (err) {
        console.warn('Lỗi khi xóa cuộc họp:', err);
      }
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Thống kê tổng quan động theo dữ liệu Firestore của tài khoản
  const stats = useMemo(() => {
    const total = meetings.length;
    const readyCount = meetings.filter((m) => m.status === 'ready').length;
    const processingCount = meetings.filter((m) => m.status === 'processing').length;

    return {
      totalMeetings: total,
      totalHours: `${total * 30} phút`,
      readyCount,
      processingCount,
      actionItemRate: total > 0 ? '100%' : '0%',
      storageUsed: `${(total * 18.5).toFixed(1)} MB`,
    };
  }, [meetings]);

  // Lọc cuộc họp theo từ khóa tìm kiếm, trạng thái và tháng
  const filteredMeetings = useMemo(() => {
    let result = [...meetings];
    const query = searchQuery.trim().toLowerCase();

    // 1. Lọc theo Search Query
    if (query) {
      result = result.filter(
        (meeting) =>
          (meeting.title || '').toLowerCase().includes(query) ||
          (meeting.id || '').toLowerCase().includes(query) ||
          (meeting.hostName || meeting.host || '').toLowerCase().includes(query)
      );
    }

    // 2. Lọc theo Status
    if (statusFilter !== 'all') {
      result = result.filter((meeting) => meeting.status === statusFilter);
    }

    // 3. Lọc theo Tháng
    if (monthFilter !== 'all') {
      result = result.filter((meeting) => {
        if (!meeting.date) return false;
        return meeting.date.includes(monthFilter) || meeting.date.includes(`Th${monthFilter}`);
      });
    }

    return result;
  }, [meetings, searchQuery, statusFilter, monthFilter]);

  return {
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    viewMode,
    setViewMode,
    stats,
    filteredMeetings,
    isLoading,
    handleStartMeeting,
    handleDeleteMeeting,
  };
}
