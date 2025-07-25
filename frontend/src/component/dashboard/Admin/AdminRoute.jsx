import { Navigate, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Function to check if JWT token is expired
  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  // Function to validate token with backend
  const validateToken = async (token) => {
    try {
      const response = await axios.get('http://localhost:5000/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.status === 200;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('access_token');
      const user = localStorage.getItem('user');
      const isAdmin = localStorage.getItem('isAdmin');

      // Check if all required authentication data exists
      if (!token || !user || isAdmin !== 'true') {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Check if token is expired
      if (isTokenExpired(token)) {
        // Clear invalid data
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        localStorage.removeItem('isAdmin');
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const userData = JSON.parse(user);
        // Check if user has admin role
        if (userData.role !== 'admin' && userData.role !== 'super_admin') {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Check if user status is Active
        if (userData.status && userData.status !== 'Active') {
          // Clear authentication data for inactive users
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
          localStorage.removeItem('isAdmin');
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Validate token with backend (optional - can be removed if backend doesn't have this endpoint)
        // const isValid = await validateToken(token);
        // if (!isValid) {
        //   setIsAuthenticated(false);
        //   setIsLoading(false);
        //   return;
        // }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;