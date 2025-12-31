import React from 'react';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { Category } from '@/services/category.service';
import { Tag } from '@/services/tag.service';
import { ArticleInput } from '@/services/article.service';
import ImageGallery from './ImageGallery';
import TagSelector from './TagSelector';

interface ArticleEditorSidebarProps {
    formData: ArticleInput;
    categories: Category[];
    availableTags: Tag[];
    showSeoSection: boolean;
    onFormDataChange: (data: Partial<ArticleInput>) => void;
    onToggleFeatured: () => void;
    onToggleSeoSection: () => void;
}

const ArticleEditorSidebar: React.FC<ArticleEditorSidebarProps> = ({
    formData,
    categories,
    availableTags,
    showSeoSection,
    onFormDataChange,
    onToggleFeatured,
    onToggleSeoSection,
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        onFormDataChange({ [name]: value });
    };

    return (
        <div className="lg:col-span-4 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-base">Hình ảnh</h3>
                <ImageGallery
                    images={formData.images || []}
                    onImagesChange={(images) => onFormDataChange({ images })}
                />
            </div>

            {/* Tags */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-base">Tags</h3>
                <TagSelector
                    selectedTags={formData.tags || []}
                    onTagsChange={(tags) => onFormDataChange({ tags })}
                    availableTags={availableTags}
                />
            </div>

            {/* SEO Metadata */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={onToggleSeoSection}
                >
                    <h3 className="font-bold text-gray-900 text-base">SEO Metadata</h3>
                    {showSeoSection ? (
                        <HiChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                        <HiChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                </div>
                {showSeoSection && (
                    <div className="mt-4 space-y-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                                type="text"
                                value={formData.seo_metadata?.meta_title || ''}
                                onChange={(e) => onFormDataChange({
                                    seo_metadata: { ...formData.seo_metadata, meta_title: e.target.value }
                                })}
                                placeholder="Tiêu đề SEO..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Meta Description</label>
                            <textarea
                                value={formData.seo_metadata?.meta_description || ''}
                                onChange={(e) => onFormDataChange({
                                    seo_metadata: { ...formData.seo_metadata, meta_description: e.target.value }
                                })}
                                placeholder="Mô tả SEO..."
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Meta Keywords</label>
                            <input
                                type="text"
                                value={formData.seo_metadata?.meta_keywords || ''}
                                onChange={(e) => onFormDataChange({
                                    seo_metadata: { ...formData.seo_metadata, meta_keywords: e.target.value }
                                })}
                                placeholder="keyword1, keyword2, keyword3..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">OG Image URL</label>
                            <input
                                type="text"
                                value={formData.seo_metadata?.og_image || ''}
                                onChange={(e) => onFormDataChange({
                                    seo_metadata: { ...formData.seo_metadata, og_image: e.target.value }
                                })}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">Canonical URL</label>
                            <input
                                type="text"
                                value={formData.seo_metadata?.canonical_url || ''}
                                onChange={(e) => onFormDataChange({
                                    seo_metadata: { ...formData.seo_metadata, canonical_url: e.target.value }
                                })}
                                placeholder="https://..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Settings */}
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-5">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-2 text-base">Cấu hình bài viết</h3>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="DRAFT">Bản nháp</option>
                        <option value="REVIEW">Chờ duyệt</option>
                        <option value="PUBLISHED">Đã đăng</option>
                    </select>
                </div>

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Danh mục</label>
                    <select
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Featured Toggle */}
                <div className="pt-2 border-t border-gray-100">
                    <div
                        className="flex items-start cursor-pointer group"
                        onClick={onToggleFeatured}
                    >
                        <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.is_featured ? 'bg-blue-600' : 'bg-gray-200'}`}>
                            <span
                                aria-hidden="true"
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.is_featured ? 'translate-x-5' : 'translate-x-0'}`}
                            />
                        </div>
                        <div className="ml-3 select-none">
                            <span className="block text-sm font-medium text-gray-900 group-hover:text-blue-700 transition-colors">Bài viết nổi bật</span>
                            <span className="block text-xs text-gray-500">Ghim bài viết này lên đầu trang chủ tin tức.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleEditorSidebar;
