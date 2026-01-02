"use client";

import { useEffect, useState } from "react";
import {
    dashboardService,
    AnalyticsData,
    CategoryHierarchyStats,
    CategoryTreeData
} from "@/services/dashboard.service";
import CategoryHierarchyStatsComponent from "./CategoryHierarchyStats";
import CategoryTreeChart from "./CategoryTreeChart";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend } from "recharts";
import { FiFileText, FiEye, FiMessageSquare, FiActivity } from "react-icons/fi";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function CategoryAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [hierarchyStats, setHierarchyStats] = useState<CategoryHierarchyStats | null>(null);
    const [categoryTree, setCategoryTree] = useState<CategoryTreeData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch all data in parallel
                const [analyticsData, hierarchyData, treeData] = await Promise.all([
                    dashboardService.getAnalytics(),
                    dashboardService.getHierarchyStats(),
                    dashboardService.getCategoryTree()
                ]);

                setData(analyticsData);
                setHierarchyStats(hierarchyData);
                setCategoryTree(treeData);
            } catch (error) {
                setError("Không thể tải dữ liệu thống kê.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="py-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Original Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Tổng bài viết"
                    value={data.total_articles}
                    icon={<FiFileText size={24} />}
                    color="bg-blue-100 text-blue-600"
                />
                <StatCard
                    title="Tổng lượt xem"
                    value={data.total_views}
                    icon={<FiEye size={24} />}
                    color="bg-green-100 text-green-600"
                />
                <StatCard
                    title="Tổng bình luận"
                    value={data.total_comments}
                    icon={<FiMessageSquare size={24} />}
                    color="bg-purple-100 text-purple-600"
                />
                <StatCard
                    title="Hoạt động"
                    value="Active"
                    icon={<FiActivity size={24} />}
                    color="bg-orange-100 text-orange-600"
                />
            </div>

            {/* Hierarchy Stats - NEW */}
            {hierarchyStats && <CategoryHierarchyStatsComponent stats={hierarchyStats} />}

            {/* Article Trend Chart */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Xu hướng bài viết (30 ngày)</h3>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data.article_trend || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Category Tree Chart - NEW */}
            {categoryTree && <CategoryTreeChart data={categoryTree} />}

            {/* Charts Row: Category Distribution & Top Tags */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Phân bố danh mục</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={(data.top_categories || []) as any}
                                    cx="50%"
                                    cy="45%"
                                    labelLine={true}
                                    outerRadius={80}
                                    innerRadius={60}
                                    paddingAngle={5}
                                    fill="#8884d8"
                                    dataKey="article_count"
                                    nameKey="name"
                                    label={({ name, percent }: any) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                                >
                                    {(data.top_categories || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    iconType="circle"
                                    formatter={(value: string) => <span className="text-xs text-gray-600">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Thẻ được sử dụng</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.top_tags || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="usage_count" fill="#82ca9d" radius={[4, 4, 0, 0]} barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string, value: string | number, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
            </div>
        </div>
    );
}
