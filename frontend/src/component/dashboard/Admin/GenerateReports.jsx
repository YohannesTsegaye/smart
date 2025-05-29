import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", jobs: 5, applicants: 45 },
  { name: "Feb", jobs: 8, applicants: 62 },
  { name: "Mar", jobs: 12, applicants: 89 },
  { name: "Apr", jobs: 6, applicants: 51 },
  { name: "May", jobs: 9, applicants: 68 },
];

const Reports = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-black">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Statistics</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#8884d8" />
                <Bar dataKey="applicants" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Quick Actions
          </h2>
          <div className="space-y-4">
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition text-black">
              Download All Jobs Report
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition text-black">
              Export Applicants Data
            </button>
            <button className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition text-black">
              Generate Performance Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
