"use client";

import { useState, useEffect } from "react";
import { FiX, FiCheck, FiUser, FiInfo } from "react-icons/fi";
import { User, userService } from "@/services/user.service";

interface UserEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingUser: User | null;
}

export default function UserEditModal({ isOpen, onClose, onSuccess, editingUser }: UserEditModalProps) {
    const [formData, setFormData] = useState({
        full_name: "",
        avatar_url: "",
        is_active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (editingUser) {
            setFormData({
                full_name: editingUser.full_name || "",
                avatar_url: editingUser.avatar_url || "",
                is_active: editingUser.is_active
            });
            setError("");
        }
    }, [editingUser]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        try {
            setLoading(true);
            setError("");
            await userService.update(editingUser.id, formData);
            onSuccess();
            onClose();
        } catch (error: any) {
            setError(error.response?.data?.error || "Không thể cập nhật thông tin người dùng");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        Chỉnh sửa người dùng
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <FiX size={20} className="text-gray-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-xl text-sm border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <FiInfo size={16} className="flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Họ và tên</label>
                            <input
                                type="text"
                                disabled
                                value={formData.full_name}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                placeholder="Nhập họ và tên đầy đủ..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                disabled
                                value={editingUser?.email || ""}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                            />
                            <p className="text-[10px] text-gray-400 mt-1 italic">* Thông tin cá nhân do người dùng quản lý</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">URL Ảnh đại diện</label>
                            <input
                                type="text"
                                disabled
                                value={formData.avatar_url}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>

                        <div className={`flex items-center justify-between p-4 rounded-xl border ${editingUser?.roles?.some(r => r.name === 'ADMIN')
                            ? 'bg-gray-50 border-gray-100 opacity-60'
                            : 'bg-gray-50 border-gray-100'
                            }`}>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Trạng thái tài khoản</p>
                                <p className="text-xs text-gray-500">
                                    {editingUser?.roles?.some(r => r.name === 'ADMIN')
                                        ? "Tài khoản Quản trị viên không thể bị khóa"
                                        : "Người dùng có thể đăng nhập nếu tài khoản hoạt động"}
                                </p>
                            </div>
                            <label className={`relative inline-flex items-center ${editingUser?.roles?.some(r => r.name === 'ADMIN') ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={formData.is_active}
                                    disabled={editingUser?.roles?.some(r => r.name === 'ADMIN')}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all active:scale-95"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 active:scale-95"
                        >
                            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <FiCheck />}
                            <span>Lưu thay đổi</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
