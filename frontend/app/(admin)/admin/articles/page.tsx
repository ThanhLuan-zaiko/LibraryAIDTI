"use client";

import React, { useState } from 'react';
import { HiPlus, HiPencil, HiTrash, HiEye, HiFilter } from 'react-icons/hi';

const ArticlesAdminPage = () => {
    // Mock data for initial UI
    const [articles] = useState([
        { id: 1, title: 'Xu hướng công nghệ AI năm 2024', category: 'Công nghệ', author: 'Admin', status: 'Published', date: '2025-12-25' },
        { id: 2, title: 'Thị trường chứng khoán có dấu hiệu hồi phục', category: 'Kinh doanh', author: 'Luan Nguyen', status: 'Published', date: '2025-12-24' },
        { id: 3, title: 'Hướng dẫn nấu món ngon ngày Tết', category: 'Đời sống', author: 'Admin', status: 'Draft', date: '2025-12-26' },
    ]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý bài viết</h1>
                    <p className="text-sm text-gray-500">Xem, chỉnh sửa và quản lý tất cả tin tức của bạn.</p>
                </div>
                <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all">
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
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    <HiFilter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                </div>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                    <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none">
                        <option value="">Tất cả danh mục</option>
                        <option value="tech">Công nghệ</option>
                        <option value="biz">Kinh doanh</option>
                    </select>
                    <select className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none">
                        <option value="">Trạng thái</option>
                        <option value="published">Đã đăng</option>
                        <option value="draft">Bản nháp</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Tiêu đề</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Danh mục</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Tác giả</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Ngày tạo</th>
                            <th className="px-6 py-4 text-sm font-bold text-gray-700 uppercase tracking-wider text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {articles.map((article) => (
                            <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="text-sm font-bold text-gray-900 line-clamp-1">{article.title}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">{article.category}</td>
                                <td className="px-6 py-4 text-sm text-gray-600">{article.author}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${article.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                        }`}>
                                        {article.status === 'Published' ? 'Đã đăng' : 'Bản nháp'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{article.date}</td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800 p-1 transition-colors"><HiEye className="w-5 h-5" /></button>
                                    <button className="text-amber-600 hover:text-amber-800 p-1 transition-colors"><HiPencil className="w-5 h-5" /></button>
                                    <button className="text-red-600 hover:text-red-800 p-1 transition-colors"><HiTrash className="w-5 h-5" /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-sm text-gray-500">Hiển thị <span className="font-bold">1</span> đến <span className="font-bold">3</span> trong <span className="font-bold">3</span> bài viết</p>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 border border-gray-200 rounded-md bg-gray-50 text-gray-400 cursor-not-allowed">Trước</button>
                    <button className="px-3 py-1 border border-blue-500 rounded-md bg-blue-50 text-blue-600 font-bold">1</button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">Tiếp</button>
                </div>
            </div>
        </div>
    );
};

export default ArticlesAdminPage;
