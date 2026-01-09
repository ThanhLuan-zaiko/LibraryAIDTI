import React, { useEffect, useState } from 'react';
import { seoService, ArticleSeoRedirect } from '@/services/seo.service';
import { toast } from 'react-hot-toast';
import { HiExternalLink, HiSearch, HiChevronLeft, HiChevronRight, HiChartPie, HiDocumentText } from 'react-icons/hi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

export default function ArticleSeoTab() {
    const [redirects, setRedirects] = useState<ArticleSeoRedirect[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);

    const [trends, setTrends] = useState<any[]>([]);

    useEffect(() => {
        fetchTrends();
    }, []);

    const fetchTrends = async () => {
        try {
            const resp = await seoService.getSeoTrends(6);
            setTrends(resp.data || []);
        } catch (error) {
            console.error("Failed to load trends", error);
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, limit, search]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resp = await seoService.getArticleRedirects({ page, limit, search });
            setRedirects(resp.data || []);
            setTotal(resp.total || 0);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải dữ liệu Article SEO");
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / limit);

    return (
        <div className="space-y-8">
            {/* Stats Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                        <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-3">
                            <HiChartPie className="w-5 h-5" />
                        </span>
                        Xu hướng Redirect Bài Viết
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}
                                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRedirects" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                                <YAxis fontSize={12} stroke="#9ca3af" />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="redirects" stroke="#6366f1" fillOpacity={1} fill="url(#colorRedirects)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center">
                        <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3">
                            <HiDocumentText className="w-5 h-5" />
                        </span>
                        Tương quan Bài viết & Redirect
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="date" fontSize={12} stroke="#9ca3af" />
                                <YAxis fontSize={12} stroke="#9ca3af" />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend />
                                <Bar dataKey="articles" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} name="Bài viết mới" />
                                <Bar dataKey="redirects" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} name="Redirect mới" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg">Article Redirects</h3>
                        <p className="text-xs text-gray-500 mt-1">Danh sách chuyển hướng gắn liền với bài viết cụ thể</p>
                    </div>

                    <div className="flex items-center space-x-3">
                        <select
                            value={limit}
                            onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={25}>25 / trang</option>
                            <option value={50}>50 / trang</option>
                            <option value={100}>100 / trang</option>
                        </select>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                <HiSearch className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Tìm kiếm slug..."
                                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-blue-500 w-48 md:w-64 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-4">Article</th>
                                <th className="px-6 py-4">Nguồn (Source)</th>
                                <th className="px-6 py-4">Đích (Target)</th>
                                <th className="px-6 py-4">Ngày tạo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400 text-sm">Đang tải dữ liệu...</td></tr>
                            ) : redirects.length === 0 ? (
                                <tr><td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic text-sm">Không tìm thấy dữ liệu nào.</td></tr>
                            ) : (
                                redirects.map((r) => (
                                    <tr key={r.id} className="group hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            {r.article ? (
                                                <div className="max-w-xs">
                                                    <div className="font-medium text-gray-900 truncate" title={r.article.title}>{r.article.title}</div>
                                                    <div className="text-xs text-gray-400 truncate">{r.article_id}</div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 italic">Unknown</span>
                                            )}
                                        </td>
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
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(r.created_at).toLocaleDateString('vi-VN')}
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
        </div>
    );
}
