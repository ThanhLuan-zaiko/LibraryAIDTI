export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Articles</p>
                    <h3 className="text-3xl font-bold mt-2">128</h3>
                    <p className="text-xs text-green-600 mt-2">↑ 12% since last month</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Total Readers</p>
                    <h3 className="text-3xl font-bold mt-2">45.2k</h3>
                    <p className="text-xs text-green-600 mt-2">↑ 5.4% since last week</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Categories</p>
                    <h3 className="text-3xl font-bold mt-2">8</h3>
                    <p className="text-xs text-gray-400 mt-2">No changes</p>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Pending Posts</p>
                    <h3 className="text-3xl font-bold mt-2">3</h3>
                    <p className="text-xs text-yellow-600 mt-2">Needs review</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                    <h4 className="font-bold text-gray-800 mb-4">Recent Activity</h4>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-600">Admin published "New Tech Trends 2024"</p>
                                <p className="text-xs text-gray-400 italic">2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-600">New user "John Doe" registered</p>
                                <p className="text-xs text-gray-400 italic">5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
                            <div>
                                <p className="text-sm text-gray-600">Draft "Holiday Season Recipes" updated</p>
                                <p className="text-xs text-gray-400 italic">1 day ago</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[400px]">
                    <h4 className="font-bold text-gray-800 mb-4">Quick Shortcuts</h4>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <button className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-blue-500 hover:text-blue-500 transition-all text-sm font-semibold">
                            + New Article
                        </button>
                        <button className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-green-500 hover:text-green-500 transition-all text-sm font-semibold">
                            + New Category
                        </button>
                        <button className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-purple-500 hover:text-purple-500 transition-all text-sm font-semibold">
                            Manage Users
                        </button>
                        <button className="p-4 border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-500 hover:text-orange-500 transition-all text-sm font-semibold">
                            Site Settings
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
