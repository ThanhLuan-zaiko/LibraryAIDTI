"use client";

import { useState } from "react";
import GeneralSettings from "@/components/admin/settings/GeneralSettings";
import LogViewer from "@/components/admin/settings/LogViewer";
import SettingsDashboard from "@/components/admin/settings/SettingsDashboard";
import {
    LayoutDashboard,
    Settings as SettingsIcon,
    ShieldCheck,
    Terminal,
    ChevronRight,
    Home
} from "lucide-react";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<string>("overview");

    const tabs = [
        { id: "overview", label: "Tổng quan", icon: LayoutDashboard, color: "text-indigo-600", bg: "bg-indigo-50" },
        { id: "general", label: "Cấu hình chung", icon: SettingsIcon, color: "text-blue-600", bg: "bg-blue-50" },
        { id: "audit", label: "Nhật ký hoạt động", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
        { id: "system", label: "Nhật ký hệ thống", icon: Terminal, color: "text-rose-600", bg: "bg-rose-50" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="relative p-12 bg-gray-900 rounded-[48px] overflow-hidden shadow-2xl">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-500/10 to-transparent"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                        <div className="flex items-center space-x-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-4">
                            <Home className="w-3 h-3" />
                            <span>Admin</span>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-white">Cài đặt hệ thống</span>
                        </div>
                        <h1 className="text-5xl font-black text-white tracking-tighter mb-4">Settings & Audit</h1>
                        <p className="text-gray-400 font-medium text-lg max-w-xl leading-relaxed">
                            Quản trị toàn diện thông tin website, theo dõi nhật ký hoạt động và giám sát hiệu năng server theo thời gian thực.
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="h-16 w-px bg-white/10 hidden md:block"></div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">System Status</p>
                            <div className="flex items-center justify-end space-x-2">
                                <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-lg font-black text-white uppercase tracking-tight">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center p-2 bg-gray-100/50 backdrop-blur-xl border border-gray-200/50 rounded-[32px] w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center space-x-2.5 px-6 py-3.5 rounded-2xl font-black text-sm transition-all duration-300
                            ${activeTab === tab.id
                                ? `${tab.bg} ${tab.color} shadow-lg shadow-gray-200/50`
                                : 'text-gray-400 hover:text-gray-900 hover:bg-white/50'
                            }
                        `}
                    >
                        <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
                        <span className="tracking-tight">{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="transition-all duration-500">
                {activeTab === "overview" && <SettingsDashboard />}
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "audit" && <LogViewer type="audit" />}
                {activeTab === "system" && <LogViewer type="system" />}
            </div>
        </div>
    );
}
