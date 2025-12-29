"use client";

import { useEffect, useState } from "react";
import { FiUsers, FiUserCheck, FiUserX, FiShield } from "react-icons/fi";
import { userService, UserStats as UserStatsType } from "@/services/user.service";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from 'recharts';

export default function UserStats() {
    const [stats, setStats] = useState<UserStatsType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await userService.getStats();
                setStats(data);
            } catch (error) {
                setError("Không thể tải dữ liệu thống kê.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl"></div>
                            <div className="w-16 h-4 bg-gray-100 rounded-lg"></div>
                        </div>
                        <div className="w-24 h-8 bg-gray-100 rounded-lg mb-2"></div>
                        <div className="w-32 h-4 bg-gray-100 rounded-lg"></div>
                    </div>
                ))}
            </div>
        );
    }

    const cards = [
        {
            title: "Tổng người dùng",
            value: stats?.total_users || 0,
            icon: <FiUsers className="text-blue-600" size={24} />,
            color: "bg-blue-50",
            description: "Số lượng tài khoản đã đăng ký"
        },
        {
            title: "Đang hoạt động",
            value: stats?.active_users || 0,
            icon: <FiUserCheck className="text-green-600" size={24} />,
            color: "bg-green-50",
            description: "Tài khoản có thể truy cập"
        },
        {
            title: "Ngừng hoạt động",
            value: stats?.inactive_users || 0,
            icon: <FiUserX className="text-red-600" size={24} />,
            color: "bg-red-50",
            description: "Tài khoản bị vô hiệu hóa"
        },
        {
            title: "Quản trị viên",
            value: stats?.role_distribution.find(r => r.role_name === 'ADMIN')?.count || 0,
            icon: <FiShield className="text-purple-600" size={24} />,
            color: "bg-purple-50",
            description: "Người dùng có quyền tối cao"
        }
    ];

    const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    const chartData = stats?.role_distribution.map(role => ({
        name: role.role_name,
        value: role.count
    })) || [];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                        <div className={`absolute top-0 right-0 p-8 transform translate-x-8 -translate-y-8 rounded-full ${card.color} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>

                        <div className="flex items-center justify-between mb-4 relative z-10">
                            <div className={`${card.color} p-3 rounded-xl transform group-hover:rotate-12 transition-transform`}>
                                {card.icon}
                            </div>
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">{card.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Phân bổ Vai trò</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm min-h-[400px]">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Số lượng người dùng theo Vai trò</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#f9fafb' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                    {chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
