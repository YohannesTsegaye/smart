const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Welcome to the Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Total Jobs</h2>
            <p className="text-2xl font-semibold text-blue-800 mt-1">42</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Applications</h2>
            <p className="text-2xl font-semibold text-green-700 mt-1">128</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Active Admins</h2>
            <p className="text-2xl font-semibold text-purple-700 mt-1">5</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-500">Reports Generated</h2>
            <p className="text-2xl font-semibold text-red-600 mt-1">17</p>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-700">Recent Job Posts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted On</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Frontend Developer</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Engineering</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">May 2, 2025</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium">Open</td>
                </tr>
                <tr>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">UI/UX Designer</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Design</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">Apr 28, 2025</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-yellow-600 font-medium">Pending</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;