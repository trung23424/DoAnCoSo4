import { useState, useMemo } from 'react';
import adminData from '../models/adminMock.json';

export default function useAdminController() {
  const [adminTab, setAdminTab] = useState('overview'); // 'overview' | 'users' | 'meetings' | 'ai-quota'
  const [users, setUsers] = useState(adminData.users);
  const [activeMeetings, setActiveMeetings] = useState(adminData.activeMeetings);
  const [metrics, setMetrics] = useState(adminData.metrics);
  const [aiEngineStats] = useState(adminData.aiEngineStats);

  // AI Policies
  const [policies, setPolicies] = useState({
    maxRecordMinutes: 90,
    maxSummaryTokens: 16000,
    retentionDays: 30,
    autoAudioPurge: true,
  });

  // Tìm kiếm và lọc người dùng
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all'); // 'all' | 'Admin' | 'Host' | 'Member'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Mở modal tạo người dùng mới
  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsCreateModalOpen(true);
  };

  // Mở modal chỉnh sửa người dùng
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Mở modal xác nhận xóa
  const handleOpenDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Mở modal xem chi tiết
  const handleOpenViewModal = (user) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  // Thêm người dùng mới (Create)
  const handleCreateUser = (newUser) => {
    const created = {
      id: `u-${Date.now()}`,
      name: newUser.name || 'Sinh viên VKU',
      email: newUser.email || 'sinhvien@vku.udn.vn',
      studentId: newUser.studentId || '24AI000',
      role: newUser.role || 'Member',
      faculty: newUser.faculty || 'Khoa Khoa học Máy tính',
      status: newUser.status || 'Active',
      meetingsCreated: 0,
      lastActive: 'Vừa xong',
      avatar: (newUser.name || 'SV').split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
    };

    setUsers((prev) => [created, ...prev]);
    setMetrics((prev) => ({
      ...prev,
      totalUsers: prev.totalUsers + 1,
    }));
    setIsCreateModalOpen(false);
    showToast(`Đã cấp tài khoản thành công cho ${created.name}!`);
  };

  // Cập nhật người dùng (Update)
  const handleUpdateUser = (updatedData) => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, ...updatedData } : u))
    );
    setIsEditModalOpen(false);
    showToast(`Đã cập nhật thông tin của ${updatedData.name || selectedUser.name}!`);
  };

  // Xác nhận xóa người dùng (Delete)
  const handleConfirmDelete = () => {
    if (!selectedUser) return;
    const name = selectedUser.name;
    setUsers((prev) => prev.filter((u) => u.id !== selectedUser.id));
    setMetrics((prev) => ({
      ...prev,
      totalUsers: Math.max(0, prev.totalUsers - 1),
    }));
    setIsDeleteModalOpen(false);
    showToast(`Đã xóa vĩnh viễn tài khoản ${name}!`);
  };

  // Thay đổi vai trò người dùng (Admin / Host / Member)
  const handleRoleChange = (userId, newRole) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    const target = users.find((u) => u.id === userId);
    showToast(`Đã chuyển vai trò của ${target?.name} thành ${newRole}!`);
  };

  // Bật/tắt trạng thái hoạt động của tài khoản
  const handleToggleStatus = (userId) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );
    showToast('Đã cập nhật trạng thái kích hoạt tài khoản!');
  };

  // Xuất danh sách Excel / CSV
  const handleExportUsers = () => {
    showToast('Đang tạo và tải tệp CSV danh sách người dùng VKU...');
  };

  // Cập nhật chính sách AI Quota
  const handleSavePolicies = (newPolicies) => {
    setPolicies(newPolicies);
    setIsPolicyModalOpen(false);
    showToast('Đã cập nhật chính sách hạn mức AI thành công!');
  };

  // Buộc kết thúc cuộc họp đang diễn ra
  const handleForceEndMeeting = (meetingId) => {
    if (window.confirm('Bạn có chắc chắn muốn buộc đóng phòng họp này?')) {
      setActiveMeetings((prev) => prev.filter((m) => m.id !== meetingId));
      setMetrics((prev) => ({
        ...prev,
        activeMeetingsCount: Math.max(0, prev.activeMeetingsCount - 1),
      }));
      showToast('Đã đóng phòng họp thành công!');
    }
  };

  // Làm mới phòng họp
  const handleRefreshMeetings = () => {
    showToast('Đã làm mới dữ liệu giám sát phòng họp P2P!');
  };

  // Lọc danh sách người dùng theo tên/email/mssv và vai trò
  const filteredUsers = useMemo(() => {
    let result = [...users];
    const query = userSearch.trim().toLowerCase();

    if (query) {
      result = result.filter(
        (u) =>
          u.name.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query) ||
          u.studentId.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== 'all') {
      result = result.filter((u) => u.role === roleFilter);
    }

    return result;
  }, [users, userSearch, roleFilter]);

  return {
    adminTab,
    setAdminTab,
    metrics,
    aiEngineStats,
    policies,
    activeMeetings,
    userSearch,
    setUserSearch,
    roleFilter,
    setRoleFilter,
    filteredUsers,
    toastMessage,
    // Modals
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
    isPolicyModalOpen,
    setIsPolicyModalOpen,
    selectedUser,
    // Handlers
    handleOpenCreateModal,
    handleOpenEditModal,
    handleOpenDeleteModal,
    handleOpenViewModal,
    handleCreateUser,
    handleUpdateUser,
    handleConfirmDelete,
    handleRoleChange,
    handleToggleStatus,
    handleExportUsers,
    handleSavePolicies,
    handleForceEndMeeting,
    handleRefreshMeetings,
  };
}
