import React, { useState } from 'react';
import JobSearchComponent from './JobSearchComponent';
import BackIcon from '../../assets/Icons/BackIcon';
//import UploadIcon from "../../assets/Icons/UploadIcon";
import FileUpload from '../../assets/FileUpload';
const JobApplicationForm = ({ onBack, onSubmit, jobTitle }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    gpa: '',
    description: '',
    file: null
  });

  const [errors, setErrors] = useState({});
  const [fileStatus, setFileStatus] = useState({
    message: '',
    isError: false,
    fileName: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFileSelect = (file, error) => {
    if (error) {
      setFileStatus({ message: error, isError: true, fileName: '' });
      setFormData({ ...formData, file: null });
      setErrors({ ...errors, file: error });
    } else {
      setFileStatus({ message: 'File accepted', isError: false, fileName: file.name });
      setFormData({ ...formData, file });
      setErrors({ ...errors, file: '' });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.gpa) {
      newErrors.gpa = 'GPA is required';
    } else if (isNaN(formData.gpa)) {
      newErrors.gpa = 'GPA must be a number';
    } else if (formData.gpa > 4.0 || formData.gpa < 0) {
      newErrors.gpa = 'GPA must be between 0 and 4.0';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    if (!formData.file) {
      newErrors.file = 'Resume is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-white p-4 overflow-y-auto z-50">
      <button
        onClick={onBack}
        className="flex items-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg mb-6 transition-colors duration-200 shadow-md"
      >
        <BackIcon className="w-5 h-5 mr-2" />
        Back to Job Details
      </button>

      <div className="max-w-xl mx-auto">
        <h2 className="text-center text-xl font-bold text-gray-800 mb-1">
          Apply for: {jobTitle}
        </h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Please fill out the form below and attach your resume. Only PDF and Word files are accepted.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3 text-black`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number*
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3  text-black`}
              placeholder="+1 (123) 456-7890"
            />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
          </div>

          {/* GPA */}
          <div>
            <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-1">
              GPA (0–4.0)*
            </label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              step="0.01"
              min="0"
              max="4.0"
              value={formData.gpa}
              onChange={handleChange}
              className={`w-full border ${errors.gpa ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3  text-black`}
              placeholder="3.5"
            />
            {errors.gpa && <p className="text-sm text-red-600">{errors.gpa}</p>}
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 ">
              Resume (PDF or Word)*
            </label>
            <FileUpload 
              onFileSelect={handleFileSelect} 
              acceptedTypes=".pdf,.doc,.docx"
            />
            {fileStatus.message && (
              <p className={`mt-2 text-sm ${fileStatus.isError ? 'text-red-600' : 'text-green-600'}`}>
                {fileStatus.message}
              </p>
            )}
            {fileStatus.fileName && (
              <p className="text-gray-700 text-sm truncate">
                <strong>Selected file:</strong> {fileStatus.fileName}
              </p>
            )}
            {errors.file && <p className="text-sm text-red-600">{errors.file}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter/Description* <span className="text-xs text-gray-500">(min. 50 characters)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md py-2 px-3  text-black`}
              placeholder="Explain why you're a good fit for this position..."
            />
            {errors.description && <p className="text-sm text-red-600">{errors.description}</p>}
            <p className="text-xs text-gray-500 mt-1" >
              {formData.description.length}/50 characters
            </p>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md"
            disabled={Object.keys(errors).some(key => errors[key])}
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationForm;
