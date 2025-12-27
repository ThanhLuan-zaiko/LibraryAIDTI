import { useState, useEffect, useRef } from "react";
import { categoryService, Category } from "@/services/category.service";

export const useCategoryLogic = () => {
    // Data States
    const [categories, setCategories] = useState<Category[]>([]);
    const [allCategories, setAllCategories] = useState<Category[]>([]); // For Parent dropdown
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total_rows: 0,
        total_pages: 0
    });
    const [loading, setLoading] = useState(true);

    // Search State
    const [searchQuery, setSearchQuery] = useState("");
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Initial Load
    useEffect(() => {
        fetchData();
        fetchAllForDropdown();
    }, []);

    const fetchData = async (page = 1, search = "", limit = pagination.limit) => {
        try {
            setLoading(true);
            const result = await categoryService.getList({
                page,
                limit,
                search
            });
            setCategories(result.data);
            setPagination(prev => ({
                ...prev,
                page: result.pagination.page,
                limit: result.pagination.limit,
                total_rows: result.pagination.total_rows,
                total_pages: result.pagination.total_pages
            }));
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllForDropdown = async () => {
        try {
            const data = await categoryService.getAll();
            setAllCategories(data);
        } catch (error) {
            console.error("Failed to fetch all categories:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage !== pagination.page) {
            fetchData(newPage, searchQuery);
        }
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            fetchData(1, query); // Reset to page 1 on search
        }, 500);
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLimit = parseInt(e.target.value);
        setPagination(prev => ({ ...prev, limit: newLimit, page: 1 }));
        fetchData(1, searchQuery, newLimit);
    };

    const refreshData = () => {
        fetchData(pagination.page, searchQuery);
        fetchAllForDropdown();
    };

    return {
        categories,
        allCategories,
        pagination,
        loading,
        searchQuery,
        handlePageChange,
        handleSearch,
        handleLimitChange,
        refreshData
    };
};
