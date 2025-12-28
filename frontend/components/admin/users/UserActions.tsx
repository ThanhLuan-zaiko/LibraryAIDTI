"use client";

import { FiSearch, FiFilter } from "react-icons/fi";
import { Role } from "@/services/user.service";

interface UserActionsProps {
    searchQuery: string;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    limit: number;
    totalRows: number;
    onLimitChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    isActiveFilter: boolean | undefined;
    onActiveFilter: (val: string) => void;
    roleFilter: string;
    onRoleFilter: (role: string) => void;
    roles: Role[];
}

export default function UserActions({
    searchQuery,
    onSearch,
    limit,
    totalRows,
    onLimitChange,
    isActiveFilter,
    onActiveFilter,
    roleFilter,
    onRoleFilter,
    roles
}: UserActionsProps) {
    return (
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
            <div className="relative flex-1 group">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc email..."
                    value={searchQuery}
                    onChange={onSearch}
                    className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm shadow-sm hover:border-gray-300"
                />
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <FiFilter className="text-gray-400" size={14} />
                    <select
                        value={isActiveFilter === undefined ? "" : isActiveFilter.toString()}
                        onChange={(e) => onActiveFilter(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="true">Đang hoạt động</option>
                        <option value="false">Đã bị khóa</option>
                    </select>
                </div>

                <select
                    value={roleFilter}
                    onChange={(e) => onRoleFilter(e.target.value)}
                    className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300"
                >
                    <option value="">Tất cả vai trò</option>
                    {roles.map(role => (
                        <option key={role.id} value={role.name}>{role.name}</option>
                    ))}
                </select>

                <div className="h-6 w-px bg-gray-200 mx-1 hidden md:block"></div>

                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Hiển thị:</span>
                    <select
                        value={limit}
                        onChange={onLimitChange}
                        className="bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:border-gray-300"
                    >
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                </div>
            </div>
        </div>
    );
}
