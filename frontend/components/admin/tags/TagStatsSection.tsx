"use client";

import { TagStats } from "@/services/tag.service";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import { FiTrendingUp, FiHash, FiActivity } from "react-icons/fi";

interface TagStatsSectionProps {
    stats: TagStats[];
    loading: boolean;
}

const COLORS = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#ddd6fe', '#ede9fe', '#f5f3ff', '#faf5ff'];

export default function TagStatsSection({ stats, loading }: TagStatsSectionProps) {
    if (!stats || (stats.length === 0 && !loading)) return null;

    const totalUsage = stats.reduce((acc, curr) => acc + curr.usage_count, 0);
    const topTag = stats.length > 0 ? stats[0] : null;
    const avgUsage = stats.length > 0 ? (totalUsage / stats.length).toFixed(1) : 0;

    return (
        <div className={`p-6 border-b border-gray-200 bg-gray-50/30 transition-opacity duration-300 ${loading && stats.length === 0 ? 'opacity-0' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Phân tích Thẻ hệ thống</h3>
                    <p className="text-sm text-gray-500 font-normal">Dữ liệu thống kê dựa trên 7 thẻ được sử dụng nhiều nhất</p>
                </div>
                {loading && (
                    <div className="flex items-center space-x-2 text-xs text-purple-600 font-medium animate-pulse bg-purple-50 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                        <span>Đang cập nhật...</span>
                    </div>
                )}
            </div>

            {/* Metric Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <FiActivity size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Tổng lượt sử dụng</p>
                        <p className="text-2xl font-bold text-gray-800">{totalUsage}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <FiTrendingUp size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Thẻ hàng đầu</p>
                        <p className="text-xl font-bold text-gray-800 truncate max-w-[150px]">{topTag?.name || "N/A"}</p>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                        <FiHash size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Trung bình/Thẻ</p>
                        <p className="text-2xl font-bold text-gray-800">{avgUsage}</p>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300 ${loading ? 'opacity-50 blur-[2px]' : 'opacity-100'}`}>
                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-6 flex items-center">
                        <span className="w-2 h-4 bg-purple-500 rounded-full mr-2"></span>
                        Số lượng bài viết
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats as any[]}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="usage_count" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={30} name="Số bài viết" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-6 flex items-center">
                        <span className="w-2 h-4 bg-blue-500 rounded-full mr-2"></span>
                        Tỉ lệ phần bổ
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={stats as any[]}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="usage_count"
                                    nameKey="name"
                                >
                                    {stats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h4 className="text-sm font-semibold text-gray-700 mb-6 flex items-center">
                        <span className="w-2 h-4 bg-green-500 rounded-full mr-2"></span>
                        So sánh tương quan
                    </h4>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats as any[]}>
                                <PolarGrid stroke="#f1f5f9" />
                                <PolarAngleAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Radar
                                    name="Sử dụng"
                                    dataKey="usage_count"
                                    stroke="#8b5cf6"
                                    fill="#8b5cf6"
                                    fillOpacity={0.5}
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
