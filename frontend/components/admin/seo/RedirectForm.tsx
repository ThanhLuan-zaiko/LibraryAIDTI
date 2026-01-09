import React from 'react';
import { HiPlus, HiArrowDown } from 'react-icons/hi';

interface RedirectFormProps {
    newItem: { from: string; to: string };
    setNewItem: (item: { from: string; to: string }) => void;
    onSubmit: () => void;
    isSubmitting: boolean;
    isEditing?: boolean;
    onCancel?: () => void;
}

export default function RedirectForm({
    newItem, setNewItem, onSubmit, isSubmitting, isEditing, onCancel
}: RedirectFormProps) {
    const slugify = (val: string) => {
        if (val.includes('http') || val.includes('://')) {
            try {
                const url = new URL(val);
                return url.pathname.replace(/^\/|\/$/g, '');
            } catch (err) { }
        }
        return val.toLowerCase()
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-");
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center justify-between">
                <span className="flex items-center">
                    <span className="w-2 h-6 bg-blue-600 rounded-full mr-3"></span>
                    {isEditing ? 'Cập Nhật Redirect' : 'Thêm Redirect Mới'}
                </span>
                {isEditing && (
                    <button onClick={onCancel} className="text-xs text-red-500 hover:underline">Hủy</button>
                )}
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Link Cũ (Nguồn 404)</label>
                    <p className="text-[10px] text-gray-400 mb-2">Đường dẫn cũ không còn truy cập được</p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
                        <input
                            type="text"
                            value={newItem.from}
                            onChange={(e) => setNewItem({ ...newItem, from: slugify(e.target.value) })}
                            placeholder="vd: tin-vui-2023"
                            className="w-full pl-6 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium"
                        />
                    </div>
                </div>

                <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-white p-1 rounded-full border border-gray-100 shadow-sm text-gray-300">
                        <HiArrowDown className="w-5 h-5" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Link Mới (Đích)</label>
                    <p className="text-[10px] text-gray-400 mb-2">Người dùng sẽ được chuyển tới đây</p>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm">/</span>
                        <input
                            type="text"
                            value={newItem.to}
                            onChange={(e) => setNewItem({ ...newItem, to: slugify(e.target.value) })}
                            placeholder="vd: tin-tuc-khuyen-mai"
                            className="w-full pl-6 pr-3 py-2.5 bg-blue-50/30 border border-blue-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none text-sm font-medium text-blue-700"
                        />
                    </div>
                </div>

                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || !newItem.from || !newItem.to}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 font-bold flex items-center justify-center disabled:opacity-50 disabled:shadow-none transition-all mt-2"
                >
                    {isSubmitting ? 'Đang xử lý...' : (
                        <>
                            {isEditing ? <HiArrowDown className="w-5 h-5 mr-2 rotate-[-90deg]" /> : <HiPlus className="w-5 h-5 mr-2" />}
                            {isEditing ? 'Lưu Thay Đổi' : 'Tạo Redirect'}
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
