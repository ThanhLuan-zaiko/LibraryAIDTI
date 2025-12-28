"use client";

import UserManager from "@/components/admin/users/UserManager";

export default function UsersPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
                <p className="text-sm text-gray-500">Xem danh sách, phân quyền và quản lý trạng thái tài khoản người dùng.</p>
            </div>

            <UserManager />
        </div>
    );
}
