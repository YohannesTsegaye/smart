import { useNavigate } from 'react-router-dom';

// Inside your component...
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('isAdmin');
  navigate('/login');
};

// Add this to your logout button
<button 
  onClick={handleLogout}
  className="flex items-center text-gray-500 hover:text-gray-700"
>
  <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  Logout
</button>