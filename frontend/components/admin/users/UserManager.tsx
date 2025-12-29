"use client";

import { useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { useUserLogic } from "@/hooks/admin/useUserLogic";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Pagination from "@/components/admin/Pagination";
import UserStats from "./UserStats";
import UserTable from "./UserTable";
import UserActions from "./UserActions";
import UserEditModal from "./UserEditModal";
import UserRoleModal from "./UserRoleModal";
import { User, userService } from "@/services/user.service";

export default function UserManager() {
    const {
        users,
        roles,
        pagination,
        loading,
        searchQuery,
        sortField,
        sortOrder,
        isActiveFilter,
        roleFilter,
        handlePageChange,
        handleSearch,
        handleLimitChange,
        handleSort,
        handleActiveFilter,
        handleRoleFilter,
        refreshData
    } = useUserLogic();

    // Modal States
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handlers
    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleAssignRoles = (user: User) => {
        setSelectedUser(user);
        setIsRoleModalOpen(true);
    };

    const handleDeleteClick = (id: string) => {
        const user = users.find(u => u.id === id);
        if (user) {
            setSelectedUser(user);
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmStatusToggle = async () => {
        if (!selectedUser) return;
        try {
            setDeleting(true);
            if (selectedUser.is_active) {
                // If currently active, lock them
                await userService.delete(selectedUser.id);
            } else {
                // If currently inactive, unlock them
                await userService.update(selectedUser.id, { is_active: true });
            }
            refreshData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            setError("Không thể thay đổi trạng thái người dùng.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <UserStats />

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <UserActions
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    limit={pagination.limit}
                    totalRows={pagination.total_rows}
                    onLimitChange={handleLimitChange}
                    isActiveFilter={isActiveFilter}
                    onActiveFilter={handleActiveFilter}
                    roleFilter={roleFilter}
                    onRoleFilter={handleRoleFilter}
                    roles={roles}
                />

                <UserTable
                    users={users}
                    loading={loading}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSort={handleSort}
                    onEdit={handleEdit}
                    onDelete={handleDeleteClick}
                    onAssignRoles={handleAssignRoles}
                />

                <div className="p-4 border-t border-gray-50 bg-gray-50/30">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={pagination.total_pages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>

            <UserEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSuccess={refreshData}
                editingUser={selectedUser}
            />

            <UserRoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onSuccess={refreshData}
                user={selectedUser}
                roles={roles}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title={selectedUser?.is_active ? "Khóa tài khoản người dùng" : "Mở khóa tài khoản"}
                message={selectedUser?.is_active
                    ? `Bạn có chắc chắn muốn khóa tài khoản của ${selectedUser.full_name}? Người dùng này sẽ không thể đăng nhập vào hệ thống.`
                    : `Xác nhận mở khóa tài khoản cho ${selectedUser?.full_name}?`}
                confirmText={selectedUser?.is_active ? "Khóa tài khoản" : "Mở khóa"}
                cancelText="Hủy bỏ"
                onConfirm={handleConfirmStatusToggle}
                onCancel={() => setIsDeleteModalOpen(false)}
                loading={deleting}
                type={selectedUser?.is_active ? "danger" : "info"}
            />
        </div>
    );
}
