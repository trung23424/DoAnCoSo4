import React from 'react';
import {
  Search,
  ShieldCheck,
  UserPlus,
  Download,
  Edit3,
  Trash2,
  Eye,
  Lock,
  Unlock,
  SlidersHorizontal,
} from 'lucide-react';
import UserFormModal from './UserFormModal';
import DeleteUserModal from './DeleteUserModal';
import UserDetailModal from './UserDetailModal';

export default function AdminUsersTab({
  userSearch,
  setUserSearch,
  roleFilter,
  setRoleFilter,
  filteredUsers,
  onRoleChange,
  onToggleStatus,
  // Modals & Handlers
  isCreateModalOpen,
  isEditModalOpen,
  isDeleteModalOpen,
  isViewModalOpen,
  selectedUser,
  onOpenCreateModal,
  onOpenEditModal,
  onOpenDeleteModal,
  onOpenViewModal,
  onCloseModals,
  onCreateUser,
  onUpdateUser,
  onConfirmDelete,
  onExportUsers,
}) {
  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>Quản lý Tài khoản & Phân quyền sinh viên VKU</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/40">
              {filteredUsers.length} tài khoản
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cấp quyền, quản lý hồ sơ và theo dõi số lượng cuộc họp đã tạo
          </p>
        </div>

        {/* Action Buttons (Create & Export) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onExportUsers}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Cấp tài khoản mới</span>
          </button>
        </div>
      </div>

      {/* 2. Filter and Search Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Tìm theo tên, email VKU hoặc MSSV..."
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600 text-white placeholder:text-slate-500"
          />
        </div>

        {/* Role Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl text-xs font-medium text-slate-400">
          {['all', 'Admin', 'Host', 'Member'].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                roleFilter === role
                  ? 'bg-purple-900/60 text-purple-200 font-bold border border-purple-500/30'
                  : 'hover:text-white'
              }`}
            >
              {role === 'all' ? 'Tất cả vai trò' : role}
            </button>
          ))}
        </div>
      </div>

      {/* 3. User Data Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase text-[11px] tracking-wider font-semibold">
              <tr>
                <th className="py-4 px-6">Thành viên & MSSV</th>
                <th className="py-4 px-4">Email VKU & Khoa</th>
                <th className="py-4 px-4">Vai trò (RBAC)</th>
                <th className="py-4 px-4">Trạng thái</th>
                <th className="py-4 px-4">Cuộc họp</th>
                <th className="py-4 px-6 text-right">Thao tác CRUD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500">
                    Không tìm thấy thành viên nào phù hợp với từ khóa tìm kiếm.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isAdmin = user.role === 'Admin';
                  const isHost = user.role === 'Host';

                  return (
                    <tr key={user.id} className="hover:bg-slate-900/50 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-900/60 border border-purple-500/30 text-purple-300 font-bold text-xs flex items-center justify-center">
                            {user.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm">{user.name}</div>
                            <div className="text-[11px] font-mono text-slate-400">{user.studentId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Email & Faculty */}
                      <td className="py-4 px-4">
                        <div className="font-medium text-slate-200">{user.email}</div>
                        <div className="text-[11px] text-slate-400">{user.faculty}</div>
                      </td>

                      {/* Role Badge */}
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border inline-flex items-center gap-1 ${
                            isAdmin
                              ? 'bg-purple-950/70 text-purple-300 border-purple-500/40'
                              : isHost
                              ? 'bg-blue-950/70 text-blue-300 border-blue-500/40'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {isAdmin && <ShieldCheck className="w-3 h-3 text-purple-400" />}
                          <span>{user.role}</span>
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-4">
                        <button
                          onClick={() => onToggleStatus && onToggleStatus(user.id)}
                          title="Bấm để Đổi trạng thái kích hoạt"
                          className={`px-2.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                            user.status === 'Active'
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-900/50'
                              : 'bg-slate-800 text-slate-500 border border-slate-700 hover:bg-slate-700'
                          }`}
                        >
                          {user.status === 'Active' ? '● Hoạt động' : '○ Bị khóa'}
                        </button>
                      </td>

                      {/* Meetings Created */}
                      <td className="py-4 px-4 font-mono font-medium text-slate-300">
                        {user.meetingsCreated}
                      </td>

                      {/* Full CRUD Action Buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. View Details (Read) */}
                          <button
                            onClick={() => onOpenViewModal && onOpenViewModal(user)}
                            title="Xem chi tiết hồ sơ"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 2. Edit User (Update) */}
                          <button
                            onClick={() => onOpenEditModal && onOpenEditModal(user)}
                            title="Chỉnh sửa thông tin"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-purple-400 hover:text-purple-300 hover:bg-purple-950/50 hover:border-purple-800/40 transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 3. Quick Role Change Buttons */}
                          <div className="hidden lg:flex items-center gap-1 border-l border-r border-slate-800 px-1 mx-0.5">
                            <button
                              onClick={() => onRoleChange && onRoleChange(user.id, 'Admin')}
                              title="Cấp quyền Admin"
                              className={`px-1.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                user.role === 'Admin'
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white'
                              }`}
                            >
                              Admin
                            </button>
                            <button
                              onClick={() => onRoleChange && onRoleChange(user.id, 'Host')}
                              title="Cấp quyền Host"
                              className={`px-1.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                user.role === 'Host'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white'
                              }`}
                            >
                              Host
                            </button>
                            <button
                              onClick={() => onRoleChange && onRoleChange(user.id, 'Member')}
                              title="Cấp quyền Member"
                              className={`px-1.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                                user.role === 'Member'
                                  ? 'bg-slate-700 text-white'
                                  : 'bg-slate-900 text-slate-400 hover:text-white'
                              }`}
                            >
                              Member
                            </button>
                          </div>

                          {/* 4. Delete User (Delete) */}
                          <button
                            onClick={() => onOpenDeleteModal && onOpenDeleteModal(user)}
                            title="Xóa tài khoản vĩnh viễn"
                            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-rose-400 hover:text-rose-300 hover:bg-rose-950/50 hover:border-rose-800/40 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* Modal 1: Create User */}
      <UserFormModal
        isOpen={isCreateModalOpen}
        onClose={onCloseModals}
        mode="create"
        onSubmit={onCreateUser}
      />

      {/* Modal 2: Edit User */}
      <UserFormModal
        isOpen={isEditModalOpen}
        onClose={onCloseModals}
        mode="edit"
        initialData={selectedUser}
        onSubmit={onUpdateUser}
      />

      {/* Modal 3: Delete Confirmation */}
      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={onCloseModals}
        user={selectedUser}
        onConfirm={onConfirmDelete}
      />

      {/* Modal 4: View User Details */}
      <UserDetailModal
        isOpen={isViewModalOpen}
        onClose={onCloseModals}
        user={selectedUser}
      />
    </div>
  );
}
