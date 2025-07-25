import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { CandidatesService } from "../../../services/candidates.service";
import { toast } from "react-hot-toast";
import JobStats from "./JobStats";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const downloadCsv = async (url, filename) => {
  const res = await fetch(url, { headers: { Authorization: undefined } });
  if (!res.ok) {
    alert('Failed to download report');
    return;
  }
  const blob = await res.blob();
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const Reports = () => {
  const [candidateStats, setCandidateStats] = useState({
    totalCandidates: 0,
    byStatus: {},
    byDepartment: {},
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('graphs'); // 'graphs' or 'numbers'

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await CandidatesService.getStats();
        setCandidateStats(data);
      } catch (error) {
        console.error("Error fetching candidate stats:", error);
        toast.error("Failed to load candidate statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Prepare data for charts
  const statusData = Object.entries(candidateStats.byStatus || {}).map(([status, count]) => ({
    name: status,
    value: count,
    count: count,
  }));

  const departmentData = Object.entries(candidateStats.byDepartment || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([department, count]) => ({
      name: department,
      candidates: count,
    }));

  const monthlyData = [
    { name: "Jan", jobs: 5, applicants: 45 },
    { name: "Feb", jobs: 8, applicants: 62 },
    { name: "Mar", jobs: 12, applicants: 89 },
    { name: "Apr", jobs: 6, applicants: 51 },
    { name: "May", jobs: 9, applicants: 68 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6 text-black">Reports & Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Candidates</h3>
              <p className="mt-2 text-3xl font-semibold text-black">
                {candidateStats.totalCandidates.toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">👥</span>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Under Review</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-600">
                {(candidateStats.byStatus["Under Review"] || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">👀</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Interview</h3>
              <p className="mt-2 text-3xl font-semibold text-purple-600">
                {(candidateStats.byStatus["Interview"] || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">🤝</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
    <div>
              <h3 className="text-sm font-medium text-gray-500">Call for Exam</h3>
              <p className="mt-2 text-3xl font-semibold text-yellow-600">
                {(candidateStats.byStatus["Call for exam"] || 0).toLocaleString()}
              </p>
            </div>
            <span className="text-2xl">📝</span>
          </div>
        </div>
      </div>

      {/* Job Statistics */}
      <JobStats />

      {/* Reports Section with Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('graphs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'graphs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📊 Visual Reports (Graphs)
            </button>
            <button
              onClick={() => setActiveTab('numbers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'numbers'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📈 Detailed Reports (Numbers & Text)
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'graphs' ? (
            /* Graphs Section */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Visual Analytics</h2>
              
              {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Candidate Status Distribution */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-black">Candidate Status Distribution</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Department Distribution */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4 text-black">Top Departments</h3>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={departmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" angle={-30} textAnchor="end" height={80} fontSize={12} />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="candidates" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Monthly Statistics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Monthly Statistics</h3>
                <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                      <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="jobs" fill="#8884d8" />
                <Bar dataKey="applicants" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
            </div>
          ) : (
            /* Numbers and Text Section */
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Detailed Analytics</h2>
              
              {/* Export Reports */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Export Reports</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
                    className="p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              onClick={() => downloadCsv('http://localhost:5000/job-posts/export/csv', 'jobs.csv')}
            >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">💼</span>
                      <div>
                        <p className="font-medium text-blue-900">Jobs Report</p>
                        <p className="text-sm text-blue-700">Export all job postings</p>
                      </div>
                    </div>
            </button>
                
            <button
                    className="p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
              onClick={() => downloadCsv('http://localhost:5000/candidates/export/csv', 'candidates.csv')}
            >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📊</span>
                      <div>
                        <p className="font-medium text-green-900">Candidates Report</p>
                        <p className="text-sm text-green-700">Export all candidates data</p>
                      </div>
                    </div>
            </button>
                
                  <button className="p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">📈</span>
                      <div>
                        <p className="font-medium text-purple-900">Performance Report</p>
                        <p className="text-sm text-purple-700">Generate detailed analytics</p>
                      </div>
                    </div>
            </button>
          </div>
              </div>

              {/* Detailed Status Table */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Detailed Status Breakdown</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-white">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Count
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Percentage
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(candidateStats.byStatus || {}).map(([status, count]) => {
                        const percentage = candidateStats.totalCandidates > 0 
                          ? ((count / candidateStats.totalCandidates) * 100).toFixed(1)
                          : 0;
                        
                        return (
                          <tr key={status}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <span className="text-lg mr-2">
                                  {status === "Under Review" ? "👀" :
                                   status === "Received" ? "📥" :
                                   status === "Accepted" ? "✅" :
                                   status === "Rejected" ? "❌" :
                                   status === "Interview" ? "🤝" :
                                   status === "Call for exam" ? "📝" : "📊"}
                                </span>
                                <span className="text-sm font-medium text-gray-900">{status}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {count.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {percentage}%
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="w-20 h-2 bg-gray-200 rounded-full">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Department Statistics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-black">Department Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(candidateStats.byDepartment || {})
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 6)
                    .map(([department, count]) => {
                      const percentage = candidateStats.totalCandidates > 0 
                        ? ((count / candidateStats.totalCandidates) * 100).toFixed(1)
                        : 0;
                      
                      return (
                        <div key={department} className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-lg">🏢</span>
                            <span className="text-sm font-medium text-gray-500">{percentage}%</span>
                          </div>
                          <h4 className="font-medium text-gray-900 mb-1">{department}</h4>
                          <p className="text-2xl font-bold text-blue-600">{count.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">candidates</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;