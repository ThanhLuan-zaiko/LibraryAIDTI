"use client";

import { useEffect, useState } from "react";
import { tagService, Tag, TagStats } from "@/services/tag.service";
import { FiPlus, FiSearch } from "react-icons/fi";
import ConfirmModal from "@/components/admin/ConfirmModal";
import TagGrid from "@/components/admin/tags/TagGrid";
import TagStatsSection from "@/components/admin/tags/TagStatsSection";
import TagModal from "@/components/admin/tags/TagModal";
import Pagination from "@/components/admin/Pagination";

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [stats, setStats] = useState<TagStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination & Search States
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [search, setSearch] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalRows, setTotalRows] = useState(0);

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchData();
        // Stats are only fetched once or on explicit refresh
        tagService.getStats(7).then(setStats);
    }, [page, search, limit]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const result = await tagService.getList({
                page,
                limit,
                search
            });
            setTags(result.data);
            setTotalPages(result.pagination.total_pages);
            setTotalRows(result.pagination.total_rows);
        } catch (error) {
            setError("Không thể tải dữ liệu thẻ.");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        fetchData();
        tagService.getStats(7).then(setStats);
    };

    const handleOpenModal = (tag?: Tag) => {
        setEditingTag(tag || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTag(null);
    };

    const handleOpenDeleteModal = (id: string) => {
        setTagToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!tagToDelete) return;
        try {
            setDeleting(true);
            await tagService.delete(tagToDelete);
            refreshData();
            setIsDeleteModalOpen(false);
            setTagToDelete(null);
        } catch (error) {
            setError("Không thể xóa thẻ.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Quản lý Thẻ (Tags)</h2>
                    <p className="text-sm text-gray-500">Gán nhãn cho các bài viết để tăng khả năng tìm kiếm</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative w-full md:w-64">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm thẻ..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all text-sm"
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1); // Reset to first page on search
                            }}
                        />
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="w-full md:w-auto flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                    >
                        <FiPlus />
                        <span>Thêm mới</span>
                    </button>
                </div>
            </div>

            <TagStatsSection stats={stats} loading={loading} />

            <div className="p-6">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                        <span>Tổng số: <span className="font-semibold text-gray-700">{totalRows}</span> thẻ</span>
                        <div className="flex items-center space-x-2 border-l border-gray-200 pl-4">
                            <span>Hiện:</span>
                            <select
                                className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
                                value={limit}
                                onChange={(e) => {
                                    setLimit(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                <option value={12}>12</option>
                                <option value={24}>24</option>
                                <option value={48}>48</option>
                                <option value={96}>96</option>
                            </select>
                        </div>
                    </div>
                    {search && (
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-full text-xs font-medium">
                            Kết quả cho: "{search}"
                        </span>
                    )}
                </div>
                <div className={`transition-opacity duration-300 ${loading && tags.length === 0 ? 'opacity-50' : 'opacity-100'}`}>
                    <TagGrid
                        tags={tags}
                        loading={loading}
                        limit={limit}
                        onEdit={handleOpenModal}
                        onDelete={handleOpenDeleteModal}
                    />
                </div>

                {totalRows > 0 && (
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            onPageChange={setPage}
                        />
                    </div>
                )}
            </div>

            {/* Modals */}
            <TagModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={refreshData}
                editingTag={editingTag}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Xác nhận xóa thẻ"
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
