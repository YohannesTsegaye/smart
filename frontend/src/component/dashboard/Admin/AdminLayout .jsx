import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showStatusWarning, setShowStatusWarning] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get user data from localStorage
  const getUserData = () => {
    const userData = localStorage.getItem("user");
    if (userData) {
      return JSON.parse(userData);
    }
    return null;
  };

  const user = getUserData();

  // Check user status on component mount and when user data changes
  useEffect(() => {
    if (user && user.status && user.status !== 'Active') {
      setShowStatusWarning(true);
      // Auto-logout after 5 seconds
      setTimeout(() => {
        handleLogout();
      }, 5000);
    }
  }, [user]);

  const navItems = [
    { path: "/admin/dashboard", name: "Dashboard", icon: "📊" },
    { path: "/admin/jobs", name: "Manage Jobs", icon: "💼" },
    { path: "/admin/candidates", name: "Candidates", icon: "👤" },
    { path: "/admin/reports", name: "Reports", icon: "📈" },
    { path: "/admin/admins", name: "Manage Admins", icon: "👥" },
    { path: "/admin/settings", name: "Settings", icon: "⚙️" },
    { path: "/admin/profile", name: "My Profile", icon: "👤" },
  ];

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    
    // Redirect to jobs page
    window.location.href = "/jobs";
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Status Warning Banner */}
      {showStatusWarning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white p-4 text-center">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">⚠️</span>
            <span className="font-medium">
              Your account has been deactivated. You will be logged out automatically in 5 seconds.
            </span>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-800 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 flex items-center justify-between border-b border-blue-700">
          {sidebarOpen ? (
            <p className="text-xl font-bold">Admin Panel</p>
          ) : (
            <span className="text-xl"></span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-full hover:bg-blue-700"
          >
            {sidebarOpen ? "◀" : "▶"}
          </button>
        </div>
        <nav className="mt-4 flex-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center p-3 mx-2 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? "bg-blue-700"
                  : "hover:bg-blue-700"
              }`}
            >
              <span className="text-lg mr-3">{item.icon}</span>
              {sidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors ${
              sidebarOpen ? "justify-start" : "justify-center"
            }`}
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between p-4">
            <h2 className="text-xl font-semibold text-black">
              {navItems.find((item) => item.path === location.pathname)?.name ||
                "Admin Panel"}
            </h2>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/profile"
                className="flex items-center space-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
                  {user?.email?.charAt(0).toUpperCase() || "A"}
                </div>
                {sidebarOpen && (
                  <div className="text-right">
                    <div className="font-medium text-black text-sm">
                      {user?.role === "super_admin" ? "Super Admin" : "Admin"}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {user?.email || "admin@example.com"}
                    </div>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
