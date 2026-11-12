import React from 'react';
import useAdminController from '../controllers/useAdminController';
import AdminSidebar from './admin/AdminSidebar';
import AdminOverviewTab from './admin/AdminOverviewTab';
import AdminUsersTab from './admin/AdminUsersTab';
import AdminMeetingsTab from './admin/AdminMeetingsTab';
import AdminAiQuotaTab from './admin/AdminAiQuotaTab';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AdminView({ onBackToUserApp }) {
  const {
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
    // Modals & User state
    isCreateModalOpen,
    setIsCreateModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isViewModalOpen,
    setIsViewModalOpen,
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
  } = useAdminController();

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 overflow-hidden font-sans select-none">
      {/* 1. Admin Sidebar Component */}
      <AdminSidebar
        adminTab={adminTab}
        setAdminTab={setAdminTab}
        totalUsers={metrics.totalUsers}
        activeMeetingsCount={activeMeetings.length}
        onBackToUserApp={onBackToUserApp}
      />

      {/* 2. Main Admin Workspace */}
      <div className="flex-1 h-screen overflow-y-auto bg-slate-900/70 p-6 sm:p-8 space-y-6 relative">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 bg-purple-950/60 px-3 py-1 rounded-full w-fit border border-purple-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Quản trị Hệ thống & Phân quyền Cấp cao (RBAC)</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1.5">
              Admin Control Center
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Giám sát tài nguyên AI Whisper/Gemini, hạ tầng phòng họp WebRTC P2P và người dùng trường VKU
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>All Services Healthy</span>
            </div>
          </div>
        </header>

        {/* 3. Phân tách Tab Components con */}
        {adminTab === 'overview' && (
          <AdminOverviewTab
            metrics={metrics}
            activeMeetings={activeMeetings}
            aiEngineStats={aiEngineStats}
            onForceEndMeeting={handleForceEndMeeting}
          />
        )}

        {adminTab === 'users' && (
          <AdminUsersTab
            userSearch={userSearch}
            setUserSearch={setUserSearch}
            roleFilter={roleFilter}
            setRoleFilter={setRoleFilter}
            filteredUsers={filteredUsers}
            onRoleChange={handleRoleChange}
            onToggleStatus={handleToggleStatus}
            // Modals props
            isCreateModalOpen={isCreateModalOpen}
            isEditModalOpen={isEditModalOpen}
            isDeleteModalOpen={isDeleteModalOpen}
            isViewModalOpen={isViewModalOpen}
            selectedUser={selectedUser}
            onOpenCreateModal={handleOpenCreateModal}
            onOpenEditModal={handleOpenEditModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            onOpenViewModal={handleOpenViewModal}
            onCloseModals={handleCloseModals}
            onCreateUser={handleCreateUser}
            onUpdateUser={handleUpdateUser}
            onConfirmDelete={handleConfirmDelete}
            onExportUsers={handleExportUsers}
          />
        )}

        {adminTab === 'meetings' && (
          <AdminMeetingsTab
            activeMeetings={activeMeetings}
            onForceEndMeeting={handleForceEndMeeting}
            onRefresh={handleRefreshMeetings}
          />
        )}

        {adminTab === 'ai-quota' && (
          <AdminAiQuotaTab
            metrics={metrics}
            policies={policies}
            onSavePolicies={handleSavePolicies}
          />
        )}
      </div>
    </div>
  );
}
