import { useState, useEffect, useRef } from "react";
import { userService, User, Role } from "@/services/user.service";

export const useUserLogic = () => {
    // Data States
    const [users, setUsers] = useState<User[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total_rows: 0,
        total_pages: 0
    });
    const [loading, setLoading] = useState(true);

    // Filter States
    const [sortField, setSortField] = useState<string>("created_at");
    const [sortOrder, setSortOrder] = useState<string>("desc");
    const [searchQuery, setSearchQuery] = useState("");
    const [isActiveFilter, setIsActiveFilter] = useState<boolean | undefined>(undefined);
    const [roleFilter, setRoleFilter] = useState<string>("");

    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    // Initial Load & Real-time Listener
    useEffect(() => {
        fetchData();
        fetchRoles();

        const handleAdminUpdate = (event: any) => {
            const { module } = event.detail || {};
            if (module === 'users' || module === 'admin' || !module) {
                refreshData();
            }
        };

        window.addEventListener('admin-data-updated', handleAdminUpdate);
        return () => {
            window.removeEventListener('admin-data-updated', handleAdminUpdate);
        };
    }, []);

    const fetchData = async (
        page = pagination.page,
        search = searchQuery,
        limit = pagination.limit,
        sort = sortField,
        order = sortOrder,
        isActive = isActiveFilter,
        role = roleFilter
    ) => {
        try {
            setLoading(true);
            const result = await userService.getList({
                page,
                limit,
                search,
                sort,
                order,
                is_active: isActive,
                role
            });

            setUsers(result.data);
            setPagination({
                page: result.pagination.page,
                limit: result.pagination.limit,
                total_rows: result.pagination.total_rows,
                total_pages: result.pagination.total_pages
            });
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchRoles = async () => {
        try {
            const data = await userService.getRoles();
            setRoles(data);
        } catch (error) {
            console.error("Failed to fetch roles:", error);
        }
    };

    const handlePageChange = (newPage: number) => {
        if (newPage !== pagination.page) {
            fetchData(newPage);
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
        fetchData(1, searchQuery, newLimit);
    };

    const handleSort = (field: string) => {
        const newOrder = field === sortField && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(newOrder);
        fetchData(1, searchQuery, pagination.limit, field, newOrder);
    };

    const handleActiveFilter = (val: string) => {
        let active: boolean | undefined = undefined;
        if (val === "true") active = true;
        if (val === "false") active = false;

        setIsActiveFilter(active);
        fetchData(1, searchQuery, pagination.limit, sortField, sortOrder, active);
    };

    const handleRoleFilter = (role: string) => {
        setRoleFilter(role);
        fetchData(1, searchQuery, pagination.limit, sortField, sortOrder, isActiveFilter, role);
    };

    const refreshData = () => {
        fetchData(pagination.page, searchQuery, pagination.limit, sortField, sortOrder, isActiveFilter, roleFilter);
        fetchRoles();
    };

    return {
        users,
        roles,
        pagination,
        loading,
        searchQuery,
        sortField,
        sortOrder,
        isActiveFilter,
        roleFilter,
        handlePageChange,
        handleSearch,
        handleLimitChange,
        handleSort,
        handleActiveFilter,
        handleRoleFilter,
        refreshData
    };
};
