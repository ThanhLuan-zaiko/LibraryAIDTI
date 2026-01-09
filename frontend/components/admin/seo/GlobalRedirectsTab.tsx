import React, { useEffect, useState } from 'react';
import { seoService, SeoRedirect } from '@/services/seo.service';
import { toast } from 'react-hot-toast';
import RedirectTable from '@/components/admin/seo/RedirectTable';
import RedirectForm from '@/components/admin/seo/RedirectForm';
import SeoStats from '@/components/admin/seo/SeoStats';
import SeoTips from '@/components/admin/seo/SeoTips';
import ConfirmModal from '@/components/admin/ConfirmModal';

export default function GlobalRedirectsTab() {
    const [redirects, setRedirects] = useState<SeoRedirect[]>([]);
    const [seoStats, setSeoStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    // ... items state
    const [newItem, setNewItem] = useState({ from: '', to: '' });
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Delete Modal State
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    // Pagination State
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(25);
    const [search, setSearch] = useState('');
    const [total, setTotal] = useState(0);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData();
        }, 300);
        return () => clearTimeout(timer);
    }, [page, limit, search]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [redirectsResponse, statsData] = await Promise.all([
                seoService.getRedirects({ page, limit, search }),
                seoService.getSeoStats()
            ]);

            setRedirects(redirectsResponse.data || []);
            setTotal(redirectsResponse.total || 0);
            setSeoStats(statsData?.advanced || {});

        } catch (error) {
            console.error(error);
            toast.error("Không thể tải dữ liệu SEO");
        } finally {
            setLoading(false);
        }
    };

    // ... handlers ...
    const handleSubmit = async () => {
        if (!newItem.from || !newItem.to) return;
        setIsSubmitting(true);
        try {
            if (editingId) {
                await seoService.updateRedirect(editingId, newItem.from, newItem.to);
                toast.success("Đã cập nhật redirect thành công");
                setEditingId(null);
            } else {
                await seoService.createRedirect(newItem.from, newItem.to);
                toast.success("Đã tạo redirect thành công");
            }
            setNewItem({ from: '', to: '' });
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.error || "Lỗi khi lưu redirect");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (redirect: SeoRedirect) => {
        setNewItem({ from: redirect.from_slug, to: redirect.to_slug });
        setEditingId(redirect.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewItem({ from: '', to: '' });
        setEditingId(null);
    };

    const handleDeleteClick = (id: string) => {
        setItemToDelete(id);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!itemToDelete) return;
        try {
            await seoService.deleteRedirect(itemToDelete);
            toast.success("Đã xóa redirect");
            setRedirects(prev => prev.filter(r => r.id !== itemToDelete));
            setTotal(prev => prev - 1);
        } catch (error) {
            toast.error("Lỗi khi xóa redirect");
        } finally {
            setDeleteModalOpen(false);
            setItemToDelete(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* SEO Health Cards - Now inside this tab */}
            <SeoStats stats={seoStats} loading={loading} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content: List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 flex items-start space-x-3 mb-4">
                        <div className="text-blue-500 mt-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </div>
                        <div className="text-sm text-blue-800">
                            <strong>Global Redirects</strong> là các chuyển hướng không gắn liền với bài viết cụ thể (ví dụ: các trang cũ, landing page, hoặc fix lỗi 404 từ hệ thống cũ).
                        </div>
                    </div>

                    <RedirectTable
                        redirects={redirects}
                        loading={loading}
                        onDelete={handleDeleteClick}
                        page={page}
                        setPage={setPage}
                        limit={limit}
                        setLimit={setLimit}
                        search={search}
                        setSearch={setSearch}
                        total={total}
                        onEdit={handleEdit}
                    />
                </div>

                {/* Sidebar: Add New & Tips */}
                <div className="space-y-6 sticky top-24 h-fit">
                    <RedirectForm
                        newItem={newItem}
                        setNewItem={setNewItem}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                        isEditing={!!editingId}
                        onCancel={handleCancelEdit}
                    />
                    <SeoTips />
                </div>
            </div>

            <ConfirmModal
                isOpen={deleteModalOpen}
                title="Xóa Redirect?"
                message="Bạn có chắc chắn muốn xóa redirect này không? Hành động này không thể hoàn tác."
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteModalOpen(false)}
                confirmText="Xóa Ngay"
                type="danger"
            />
        </div>
    );
}
