import apiClient from './api';

const USERS_URL = '/users';
const ROLES_URL = '/roles';

export interface Permission {
    id: string;
    code: string;
    description: string;
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions?: Permission[];
}

export interface User {
    id: string;
    email: string;
    full_name: string;
    avatar_url: string;
    is_active: boolean;
    email_verified: boolean;
    last_login_at: string | null;
    created_at: string;
    updated_at: string;
    roles?: Role[];
}

export interface RoleCount {
    role_name: string;
    count: number;
}

export interface UserStats {
    total_users: number;
    active_users: number;
    inactive_users: number;
    role_distribution: RoleCount[];
}

export interface Pagination {
    page: number;
    limit: number;
    total_rows: number;
    total_pages: number;
}

export interface PaginatedResult<T> {
    data: T[];
    pagination: Pagination;
}

export const userService = {
    async getList(params: {
        page: number;
        limit: number;
        search?: string;
        sort?: string;
        order?: string;
        is_active?: boolean;
        role?: string;
    }) {
        const response = await apiClient.get<PaginatedResult<User>>(USERS_URL, {
            params: {
                ...params,
                q: params.search,
            }
        });
        return response.data;
    },

    async getStats() {
        const response = await apiClient.get<UserStats>(`${USERS_URL}/stats`);
        return response.data;
    },

    async getById(id: string) {
        const response = await apiClient.get<User>(`${USERS_URL}/${id}`);
        return response.data;
    },

    async update(id: string, data: { full_name?: string; avatar_url?: string; is_active?: boolean }) {
        const response = await apiClient.put<{ message: string }>(`${USERS_URL}/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        const response = await apiClient.delete<{ message: string }>(`${USERS_URL}/${id}`);
        return response.data;
    },

    async assignRoles(userID: string, roleIDs: string[]) {
        const response = await apiClient.put<{ message: string }>(`${USERS_URL}/${userID}/roles`, { role_ids: roleIDs });
        return response.data;
    },

    async getRoles() {
        const response = await apiClient.get<Role[]>(ROLES_URL);
        return response.data;
    }
};
