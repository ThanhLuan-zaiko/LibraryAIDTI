'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Article } from '@/services/article.service';
import { HiOutlineArrowRight, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlineClock } from 'react-icons/hi';
import { getImageUrl } from '@/utils/image';

interface HeroSectionProps {
    featuredArticles: Article[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ featuredArticles }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    useEffect(() => {
        if (!featuredArticles || featuredArticles.length <= 1) return;

        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % featuredArticles.length);
        }, 8000);

        return () => clearInterval(timer);
    }, [featuredArticles]);

    if (!featuredArticles || featuredArticles.length === 0) return null;

    const currentArticle = featuredArticles[activeIndex];

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + featuredArticles.length) % featuredArticles.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % featuredArticles.length);
    };

    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) {
            handleNext();
        } else if (isRightSwipe) {
            handlePrev();
        }
    };

    return (
        <section
            className="group relative w-full h-[650px] md:h-[750px] lg:h-[800px] bg-gray-950 overflow-hidden lg:rounded-[3rem] lg:mt-8 shadow-3xl touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Immersive Background Slideshow */}
            {featuredArticles.map((article, index) => (
                <div
                    key={article.id}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                >
                    <img
                        src={getImageUrl(article.image_url) || '/placeholder-hero.jpg'}
                        alt={article.title}
                        className={`w-full h-full object-cover transition-transform duration-[8000ms] ease-linear ${index === activeIndex ? 'scale-110' : 'scale-100'}`}
                    />
                    {/* Cinematic Multi-layered Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-black/20" />
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-gray-950 to-transparent opacity-60" />
                </div>
            ))}

            {/* Premium Navigation Controls */}
            {featuredArticles.length > 1 && (
                <>
                    <button
                        onClick={handlePrev}
                        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center rounded-3xl bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-white hover:text-gray-950 transition-all duration-500 opacity-0 group-hover:opacity-100 -translate-x-12 group-hover:translate-x-0 shadow-2xl"
                    >
                        <HiOutlineChevronLeft className="w-7 h-7" />
                    </button>
                    <button
                        onClick={handleNext}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 w-14 h-14 flex items-center justify-center rounded-3xl bg-white/5 backdrop-blur-xl text-white border border-white/10 hover:bg-white hover:text-gray-950 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-12 group-hover:translate-x-0 shadow-2xl"
                    >
                        <HiOutlineChevronRight className="w-7 h-7" />
                    </button>
                </>
            )}

            {/* Content Architecture - Animated via Key for Re-triggering */}
            <div className="relative z-20 h-full container mx-auto px-8 md:px-16 flex flex-col justify-center max-w-6xl">
                <div key={currentArticle.id} className="space-y-10 max-w-4xl">
                    {/* Hero Metadata */}
                    <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 ease-out fill-mode-forwards">
                        <span className="px-5 py-2 bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-2xl shadow-2xl border border-white/20">
                            {currentArticle.category?.name || 'Exclusive'}
                        </span>
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white text-[10px] font-bold uppercase tracking-widest">
                            <HiOutlineClock className="w-4 h-4 text-blue-400" />
                            <span>8 MIN READ</span>
                        </div>
                    </div>

                    {/* Majestic Title */}
                    <h1 className="text-4xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tighter drop-shadow-3xl animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-150 ease-out fill-mode-forwards">
                        {currentArticle.title}
                    </h1>

                    {/* Refined Summary */}
                    <p className="text-lg md:text-xl text-gray-300 font-medium line-clamp-2 max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 ease-out fill-mode-forwards">
                        {currentArticle.summary || currentArticle.content.substring(0, 200).replace(/<[^>]*>/g, '') + '...'}
                    </p>

                    {/* Interaction Hub */}
                    <div className="flex flex-wrap items-center gap-10 pt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500 ease-out fill-mode-forwards">
                        <div className="flex items-center gap-4 group cursor-pointer transition-transform hover:translate-x-2">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 p-0.5 shadow-2xl">
                                <div className="w-full h-full rounded-[0.9rem] bg-gray-900 flex items-center justify-center text-white text-xl font-black italic">
                                    {currentArticle.author?.full_name?.charAt(0) || 'D'}
                                </div>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-white font-black text-lg tracking-tight">{currentArticle.author?.full_name}</p>
                                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Pro Editor</p>
                            </div>
                        </div>

                        <Link
                            href={`/article/${currentArticle.slug}`}
                            className="group relative px-10 py-5 bg-white text-gray-950 font-black text-sm uppercase tracking-widest rounded-3xl flex items-center gap-3 hover:bg-blue-600 hover:text-white transition-all duration-500 shadow-4xl hover:-translate-y-1 overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Start Reading
                                <HiOutlineArrowRight className="w-5 h-5 transition-all duration-500 group-hover:translate-x-2" />
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>
                    </div>
                </div>

                {/* Aesthetic Pagination Hub */}
                {featuredArticles.length > 1 && (
                    <div className="absolute bottom-12 md:bottom-20 left-8 md:left-16 flex items-end gap-6 z-30">
                        <div className="flex gap-4">
                            {featuredArticles.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className="group relative flex items-center"
                                >
                                    <div className={`h-[3px] rounded-full transition-all duration-1000 ${idx === activeIndex ? 'w-16 bg-blue-600' : 'w-8 bg-white/20 hover:bg-white/40'}`} />
                                    {idx === activeIndex && (
                                        <span className="absolute -top-6 left-0 text-[10px] font-black text-white animate-in fade-in zoom-in duration-500">
                                            0{idx + 1}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="hidden md:block h-px w-20 bg-white/10 mb-[1px]" />
                        <span className="hidden md:block text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-[-4px]">Featured Intellect</span>
                    </div>
                )}

                {/* Visual Accent Decoration */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[150px] -mr-64 -mt-64 z-0 pointer-events-none" />
            </div>
        </section>
    );
};

export default HeroSection;
