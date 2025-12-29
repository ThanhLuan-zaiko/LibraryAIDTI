import { User, Role } from "@/services/user.service";
import { FiEdit2, FiTrash2, FiUser, FiArrowUp, FiArrowDown, FiKey, FiMoreVertical, FiShield } from "react-icons/fi";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { FiCircle } from "react-icons/fi";

interface UserTableProps {
    users: User[];
    loading: boolean;
    sortField: string;
    sortOrder: string;
    onEdit: (user: User) => void;
    onDelete: (id: string) => void;
    onSort: (field: string) => void;
    onAssignRoles: (user: User) => void;
}

export default function UserTable({ users, loading, sortField, sortOrder, onEdit, onDelete, onSort, onAssignRoles }: UserTableProps) {
    const { onlineUsers } = useAuth();

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p>Đang tải dữ liệu người dùng...</p>
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="p-12 text-center text-gray-400">
                <FiUser size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy người dùng nào phù hợp.</p>
            </div>
        );
    }

    const renderSortButton = (field: string, label: string) => {
        const isActive = sortField === field;
        return (
            <button
                onClick={() => onSort(field)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${isActive
                    ? 'bg-blue-100 text-blue-700 font-bold shadow-sm'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                    }`}
            >
                {label}
                {isActive && (
                    sortOrder === "asc"
                        ? <FiArrowUp className="w-4 h-4" />
                        : <FiArrowDown className="w-4 h-4" />
                )}
            </button>
        );
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
                <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-200">
                    <div className="w-[30%] flex items-center gap-2">
                        {renderSortButton("full_name", "Người dùng")}
                    </div>
                    <div className="w-[20%] text-gray-500">Vai trò</div>
                    <div className="w-[15%] text-center">
                        {renderSortButton("is_active", "Trạng thái")}
                    </div>
                    <div className="w-[20%]">
                        {renderSortButton("created_at", "Ngày tham gia")}
                    </div>
                    <div className="w-[15%] text-right text-gray-500 pr-4">Thao tác</div>
                </div>

                {users.map(user => (
                    <div key={user.id} className="flex items-center p-4 border-b border-gray-100 hover:bg-blue-50/30 transition-colors">
                        <div className="w-[30%] flex items-center">
                            <div className="relative group/avatar">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.full_name} className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center border-2 border-white shadow-sm font-bold">
                                        {user.full_name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                {user.email_verified && (
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" title="Đã xác minh email"></div>
                                )}
                            </div>
                            <div className="ml-3 overflow-hidden">
                                <p className="font-semibold text-gray-800 truncate">{user.full_name}</p>
                                <p className="text-xs text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>

                        <div className="w-[20%] flex flex-wrap gap-1">
                            {user.roles && user.roles.length > 0 ? (
                                user.roles.map(role => (
                                    <span key={role.id} className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${role.name === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                        role.name === 'EDITOR' ? 'bg-blue-100 text-blue-700' :
                                            role.name === 'AUTHOR' ? 'bg-orange-100 text-orange-700' :
                                                'bg-gray-100 text-gray-700'
                                        }`}>
                                        {role.name}
                                    </span>
                                ))
                            ) : (
                                <span className="text-gray-400 text-xs italic">Chưa có vai trò</span>
                            )}
                        </div>

                        <div className="w-[15%] text-center">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${user.is_active ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>
                                {user.is_active ? "Hoạt động" : "Bị khóa"}
                            </span>
                        </div>

                        <div className="w-[20%] text-sm text-gray-500">
                            <p>{format(new Date(user.created_at), 'dd/MM/yyyy', { locale: vi })}</p>
                            <div className="flex items-center gap-1.5">
                                {onlineUsers.has(String(user.id)) ? (
                                    <>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <p className="text-[10px] text-green-600 font-medium tracking-tight">Trực tuyến</p>
                                    </>
                                ) : (
                                    <p className="text-[10px] text-gray-400">
                                        {user.last_login_at ? `Gần nhất: ${format(new Date(user.last_login_at), 'dd/MM/yyyy HH:mm', { locale: vi })}` : 'Chưa đăng nhập'}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="w-[15%] flex justify-end space-x-1 pr-2">
                            <button
                                onClick={() => onAssignRoles(user)}
                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors group/btn"
                                title="Gán vai trò (Chỉ người phong quyền Admin mới có thể đổi lại)"
                            >
                                <FiShield size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => onEdit(user)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors group/btn"
                                title="Sửa thông tin"
                            >
                                <FiEdit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                            <button
                                onClick={() => onDelete(user.id)}
                                disabled={user.roles?.some(r => r.name === 'ADMIN')}
                                className={`p-2 rounded-lg transition-colors group/btn ${user.roles?.some(r => r.name === 'ADMIN')
                                    ? 'text-gray-300 cursor-not-allowed'
                                    : 'text-red-600 hover:bg-red-50'
                                    }`}
                                title={user.roles?.some(r => r.name === 'ADMIN') ? "Không thể xóa Admin" : "Xóa / Khóa"}
                            >
                                <FiTrash2 size={16} className={user.roles?.some(r => r.name === 'ADMIN') ? "" : "group-hover/btn:scale-110 transition-transform"} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
