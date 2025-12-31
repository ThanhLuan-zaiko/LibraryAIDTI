import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { HiSave, HiArrowLeft, HiCloudUpload, HiTrash, HiCheck, HiChevronRight, HiExclamationCircle, HiX } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';
import { articleService, Article, ArticleInput } from '@/services/article.service';
import { categoryService, Category } from '@/services/category.service';

interface ArticleEditorProps {
    articleId?: string;
    initialData?: Article | null;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ articleId, initialData }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<ArticleInput>({
        title: '',
        content: '',
        summary: '',
        status: 'DRAFT',
        category_id: '',
        is_featured: false,
    });

    const [imageUrl, setImageUrl] = useState<string>('');

    // Load categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await categoryService.getAll();
                setCategories(data);
            } catch (error) {
                console.error("Failed to load categories", error);
                setError("Không thể tải danh sách danh mục");
            }
        };
        fetchCategories();
    }, []);

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
            if (initialData.images && initialData.images.length > 0) {
                setImageUrl(initialData.images[0].image_url);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleToggleFeatured = () => {
        setFormData(prev => ({
            ...prev,
            is_featured: !prev.is_featured
        }));
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setError(null);
        try {
            const res = await articleService.uploadImage(file);
            const fullUrl = res.url.startsWith('http')
                ? res.url
                : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${res.url}`;
            setImageUrl(fullUrl);
        } catch (error) {
            console.error("Upload failed", error);
            setError("Tải ảnh thất bại. Vui lòng thử lại với file nhỏ hơn 5MB.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload: any = { ...formData };
        if (imageUrl) {
            payload.images = [{ image_url: imageUrl }];
        }

        try {
            if (articleId) {
                await articleService.update(articleId, payload);
            } else {
                await articleService.create(payload);
            }
            router.push('/admin/articles');
        } catch (error: any) {
            console.error("Failed to save article", error);
            setError(error.response?.data?.error || "Có lỗi xảy ra khi lưu bài viết.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate Progress Step based on Status
    const getActiveStep = () => {
        switch (formData.status) {
            case 'DRAFT': return 1;
            case 'REVIEW': return 2;
            case 'PUBLISHED': return 3;
            default: return 1;
        }
    };

    const activeStep = getActiveStep();
    const steps = [
        { id: 1, name: 'Soạn thảo', value: 'DRAFT' },
        { id: 2, name: 'Chờ duyệt', value: 'REVIEW' },
        { id: 3, name: 'Đã đăng', value: 'PUBLISHED' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans text-gray-900">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center h-auto md:h-16 py-3 md:py-0 space-y-3 md:space-y-0">
                        {/* Left: Back & Title */}
                        <div className="flex items-center w-full md:w-auto">
                            <button
                                onClick={() => router.back()}
                                className="p-2 mr-3 hover:bg-gray-100 rounded-full transition-all text-gray-500 hover:text-gray-900"
                                title="Quay lại"
                            >
                                <HiArrowLeft className="w-5 h-5" />
                            </button>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">
                                    {articleId ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                                </h1>
                            </div>
                        </div>

                        {/* Center: Progress Bar */}
                        <div className="hidden md:flex items-center space-x-2">
                            {steps.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    <div className={`flex items-center space-x-2 ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 
                                            ${activeStep >= step.id ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}
                                            ${activeStep > step.id ? 'bg-blue-600 text-white border-blue-600' : ''}
                                        `}>
                                            {activeStep > step.id ? <HiCheck className="w-4 h-4" /> : step.id}
                                        </div>
                                        <span className={`text-sm font-medium ${activeStep === step.id ? 'font-bold' : ''}`}>{step.name}</span>
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className={`w-12 h-0.5 ${activeStep > step.id ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
                            <button
                                onClick={() => router.push('/admin/articles')}
                                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                            >
                                Hủy bỏ
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex items-center space-x-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all hover:shadow-lg disabled:opacity-70 transform active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                                        Đang lưu...
                                    </span>
                                ) : (
                                    <>
                                        <HiSave className="w-5 h-5" />
                                        <span>{articleId ? 'Cập nhật' : 'Lưu bài viết'}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Notification */}
            {error && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg flex items-start">
                        <div className="flex-shrink-0">
                            <HiExclamationCircle className="h-5 w-5 text-red-500" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
                            <div className="mt-1 text-sm text-red-700">{error}</div>
                        </div>
                        <div className="ml-auto pl-3">
                            <button
                                onClick={() => setError(null)}
                                className="-mx-1.5 -my-1.5 bg-red-50 p-1.5 rounded-lg text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                <span className="sr-only">Dismiss</span>
                                <HiX className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Progress Bar (visible only on small screens) */}
            <div className="md:hidden bg-white border-b border-gray-200 py-3 px-4 overflow-x-auto">
                <div className="flex items-center space-x-4 min-w-max mx-auto justify-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`flex items-center space-x-2 ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                            <span className={`text-xs font-bold ${activeStep === step.id ? 'underline' : ''}`}>{step.name}</span>
                            {index < steps.length - 1 && <HiChevronRight className="w-3 h-3 text-gray-300" />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Editor (8 cols) */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Title & Summary */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tiêu đề bài viết</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="Nhập tiêu đề hấp dẫn..."
                                    className="w-full px-0 py-2 text-3xl font-bold text-gray-900 placeholder-gray-300 border-none border-b-2 border-transparent focus:border-blue-500 focus:ring-0 transition-all bg-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Tóm tắt ngắn</label>
                                <textarea
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                    rows={2}
                                    placeholder="Mô tả ngắn gọn về nội dung (hiển thị trên danh sách tin tức)..."
                                    className="w-full text-base text-gray-600 placeholder-gray-400 border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-[600px]">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-500 uppercase">Nội dung chi tiết</span>
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">Markdown Supported</span>
                            </div>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Viết nội dung bài viết của bạn tại đây..."
                                className="flex-1 w-full p-6 border-none focus:ring-0 resize-none text-base leading-relaxed text-gray-800 font-article"
                            />
                        </div>
                    </div>

                    {/* Right Column: Sidebar (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* Image Upload */}
                        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-4 text-base">Ảnh đại diện</h3>
                            <div className="space-y-3">
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative aspect-video rounded-lg overflow-hidden border-2 border-dashed transition-all cursor-pointer group
                                        ${imageUrl
                                            ? 'border-transparent shadow-md'
                                            : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                                        }`}
                                >
                                    {imageUrl ? (
                                        <>
                                            <img src={imageUrl} alt="Featured" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                <div className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">Thay ảnh</div>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setImageUrl(''); }}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                                title="Xóa ảnh"
                                            >
                                                <HiTrash className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                                            {uploading ? (
                                                <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
                                            ) : (
                                                <HiCloudUpload className="w-10 h-10 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                            )}
                                            <p className="mt-2 text-sm font-medium text-gray-600">Nhấn để tải ảnh lên</p>
                                            <p className="text-xs text-gray-400 mt-1">PNG, JPG tối đa 5MB</p>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                />
                                {!imageUrl && !uploading && (
                                    <input
                                        type="text"
                                        placeholder="Hoặc nhập URL hình ảnh..."
                                        className="w-full text-xs border border-gray-300 rounded-md px-3 py-2 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                )}
                            </div>
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
                                    onClick={handleToggleFeatured}
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
                </div>
            </div>
        </div>
    );
};

export default ArticleEditor;
