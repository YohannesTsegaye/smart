const AdminDashboard = () => {
  const stats = [
    { name: "Total Jobs", value: "124", change: "+12%", trend: "up" },
    { name: "Active Jobs", value: "89", change: "+5%", trend: "up" },
    { name: "Expired Jobs", value: "15", change: "-3%", trend: "down" },
    { name: "New Admins", value: "3", change: "+2", trend: "up" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
          >
            <h3 className="text-sm font-medium text-black">{stat.name}</h3>
            <div className="mt-2 flex items-baseline">
              <p className="text-3xl font-semibold text-black">{stat.value}</p>
              <span
                className={`ml-2 text-sm font-medium ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-black mb-4">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="flex items-start pb-4 border-b border-gray-100 last:border-0"
            >
              <div className="flex-shrink-0 mt-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  {item % 2 === 0 ? "👤" : "💼"}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-black">
                  {item % 2 === 0 ? "New admin added" : "Job listing updated"}
                </p>
                <p className="text-sm text-black">2 hours ago</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
