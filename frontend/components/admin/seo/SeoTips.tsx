import React from 'react';
import { HiLightBulb } from 'react-icons/hi';

export default function SeoTips() {
    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-2xl text-white shadow-lg">
            <h4 className="font-bold text-lg mb-3 flex items-center">
                <HiLightBulb className="w-5 h-5 mr-2 opacity-80" />
                Mẹo SEO
            </h4>
            <ul className="space-y-3 text-sm opacity-90">
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <div>Nên dùng 301 Redirect khi bạn đổi URL bài viết để giữ thứ hạng trên Google.</div>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <div>Hạn chế redirect vòng (A đến B, B lại về A).</div>
                </li>
                <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <div>Nên điền đầy đủ Meta Description và OG Image cho mọi bài viết để tăng CTR.</div>
                </li>
            </ul>
        </div>
    );
}
