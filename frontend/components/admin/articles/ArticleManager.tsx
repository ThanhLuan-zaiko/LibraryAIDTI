import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiFilter, HiSearch } from 'react-icons/hi';
import { useArticleLogic } from '@/hooks/admin/useArticleLogic';

import { articleService, ArticleInput } from '@/services/article.service';
import Pagination from '@/components/admin/Pagination';
import ConfirmModal from '@/components/admin/ConfirmModal';

import { useRouter } from 'next/navigation';

const ArticleManager = () => {
    const router = useRouter();
    const {
        articles,
        loading,
        pagination,
        searchQuery,
        statusFilter,
        handleSearch,
        handlePageChange,
        handleStatusFilter,
        refreshData
    } = useArticleLogic();

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [articleToDelete, setArticleToDelete] = useState<string | null>(null);

    const handleDeleteClick = (id: string) => {
        setArticleToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (articleToDelete) {
            await articleService.delete(articleToDelete);
            refreshData();
            setIsDeleteModalOpen(false);
        }
    };



    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
                    <p className="text-sm text-gray-500">Xem, chỉnh sửa và quản lý tất cả tin tức của bạn.</p>
                </div>
                <button
                    onClick={() => router.push('/admin/articles/create')}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                    <HiPlus className="w-5 h-5" />
                    <span>Viết bài mới</span>
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Tìm kiếm bài viết..."
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <HiSearch className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="PUBLISHED">Đã đăng</option>
                        <option value="DRAFT">Bản nháp</option>
                        <option value="REVIEW">Chờ duyệt</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Tiêu đề</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Tác giả</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Lượt xem</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Ngày tạo</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Đang tải...</td>
                                </tr>
                            ) : articles.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Không có bài viết nào.</td>
                                </tr>
                            ) : (
                                articles.map((article) => (
                                    <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900 line-clamp-1">{article.title}</div>
                                            <div className="text-xs text-gray-500">{article.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{article.author?.full_name || 'Admin'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full ${article.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' :
                                                article.status === 'DRAFT' ? 'bg-gray-100 text-gray-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {article.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{article.view_count}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(article.created_at).toLocaleDateString('vi-VN')}</td>
                                        <td className="px-6 py-4 text-right space-x-2">
                                            <button onClick={() => router.push(`/admin/articles/${article.id}/edit`)} className="text-amber-600 hover:text-amber-800 p-1 transition-colors"><HiPencil className="w-5 h-5" /></button>
                                            <button onClick={() => handleDeleteClick(article.id)} className="text-red-600 hover:text-red-800 p-1 transition-colors"><HiTrash className="w-5 h-5" /></button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200">
                    <Pagination
                        currentPage={pagination.page}
                        totalPages={Math.ceil(pagination.total / pagination.limit)}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>



            <ConfirmModal
                isOpen={isDeleteModalOpen}
                title="Xóa bài viết"
                message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác."
                confirmText="Xóa"
                cancelText="Hủy"
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsDeleteModalOpen(false)}
                type="danger"
            />
        </div>
    );
};

export default ArticleManager;
