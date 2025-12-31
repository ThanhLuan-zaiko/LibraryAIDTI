"use client";

import React, { useEffect, useState } from 'react';
import ArticleEditor from '@/components/admin/articles/ArticleEditor';
import { useParams } from 'next/navigation';
import { articleService, Article } from '@/services/article.service';

const ArticleEditPage = () => {
    const params = useParams();
    const id = params?.id as string;
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchArticle = async () => {
            try {
                const data = await articleService.getById(id);
                setArticle(data);
            } catch (error) {
                console.error("Failed to load article", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id]);

    if (loading) return <div className="p-8 text-center text-gray-500">Đang tải dữ liệu bài viết...</div>;
    if (!article) return <div className="p-8 text-center text-red-500">Không tìm thấy bài viết.</div>;

    return <ArticleEditor articleId={id} initialData={article} />;
};

export default ArticleEditPage;
