import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const GenerateReports = () => {
  const [reportType, setReportType] = useState('monthly');
  
  const data = {
    monthly: [
      { name: 'Jan', jobs: 12, applications: 120 },
      { name: 'Feb', jobs: 18, applications: 150 },
      { name: 'Mar', jobs: 15, applications: 135 },
      { name: 'Apr', jobs: 22, applications: 180 },
      { name: 'May', jobs: 19, applications: 160 },
      { name: 'Jun', jobs: 25, applications: 210 },
    ],
    quarterly: [
      { name: 'Q1', jobs: 45, applications: 405 },
      { name: 'Q2', jobs: 66, applications: 550 },
      { name: 'Q3', jobs: 72, applications: 620 },
      { name: 'Q4', jobs: 58, applications: 490 },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Generate Reports</h1>
        <div className="flex space-x-2">
          <button
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-lg ${reportType === 'monthly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setReportType('quarterly')}
            className={`px-4 py-2 rounded-lg ${reportType === 'quarterly' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            Quarterly
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data[reportType]}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="jobs" fill="#3B82F6" name="Jobs Posted" />
              <Bar dataKey="applications" fill="#10B981" name="Applications" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Export Data</h2>
          <div className="space-y-3">
            <button className="w-full py-2 px-4 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors">
              Download as CSV
            </button>
            <button className="w-full py-2 px-4 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
              Download as PDF
            </button>
            <button className="w-full py-2 px-4 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-colors">
              Download as Excel
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total Jobs Posted</p>
              <p className="text-2xl font-bold">124</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Applications</p>
              <p className="text-2xl font-bold">1,245</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Applications per Job</p>
              <p className="text-2xl font-bold">10.2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateReports;