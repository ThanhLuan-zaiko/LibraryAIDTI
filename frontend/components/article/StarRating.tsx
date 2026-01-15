'use client';

import React, { useState, useEffect } from 'react';
import { HiStar, HiOutlineStar } from 'react-icons/hi';
import { articleService } from '@/services/article.service';
import { useAuth } from '@/hooks/useAuth';

interface StarRatingProps {
    articleId: string;
    initialAvg?: number;
    initialCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ articleId, initialAvg = 0, initialCount = 0 }) => {
    const { user } = useAuth();
    const [rating, setRating] = useState<number | null>(null);
    const [hover, setHover] = useState<number | null>(null);
    const [stats, setStats] = useState({ average: initialAvg, count: initialCount });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

    useEffect(() => {
        const fetchRating = async () => {
            try {
                const data = await articleService.getArticleRating(articleId);
                setStats({ average: data.average, count: data.count });
                setRating(data.user_rating);
            } catch (error) {
                console.error('Error fetching rating:', error);
            }
        };

        if (articleId) fetchRating();
    }, [articleId, user]);

    const handleRate = async (score: number) => {
        if (!user) {
            setMessage({ text: 'Vui lòng đăng nhập để đánh giá bài viết!', type: 'info' });
            return;
        }

        try {
            setLoading(true);
            await articleService.rateArticle(articleId, score);
            setRating(score);

            // Re-fetch stats to get accurate average
            const data = await articleService.getArticleRating(articleId);
            setStats({ average: data.average, count: data.count });

            setMessage({ text: 'Cảm ơn bạn đã đánh giá!', type: 'success' });
            setTimeout(() => setMessage(null), 3000);
        } catch (error: any) {
            setMessage({ text: error.response?.data?.error || 'Đã có lỗi xảy ra', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/40 backdrop-blur-md border border-gray-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Đánh giá bài viết</h3>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center text-yellow-500">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span key={star}>
                                    {stats.average >= star ? (
                                        <HiStar className="w-5 h-5" />
                                    ) : stats.average >= star - 0.5 ? (
                                        <div className="relative">
                                            <HiOutlineStar className="w-5 h-5 text-gray-300" />
                                            <div className="absolute top-0 left-0 overflow-hidden w-[50%]">
                                                <HiStar className="w-5 h-5" />
                                            </div>
                                        </div>
                                    ) : (
                                        <HiOutlineStar className="w-5 h-5 text-gray-300" />
                                    )}
                                </span>
                            ))}
                        </div>
                        <span className="text-lg font-black text-gray-900">{stats.average.toFixed(1)}</span>
                        <span className="text-sm text-gray-400 font-medium">({stats.count} lượt đánh giá)</span>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(null)}
                                onClick={() => handleRate(star)}
                                disabled={loading}
                                className={`p-1 transition-all duration-200 hover:scale-110 active:scale-95 ${loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                            >
                                {(hover || rating || 0) >= star ? (
                                    <HiStar className={`w-8 h-8 ${hover ? 'text-yellow-400' : 'text-yellow-500'} drop-shadow-sm`} />
                                ) : (
                                    <HiOutlineStar className="w-8 h-8 text-gray-300 hover:text-yellow-200" />
                                )}
                            </button>
                        ))}
                    </div>
                    {message && (
                        <p
                            className={`text-sm font-bold tracking-tight uppercase animate-in fade-in slide-in-from-bottom-2 duration-300 ${message.type === 'success' ? 'text-emerald-600' :
                                message.type === 'error' ? 'text-rose-600' : 'text-blue-600'
                                }`}
                        >
                            {message.text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StarRating;
