import { CategoryHierarchyStats } from "@/services/dashboard.service";
import { FiFolder, FiGitBranch, FiLayers, FiTrendingUp } from "react-icons/fi";

interface CategoryHierarchyStatsProps {
    stats: CategoryHierarchyStats;
}

export default function CategoryHierarchyStatsComponent({ stats }: CategoryHierarchyStatsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                title="Danh mục gốc"
                value={stats.root_count}
                icon={<FiFolder size={24} />}
                color="bg-blue-100 text-blue-600"
                description="Root categories"
            />
            <StatCard
                title="Danh mục con"
                value={stats.child_count}
                icon={<FiGitBranch size={24} />}
                color="bg-green-100 text-green-600"
                description="Child categories"
            />
            <StatCard
                title="Trung bình con/cha"
                value={stats.avg_children.toFixed(1)}
                icon={<FiLayers size={24} />}
                color="bg-purple-100 text-purple-600"
                description="Average children per parent"
            />
            <StatCard
                title="Độ sâu tối đa"
                value={stats.max_depth}
                icon={<FiTrendingUp size={24} />}
                color="bg-orange-100 text-orange-600"
                description="Maximum depth level"
            />
        </div>
    );
}

function StatCard({
    title,
    value,
    icon,
    color,
    description
}: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    description: string;
}) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{title}</p>
                <h4 className="text-2xl font-bold text-gray-800 mt-1">{value}</h4>
                <p className="text-xs text-gray-400 mt-1">{description}</p>
            </div>
        </div>
    );
}
