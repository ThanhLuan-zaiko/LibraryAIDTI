'use client';

import React from 'react';
import { HiOutlineTag, HiOutlineHashtag, HiOutlineChartBar } from 'react-icons/hi';

interface TagHeroProps {
    tagName: string;
    usageCount?: number;
}

const TagHero: React.FC<TagHeroProps> = ({ tagName, usageCount = 0 }) => {
    return (
        <section className="relative py-24 overflow-hidden rounded-[3rem] my-8">
            {/* Mesh Gradient Background */}
            <div className="absolute inset-0 bg-[#0F172A] z-0" />
            <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-purple-600 rounded-full blur-[100px]" />
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-blue-400 text-sm font-bold uppercase tracking-widest">
                        <HiOutlineHashtag className="w-4 h-4" />
                        <span>Tag Topic</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                        #{tagName}
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
                        Khám phá tất cả kiến thức, xu hướng và những thảo luận chuyên sâu xoay quanh chủ đề <span className="text-white">#{tagName}</span>.
                        Được cập nhật liên tục từ cộng đồng LibraryAI DTI.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/5">
                            <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                                <HiOutlineChartBar className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <span className="block text-2xl font-black text-white leading-none">{usageCount}</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bài viết liên quan</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 px-6 py-4 bg-white/5 backdrop-blur-sm rounded-3xl border border-white/5">
                            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                                <HiOutlineTag className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <span className="block text-2xl font-black text-white leading-none">Chủ đề</span>
                                <span className="text-xs text-gray-500 font-bold uppercase tracking-wider">Phổ biến</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Smooth edge transition */}
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#FDFDFD] to-transparent z-0" />
        </section>
    );
};

export default TagHero;
