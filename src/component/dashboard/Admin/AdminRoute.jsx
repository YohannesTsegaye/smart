import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};
///ghjkl
export default AdminRoute;