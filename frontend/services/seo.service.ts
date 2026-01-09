import apiClient from './api';

export interface SeoRedirect {
    id: string;
    from_slug: string;
    to_slug: string;
    created_at: string;
}

export interface ArticleSeoRedirect {
    id: string;
    article_id: string;
    from_slug: string;
    to_slug: string;
    created_at: string;
    article?: {
        title: string;
        slug: string;
    };
}

export const seoService = {
    async getRedirects(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: SeoRedirect[]; total: number; page: number; limit: number }> {
        const response = await apiClient.get('/seo/redirects', { params });
        return response.data;
    },

    async getArticleRedirects(params?: { page?: number; limit?: number; search?: string }): Promise<{ data: ArticleSeoRedirect[], total: number, page: number, limit: number }> {
        const response = await apiClient.get('/seo/article-redirects', { params });
        return response.data;
    },

    async getSeoTrends(months: number = 6): Promise<{ data: { date: string; redirects: number; articles: number }[] }> {
        const response = await apiClient.get('/seo/trends', { params: { months } });
        return response.data;
    },

    async createRedirect(fromSlug: string, toSlug: string): Promise<void> {
        await apiClient.post('/seo/redirects', { from_slug: fromSlug, to_slug: toSlug });
    },

    async deleteRedirect(id: string): Promise<void> {
        await apiClient.delete(`/seo/redirects/${id}`);
    },

    async updateRedirect(id: string, fromSlug: string, toSlug: string): Promise<void> {
        await apiClient.put(`/seo/redirects/${id}`, { from_slug: fromSlug, to_slug: toSlug });
    },

    async getSeoStats(): Promise<any> {
        const response = await apiClient.get('/admin/super-dashboard');
        return response.data;
    }
};
