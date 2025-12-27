"use client";

import { Category } from "@/services/category.service";
import { FiEdit2, FiTrash2, FiFolder, FiFolderPlus, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { useState, useEffect } from "react";

interface CategoryTreeViewProps {
    categories: Category[];
    loading: boolean;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export default function CategoryTreeView({
    categories,
    loading,
    onEdit,
    onDelete
}: CategoryTreeViewProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [focusedId, setFocusedId] = useState<string | null>(null);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!focusedId) return;

            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    setExpandedCategories(prev => new Set([...prev, focusedId]));
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    setExpandedCategories(prev => {
                        const newSet = new Set(prev);
                        newSet.delete(focusedId);
                        return newSet;
                    });
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedId]);

    if (loading) {
        return (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mb-4"></div>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="p-12 text-center text-gray-400">
                <FiFolder size={48} className="mx-auto mb-4 opacity-20" />
                <p>Không tìm thấy danh mục nào.</p>
            </div>
        );
    }

    const toggleExpand = (categoryId: string) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const renderTreeNode = (category: Category, level: number = 0, isLast: boolean = false, parentLines: boolean[] = []) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);

        return (
            <div key={category.id} className="relative">
                {/* Tree Node Row */}
                <div
                    className={`flex items-center py-3 rounded-lg transition-all group cursor-pointer ${focusedId === category.id
                            ? 'bg-blue-50 ring-2 ring-blue-400 ring-offset-2'
                            : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-transparent'
                        }`}
                    onClick={() => setFocusedId(category.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleExpand(category.id);
                        }
                    }}
                    tabIndex={0}
                    role="treeitem"
                    aria-expanded={hasChildren ? isExpanded : undefined}
                >
                    {/* Tree Lines - Parent Vertical Lines */}
                    <div className="flex items-center" style={{ width: `${level * 32}px` }}>
                        {parentLines.map((hasLine, idx) => (
                            <div key={idx} className="w-8 h-full relative">
                                {hasLine && (
                                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-blue-200"></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Branch Connector - L-shaped with rounded corner */}
                    {level > 0 && (
                        <div className="relative w-8 h-full flex items-center">
                            {/* Vertical line from parent - extends to middle */}
                            {!isLast && (
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-300 to-blue-200"></div>
                            )}

                            {/* L-shaped connector with rounded corner using SVG */}
                            <svg
                                className="absolute left-0 top-0 w-8 h-full pointer-events-none"
                                style={{ overflow: 'visible' }}
                            >
                                <path
                                    d="M 16 0 L 16 12 Q 16 16 20 16 L 32 16"
                                    stroke="rgb(147 197 253)"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>
                    )}

                    {/* Expand/Collapse Icon with animation */}
                    <div className="w-6 mr-3">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-blue-100 rounded-md transition-all hover:scale-110 active:scale-95"
                            >
                                {isExpanded ? (
                                    <FiChevronDown className="w-4 h-4 text-blue-600 transition-transform" />
                                ) : (
                                    <FiChevronRight className="w-4 h-4 text-blue-400 transition-transform" />
                                )}
                            </button>
                        ) : (
                            <div className="w-6 h-6 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-200"></div>
                            </div>
                        )}
                    </div>

                    {/* Folder Icon with depth-based colors */}
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mr-3 transition-all ${hasChildren
                            ? level === 0
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md'
                                : 'bg-gradient-to-br from-blue-400 to-blue-500 text-white shadow-sm'
                            : 'bg-gradient-to-br from-gray-100 to-gray-200 text-gray-600'
                        }`}>
                        {hasChildren ? (
                            <FiFolderPlus size={18} className={isExpanded ? 'scale-110' : ''} />
                        ) : (
                            <FiFolder size={16} />
                        )}
                    </div>

                    {/* Category Info with better typography */}
                    <div className="flex-1 flex items-center gap-4">
                        <div className="min-w-0">
                            <p className={`font-semibold text-gray-800 ${level === 0 ? 'text-base' : 'text-sm'}`}>
                                {category.name}
                            </p>
                            <p className="text-xs text-gray-400 italic truncate">/{category.slug}</p>
                        </div>
                        {hasChildren && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 text-blue-700 text-xs rounded-full font-medium shadow-sm">
                                <FiFolder size={10} />
                                <span>{category.children!.length}</span>
                            </div>
                        )}
                        {category.description && (
                            <p className="text-sm text-gray-500 truncate max-w-md hidden lg:block">
                                {category.description}
                            </p>
                        )}
                    </div>

                    {/* Status with better design */}
                    <div className="mx-4">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${category.is_active
                                ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200"
                                : "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border border-red-200"
                            }`}>
                            {category.is_active ? "● Hoạt động" : "○ Tạm dừng"}
                        </span>
                    </div>

                    {/* Actions with better hover effects */}
                    <div className="flex space-x-1.5 opacity-0 group-hover:opacity-100 transition-all">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-all hover:shadow-md hover:scale-105 active:scale-95"
                            title="Sửa"
                        >
                            <FiEdit2 size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-all hover:shadow-md hover:scale-105 active:scale-95"
                            title="Xóa"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Children (if expanded) with subtle animation */}
                {hasChildren && isExpanded && (
                    <div className="animate-in slide-in-from-top-2 duration-200">
                        {category.children!.map((child, idx) =>
                            renderTreeNode(
                                child,
                                level + 1,
                                idx === category.children!.length - 1,
                                [...parentLines, !isLast]
                            )
                        )}
                    </div>
                )}
            </div>
        );
    };

    // Get root categories
    const rootCategories = categories.filter(cat => !cat.parent_id);

    return (
        <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Cấu trúc cây danh mục</h3>
                    <p className="text-sm text-gray-500">
                        Click mũi tên để mở/đóng các nhánh danh mục con
                    </p>
                </div>
                <button
                    onClick={() => {
                        if (expandedCategories.size > 0) {
                            setExpandedCategories(new Set());
                        } else {
                            const allIds = new Set<string>();
                            const collectIds = (cats: Category[]) => {
                                cats.forEach(cat => {
                                    if (cat.children && cat.children.length > 0) {
                                        allIds.add(cat.id);
                                        collectIds(cat.children);
                                    }
                                });
                            };
                            collectIds(rootCategories);
                            setExpandedCategories(allIds);
                        }
                    }}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                    {expandedCategories.size > 0 ? "Thu gọn tất cả" : "Mở rộng tất cả"}
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4">
                {rootCategories.map((category, idx) =>
                    renderTreeNode(category, 0, idx === rootCategories.length - 1, [])
                )}
            </div>
        </div>
    );
}
