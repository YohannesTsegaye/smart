import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../component/comm/header';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-white p-8 w-full overflow-x-hidden">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-4">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Browse thousands of job openings from top companies.
          </p>
          <button
            onClick={() => navigate('/Job')}
            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition"
          >
            Browse Jobs
          </button>
        </div>
      </div>
    </>
  );
}