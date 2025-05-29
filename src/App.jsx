import './index.css';
import Job from './main function/jobs/jobs';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './component/dashboard/Admin/AdminLayout ';
// import AddJob from './component/dashboard/Admin/AddJob';
import DashboardHome from './component/dashboard/Admin/Dashboard';
import Settings from './component/dashboard/Admin/Settings';
import Candidates from './component/dashboard/Admin/Candidates';
import ManageJobs from './component/dashboard/Admin/ManageJobs';
import Reports from './component/dashboard/Admin/GenerateReports';
import Home from './layout/home';
import Login from './component/auth/login';
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        
        <Routes>
          <Route index element={<Home />} />
          <Route path="/jobs" element={<Job />} />
          <Route path="/login" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="jobs" element={<ManageJobs />} />
          {/* <Route path="add-job" element={<AddJob />} /> */}
          <Route path="candidates" element={<Candidates />} />
          <Route path="settings" element={<Settings />} />
          <Route path="reports" element={<Reports />} />
          </Route>
        <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
