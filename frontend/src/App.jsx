import Job from "./main function/jobs/jobs";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdminLayout from "./component/dashboard/Admin/AdminLayout ";
import AdminRoute from "./component/dashboard/Admin/AdminRoute";
import DashboardHome from "./component/dashboard/Admin/Dashboard";
import Settings from "./component/dashboard/Admin/Settings";
import Candidates from "./component/dashboard/Admin/Candidates";
import ManageJobs from "./component/dashboard/Admin/ManageJobs";
import Reports from "./component/dashboard/Admin/GenerateReports";
import AdminProfile from "./component/dashboard/Admin/AdminProfile";
import ManageAdmins from "./component/dashboard/Admin/ManageAdmins";
import Home from "./layout/home";
import Login from "./component/auth/login";
import ForgotPassword from "./component/auth/ForgotPassword";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: 2000, // Refetch every 2 seconds
      refetchOnWindowFocus: false,
      staleTime: 0,
    },
  },
});

function App() {
  // Check authentication on app startup
  useEffect(() => {
    const checkAuthOnStartup = () => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      const isAdmin = localStorage.getItem('isAdmin');

      // If any authentication data is missing, clear all
      if (!token || !user || isAdmin !== 'true') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        return;
      }

      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        if (payload.exp < currentTime) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAdmin');
          return;
        }

        // Check if user status is Active
        const userData = JSON.parse(user);
        if (userData.status && userData.status !== 'Active') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAdmin');
          return;
        }
      } catch (error) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
      }
    };

    checkAuthOnStartup();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
      <Router>
        <div className="min-h-screen bg-gray-50">
          <ToastContainer
            position="top-right"
            autoClose={1000}
            hideProgressBar={true}
            closeOnClick
            pauseOnHover={false}
            draggable={false}
            theme="colored"
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Job />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/admin" element={<AdminRoute />}>
              <Route element={<AdminLayout />}>
              <Route
                index
                element={<Navigate to="/admin/dashboard" replace />}
              />
              <Route path="dashboard" element={<DashboardHome />} />
              <Route path="jobs" element={<ManageJobs />} />
              <Route path="candidates" element={<Candidates />} />
              <Route path="admins" element={<ManageAdmins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="reports" element={<Reports />} />
              <Route path="profile" element={<AdminProfile />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
