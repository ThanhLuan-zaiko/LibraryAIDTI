"use client";

import { useState, useEffect } from "react";
import { settingsService } from "@/services/settings.service";
import { toast } from "react-hot-toast";
import {
    Globe,
    Mail,
    Hash,
    History,
    Layout,
    Save,
    Loader2,
    Info,
    Smartphone,
    Shield,
    CheckCircle2
} from "lucide-react";

export default function GeneralSettings() {
    const [settings, setSettings] = useState<any>({
        site_name: "",
        site_description: "",
        footer_text: "",
        contact_email: "",
        items_per_page: 10,
        log_retention_days: 30,
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const data = await settingsService.getSettings();
            if (data) {
                setSettings((prev: any) => ({ ...prev, ...data }));
            }
        } catch (error) {
            console.error("Failed to fetch settings", error);
            toast.error("Không thể tải cấu hình");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await settingsService.updateSettings(settings);
            toast.success("Cài đặt đã được cập nhật thành công");
        } catch (error) {
            console.error("Failed to update settings", error);
            toast.error("Cập nhật thất bại, vui lòng thử lại sau");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-44 bg-gray-100 rounded-[32px] border border-gray-200/50"></div>
                ))}
            </div>
        );
    }

    const SectionHeader = ({ icon: Icon, title, description }: any) => (
        <div className="flex items-start space-x-4 mb-8">
            <div className="p-3 bg-white shadow-xl shadow-blue-100/50 rounded-2xl border border-blue-50/50">
                <Icon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
                <h3 className="text-lg font-black text-gray-900 tracking-tight">{title}</h3>
                <p className="text-xs font-medium text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    );

    const PremiumInput = ({ label, icon: Icon, value, onChange, type = "text", placeholder, description, ...props }: any) => (
        <div className="group relative">
            <label className="block text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2.5 ml-1">
                {label}
            </label>
            <div className="relative overflow-hidden rounded-[22px] border border-gray-100 bg-gray-50/30 group-focus-within:bg-white group-focus-within:border-blue-500/30 group-focus-within:shadow-2xl group-focus-within:shadow-blue-500/10 transition-all duration-300">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white shadow-sm border border-gray-50 group-focus-within:text-blue-600 transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full pl-13 pr-4 py-3.5 bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-300"
                    {...props}
                />
            </div>
            {description && (
                <div className="flex items-center space-x-1.5 mt-2 ml-1">
                    <Info className="w-3 h-3 text-gray-300" />
                    <p className="text-[10px] font-medium text-gray-400 italic line-clamp-1">{description}</p>
                </div>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-10 pb-10">
            {/* Header with Save button floating or fixed style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-gray-100">
                <div>
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Cấu hình chung</h2>
                    <p className="text-sm font-medium text-gray-400 mt-1">Điều chỉnh các thông số cốt lõi của toàn bộ hệ thống</p>
                </div>
                <button
                    type="submit"
                    disabled={saving}
                    className="relative group overflow-hidden bg-gray-900 text-white px-8 py-4 rounded-[24px] font-black text-sm tracking-widest uppercase hover:bg-black disabled:opacity-50 transition-all shadow-2xl shadow-gray-200"
                >
                    <div className="relative z-10 flex items-center justify-center space-x-2">
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Đang xử lý</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Lưu cấu hình</span>
                            </>
                        )}
                    </div>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Section 1: Brand & Identity */}
                <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm">
                    <SectionHeader
                        icon={Globe}
                        title="Đặc diện Thương hiệu"
                        description="Tên và mô tả website hiển thị trên các công cụ tìm kiếm"
                    />
                    <div className="space-y-6">
                        <PremiumInput
                            label="Tên Website"
                            icon={Globe}
                            value={settings.site_name}
                            onChange={(e: any) => setSettings({ ...settings, site_name: e.target.value })}
                            placeholder="VD: Library AI DTI"
                        />
                        <div className="group relative">
                            <label className="block text-[11px] font-black uppercase text-gray-400 tracking-widest mb-2.5 ml-1">
                                Mô tả Website
                            </label>
                            <div className="relative overflow-hidden rounded-[22px] border border-gray-100 bg-gray-50/30 group-focus-within:bg-white group-focus-within:border-blue-500/30 group-focus-within:shadow-2xl group-focus-within:shadow-blue-500/10 transition-all duration-300">
                                <textarea
                                    value={settings.site_description}
                                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                                    rows={4}
                                    className="w-full px-5 py-4 bg-transparent outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-300 resize-none"
                                    placeholder="Mô tả ngắn gọn về website của bạn..."
                                />
                            </div>
                        </div>
                        <PremiumInput
                            label="Nội dung chân trang (Footer)"
                            icon={Layout}
                            value={settings.footer_text}
                            onChange={(e: any) => setSettings({ ...settings, footer_text: e.target.value })}
                            placeholder="VD: © 2026 Library AI. All rights reserved."
                        />
                    </div>
                </div>

                {/* Section 2: Contact & Communication */}
                <div className="space-y-10">
                    <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm">
                        <SectionHeader
                            icon={Mail}
                            title="Thông tin Liên hệ"
                            description="Email và các phương thức liên lạc chính của hệ thống"
                        />
                        <div className="space-y-6">
                            <PremiumInput
                                label="Email Hệ thống"
                                icon={Mail}
                                type="email"
                                value={settings.contact_email}
                                onChange={(e: any) => setSettings({ ...settings, contact_email: e.target.value })}
                                placeholder="admin@example.com"
                                description="Dùng để nhận thông báo và phản hồi từ người dùng."
                            />
                        </div>
                    </div>

                    <div className="p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm">
                        <SectionHeader
                            icon={Shield}
                            title="Quản trị & Bảo mật"
                            description="Thiết lập các giới hạn và quy tắc vận hành"
                        />
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <PremiumInput
                                label="Phân trang"
                                icon={Hash}
                                type="number"
                                value={settings.items_per_page || ""}
                                onChange={(e: any) => setSettings({ ...settings, items_per_page: e.target.value === "" ? "" : parseInt(e.target.value) })}
                                description="Số bài viết mỗi trang."
                            />
                            <PremiumInput
                                label="Lưu trữ nhật ký"
                                icon={History}
                                type="number"
                                value={settings.log_retention_days || ""}
                                onChange={(e: any) => setSettings({ ...settings, log_retention_days: e.target.value === "" ? "" : parseInt(e.target.value) })}
                                description="Số ngày lưu nhật ký."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Tip */}
            <div className="flex items-center space-x-3 p-6 bg-blue-50/50 border border-blue-100 rounded-[32px]">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-blue-50">
                    <CheckCircle2 className="w-4 h-4 text-blue-500" />
                </div>
                <p className="text-sm font-semibold text-blue-700">
                    Các thay đổi về hệ thống sẽ được áp dụng ngay lập tức cho toàn bộ người dùng đang truy cập.
                </p>
            </div>
        </form>
    );
}
