import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/comm/header';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4 sm:p-8">
        <div className="max-w-2xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-6">
            Browse thousands of job openings from top companiesss.
          </p>
          <button
            onClick={() => navigate('/Jobs')} // Changed to lowercase for consistency
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 sm:px-6 sm:py-3 rounded-md transition-colors duration-200 font-medium"
          >
            Browse Jobs
          </button>
        </div>
      </main>
    </div>
  );
}