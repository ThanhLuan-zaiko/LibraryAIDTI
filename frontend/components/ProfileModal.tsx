"use client";

import React, { useState } from 'react';
import { IoClose, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { authService } from '@/services/auth.service';

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: any;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, user }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [profileData, setProfileData] = useState({
        full_name: user?.full_name || ''
    });

    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });

    // Sync user data when modal opens or user changes
    React.useEffect(() => {
        if (isOpen && user) {
            setProfileData({
                full_name: user.full_name || ''
            });
            setPasswordData({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });
            setError('');
            setSuccess('');
        }
    }, [isOpen, user]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            let profileChanged = profileData.full_name !== user?.full_name;
            let passwordAttempted = passwordData.new_password !== '';

            if (!profileChanged && !passwordAttempted) {
                setError('Bạn chưa thay đổi thông tin nào');
                setLoading(false);
                return;
            }

            // Handle Password Change first if attempted
            if (passwordAttempted) {
                if (!passwordData.old_password) {
                    setError('Vui lòng nhập mật khẩu cũ để đổi mật khẩu mới');
                    setLoading(false);
                    return;
                }
                if (passwordData.new_password !== passwordData.confirm_password) {
                    setError('Mật khẩu xác nhận không khớp');
                    setLoading(false);
                    return;
                }
                await authService.changePassword({
                    old_password: passwordData.old_password,
                    new_password: passwordData.new_password
                });
            }

            // Handle Profile Change
            if (profileChanged) {
                await authService.updateProfile(profileData.full_name);
            }

            setSuccess('Cập nhật thông tin thành công!');
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' });

            // Note: In a real app, you might want to trigger a user state sync here
            // window.location.reload(); // Or use a context to update
        } catch (err: any) {
            setError(err.response?.data?.error || 'Đã có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                    <h2 className="text-xl font-bold text-black">Cài đặt tài khoản</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <IoClose size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar flex-grow">
                    {error && <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
                    {success && <div className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg text-sm">{success}</div>}

                    <form id="profile-form" onSubmit={handleSubmit} className="space-y-8">
                        {/* Profile Section */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thông tin cá nhân</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Họ và tên</label>
                                    <input
                                        type="text"
                                        value={profileData.full_name}
                                        onChange={(e) => setProfileData({ full_name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none text-sm"
                                        placeholder="Nhập họ và tên"
                                        required
                                    />
                                </div>
                                <div className="space-y-1 opacity-50">
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email || ''}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 cursor-not-allowed outline-none text-sm"
                                    />
                                </div>
                            </div>
                        </section>

                        <div className="h-px bg-gray-100"></div>

                        {/* Password Section */}
                        <section>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Thay đổi mật khẩu</h3>
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Mật khẩu cũ</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none text-sm"
                                            placeholder="Nhập mật khẩu cũ nếu muốn đổi"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                        >
                                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Mật khẩu mới</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none text-sm"
                                            placeholder="Nhập mật khẩu mới"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                        >
                                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            value={passwordData.confirm_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-black focus:ring-0 transition-all outline-none text-sm"
                                            placeholder="Xác nhận mật khẩu mới"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            tabIndex={-1}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                        >
                                            {showPassword ? <IoEyeOffOutline size={20} /> : <IoEyeOutline size={20} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>

                {/* Footer Footer */}
                <div className="p-6 border-t border-gray-100 flex-shrink-0 bg-gray-50/50">
                    <button
                        form="profile-form"
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-zinc-800 transition-all shadow-lg active:scale-[0.98] disabled:opacity-70 text-sm"
                    >
                        {loading ? 'Đang xử lý...' : 'Lưu tất cả thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
