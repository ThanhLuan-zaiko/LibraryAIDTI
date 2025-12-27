"use client";

import { FiGrid, FiList, FiGitBranch } from "react-icons/fi";

interface ViewToggleProps {
    viewMode: 'hierarchical' | 'flat' | 'tree';
    onChange: (mode: 'hierarchical' | 'flat' | 'tree') => void;
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
    return (
        <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
            <button
                onClick={() => onChange('flat')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'flat'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                title="Chế độ bảng phẳng"
            >
                <FiList size={16} />
                <span className="text-sm font-medium hidden sm:inline">Phẳng</span>
            </button>
            <button
                onClick={() => onChange('hierarchical')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'hierarchical'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                    }`}
                title="Chế độ phân cấp"
            >
                <FiGrid size={16} />
                <span className="text-sm font-medium hidden sm:inline">Phân cấp</span>
            </button>
            <button
                onClick={() => onChange('tree')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all ${viewMode === 'tree'
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/50 scale-105'
                    : 'text-gray-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-600'
                    }`}
                title="Chế độ cây - Xem cấu trúc phân cấp với đường kẻ"
            >
                <FiGitBranch size={16} className={viewMode === 'tree' ? 'animate-pulse' : ''} />
                <span className="text-sm font-medium hidden sm:inline">Cây</span>
            </button>
        </div>
    );
}
