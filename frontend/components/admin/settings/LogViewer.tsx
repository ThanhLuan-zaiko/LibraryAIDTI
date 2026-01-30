"use client";

import { useState, useEffect, Fragment } from "react";
import { settingsService, LogEntry } from "@/services/settings.service";
import {
    X,
    History,
    User as UserIcon,
    Activity,
    Database,
    ChevronRight,
    Calendar,
    ArrowRight,
    Info,
    Hash,
    Search,
    ChevronLeft,
    ChevronsLeft,
    ChevronsRight
} from "lucide-react";

interface LogViewerProps {
    type: 'audit' | 'system';
}

export default function LogViewer({ type }: LogViewerProps) {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1); // Reset to page 1 on search
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        fetchLogs();
    }, [page, limit, debouncedSearch, type]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = type === 'audit'
                ? await settingsService.getAuditLogs(page, limit, "", "", debouncedSearch)
                : await settingsService.getSystemLogs(page, limit, "", debouncedSearch);
            setLogs(data.data);
            setTotal(data.total);
        } catch (error) {
            console.error("Failed to fetch logs", error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleString("vi-VN", {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getLabel = (key: string) => {
        const labels: Record<string, string> = {
            'site_name': 'Tên website',
            'site_description': 'Mô tả website',
            'contact_email': 'Email liên hệ',
            'contact_phone': 'Số điện thoại',
            'footer_text': 'Nội dung chân trang',
            'items_per_page': 'Số bài viết mỗi trang',
            'allow_registration': 'Cho phép đăng ký',
            'maintenance_mode': 'Chế độ bảo trì',
            'facebook_url': 'Link Facebook',
            'youtube_url': 'Link Youtube',
            'name': 'Tên',
            'slug': 'Đường dẫn (Slug)',
            'description': 'Mô tả',
            'title': 'Tiêu đề',
            'content': 'Nội dung',
            'thumbnail': 'Ảnh đại diện',
            'category_id': 'ID Danh mục',
            'status': 'Trạng thái',
            'view_count': 'Lượt xem',
        };
        return labels[key] || key;
    };

    const LogDetailModal = ({ log, onClose }: { log: LogEntry, onClose: () => void }) => {
        const isSettings = log.table_name === 'system_settings' || (typeof log.old_data === 'object' && log.old_data !== null && !Array.isArray(log.old_data));

        // Improve key extraction to handle potential nulls
        const oldData = log.old_data || {};
        const newData = log.new_data || {};
        const allKeys = isSettings ? Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)])) : [];

        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
                <div
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
                    onClick={onClose}
                />

                <div className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center space-x-4">
                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <History className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 leading-tight">Chi tiết nhật ký</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-0.5">ID: {log.id.substring(0, 8)}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-900 rounded-2xl transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-8 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                            {/* Meta Info Cards */}
                            <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl space-y-3">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <UserIcon className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Thực hiện bởi</span>
                                </div>
                                <div className="flex items-center space-x-3 text-gray-900">
                                    <div className="w-8 h-8 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-xs text-blue-600 border border-gray-100">
                                        {log.user?.full_name?.charAt(0) || 'S'}
                                    </div>
                                    <span className="text-sm font-bold truncate">{log.user?.full_name || 'Hệ thống'}</span>
                                </div>
                            </div>

                            <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl space-y-3">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Activity className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Hành động</span>
                                </div>
                                <div>
                                    <span className={`inline-flex px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-tight ${log.action.includes('CREATE') ? 'bg-green-100 text-green-700' :
                                        log.action.includes('UPDATE') ? 'bg-blue-100 text-blue-700' :
                                            log.action.includes('DELETE') ? 'bg-red-100 text-red-700' :
                                                'bg-gray-200 text-gray-600'
                                        }`}>
                                        {log.action}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 bg-gray-50/50 border border-gray-100 rounded-3xl space-y-3">
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-wider">Thời gian</span>
                                </div>
                                <div className="text-sm font-bold text-gray-700 flex items-center space-x-2">
                                    <span>{formatDate(log.created_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Data Visualization */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-2 h-8 bg-blue-600 rounded-full" />
                                    <h4 className="text-lg font-black text-gray-900 tracking-tight">So sánh dữ liệu</h4>
                                </div>
                                <div className="flex items-center space-x-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                                    <Database className="w-3.5 h-3.5 text-gray-400" />
                                    <span className="text-[10px] font-black text-gray-400 uppercase">{log.table_name || 'unknown'}</span>
                                </div>
                            </div>

                            {isSettings ? (
                                <div className="space-y-4">
                                    {allKeys.map(key => {
                                        const ov = oldData[key];
                                        const nv = newData[key];
                                        if (JSON.stringify(ov) === JSON.stringify(nv)) return null;
                                        return (
                                            <div key={key} className="group p-6 bg-gray-50/30 hover:bg-white hover:shadow-xl hover:shadow-gray-200/50 border border-gray-100 rounded-[28px] transition-all duration-300">
                                                <div className="flex items-center space-x-2 mb-4">
                                                    <div className="p-1.5 bg-blue-50 rounded-lg">
                                                        <Info className="w-3 h-3 text-blue-500" />
                                                    </div>
                                                    <span className="text-[11px] font-black uppercase text-gray-400 tracking-widest">{getLabel(key)}</span>
                                                </div>
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                                                    <div className="flex-1 bg-red-50/50 p-4 rounded-2xl border border-red-100/50">
                                                        <span className="block text-[9px] font-black text-red-300 uppercase mb-2 tracking-wider">Trước</span>
                                                        <p className="text-sm text-red-600 font-medium line-through decoration-red-300/50 break-all leading-relaxed">
                                                            {ov !== undefined ? String(ov) : '-'}
                                                        </p>
                                                    </div>
                                                    <div className="hidden sm:flex shrink-0 w-10 h-10 rounded-full bg-white shadow-sm items-center justify-center border border-gray-100 group-hover:scale-110 transition-transform duration-300">
                                                        <ArrowRight className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                    <div className="flex-1 bg-green-50/50 p-4 rounded-2xl border border-green-100/50 shadow-sm">
                                                        <span className="block text-[9px] font-black text-green-300 uppercase mb-2 tracking-wider">Sau</span>
                                                        <p className="text-sm text-green-700 font-bold break-all leading-relaxed animate-in fade-in slide-in-from-left-2 duration-500">
                                                            {nv !== undefined ? String(nv) : '-'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {allKeys.length === 0 && (
                                        <div className="p-12 text-center bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                            <Info className="w-10 h-10 text-gray-300 mx-auto mb-4" />
                                            <p className="text-sm font-medium text-gray-400">Không có thay đổi dữ liệu nào được ghi nhận</p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 px-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dữ liệu gốc</span>
                                        </div>
                                        <pre className="p-6 bg-gray-900 text-gray-100 rounded-[28px] font-mono text-xs overflow-auto max-h-[400px] border border-gray-800 shadow-inner [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-700 selection:bg-blue-500/30">
                                            {JSON.stringify(log.old_data, null, 2)}
                                        </pre>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center space-x-2 px-1">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dữ liệu mới</span>
                                        </div>
                                        <pre className="p-6 bg-blue-900 border border-blue-800 text-blue-50 rounded-[28px] font-mono text-xs overflow-auto max-h-[400px] shadow-inner [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-blue-800 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-700 selection:bg-white/10">
                                            {JSON.stringify(log.new_data, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="px-8 py-6 border-t border-gray-100 bg-gray-50/50 flex justify-between items-center shrink-0">
                        <div className="flex items-center space-x-3">
                            <Hash className="w-4 h-4 text-gray-300" />
                            <span className="text-[10px] font-black text-gray-400 tracking-tighter uppercase tabular-nums">Ref: {log.record_id || 'N/A'}</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white text-xs font-black uppercase tracking-widest rounded-2xl transition-all duration-300 active:scale-95 shadow-xl shadow-gray-200"
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="relative flex-1 group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white shadow-sm border border-gray-100 group-focus-within:text-blue-600 transition-colors">
                        <Search className="w-3.5 h-3.5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm hành động, bảng hoặc ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-13 pr-4 py-3.5 bg-white/40 backdrop-blur-xl border border-gray-100 rounded-[22px] outline-none text-sm font-semibold text-gray-700 placeholder:text-gray-300 focus:bg-white focus:border-blue-500/30 focus:shadow-2xl focus:shadow-blue-500/10 transition-all duration-300"
                    />
                </div>
                <div className="flex items-center space-x-4 shrink-0">
                    <div className="flex items-center space-x-2 bg-white/40 backdrop-blur-xl border border-gray-100 p-1.5 rounded-2xl">
                        {[25, 50, 75, 100].map((l) => (
                            <button
                                key={l}
                                onClick={() => { setLimit(l); setPage(1); }}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-300 ${limit === l ? 'bg-gray-900 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900 hover:bg-white'}`}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto rounded-[32px] border border-gray-100 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50/50">
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">Thời gian</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">Quản trị viên</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">Hành động</th>
                            <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 whitespace-nowrap">Đối tượng</th>
                            <th className="px-8 py-5 text-right"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            Array(5).fill(0).map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td colSpan={5} className="px-8 py-6">
                                        <div className="h-5 bg-gray-50 rounded-xl w-full"></div>
                                    </td>
                                </tr>
                            ))
                        ) : logs.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center mb-4">
                                            <Info className="w-8 h-8 text-gray-300" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest text-[10px]">Không tìm thấy nhật ký nào</span>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr
                                    key={log.id}
                                    className="group hover:bg-gray-50/80 transition-all duration-300 cursor-pointer"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <td className="px-8 py-5 whitespace-nowrap">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-black text-gray-900 tabular-nums">{formatDate(log.created_at).split(', ')[1]}</span>
                                            <span className="text-[10px] font-bold text-gray-400 mt-0.5 tabular-nums">{formatDate(log.created_at).split(', ')[0]}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-100 text-gray-600 flex items-center justify-center font-black text-[11px] group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300 group-hover:scale-110 shadow-sm shrink-0">
                                                {log.user?.full_name?.charAt(0) || 'S'}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight truncate">{log.user?.full_name || 'Hệ thống'}</span>
                                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest truncate">{log.user?.email || 'SYSTEM_EVENT'}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tight shadow-sm whitespace-nowrap ${log.action.includes('CREATE') ? 'bg-green-50 text-green-700 border border-green-100' :
                                            log.action.includes('UPDATE') ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                                                log.action.includes('DELETE') ? 'bg-red-50 text-red-700 border border-red-100' :
                                                    'bg-gray-50 text-gray-600 border border-gray-100'
                                            }`}>
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex items-center space-x-2">
                                            <Database className="w-3 h-3 text-gray-300" />
                                            <span className="text-[11px] font-black text-gray-500 uppercase tracking-tighter truncate">{log.table_name || '-'}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right whitespace-nowrap">
                                        <div className="inline-flex p-2 rounded-xl bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 border border-transparent group-hover:border-blue-100 transition-all duration-300">
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 px-10 py-6 bg-white/40 backdrop-blur-xl rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center gap-4 text-[10px] font-black uppercase tracking-widest text-gray-400 tabular-nums">
                    <span>Trang {page} / {Math.max(1, Math.ceil(total / limit))}</span>
                    <span className="hidden sm:block text-gray-200">|</span>
                    <span>Hiển thị {logs.length} / {total} kết quả</span>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setPage(1)}
                        disabled={page === 1}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:shadow-xl hover:shadow-gray-200/50 disabled:opacity-20 transition-all active:scale-95"
                    >
                        <ChevronsLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:shadow-xl hover:shadow-gray-200/50 disabled:opacity-20 transition-all active:scale-95"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="hidden lg:flex items-center space-x-2 px-2">
                        {(() => {
                            const totalPages = Math.max(1, Math.ceil(total / limit));
                            const delta = 2;
                            const range = [];
                            for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
                                range.push(i);
                            }

                            if (page - delta > 2) range.unshift("...");
                            range.unshift(1);
                            if (page + delta < totalPages - 1) range.push("...");
                            if (totalPages > 1) range.push(totalPages);

                            return range.map((p, i) => (
                                typeof p === 'number' ? (
                                    <button
                                        key={i}
                                        onClick={() => setPage(p)}
                                        className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all duration-300 ${page === p
                                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                            : 'bg-white border border-gray-100 text-gray-400 hover:text-gray-900 hover:border-gray-300'}`}
                                    >
                                        {p}
                                    </button>
                                ) : (
                                    <span key={i} className="text-gray-300 font-black px-1">...</span>
                                )
                            ));
                        })()}
                    </div>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page * limit >= total}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:shadow-xl hover:shadow-gray-200/50 disabled:opacity-20 transition-all active:scale-95"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setPage(Math.ceil(total / limit))}
                        disabled={page * limit >= total}
                        className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 hover:shadow-xl hover:shadow-gray-200/50 disabled:opacity-20 transition-all active:scale-95"
                    >
                        <ChevronsRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Detail Modal */}
            {selectedLog && (
                <LogDetailModal
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            )}
        </div>
    );
}
