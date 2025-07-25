import { useState, useEffect } from "react";
import { DashboardService } from "../../../services/dashboard.service";
import { toast } from "react-hot-toast";
import CandidateStats from "./CandidateStats";
import JobStats from "./JobStats";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0,
    newToday: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await DashboardService.getStats();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    // Refresh stats every 5 minutes
    const interval = setInterval(fetchStats, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const statCards = [
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: "💼",
      color: "bg-blue-100 text-blue-800",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      icon: "✨",
      color: "bg-green-100 text-green-800",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: "📝",
      color: "bg-purple-100 text-purple-800",
    },
    {
      title: "New Today",
      value: stats.newToday,
      icon: "🆕",
      color: "bg-yellow-100 text-yellow-800",
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Dashboard Overview</h1>

      {/* Main Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? // Loading skeletons for stats cards
            Array(4)
              .fill(0)
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))
          : // Actual stats cards
            statCards.map((stat) => (
              <div
                key={stat.title}
                className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </h3>
                    <p className="mt-2 text-3xl font-semibold text-black">
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-2xl">{stat.icon}</span>
                </div>
                <div
                  className={`mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${stat.color}`}
                >
                  {stat.title === "New Today"
                    ? "Today's Applications"
                    : stat.title === "Active Jobs"
                    ? "Currently Active"
                    : stat.title === "Total Jobs"
                    ? "All Time"
                    : "Total Applications"}
                </div>
              </div>
            ))}
      </div>

      {/* Candidate Statistics */}
      <CandidateStats />

      {/* Job Statistics */}
      <JobStats />

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4 text-black">
          Recent Activity
        </h2>
        <div className="space-y-4 text-black">
          {[
            "Job posted",
            "Application received",
            "Job edited",
            "Report generated",
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-center border-b pb-3 last:border-0"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                {["📝", "📩", "✏️", "📊"][i]}
              </div>
              <div>
                <p className="text-black">{activity}</p>
                <p className="text-sm text-black">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
