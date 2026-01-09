import React from 'react';
import { HiExclamation, HiPhotograph, HiDocumentText } from 'react-icons/hi';

interface SeoStatsProps {
    stats: any;
    loading: boolean;
}

export default function SeoStats({ stats, loading }: SeoStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Card 1: Missing Meta */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                    <HiExclamation className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                    {loading ? '...' : (stats?.seo_stats?.missing_meta_description || 0)}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Thiếu Meta Desc</div>
            </div>

            {/* Card 2: Missing OG */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
                    <HiPhotograph className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                    {loading ? '...' : (stats?.seo_stats?.missing_og_image || 0)}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Thiếu OG Image</div>
            </div>

            {/* Card 3: Missing Canonical */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
                    <HiExclamation className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                    {loading ? '...' : (stats?.content_health?.missing_canonical || 0)}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Thiếu Canonical</div>
            </div>

            {/* Card 4: Orphan Pages */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center mb-3">
                    <HiExclamation className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                    {loading ? '...' : (stats?.content_graph?.orphan_pages || 0)}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Bài viết mồ côi</div>
            </div>

            {/* Card 5: Total */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <HiDocumentText className="w-5 h-5" />
                </div>
                <div className="text-2xl font-black text-gray-900 mb-1">
                    {loading ? '...' : (stats?.seo_stats?.total_seo_records || 0)}
                </div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Tổng bài viết SEO</div>
            </div>
        </div>
    );
}
