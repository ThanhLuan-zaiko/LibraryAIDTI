import React from 'react';
import { HiOutlineChevronLeft, HiOutlineChevronRight } from 'react-icons/hi';
import Link from 'next/link';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    baseUrl?: string;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange, baseUrl }) => {
    if (totalPages <= 1) return null;

    const getPageUrl = (page: number) => {
        if (!baseUrl) return '#';
        if (page === 1) return baseUrl;
        const separator = baseUrl.includes('?') ? '&' : '?';
        return `${baseUrl}${separator}page=${page}`;
    };

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);

        if (endPage - startPage + 1 < maxVisible) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            const isActive = currentPage === i;
            const className = `w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all duration-300 ${isActive
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'bg-white text-gray-500 hover:bg-gray-50 hover:text-blue-600 border border-gray-100'
                }`;

            if (baseUrl) {
                pages.push(
                    <Link
                        key={i}
                        href={getPageUrl(i)}
                        className={className}
                        scroll={false}
                        onClick={(e) => {
                            if (isActive) e.preventDefault();
                            else onPageChange(i);
                        }}
                    >
                        {i}
                    </Link>
                );
            } else {
                pages.push(
                    <button
                        key={i}
                        onClick={() => onPageChange(i)}
                        className={className}
                    >
                        {i}
                    </button>
                );
            }
        }
        return pages;
    };

    const renderChevron = (direction: 'left' | 'right') => {
        const isLeft = direction === 'left';
        const Icon = isLeft ? HiOutlineChevronLeft : HiOutlineChevronRight;
        const disabled = isLeft ? currentPage === 1 : currentPage === totalPages;
        const targetPage = isLeft ? currentPage - 1 : currentPage + 1;

        const className = "w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-gray-100 text-gray-500 hover:text-blue-600 hover:bg-gray-50 transition-all disabled:opacity-30 disabled:cursor-not-allowed";

        if (baseUrl && !disabled) {
            return (
                <Link
                    href={getPageUrl(targetPage)}
                    className={className}
                    scroll={false}
                    onClick={() => onPageChange(targetPage)}
                >
                    <Icon className="w-5 h-5" />
                </Link>
            );
        }

        return (
            <button
                onClick={() => onPageChange(targetPage)}
                disabled={disabled}
                className={className}
            >
                <Icon className="w-5 h-5" />
            </button>
        );
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {renderChevron('left')}

            <div className="flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            {renderChevron('right')}
        </div>
    );
};

export default Pagination;
