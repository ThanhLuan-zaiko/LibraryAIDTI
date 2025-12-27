import apiClient from './api';

const TAGS_URL = '/tags';

export interface Tag {
    id: string;
    name: string;
    slug: string;
}

export interface TagStats {
    id: string;
    name: string;
    slug: string;
    usage_count: number;
}

export const tagService = {
    async getAll() {
        const response = await apiClient.get<Tag[]>(TAGS_URL);
        return response.data;
    },

    async getStats() {
        const response = await apiClient.get<TagStats[]>(`${TAGS_URL}/stats`);
        return response.data;
    },

    async getById(id: string) {
        const response = await apiClient.get<Tag>(`${TAGS_URL}/${id}`);
        return response.data;
    },

    async create(data: Partial<Tag>) {
        const response = await apiClient.post<Tag>(TAGS_URL, data);
        return response.data;
    },

    async update(id: string, data: Partial<Tag>) {
        const response = await apiClient.put<Tag>(`${TAGS_URL}/${id}`, data);
        return response.data;
    },

    async delete(id: string) {
        const response = await apiClient.delete(`${TAGS_URL}/${id}`);
        return response.data;
    }
};
