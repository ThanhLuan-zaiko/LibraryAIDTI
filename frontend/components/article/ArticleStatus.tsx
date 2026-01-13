'use client';

import React from 'react';
import { HiOutlineAnnotation, HiOutlineArrowLeft } from 'react-icons/hi';
import Link from 'next/link';

export const ArticleLoading = () => (
    <div className="container mx-auto px-6 py-32 flex flex-col items-center justify-center space-y-8">
        <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-[6px] border-blue-50 rounded-full" />
            <div className="absolute inset-0 border-[6px] border-blue-600 border-t-transparent rounded-full animate-spin shadow-lg" />
        </div>
        <div className="flex flex-col items-center space-y-2">
            <p className="text-gray-900 font-black uppercase tracking-[0.4em] text-xs">Curating Knowledge</p>
            <div className="h-1 w-12 bg-blue-600 rounded-full" />
        </div>
    </div>
);

export const ArticleNotFound = () => (
    <div className="container mx-auto px-6 py-40 text-center">
        <div className="inline-flex items-center justify-center w-32 h-32 rounded-[2.5rem] bg-red-50 text-red-500 mb-10 shadow-xl rotate-3 transform">
            <HiOutlineAnnotation className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-black text-gray-900 mb-6 tracking-tight">Content Unavailable</h1>
        <p className="text-gray-500 mb-12 max-w-lg mx-auto text-lg leading-relaxed font-medium">This architectural piece of knowledge has been moved or is currently undergoing renovation.</p>
        <Link href="/" className="inline-flex items-center justify-center px-12 py-5 bg-gray-900 text-white font-black rounded-[2rem] hover:bg-blue-600 transition-all shadow-2xl hover:shadow-blue-200 group overflow-hidden relative">
            <span className="relative z-10 flex items-center">
                <HiOutlineArrowLeft className="mr-3 transition-transform group-hover:-translate-x-2" />
                Explore Home
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    </div>
);
