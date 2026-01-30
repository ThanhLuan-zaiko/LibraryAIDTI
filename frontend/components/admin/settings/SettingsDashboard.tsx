"use client";

import { useState, useEffect } from "react";
import { settingsService } from "@/services/settings.service";
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from "recharts";
import {
    Activity,
    Database,
    Cpu,
    PieChart as PieIcon,
    TrendingUp,
    Server,
    Zap,
    History
} from "lucide-react";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export default function SettingsDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
        // Refresh every 30 seconds for live feel
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const stats = await settingsService.getSettingsStats();
            setData(stats);
        } catch (error) {
            console.error("Failed to fetch settings stats", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading || !data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="h-64 bg-gray-100 rounded-[32px] border border-gray-200/50"></div>
                ))}
            </div>
        );
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const ChartCard = ({ title, icon: Icon, children, className = "" }: any) => {
        // Detect if children is a Recharts component
        const isChart = children?.type?.name?.includes('Chart') ||
            children?.type?.displayName?.includes('Chart') ||
            (children?.props?.data && Array.isArray(children?.props?.data));

        return (
            <div className={`flex flex-col p-8 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[40px] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 ${className}`}>
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div className="flex items-center space-x-3">
                        <div className="p-2.5 bg-white shadow-xl shadow-gray-100/50 rounded-2xl border border-gray-50">
                            <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <h3 className="text-sm font-black text-gray-900 tracking-tight uppercase whitespace-nowrap">{title}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live</span>
                    </div>
                </div>
                <div className="flex-1 w-full min-h-[180px]">
                    {isChart ? (
                        <ResponsiveContainer width="100%" height="100%">
                            {children}
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex flex-col justify-center">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-10">
            {/* Top Stats Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Tổng nhật ký", value: data.total_logs, icon: History, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Kết nối DB", value: data.system_pulse.db_connections, icon: Database, color: "text-emerald-600", bg: "bg-emerald-50" },
                    { label: "Tiến trình", value: data.system_pulse.goroutines, icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
                    { label: "Bộ nhớ đang dùng", value: formatBytes(data.system_pulse.memory_usage), icon: Server, color: "text-rose-600", bg: "bg-rose-50" },
                ].map((stat, i) => (
                    <div key={i} className="p-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] shadow-sm flex items-center space-x-4">
                        <div className={`p-4 ${stat.bg} ${stat.color} rounded-2xl`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1.5">{stat.label}</p>
                            <h4 className="text-2xl font-black text-gray-900 tracking-tight">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* 1. Log Trend */}
                <ChartCard title="Hoạt động nhật ký (14 ngày)" icon={TrendingUp} className="lg:col-span-2">
                    <AreaChart data={data.log_trend}>
                        <defs>
                            <linearGradient id="colorLog" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 10, fontWeight: 700, fill: '#9CA3AF' }}
                            tickFormatter={(val) => val.split('-').slice(1).join('/')}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLog)" />
                    </AreaChart>
                </ChartCard>

                {/* 2. Action Distribution */}
                <ChartCard title="Hành động phổ biến" icon={PieIcon}>
                    <PieChart>
                        <Pie
                            data={data.action_distribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={8}
                            dataKey="count"
                            nameKey="action"
                        >
                            {data.action_distribution.map((entry: any, index: number) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </ChartCard>

                {/* 3. Table Activity */}
                <ChartCard title="Bảng hoạt động nhất" icon={Database}>
                    <BarChart data={data.table_activity}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis dataKey="table_name" hide />
                        <YAxis hide />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                    </BarChart>
                </ChartCard>

                {/* 4. Action Details (Horizontal Bar) */}
                <ChartCard title="Phân tích tác vụ" icon={Activity}>
                    <BarChart data={data.action_distribution.slice(0, 5)} layout="vertical" margin={{ left: 20 }}>
                        <XAxis type="number" hide />
                        <YAxis dataKey="action" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#6B7280' }} />
                        <Tooltip />
                        <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} barSize={12} />
                    </BarChart>
                </ChartCard>

                {/* 5. System Pulse Gauge style */}
                <ChartCard title="Tài nguyên Server" icon={Cpu}>
                    <div className="h-full flex flex-col justify-center space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Memory Allocation</span>
                                <span className="text-xs font-black text-blue-600">{formatBytes(data.system_pulse.memory_usage)}</span>
                            </div>
                            <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((data.system_pulse.memory_usage / (500 * 1024 * 1024)) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black text-gray-400 uppercase">Active Goroutines</span>
                                <span className="text-xs font-black text-emerald-600">{data.system_pulse.goroutines}</span>
                            </div>
                            <div className="h-1.5 w-full bg-emerald-50 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                                    style={{ width: `${Math.min((data.system_pulse.goroutines / 100) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </ChartCard>
            </div>
        </div>
    );
}
