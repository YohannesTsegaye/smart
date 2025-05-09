import { Link } from 'react-router-dom';
import {AuthContext}
const Header = () => {
  const { currentUser } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50">
      <nav className="container mx-auto px-6 h-full flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          JobPortal
        </Link>
        <div className="flex space-x-4">
          {currentUser?.isAdmin && (
            <Link 
              to="/admin"
              className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
            >
              Admin Panel
            </Link>
          )}
          <Link 
            to="/jobs" 
            className="text-gray-700 hover:text-blue-600 transition-colors px-3 py-2"
          >
            Jobs
          </Link>
          {/* Other navigation links */}
        </div>
      </nav>
    </header>
  );
};

export default Header;