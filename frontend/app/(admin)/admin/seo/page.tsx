"use client";

import React, { useState } from 'react';
import GlobalRedirectsTab from '@/components/admin/seo/GlobalRedirectsTab';
import ArticleSeoTab from '@/components/admin/seo/ArticleSeoTab';

export default function SeoPage() {
    const [activeTab, setActiveTab] = useState<'global' | 'article'>('global');

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">Quản lý SEO & Redirects</h1>
                <p className="text-gray-500">Theo dõi sức khỏe SEO và cấu hình chuyển hướng toàn cục.</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
                <button
                    onClick={() => setActiveTab('global')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'global'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    Redirect Toàn Cục
                </button>
                <button
                    onClick={() => setActiveTab('article')}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'article'
                            ? 'bg-white text-blue-600 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    SEO Bài Viết & Thống Kê
                </button>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                {activeTab === 'global' ? (
                    <GlobalRedirectsTab />
                ) : (
                    <ArticleSeoTab />
                )}
            </div>
        </div>
    );
}
