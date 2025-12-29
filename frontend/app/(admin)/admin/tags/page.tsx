"use client";

import { useEffect, useState } from "react";
import { tagService, Tag, TagStats } from "@/services/tag.service";
import { FiPlus } from "react-icons/fi";
import ConfirmModal from "@/components/admin/ConfirmModal";
import TagGrid from "@/components/admin/tags/TagGrid";
import TagStatsSection from "@/components/admin/tags/TagStatsSection";
import TagModal from "@/components/admin/tags/TagModal";

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [stats, setStats] = useState<TagStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // UI States
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [tagsData, statsData] = await Promise.all([
                tagService.getAll(),
                tagService.getStats()
            ]);
            setTags(tagsData);
            setStats(statsData);
        } catch (error) {
            setError("Không thể tải dữ liệu thẻ.");
        } finally {
            setLoading(false);
        }
    };

    const refreshData = async () => {
        try {
            const data = await tagService.getAll();
            setTags(data);
            tagService.getStats().then(setStats);
        } catch (error) {
            setError("Không thể tải dữ liệu thẻ.");
        }
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
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow-md active:scale-95"
                >
                    <FiPlus />
                    <span>Thêm thẻ mới</span>
                </button>
            </div>

            <TagStatsSection stats={stats} loading={loading} />

            <div className="p-6">
                <TagGrid
                    tags={tags}
                    loading={loading}
                    onEdit={handleOpenModal}
                    onDelete={handleOpenDeleteModal}
                />
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
