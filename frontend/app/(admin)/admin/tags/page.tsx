import { useEffect, useState } from "react";
import { tagService, Tag, TagStats } from "@/services/tag.service";
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiHash } from "react-icons/fi";
import ConfirmModal from "@/components/admin/ConfirmModal";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function TagsPage() {
    const [tags, setTags] = useState<Tag[]>([]);
    const [stats, setStats] = useState<TagStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [tagToDelete, setTagToDelete] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [editingTag, setEditingTag] = useState<Tag | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        slug: ""
    });

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
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTags = async () => {
        try {
            const data = await tagService.getAll();
            setTags(data);
            // Refresh stats silently
            tagService.getStats().then(setStats);
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        }
    };

    const handleOpenModal = (tag?: Tag) => {
        if (tag) {
            setEditingTag(tag);
            setFormData({
                name: tag.name,
                slug: tag.slug
            });
        } else {
            setEditingTag(null);
            setFormData({
                name: "",
                slug: ""
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTag(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingTag) {
                await tagService.update(editingTag.id, formData);
            } else {
                await tagService.create(formData);
            }
            fetchTags();
            handleCloseModal();
        } catch (error) {
            console.error("Failed to save tag:", error);
        }
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
            fetchTags();
            setIsDeleteModalOpen(false);
            setTagToDelete(null);
        } catch (error) {
            console.error("Failed to delete tag:", error);
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

            {/* Stats Section */}
            {!loading && stats.length > 0 && (
                <div className="p-6 border-b border-gray-200 bg-white">
                    <h3 className="font-bold text-gray-800 mb-4">Các thẻ được sử dụng nhiều nhất</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="usage_count" fill="#8884d8" radius={[4, 4, 0, 0]} name="Số bài viết" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            <div className="p-6">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center text-gray-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mb-4"></div>
                        <p>Đang tải dữ liệu...</p>
                    </div>
                ) : tags.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {tags.map((tag) => (
                            <div key={tag.id} className="group p-4 border border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50/30 transition-all flex flex-col justify-between h-32">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                                        <FiHash size={18} />
                                    </div>
                                    <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleOpenModal(tag)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                                            <FiEdit2 size={14} />
                                        </button>
                                        <button onClick={() => handleOpenDeleteModal(tag.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                                            <FiTrash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-800">{tag.name}</p>
                                    <p className="text-xs text-gray-400">#{tag.slug}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 text-center text-gray-400">
                        <FiTag size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Chưa có thẻ nào được tạo.</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingTag ? "Chỉnh sửa thẻ" : "Thêm thẻ mới"}
                            </h3>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Tên thẻ</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                                    placeholder="Ví dụ: Golang, ReactJS..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (Đường dẫn tĩnh)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all bg-gray-50 text-gray-500"
                                    placeholder="Tự động tạo nếu để trống"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all shadow-sm"
                                >
                                    {editingTag ? "Cập nhật" : "Lưu thẻ"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
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
