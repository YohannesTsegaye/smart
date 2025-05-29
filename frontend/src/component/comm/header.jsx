// Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand Name - Link to home */}
        <Link to="/" className="flex items-center space-x-2">
          {/* Replace with your actual logo */}
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
            SR
          </div>
          <h1 className="text-xl font-bold text-gray-800">Smart Recurrent</h1>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-6">
          <Link 
            to="/Jobs" 
            className="text-gray-600 hover:text-blue-500 transition-colors duration-200 font-medium"
          >
            Jobs
          </Link>
          <Link 
            to="/login" 
            className="bg-black-500 hover:bg-white-600 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium"
          >
            HR Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;