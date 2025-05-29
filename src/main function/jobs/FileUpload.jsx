import React, { useState } from 'react';
import UploadIcon from '../../assets/icons/UploadIcon';
import { XCircle } from 'lucide-react';

function FileUpload({ onBack, onSubmit, jobTitle }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    coverLetter: '',
    gpa: ''
  });
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    coverLetter: '',
    file: '',
    gpa: ''
  });

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateFile(e.target.files[0]);
    }
  };

  const validateFile = (file) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({...prev, file: 'Invalid file type. Please upload a PDF or Word document.'}));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({...prev, file: 'File too large. Maximum size is 5MB.'}));
      return;
    }

    setSelectedFile(file);
    setErrors(prev => ({...prev, file: ''}));
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrors(prev => ({...prev, file: ''}));
    document.getElementById('file-input').value = '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for GPA input
    if (name === 'gpa') {
      // Only allow numbers and decimal point
      const validatedValue = value.replace(/[^0-9.]/g, '');
      
      // Convert to number and check range
      const numValue = parseFloat(validatedValue);
      if (!isNaN(numValue) && (numValue < 0.5 || numValue > 4.0)) {
        setErrors(prev => ({...prev, gpa: 'GPA must be between 0.5 and 4.0'}));
      } else {
        setErrors(prev => ({...prev, gpa: ''}));
      }
      
      setFormData(prev => ({...prev, [name]: validatedValue}));
    } else {
      setFormData(prev => ({...prev, [name]: value}));
      
      // Clear error when user types
      if (errors[name]) {
        setErrors(prev => ({...prev, [name]: ''}));
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Validate cover letter
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
      isValid = false;
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = 'Cover letter must be at least 50 characters';
      isValid = false;
    }

    // Validate GPA
    if (!formData.gpa.trim()) {
      newErrors.gpa = 'GPA is required';
      isValid = false;
    } else {
      const gpaValue = parseFloat(formData.gpa);
      if (isNaN(gpaValue)) {
        newErrors.gpa = 'Please enter a valid GPA';
        isValid = false;
      } else if (gpaValue < 0.5 || gpaValue > 4.0) {
        newErrors.gpa = 'GPA must be between 0.5 and 4.0';
        isValid = false;
      }
    }

    // Validate file
    if (!selectedFile) {
      newErrors.file = 'Please upload your resume';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onSubmit({
        ...formData,
        file: selectedFile,
        jobTitle: jobTitle
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Apply for {jobTitle}</h2>
        <button 
          onClick={onBack}
          className="text-white hover:text-gray-700"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="John Doe"
            />
            {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="your.email@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* GPA */}
          <div>
            <label htmlFor="gpa" className="block text-sm font-medium text-gray-700 mb-1">
              GPA (0.5 - 4.0) *
            </label>
            <input
              type="text"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.gpa ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="3.5"
              inputMode="decimal"
            />
            {errors.gpa && <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>}
          </div>



          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume/CV *
            </label>
            <div 
              className="w-full"
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
            
              <label
                htmlFor="file-input"
                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                  dragActive 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <UploadIcon />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PDF or Word (MAX. 5MB)</p>
                </div>
                <input 
                  id="file-input" 
                  type="file" 
                  className="hidden" 
                  onChange={handleChange} 
                  accept=".pdf,.doc,.docx"
                />
              </label>
              

              {selectedFile && (
                <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <span className="text-sm text-gray-700 truncate max-w-[80%]">{selectedFile.name}</span>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700"
                    aria-label="Remove selected file"
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              )}
              {errors.file && <p className="mt-1 text-sm text-red-600">{errors.file}</p>}
            </div>
          </div>
                    {/* Cover Letter */}
          <div>
            <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter * (Minimum 50 characters)
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-3 py-2 border rounded-md ${errors.coverLetter ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Write your cover letter here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.coverLetter.length}/50 characters (minimum)
            </p>
            {errors.coverLetter && <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Submit Application
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;