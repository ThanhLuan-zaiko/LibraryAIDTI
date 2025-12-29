'use client';

import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CategoryStats, categoryService } from '@/services/category.service';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function CategoryPieChart() {
    const [data, setData] = useState<CategoryStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const stats = await categoryService.getStats();
                setData(stats || []);
            } catch (error) {
                setError("Không thể tải dữ liệu thống kê.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="h-64 flex items-center justify-center text-gray-400">Loading chart...</div>;
    }

    if (data.length === 0) {
        return <div className="h-64 flex items-center justify-center text-gray-400">No data available</div>;
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Category vs Articles</h3>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data as any[]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }: { name?: string | number; percent?: number }) => `${name ?? ''} ${(percent ? percent * 100 : 0).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="article_count"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
