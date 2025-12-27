import apiClient from './api';
import { CategoryStats } from './category.service';
import { TagStats } from './tag.service';

const ANALYTICS_URL = '/admin/analytics';

export interface ArticleTrend {
    date: string;
    count: number;
}

export interface AnalyticsData {
    total_articles: number;
    total_views: number;
    total_comments: number;
    article_trend: ArticleTrend[];
    top_categories: CategoryStats[];
    top_tags: TagStats[];
}

export interface AdminStats {
    total_articles: number;
    total_readers: number;
    total_categories: number;
    pending_posts: number;
    article_trend: number;
    reader_trend: number;
}

export interface AdminActivity {
    id: string;
    type: string;
    content: string;
    timestamp: string;
    user: string;
}

export interface DashboardAnalytics {
    date: string;
    articles: number;
    views: number;
}

export interface CategoryDistribution {
    name: string;
    value: number;
}

export interface DashboardData {
    stats: AdminStats;
    activities: AdminActivity[];
    analytics: DashboardAnalytics[];
    category_distribution: CategoryDistribution[];
}

export const getDashboardData = async () => {
    const response = await apiClient.get<DashboardData>('/admin/dashboard');
    return response.data;
};

export const dashboardService = {
    async getAnalytics() {
        const response = await apiClient.get<AnalyticsData>(ANALYTICS_URL);
        return response.data;
    },

    async getHierarchyStats() {
        const response = await apiClient.get<CategoryHierarchyStats>(`${ANALYTICS_URL}/hierarchy/stats`);
        return response.data;
    },

    async getCategoryTree() {
        const response = await apiClient.get<CategoryTreeData>(`${ANALYTICS_URL}/hierarchy/tree`);
        return response.data;
    }
};

// Hierarchy-specific types
export interface CategoryHierarchyStats {
    root_count: number;
    child_count: number;
    avg_children: number;
    max_depth: number;
}

export interface CategoryNode {
    id: string;
    name: string;
    slug: string;
    article_count: number;
    level: number;
    children?: CategoryNode[];
}

export interface CategoryTreeData {
    roots: CategoryNode[];
}
