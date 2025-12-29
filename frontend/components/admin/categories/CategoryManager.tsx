"use client";

import { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import { useCategoryLogic } from "@/hooks/admin/useCategoryLogic";
import ConfirmModal from "@/components/admin/ConfirmModal";
import Pagination from "@/components/admin/Pagination";
import CategoryModal from "./CategoryModal";
import CategoryTable from "./CategoryTable";
import CategoryHierarchicalTable from "./CategoryHierarchicalTable";
import CategoryTreeView from "./CategoryTreeView";
import CategoryActions from "./CategoryActions";
import ViewToggle from "../ViewToggle";
import { categoryService, Category } from "@/services/category.service";

export default function CategoryManager() {
    // Business Logic Hook
    const {
        categories,
        allCategories,
        pagination,
        loading,
        searchQuery,
        sortField,
        sortOrder,
        handlePageChange,
        handleSearch,
        handleLimitChange,
        handleSort,
        refreshData
    } = useCategoryLogic();

    // Modal & Action States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // View Mode State with localStorage
    const [viewMode, setViewMode] = useState<'hierarchical' | 'flat' | 'tree'>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('categoryViewMode');
            return (saved as 'hierarchical' | 'flat' | 'tree') || 'hierarchical';
        }
        return 'hierarchical';
    });

    // Persist view mode to localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('categoryViewMode', viewMode);
        }
    }, [viewMode]);

    // Handlers
    const handleOpenModal = (category?: Category) => {
        setEditingCategory(category || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
    };

    const handleOpenDeleteModal = (id: string) => {
        setCategoryToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        try {
            setDeleting(true);
            await categoryService.delete(categoryToDelete);
            refreshData();
            setIsDeleteModalOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            setError("Không thể xóa danh mục.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Danh sách danh mục</h2>
                    <p className="text-sm text-gray-500">Quản lý các danh mục bài viết của hệ thống.</p>
                </div>
                <div className="flex items-center gap-3">
                    <ViewToggle viewMode={viewMode} onChange={setViewMode} />
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <FiPlus />
                        <span>Thêm danh mục mới</span>
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-1">
                <CategoryActions
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    limit={pagination.limit}
                    totalRows={pagination.total_rows}
                    onLimitChange={handleLimitChange}
                />

                {viewMode === 'tree' ? (
                    <CategoryTreeView
                        categories={categories}
                        loading={loading}
                        onEdit={handleOpenModal}
                        onDelete={handleOpenDeleteModal}
                    />
                ) : viewMode === 'hierarchical' ? (
                    <CategoryHierarchicalTable
                        categories={categories}
                        loading={loading}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        onEdit={handleOpenModal}
                        onDelete={handleOpenDeleteModal}
                    />
                ) : (
                    <CategoryTable
                        categories={categories}
                        loading={loading}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={handleSort}
                        onEdit={handleOpenModal}
                        onDelete={handleOpenDeleteModal}
                    />
                )}

                <Pagination
                    currentPage={pagination.page}
                    totalPages={pagination.total_pages}
                    onPageChange={handlePageChange}
                />

                <div className="h-4"></div>
            </div>

            <CategoryModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={refreshData}
                editingCategory={editingCategory}
                allCategories={allCategories}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Xác nhận xóa danh mục"
                message="Dữ liệu bị xóa sẽ không thể khôi phục. Bạn có chắc chắn muốn thực hiện hành động này?"
                confirmText="Xóa ngay"
                cancelText="Quay lại"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                loading={deleting}
            />
        </div>
    );
}
