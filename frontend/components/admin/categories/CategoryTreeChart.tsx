"use client";

import { CategoryTreeData } from "@/services/dashboard.service";
import { useState, useEffect, useRef } from "react";
import { FiFolder, FiFolderPlus, FiFileText, FiChevronDown, FiChevronUp } from "react-icons/fi";

interface CategoryTreeChartProps {
    data: CategoryTreeData;
}

// Smart bento layout calculator
function calculateBentoLayout(roots: any[]) {
    const totalArticles = roots.reduce((sum, root) =>
        sum + (root.article_count || 0) +
        (root.children?.reduce((childSum: number, child: any) =>
            childSum + (child.article_count || 0), 0) || 0), 0);

    return roots.map(root => {
        const rootArticles = root.article_count || 0;
        const childrenArticles = root.children?.reduce((sum: number, child: any) =>
            sum + (child.article_count || 0), 0) || 0;
        const totalRootArticles = rootArticles + childrenArticles;

        const percentage = totalArticles > 0 ? (totalRootArticles / totalArticles) * 100 : 0;

        return {
            ...root,
            percentage,
            totalArticles: totalRootArticles,
            gridSpan: percentage > 40 ? 'col-span-2' : percentage > 25 ? 'col-span-1' : 'col-span-1'
        };
    });
}

const GRADIENT_COLORS = [
    { from: 'from-blue-500', to: 'to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' },
    { from: 'from-emerald-500', to: 'to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
    { from: 'from-purple-500', to: 'to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
    { from: 'from-orange-500', to: 'to-orange-600', bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-200' },
    { from: 'from-pink-500', to: 'to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600', border: 'border-pink-200' },
    { from: 'from-indigo-500', to: 'to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-200' },
];

export default function CategoryTreeChart({ data }: CategoryTreeChartProps) {
    const [expandedCard, setExpandedCard] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setExpandedCard(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!data || !data.roots || data.roots.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Cây phân cấp danh mục</h3>
                <div className="h-[400px] flex items-center justify-center text-gray-400">
                    <p>Chưa có dữ liệu danh mục</p>
                </div>
            </div>
        );
    }

    const layoutData = calculateBentoLayout(data.roots);

    const toggleExpand = (cardId: string) => {
        setExpandedCard(prev => prev === cardId ? null : cardId);
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Phân bố danh mục</h3>
                <p className="text-sm text-gray-500">
                    Click vào card để xem danh mục con. Click bên ngoài để đóng.
                </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6" ref={dropdownRef}>
                {layoutData.map((root, idx) => {
                    const colorScheme = GRADIENT_COLORS[idx % GRADIENT_COLORS.length];
                    const isExpanded = expandedCard === root.id;
                    const hasChildren = root.children && root.children.length > 0;

                    return (
                        <div
                            key={root.id}
                            className={`${root.gridSpan} relative`}
                        >
                            {/* Main Category Card */}
                            <div
                                className={`
                                    relative overflow-hidden rounded-2xl border-2 
                                    transition-all duration-300 cursor-pointer
                                    ${isExpanded ? 'shadow-2xl scale-105 ring-4 ring-offset-2 ring-blue-200' : 'shadow-md hover:shadow-xl'}
                                    ${colorScheme.border}
                                `}
                                onClick={() => hasChildren && toggleExpand(root.id)}
                            >
                                {/* Gradient Background */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-br opacity-90
                                    ${colorScheme.from} ${colorScheme.to}
                                `}></div>

                                {/* Pattern Overlay */}
                                <div className="absolute inset-0 opacity-10">
                                    <div className="absolute inset-0" style={{
                                        backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                                        backgroundSize: '20px 20px'
                                    }}></div>
                                </div>

                                {/* Content */}
                                <div className="relative p-6">
                                    {/* Icon & Expand Indicator */}
                                    <div className="mb-4 flex items-center justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                            {hasChildren ? (
                                                <FiFolderPlus size={28} className="text-white" />
                                            ) : (
                                                <FiFolder size={28} className="text-white" />
                                            )}
                                        </div>
                                        {hasChildren && (
                                            <div className={`
                                                w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm 
                                                flex items-center justify-center transition-transform duration-300
                                                ${isExpanded ? 'rotate-180' : ''}
                                            `}>
                                                <FiChevronDown size={20} className="text-white" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-white font-bold text-xl mb-2 line-clamp-2">
                                        {root.name}
                                    </h4>

                                    {/* Stats */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                            <FiFileText size={14} className="text-white" />
                                            <span className="text-white font-semibold text-sm">
                                                {root.totalArticles} bài
                                            </span>
                                        </div>
                                        {hasChildren && (
                                            <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                                <FiFolder size={14} className="text-white" />
                                                <span className="text-white font-semibold text-sm">
                                                    {root.children.length} con
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Percentage Bar */}
                                    <div className="w-full bg-white/20 backdrop-blur-sm rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-white h-full rounded-full transition-all duration-500"
                                            style={{ width: `${Math.min(root.percentage, 100)}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-white/80 text-xs mt-1">
                                        {root.percentage.toFixed(1)}% tổng bài viết
                                    </p>
                                </div>
                            </div>

                            {/* Children Dropdown (show on click) */}
                            {hasChildren && isExpanded && (
                                <div className="mt-3 animate-in slide-in-from-top-4 fade-in duration-300">
                                    <div className={`
                                        ${colorScheme.bg} ${colorScheme.border}
                                        border-2 rounded-2xl p-4 shadow-xl
                                    `}>
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className={`font-bold text-sm ${colorScheme.text}`}>
                                                Danh mục con ({root.children.length})
                                            </h5>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedCard(null);
                                                }}
                                                className={`
                                                    ${colorScheme.text} hover:bg-white/50 
                                                    p-1 rounded-lg transition-colors
                                                `}
                                            >
                                                <FiChevronUp size={16} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                                            {root.children.map((child: any) => (
                                                <div
                                                    key={child.id}
                                                    className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md hover:scale-105 transition-all cursor-pointer"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <FiFolder size={14} className={colorScheme.text} />
                                                        <div className="flex-1 min-w-0">
                                                            <p className={`font-semibold text-xs ${colorScheme.text} truncate`}>
                                                                {child.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {child.article_count} bài viết
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        {data.roots.length}
                    </p>
                    <p className="text-xs text-gray-500">Danh mục gốc</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        {data.roots.reduce((sum, root) =>
                            sum + (root.children?.length || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500">Danh mục con</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        {data.roots.reduce((sum, root) =>
                            sum + (root.article_count || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500">Bài ở gốc</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl font-bold text-gray-800">
                        {data.roots.reduce((sum, root) =>
                            sum + (root.article_count || 0) +
                            (root.children?.reduce((childSum: number, child: any) =>
                                childSum + (child.article_count || 0), 0) || 0), 0)}
                    </p>
                    <p className="text-xs text-gray-500">Tổng bài viết</p>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </div>
    );
}
