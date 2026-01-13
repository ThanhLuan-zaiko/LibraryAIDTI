'use client';

import React from 'react';
import Link from 'next/link';
import { HiOutlineArrowNarrowRight } from 'react-icons/hi';
import ArticleCard from '@/components/ArticleCard';
import { Article } from '@/services/article.service';

interface RelatedArticlesProps {
    related: Article[];
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ related }) => {
    return (
        <section className="bg-white border-t border-gray-100 py-40 mt-32 relative overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[150px] -mt-[400px] opacity-50" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

            <div className="container mx-auto max-w-7xl px-6 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-4 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] shadow-xl">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Selective Discovery
                        </div>
                        <h2 className="text-5xl md:text-8xl font-black text-gray-950 tracking-tighter leading-none italic uppercase shadow-sm">Mở rộng <br className="hidden md:block" /> kỷ nguyên số</h2>
                    </div>
                    <Link href="/" className="group inline-flex items-center gap-4 px-12 py-6 bg-gray-950 text-white font-black rounded-[2.5rem] hover:bg-blue-600 transition-all shadow-4xl transform hover:scale-105">
                        <span className="tracking-widest capitalize">CONTINUE JOURNEY</span>
                        <HiOutlineArrowNarrowRight className="w-6 h-6 transition-transform group-hover:translate-x-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                    {related.length > 0 ? (
                        related.map((item) => (
                            <ArticleCard key={item.id} article={item} variant="default" />
                        ))
                    ) : (
                        [1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse space-y-8 bg-gray-50/50 p-10 rounded-[4rem] border border-gray-100">
                                <div className="aspect-[16/10] bg-gray-200 rounded-[3rem]" />
                                <div className="space-y-4">
                                    <div className="h-8 bg-gray-200 rounded-2xl w-full" />
                                    <div className="h-8 bg-gray-200 rounded-2xl w-4/5" />
                                    <div className="h-8 bg-gray-200 rounded-2xl w-2/3" />
                                </div>
                                <div className="h-5 bg-gray-200 rounded-full w-1/3 mt-10" />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default RelatedArticles;
