'use client';

import React from 'react';
import Link from 'next/link';
import { HiOutlineBookmark, HiOutlineShare } from 'react-icons/hi';
import { Article } from '@/services/article.service';

interface ArticleAuthorProps {
    article: Article;
}

const ArticleAuthor: React.FC<ArticleAuthorProps> = ({ article }) => {
    return (
        <section className="bg-gray-950 rounded-[4rem] p-12 md:p-20 text-white relative overflow-hidden group shadow-4xl shadow-gray-200 mt-32">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40 transition-opacity duration-1000 group-hover:bg-blue-600/20" />
            <div className="relative z-10 flex flex-col lg:flex-row gap-16 items-center lg:items-start text-center lg:text-left">
                <div className="relative shrink-0">
                    <div className="w-36 h-36 md:w-52 md:h-52 rounded-[3.5rem] bg-gradient-to-tr from-blue-500 to-indigo-900 p-[3px] shadow-3xl">
                        <div className="w-full h-full rounded-[3.4rem] bg-gray-900 flex items-center justify-center text-6xl font-black italic tracking-tighter shadow-inner">
                            {article.author?.full_name?.charAt(0) || 'D'}
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 w-14 h-14 rounded-[1.5rem] bg-blue-600 border-[6px] border-gray-950 flex items-center justify-center z-20 shadow-2xl group-hover:scale-110 transition-transform">
                        <HiOutlineBookmark className="w-6 h-6 text-white" />
                    </div>
                </div>
                <div className="flex-grow space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-4xl md:text-5xl font-black tracking-tighter">{article.author?.full_name || 'LibraryAI Contributor'}</h3>
                        <p className="text-blue-500 text-xs font-black uppercase tracking-[0.4em]">Chief Content Architect</p>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-xl font-medium max-w-2xl mx-auto lg:mx-0">
                        Chịu trách nhiệm về định hướng khoa học và chuẩn hóa tri thức tại LibraryAI. Với hơn 10 năm kinh nghiệm trong ngành, tác giả cam kết mang đến những góc nhìn sâu sắc và trung thực nhất.
                    </p>
                    <div className="pt-8 flex flex-wrap justify-center lg:justify-start gap-6">
                        <Link href="/" className="px-10 py-5 bg-white text-gray-900 text-sm font-black rounded-3xl hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105 shadow-2xl">
                            VIEW ALL INTELLECT
                        </Link>
                        <button className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all text-white group/share">
                            <HiOutlineShare className="w-7 h-7 group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ArticleAuthor;
