import { useState, useEffect, useCallback } from 'react';
import { articleService, Article, Pagination } from '@/services/article.service';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/hooks/useAuth'; // Assuming integration with auth/socket

export function useArticleLogic() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 10, total: 0 });

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    const debouncedSearch = useDebounce(searchQuery, 500);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await articleService.getList({
                page: pagination.page,
                limit: pagination.limit,
                search: debouncedSearch,
                status: statusFilter,
                category_id: categoryFilter
            });
            setArticles(res.data);
            setPagination(res.meta);
        } catch (error) {
            console.error("Failed to fetch articles", error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, debouncedSearch, statusFilter, categoryFilter]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // WebSocket Integration
    const { socket } = useAuth();
    useEffect(() => {
        if (!socket) return;

        const handleMessage = (event: MessageEvent) => {
            try {
                const data = JSON.parse(event.data);
                if (['article_created', 'article_updated', 'article_deleted', 'article_status_changed'].includes(data.type)) {
                    fetchData();
                }
            } catch (e) {
                console.error("WS parse error in ArticleLogic", e);
            }
        };

        socket.addEventListener('message', handleMessage);

        return () => {
            socket.removeEventListener('message', handleMessage);
        };
    }, [socket, fetchData]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, page }));
    };

    const handleLimitChange = (limit: number) => {
        setPagination(prev => ({ ...prev, limit, page: 1 }));
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    return {
        articles,
        loading,
        pagination,
        searchQuery,
        statusFilter,
        categoryFilter,
        handleSearch,
        handlePageChange,
        handleLimitChange,
        handleStatusFilter,
        setCategoryFilter,
        refreshData: fetchData
    };
}
