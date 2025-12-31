import React from 'react';
import { useRouter } from 'next/navigation';
import { HiSave, HiArrowLeft, HiCheck, HiChevronRight } from 'react-icons/hi';
import { FaSpinner } from 'react-icons/fa';

interface ArticleEditorHeaderProps {
    articleId?: string;
    loading: boolean;
    completion: {
        completed: number;
        total: number;
        percentage: number;
        fields?: {
            title: boolean;
            content: boolean;
            summary: boolean;
            category: boolean;
            images: boolean;
            tags: boolean;
        };
    };
    activeStep: number;
    onSubmit: () => void;
    onCancel: () => void;
}

const ArticleEditorHeader: React.FC<ArticleEditorHeaderProps> = ({
    articleId,
    loading,
    completion,
    activeStep,
    onSubmit,
    onCancel
}) => {
    const router = useRouter();

    const steps = [
        { id: 1, name: 'Soạn thảo', value: 'DRAFT' },
        { id: 2, name: 'Chờ duyệt', value: 'REVIEW' },
        { id: 3, name: 'Đã đăng', value: 'PUBLISHED' },
    ];

    return (
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
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        >
                            Hủy bỏ
                        </button>
                        <button
                            onClick={onSubmit}
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

                {/* Form Completion Progress */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 border-t border-gray-100 bg-gray-50">
                    <div className="flex items-center justify-center flex-wrap gap-3">
                        {[
                            { name: 'Tiêu đề', completed: !!completion.fields?.title },
                            { name: 'Nội dung', completed: !!completion.fields?.content },
                            { name: 'Tóm tắt', completed: !!completion.fields?.summary },
                            { name: 'Danh mục', completed: !!completion.fields?.category },
                            { name: 'Hình ảnh', completed: !!completion.fields?.images },
                            { name: 'Tags', completed: !!completion.fields?.tags },
                        ].map((field, index) => (
                            <div
                                key={field.name}
                                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${field.completed
                                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                                    : 'bg-white text-gray-500 border border-gray-300'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${field.completed ? 'bg-blue-600' : 'bg-gray-400'
                                    }`} />
                                <span>{field.name}</span>
                            </div>
                        ))}
                        <div className="ml-2 px-3 py-1.5 bg-blue-600 text-white rounded-full text-xs font-bold">
                            {completion.completed}/{completion.total}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="md:hidden bg-white border-t border-gray-200 py-3 px-4 overflow-x-auto">
                <div className="flex items-center space-x-4 min-w-max mx-auto justify-center">
                    {steps.map((step, index) => (
                        <div key={step.id} className={`flex items-center space-x-2 ${activeStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}>
                            <span className={`text-xs font-bold ${activeStep === step.id ? 'underline' : ''}`}>{step.name}</span>
                            {index < steps.length - 1 && <HiChevronRight className="w-3 h-3 text-gray-300" />}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArticleEditorHeader;
