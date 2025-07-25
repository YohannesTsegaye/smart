import { useState, useEffect } from "react";
import JobsService from "../../../services/jobs.service";
import { toast } from "react-hot-toast";

const JobStats = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    byJobType: {},
    byDepartment: {},
    byStatus: {},
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('http://localhost:5000/job-posts/stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching job stats:", error);
        toast.error("Failed to load job statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Define job type colors and icons
  const jobTypeConfig = {
    "Full-time": {
      color: "bg-blue-100 text-blue-800",
      icon: "💼",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    "Part-time": {
      color: "bg-green-100 text-green-800",
      icon: "⏰",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    "Contract": {
      color: "bg-purple-100 text-purple-800",
      icon: "📋",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    "Internship": {
      color: "bg-yellow-100 text-yellow-800",
      icon: "🎓",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
    "Freelance": {
      color: "bg-orange-100 text-orange-800",
      icon: "🆓",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  };

  // Calculate percentages
  const calculatePercentage = (count) => {
    if (stats.totalJobs === 0) return 0;
    return ((count / stats.totalJobs) * 100).toFixed(1);
  };

  // Get top departments
  const topDepartments = Object.entries(stats.byDepartment || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-black">Job Statistics</h2>
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
        <h2 className="text-xl font-semibold mb-4 text-black">Job Statistics</h2>
        
        {/* Total Jobs Card */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Total Jobs</h3>
              <p className="text-3xl font-bold">{stats.totalJobs.toLocaleString()}</p>
              <p className="text-sm opacity-90">{stats.activeJobs} Active Jobs</p>
            </div>
            <span className="text-4xl">💼</span>
          </div>
        </div>

        {/* Job Type Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(jobTypeConfig).map(([jobType, config]) => {
            const count = stats.byJobType[jobType] || 0;
            const percentage = calculatePercentage(count);
            
            return (
              <div
                key={jobType}
                className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl">{config.icon}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                    {count}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-gray-900 mb-1">{jobType}</h3>
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

      {/* Status Breakdown */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4 text-black">Job Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-green-900">Active Jobs</h4>
                <p className="text-2xl font-bold text-green-800">{stats.activeJobs}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-700">
                {calculatePercentage(stats.activeJobs)}% of total jobs
              </span>
            </div>
          </div>
          
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-red-900">Inactive Jobs</h4>
                <p className="text-2xl font-bold text-red-800">{stats.totalJobs - stats.activeJobs}</p>
              </div>
              <span className="text-3xl">⏸️</span>
            </div>
            <div className="mt-2">
              <span className="text-xs text-red-700">
                {calculatePercentage(stats.totalJobs - stats.activeJobs)}% of total jobs
              </span>
            </div>
          </div>
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
                      <p className="text-sm text-gray-600">{count} jobs</p>
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

export default JobStats; 