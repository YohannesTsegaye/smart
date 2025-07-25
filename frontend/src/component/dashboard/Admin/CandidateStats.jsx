import { useState, useEffect } from "react";
import { CandidatesService } from "../../../services/candidates.service";
import { toast } from "react-hot-toast";

const CandidateStats = () => {
  const [stats, setStats] = useState({
    totalCandidates: 0,
    byStatus: {},
    byDepartment: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await CandidatesService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching candidate stats:", error);
        toast.error("Failed to load candidate statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Define status colors and icons
  const statusConfig = {
    "Under Review": {
      color: "bg-gray-100 text-gray-800",
      icon: "👀",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
    },
    "Received": {
      color: "bg-green-100 text-green-800",
      icon: "📥",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    "Accepted": {
      color: "bg-blue-100 text-blue-800",
      icon: "✅",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    "Rejected": {
      color: "bg-red-100 text-red-800",
      icon: "❌",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
    },
    "Interview": {
      color: "bg-purple-100 text-purple-800",
      icon: "🤝",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    "Call for exam": {
      color: "bg-yellow-100 text-yellow-800",
      icon: "📝",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  };

  // Calculate percentages
  const calculatePercentage = (count) => {
    if (stats.totalCandidates === 0) return 0;
    return ((count / stats.totalCandidates) * 100).toFixed(1);
  };

  // Get top departments
  const topDepartments = Object.entries(stats.byDepartment || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-black">Candidate Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Statistics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-black">Candidate Statistics</h2>
        
        {/* Total Candidates Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Total Candidates</h3>
              <p className="text-3xl font-bold">{stats.totalCandidates.toLocaleString()}</p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </div>

        {/* Status Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(statusConfig).map(([status, config]) => {
            const count = stats.byStatus[status] || 0;
            const percentage = calculatePercentage(count);
            
            return (
              <div
                key={status}
                className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    {count}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{status}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-600">{percentage}%</span>
                  <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${config.color.split(' ')[0]} transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department Breakdown */}
      {topDepartments.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-4 text-black">Top Departments</h3>
          <div className="space-y-3">
            {topDepartments.map(([department, count]) => {
              const percentage = calculatePercentage(count);
              return (
                <div key={department} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-lg mr-3">🏢</span>
                    <div>
                      <p className="font-medium text-gray-900">{department}</p>
                      <p className="text-sm text-gray-600">{count} candidates</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{percentage}%</span>
                    <div className="w-20 h-2 bg-gray-200 rounded-full mt-1">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidateStats; 