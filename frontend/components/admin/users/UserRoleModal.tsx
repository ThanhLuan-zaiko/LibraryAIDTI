"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck, FiShield, FiAlertTriangle } from "react-icons/fi";
import { User, Role, userService } from "@/services/user.service";

interface UserRoleModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: User | null;
    roles: Role[];
}

export default function UserRoleModal({ isOpen, onClose, onSuccess, user, roles }: UserRoleModalProps) {
    const [selectedRoleIDs, setSelectedRoleIDs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user && user.roles) {
            setSelectedRoleIDs(user.roles.map(r => r.id));
            setError("");
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const toggleRole = (roleID: string) => {
        setSelectedRoleIDs(prev =>
            prev.includes(roleID)
                ? prev.filter(id => id !== roleID)
                : [...prev, roleID]
        );
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);
            setError("");
            await userService.assignRoles(user.id, selectedRoleIDs);
            onSuccess();
            onClose();
        } catch (error: any) {
            setError(error.response?.data?.error || "Không thể cập nhật quyền hạn");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiShield className="text-purple-600" />
                        Gán quyền cho người dùng
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <FiX size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="mb-6 p-4 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-purple-600 shadow-sm font-bold flex-shrink-0">
                            {user.full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-purple-900">{user.full_name}</p>
                            <p className="text-xs text-purple-700/60">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-2 mb-8">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-gray-700">Chọn các vai trò áp dụng:</p>
                            {user.roles?.some(r => r.name === 'ADMIN') && (
                                <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                                    <FiAlertTriangle size={10} />
                                    Cần quyền người phong
                                </span>
                            )}
                        </div>
                        {roles.map(role => (
                            <label
                                key={role.id}
                                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRoleIDs.includes(role.id)
                                    ? 'border-purple-500 bg-purple-50/50'
                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={selectedRoleIDs.includes(role.id)}
                                    onChange={() => toggleRole(role.id)}
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className={`font-bold uppercase tracking-wider text-xs ${selectedRoleIDs.includes(role.id) ? 'text-purple-700' : 'text-gray-700'
                                            }`}>
                                            {role.name}
                                        </p>
                                        {selectedRoleIDs.includes(role.id) && <FiCheck className="text-purple-600" />}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{role.description}</p>
                                </div>
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${selectedRoleIDs.includes(role.id) ? 'border-purple-600 bg-purple-600' : 'border-gray-200'
                                    }`}>
                                    {selectedRoleIDs.includes(role.id) && <FiCheck size={12} className="text-white" />}
                                </div>
                            </label>
                        ))}
                        {roles.length === 0 && <p className="text-center text-gray-400 text-sm py-4">Đang tải danh sách vai trò...</p>}
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                            <FiAlertTriangle size={16} className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-lg shadow-purple-500/20 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck />}
                            <span>Cập nhật quyền</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
