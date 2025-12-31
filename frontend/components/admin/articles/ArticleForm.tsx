import React, { useState, useEffect } from 'react';
import { Article, ArticleInput } from '@/services/article.service';

interface ArticleFormProps {
    initialData?: Article | null;
    onSubmit: (data: ArticleInput) => Promise<void>;
    onCancel: () => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState<ArticleInput>({
        title: '',
        content: '',
        summary: '',
        status: 'DRAFT',
        category_id: '',
        is_featured: false,
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                content: initialData.content,
                summary: initialData.summary || '',
                status: initialData.status,
                category_id: initialData.category_id || '',
                is_featured: initialData.is_featured,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Tiêu đề</label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Tóm tắt</label>
                <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    rows={2}
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Nội dung</label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    rows={10}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Trạng thái</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                    >
                        <option value="DRAFT">Bản nháp</option>
                        <option value="PUBLISHED">Đã đăng</option>
                        <option value="REVIEW">Chờ duyệt</option>
                        <option value="SCHEDULED">Đã lên lịch</option>
                        <option value="ARCHIVED">Lưu trữ</option>
                    </select>
                </div>

                <div className="flex items-center mt-6">
                    <input
                        id="is_featured"
                        name="is_featured"
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                        Bài viết nổi bật
                    </label>
                </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {loading ? 'Đang lưu...' : (initialData ? 'Cập nhật' : 'Tạo mới')}
                </button>
            </div>
        </form>
    );
};

export default ArticleForm;
