import { useState, useMemo, useEffect } from 'react';
import {
  subscribeUserMeetings,
  deleteMeetingFromFirestore,
} from '../services/meetingsService';

export default function useMeetingHistoryController(currentUser) {
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Bộ lọc trạng thái: 'all' | 'ready' | 'processing'
  const [statusFilter, setStatusFilter] = useState('all');

  // Bộ lọc theo tháng: 'all' | '11' | '10'
  const [monthFilter, setMonthFilter] = useState('all');

  // Chế độ xem: 'grid' | 'table'
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

  // Xóa cuộc họp khỏi Cloud Firestore
  const handleDeleteMeeting = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cuộc họp này khỏi cơ sở dữ liệu?')) {
      try {
        await deleteMeetingFromFirestore(id);
      } catch (err) {
        console.warn('Lỗi khi xóa cuộc họp:', err);
      }
      setMeetings((prev) => prev.filter((m) => m.id !== id));
    }
  };

  // Thống kê số liệu động theo Firestore
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

  // Danh sách cuộc họp sau khi lọc
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
    meetings,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    monthFilter,
    setMonthFilter,
    viewMode,
    setViewMode,
    stats,
    filteredMeetings,
    isLoading,
    handleDeleteMeeting,
  };
}
