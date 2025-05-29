import { useState } from 'react';

const DashboardHome = () => {
  const [stats] = useState({
    totalJobs: 24,
    activeJobs: 12,
    applications: 156,
    newToday: 8
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6  text-black">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 text-black">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 uppercase text-sm font-medium">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h3>
            <p className="text-3xl font-bold mt-2">{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4 text-black">
          {['Job posted', 'Application received', 'Job edited', 'Report generated']
            .map((activity, i) => (
              <div key={i} className="flex items-center border-b pb-3 last:border-0">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  {['📝', '📩', '✏️', '📊'][i]}
                </div>
                <div>
                  <p>{activity}</p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;