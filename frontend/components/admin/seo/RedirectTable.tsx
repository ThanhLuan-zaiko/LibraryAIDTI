import React from 'react';
import { HiExternalLink, HiTrash, HiSearch, HiChevronLeft, HiChevronRight, HiPencil } from 'react-icons/hi';
import { SeoRedirect } from '@/services/seo.service';

interface RedirectTableProps {
    redirects: SeoRedirect[];
    loading: boolean;
    onDelete: (id: string) => void;
    // Pagination props
    search: string;
    setSearch: (val: string) => void;
    page: number;
    setPage: (val: number) => void;
    limit: number;
    setLimit: (val: number) => void;
    total: number;
    onEdit: (redirect: SeoRedirect) => void;
}

export default function RedirectTable({
    redirects, loading, onDelete,
    search, setSearch, page, setPage, limit, setLimit, total, onEdit
}: RedirectTableProps) {
    const totalPages = Math.ceil(total / limit);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header + Controls */}
            <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="font-bold text-gray-900 text-lg">Global Redirects</h3>
                    <p className="text-xs text-gray-500 mt-1">Danh sách chuyển hướng cấp hệ thống</p>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Limit Selector */}
                    <select
                        value={limit}
                        onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                        className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={25}>25 / trang</option>
                        <option value={50}>50 / trang</option>
                        <option value={75}>75 / trang</option>
                        <option value={100}>100 / trang</option>
                    </select>

                    {/* Search Box */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <HiSearch className="w-4 h-4" />
                        </span>
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Tìm kiếm..."
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <th className="px-6 py-4">Nguồn (Source)</th>
                            <th className="px-6 py-4">Đích (Target)</th>
                            <th className="px-6 py-4 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={3} className="px-6 py-8 text-center text-gray-400 text-sm">Đang tải dữ liệu...</td></tr>
                        ) : redirects.length === 0 ? (
                            <tr><td colSpan={3} className="px-6 py-12 text-center text-gray-400 italic text-sm">Không tìm thấy dữ liệu nào.</td></tr>
                        ) : (
                            redirects.map((r) => (
                                <tr key={r.id} className="group hover:bg-blue-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-[10px] font-bold rounded uppercase">Old</span>
                                            <span className="font-medium text-gray-700 truncate max-w-[200px]" title={r.from_slug}>/{r.from_slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2 text-blue-600">
                                            <HiExternalLink className="w-4 h-4 shrink-0 opacity-50" />
                                            <span className="font-bold truncate max-w-[200px]" title={r.to_slug}>/{r.to_slug}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <button
                                                onClick={() => onEdit(r)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                title="Sửa redirect này"
                                            >
                                                <HiPencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDelete(r.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Xóa redirect này"
                                            >
                                                <HiTrash className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            {total > 0 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium">
                        Hiển thị {((page - 1) * limit) + 1} - {Math.min(page * limit, total)} trên tổng số <span className="font-bold text-gray-700">{total}</span>
                    </span>

                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setPage(page - 1)}
                            disabled={page <= 1}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <HiChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-bold text-gray-700 px-2">
                            {page} / {totalPages || 1}
                        </span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={page >= totalPages}
                            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            <HiChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
