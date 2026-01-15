'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { articleService, Article } from '@/services/article.service';
import { HiOutlineArrowNarrowRight, HiOutlineViewGrid, HiOutlineChevronRight } from 'react-icons/hi';
import { getImageUrl } from '@/utils/image';

const MAX_RELATED_ITEMS = 18; // Balanced limit for related section

interface RelatedArticlesProps {
    initialRelated: Article[];
    categoryId?: string;
    currentArticleId: string;
}

const RelatedArticles: React.FC<RelatedArticlesProps> = ({ initialRelated, categoryId, currentArticleId }) => {
    const [articles, setArticles] = useState<Article[]>(initialRelated);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const loadMoreTriggerRef = useRef<HTMLDivElement>(null);

    const fetchMore = useCallback(async () => {
        if (loading || !hasMore || articles.length >= MAX_RELATED_ITEMS || !categoryId) return;

        setLoading(true);
        try {
            const nextPage = page + 1;
            const res = await articleService.getList({
                page: nextPage,
                limit: 6,
                category_id: categoryId,
                status: 'PUBLISHED'
            });

            const newArticles = res.data.filter((a: Article) =>
                a.id !== currentArticleId && !articles.some(existing => existing.id === a.id)
            );

            if (newArticles.length === 0 || (articles.length + newArticles.length) >= MAX_RELATED_ITEMS || res.data.length < 6) {
                setHasMore(false);
            }

            setArticles(prev => [...prev, ...newArticles].slice(0, MAX_RELATED_ITEMS));
            setPage(nextPage);
        } catch (error) {
            console.error('Failed to fetch more related articles:', error);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, articles, page, categoryId, currentArticleId]);

    useEffect(() => {
        if (!hasMore || articles.length >= MAX_RELATED_ITEMS || !categoryId) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    fetchMore();
                }
            },
            { root: scrollContainerRef.current, threshold: 0.1, rootMargin: '0px 200px 0px 0px' }
        );

        if (loadMoreTriggerRef.current) observer.observe(loadMoreTriggerRef.current);
        return () => observer.disconnect();
    }, [fetchMore, hasMore, articles.length, categoryId]);

    return (
        <section className="bg-white py-16 relative overflow-hidden border-t border-gray-50">
            <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-blue-50 rounded-full blur-[100px] -mt-[200px] opacity-30" />

            <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                            Dynamic Discovery
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-gray-950 tracking-tighter leading-none italic uppercase">
                            Bài viết <br className="hidden md:block" /> liên quan
                        </h2>
                    </div>
                </div>

                {/* Horizontal Scroll Layout */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    {articles.map((item) => (
                        <div key={item.id} className="flex-shrink-0 w-[300px] snap-start">
                            <Link href={`/article/${item.slug}`} className="group block space-y-4">
                                <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                                    <img
                                        src={getImageUrl(item.image_url) || '/placeholder-news.jpg'}
                                        alt={item.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="space-y-2 px-2">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
                                        {item.category?.name}
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        </div>
                    ))}

                    {/* Infinite Load Trigger */}
                    <div
                        ref={loadMoreTriggerRef}
                        className="flex-shrink-0 w-64 flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-[2.5rem] border-2 border-dashed border-gray-100"
                    >
                        {loading ? (
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Đang tìm...</span>
                            </div>
                        ) : articles.length >= MAX_RELATED_ITEMS ? (
                            <div className="flex flex-col items-center gap-4 text-center">
                                <div className="w-12 h-12 flex items-center justify-center bg-gray-900 text-white rounded-full shadow-lg">
                                    <HiOutlineViewGrid className="w-6 h-6" />
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-xs font-black text-gray-900 uppercase tracking-widest">Hết bài liên quan</span>
                                    <Link href="/" className="text-[10px] font-bold text-blue-600 underline uppercase tracking-widest">Về trang chủ</Link>
                                </div>
                            </div>
                        ) : !hasMore ? (
                            <div className="flex flex-col items-center gap-3 text-center">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">Đã xem hết</span>
                            </div>
                        ) : (
                            <HiOutlineChevronRight className="w-6 h-6 text-gray-300 animate-bounce" />
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RelatedArticles;
