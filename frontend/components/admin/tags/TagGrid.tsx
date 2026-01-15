import { Tag } from "@/services/tag.service";
import { FiEdit2, FiTrash2, FiTag, FiHash } from "react-icons/fi";

interface TagGridProps {
    tags: Tag[];
    loading: boolean;
    limit?: number;
    onEdit: (tag: Tag) => void;
    onDelete: (id: string) => void;
}

export default function TagGrid({ tags, loading, limit = 12, onEdit, onDelete }: TagGridProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(limit)].map((_, i) => (
                    <div key={i} className="p-4 border border-gray-100 rounded-2xl bg-gray-50/50 animate-pulse h-32 flex flex-col justify-between">
                        <div className="w-8 h-8 bg-gray-200 rounded-lg"></div>
                        <div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (tags.length === 0) {
        return (
            <div className="py-20 text-center text-gray-400">
                <div className="bg-gray-50 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <FiTag size={32} className="opacity-20" />
                </div>
                <p className="text-gray-500 font-medium">Không tìm thấy thẻ nào.</p>
                <p className="text-sm mt-1">Hãy thử thay đổi từ khóa hoặc bộ lọc tìm kiếm.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags.map((tag) => (
                <div key={tag.id} className="group p-4 border border-gray-100 rounded-2xl hover:border-purple-200 hover:bg-purple-50/30 transition-all flex flex-col justify-between h-32">
                    <div className="flex justify-between items-start">
                        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
                            <FiHash size={18} />
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEdit(tag)} className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-md transition-colors">
                                <FiEdit2 size={14} />
                            </button>
                            <button onClick={() => onDelete(tag.id)} className="p-1.5 text-red-600 hover:bg-red-100 rounded-md transition-colors">
                                <FiTrash2 size={14} />
                            </button>
                        </div>
                    </div>
                    <div>
                        <p className="font-bold text-gray-800">{tag.name}</p>
                        <p className="text-xs text-gray-400">#{tag.slug}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
