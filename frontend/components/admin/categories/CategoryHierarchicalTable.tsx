"use client";

import { Category } from "@/services/category.service";
import { FiEdit2, FiTrash2, FiFolder, FiArrowUp, FiArrowDown, FiChevronRight, FiChevronDown, FiFolderPlus } from "react-icons/fi";
import { useState, useEffect, useCallback } from "react";

interface CategoryHierarchicalTableProps {
    categories: Category[];
    loading: boolean;
    sortField: string;
    sortOrder: string;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onSort: (field: string) => void;
}

export default function CategoryHierarchicalTable({
    categories,
    loading,
    sortField,
    sortOrder,
    onEdit,
    onDelete,
    onSort
}: CategoryHierarchicalTableProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
    const [focusedIndex, setFocusedIndex] = useState<number>(-1);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (focusedIndex === -1) return;

            const rootCategories = categories.filter(cat => !cat.parent_id);

            switch (e.key) {
                case 'ArrowRight':
                    // Expand category if it has children
                    const currentCat = rootCategories[focusedIndex];
                    if (currentCat?.children && currentCat.children.length > 0) {
                        e.preventDefault();
                        setExpandedCategories(prev => new Set([...prev, currentCat.id]));
                    }
                    break;
                case 'ArrowLeft':
                    // Collapse category
                    const cat = rootCategories[focusedIndex];
                    if (cat) {
                        e.preventDefault();
                        setExpandedCategories(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(cat.id);
                            return newSet;
                        });
                    }
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setFocusedIndex(prev => Math.min(prev + 1, rootCategories.length - 1));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setFocusedIndex(prev => Math.max(prev - 1, 0));
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    const selectedCat = rootCategories[focusedIndex];
                    if (selectedCat) toggleExpand(selectedCat.id);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [focusedIndex, categories]);

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

    const renderSortButton = (field: string, label: string) => {
        const isActive = sortField === field;
        return (
            <button
                onClick={() => onSort(field)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-all ${isActive
                    ? 'bg-blue-100 text-blue-700 font-bold shadow-sm'
                    : 'hover:bg-gray-100 text-gray-600 hover:text-blue-600'
                    }`}
            >
                {label}
                {isActive && (
                    sortOrder === "asc"
                        ? <FiArrowUp className="w-4 h-4" />
                        : <FiArrowDown className="w-4 h-4" />
                )}
            </button>
        );
    };

    const getChildrenCount = (category: Category): number => {
        if (!category.children || category.children.length === 0) return 0;

        let count = category.children.length;
        category.children.forEach(child => {
            count += getChildrenCount(child);
        });
        return count;
    };

    const renderCategory = (category: Category, level: number = 0) => {
        const hasChildren = category.children && category.children.length > 0;
        const isExpanded = expandedCategories.has(category.id);
        const indentPx = level * 24;

        return (
            <div key={category.id}>
                {/* Parent Row */}
                <div
                    className={`flex items-center p-4 border-b border-gray-100 transition-colors ${level === 0 ? 'hover:bg-blue-50/30' : 'hover:bg-blue-50/20'
                        }`}
                    style={{
                        paddingLeft: `${16 + indentPx}px`,
                        backgroundColor: level > 0 ? `rgba(59, 130, 246, ${0.02 * level})` : 'transparent'
                    }}
                >
                    {/* Expand/Collapse Button */}
                    <div className="w-8 flex items-center justify-center mr-2">
                        {hasChildren ? (
                            <button
                                onClick={() => toggleExpand(category.id)}
                                className="p-1 hover:bg-blue-100 rounded transition-colors"
                                title={isExpanded ? "Thu gọn" : "Mở rộng"}
                            >
                                {isExpanded ? (
                                    <FiChevronDown className="w-4 h-4 text-blue-600" />
                                ) : (
                                    <FiChevronRight className="w-4 h-4 text-gray-400" />
                                )}
                            </button>
                        ) : (
                            <div className="w-4"></div>
                        )}
                    </div>

                    {/* Category Info */}
                    <div className="flex items-center flex-1">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${level === 0 ? 'bg-blue-100 text-blue-600' : 'bg-blue-50 text-blue-500'
                            }`}>
                            {hasChildren ? <FiFolderPlus size={14} /> : <FiFolder size={14} />}
                        </div>
                        <div>
                            <p className="font-semibold text-gray-800">{category.name}</p>
                            <p className="text-xs text-gray-400 italic">/{category.slug}</p>
                        </div>
                        {hasChildren && (
                            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                                {getChildrenCount(category)} con
                            </span>
                        )}
                    </div>

                    {/* Parent Category */}
                    <div className="flex-1 text-sm text-gray-600">
                        {category.parent ? (
                            <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium text-gray-700">
                                {category.parent.name}
                            </span>
                        ) : (
                            <span className="text-gray-400 italic">Gốc</span>
                        )}
                    </div>

                    {/* Description */}
                    <div className="hidden md:block flex-1 text-sm text-gray-500 truncate pr-4">
                        {category.description || "—"}
                    </div>

                    {/* Status */}
                    <div className="w-24 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            }`}>
                            {category.is_active ? "Hoạt động" : "Tạm dừng"}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="w-32 flex justify-end space-x-2">
                        <button
                            onClick={() => onEdit(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Sửa"
                        >
                            <FiEdit2 size={16} />
                        </button>
                        <button
                            onClick={() => onDelete(category.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa"
                        >
                            <FiTrash2 size={16} />
                        </button>
                    </div>
                </div>

                {/* Children Rows (if expanded) */}
                {hasChildren && isExpanded && (
                    <div className="border-l-2 border-blue-200 ml-8">
                        {category.children!.map(child => renderCategory(child, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="overflow-x-auto">
            <div className="min-w-[800px]">
                {/* Header */}
                <div className="flex items-center p-4 bg-gradient-to-r from-gray-50 to-gray-100 text-xs font-bold text-gray-700 uppercase tracking-wider border-b-2 border-blue-200">
                    <div className="w-8 mr-2"></div> {/* Space for expand button */}
                    <div className="flex-1 flex items-center gap-2">
                        {renderSortButton("name", "Tên danh mục")}
                    </div>
                    <div className="flex-1 text-gray-500">Danh mục cha</div>
                    <div className="hidden md:block flex-1 text-gray-500">Mô tả</div>
                    <div className="w-24 text-center flex items-center justify-center">
                        {renderSortButton("is_active", "Trạng thái")}
                    </div>
                    <div className="w-32 text-right text-gray-500">Thao tác</div>
                </div>

                {/* Category Rows */}
                {categories
                    .filter(cat => !cat.parent_id) // Only render root categories, children will be rendered recursively
                    .map(category => renderCategory(category, 0))}
            </div>
        </div>
    );
}
