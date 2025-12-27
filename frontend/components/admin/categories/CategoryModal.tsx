import { useState, useEffect } from "react";
import { Category, categoryService } from "@/services/category.service";
import { FiChevronDown } from "react-icons/fi";

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingCategory: Category | null;
    allCategories: Category[];
}

export default function CategoryModal({
    isOpen,
    onClose,
    onSuccess,
    editingCategory,
    allCategories
}: CategoryModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        parent_id: "" as string | undefined,
        description: "",
        is_active: true
    });

    useEffect(() => {
        if (editingCategory) {
            setFormData({
                name: editingCategory.name,
                slug: editingCategory.slug,
                parent_id: editingCategory.parent_id || "",
                description: editingCategory.description || "",
                is_active: editingCategory.is_active
            });
        } else {
            setFormData({
                name: "",
                slug: "",
                parent_id: "",
                description: "",
                is_active: true
            });
        }
    }, [editingCategory, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                parent_id: formData.parent_id === "" ? undefined : formData.parent_id
            };

            if (editingCategory) {
                await categoryService.update(editingCategory.id, dataToSubmit);
            } else {
                await categoryService.create(dataToSubmit);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save category:", error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                        {editingCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-xl">
                        ✕
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Tên danh mục</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            placeholder="Ví dụ: Công nghệ, Đời sống..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Slug (Đường dẫn tĩnh)</label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 text-gray-500"
                            placeholder="Tự động tạo nếu để trống"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Danh mục cha</label>
                        <div className="relative">
                            <select
                                value={formData.parent_id}
                                onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white"
                            >
                                <option value="">Không có (Danh mục gốc)</option>
                                {allCategories
                                    .filter(c => editingCategory ? c.id !== editingCategory.id : true)
                                    .map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                            </select>
                            <FiChevronDown className="absolute right-4 top-3 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Mô tả</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                            placeholder="Mô tả ngắn về danh mục này..."
                        />
                    </div>
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="is_active" className="text-sm font-medium text-gray-700 cursor-pointer">Kích hoạt danh mục này</label>
                    </div>

                    <div className="pt-4 flex space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-sm"
                        >
                            {editingCategory ? "Cập nhật" : "Lưu danh mục"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
