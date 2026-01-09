import React from 'react';

interface SeoPreviewProps {
    title: string;
    description: string;
    slug: string;
    siteName?: string;
}

const SeoPreview: React.FC<SeoPreviewProps> = ({
    title,
    description,
    slug,
    siteName = 'Library AI DTI'
}) => {
    // Truncate function similar to Google
    const truncate = (str: string, maxLength: number) => {
        if (!str) return '';
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    };

    const finalTitle = title ? `${title} | ${siteName}` : `Tiêu đề bài viết | ${siteName}`;
    const finalDesc = description || "Mô tả bài viết sẽ xuất hiện ở đây...";
    // Construct full URL (simulation)
    const url = `https://library.aidti.hochiminh.vn/articles/${slug || 'tieu-de-bai-viet'}`;

    // Simulate breadcrumb
    const breadcrumbs = `library.aidti.hochiminh.vn › articles › ${slug || 'tieu-de-bai-viet'}`;

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 font-sans">
            <div className="mb-1 flex items-center">
                <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center mr-2 text-xs text-gray-500 overflow-hidden">
                    <img src="/logo.png" alt="Icon" className="w-full h-full object-cover opacity-60" onError={(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjOUNBM0FGIiBzdHJva2Utd2lkdGg9IjIiPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTIiIHI9IjEwIiAvPjwvc3ZnPg=='} />
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-800 font-medium">Library AI DTI</span>
                    <span className="text-[11px] text-slate-500 truncate max-w-[250px] leading-tight">{url}</span>
                </div>
            </div>
            <h3 className="text-[#1a0dab] text-xl font-medium cursor-pointer hover:underline truncate leading-snug">
                {truncate(finalTitle, 60)}
            </h3>
            <div className="text-sm text-[#4d5156] mt-1 leading-snug">
                {/* Date simulation if needed: <span className="text-[#70757a]">5 ngày trước — </span> */}
                {truncate(finalDesc, 160)}
            </div>
        </div>
    );
};

export default SeoPreview;
