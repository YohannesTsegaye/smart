import React, { useState } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const SubmittedForm = ({ jobTitle, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center animate-fade-in">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <CheckCircleIcon className="h-10 w-10 text-green-600" />
        </div>
        <h3 className="mt-4 text-2xl font-bold text-gray-900">Application Submitted!</h3>
        <div className="mt-4">
          <p className="text-lg text-gray-600">
            Your application for <span className="font-semibold text-blue-600">{jobTitle}</span> has been received.
          </p>
          <p className="mt-2 text-gray-500">
            We'll review your submission and get back to you soon.
          </p>
        </div>
        <div className="mt-8">
          <button
            onClick={handleClose}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmittedForm;