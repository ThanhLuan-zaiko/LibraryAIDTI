"use client";

import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';

const CategoriesAdminPage = () => {
    const [categories] = useState([
        { id: 1, name: 'Chính trị', slug: 'politics', count: 45, description: 'Tin tức về các vấn đề chính trị trong và ngoài nước.' },
        { id: 2, name: 'Kinh doanh', slug: 'business', count: 120, description: 'Cập nhật tình hình kinh tế, tài chính.' },
        { id: 3, name: 'Công nghệ', slug: 'technology', count: 85, description: 'Máy móc, thiết bị, phần mềm và AI.' },
        { id: 4, name: 'Thể thao', slug: 'sports', count: 210, description: 'Bóng đá, tennis, đua xe...' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý danh mục</h1>
                    <p className="text-sm text-gray-500">Phân loại bài viết để người dùng dễ dàng tìm kiếm.</p>
                </div>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all shadow-sm">
                    <HiPlus className="w-5 h-5" />
                    <span>Thêm danh mục mới</span>
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">
                                {category.count} bài
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mb-6 italic">/{category.slug}</p>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-6 h-10">
                            {category.description}
                        </p>

                        <div className="flex justify-end space-x-2 border-t pt-4 border-gray-50">
                            <button className="flex items-center space-x-1 text-amber-600 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold">
                                <HiPencil className="w-4 h-4" />
                                <span>Sửa</span>
                            </button>
                            <button className="flex items-center space-x-1 text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors text-sm font-semibold">
                                <HiTrash className="w-4 h-4" />
                                <span>Xóa</span>
                            </button>
                        </div>
                    </div>
                ))}

                {/* Empty State / Add Category Placeholder */}
                <button className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-6 text-gray-400 hover:border-blue-500 hover:text-blue-500 transition-all group min-h-[220px]">
                    <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-3 group-hover:bg-blue-50">
                        <HiPlus className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-sm">Tạo danh mục mới</span>
                </button>
            </div>
        </div>
    );
};

export default CategoriesAdminPage;
