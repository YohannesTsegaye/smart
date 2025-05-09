import React, { useState } from 'react';
import UploadIcon from './Icons/UploadIcon';
import { XCircle } from 'lucide-react'; // Optional: icon for remove

function FileUpload({ onFileSelect, acceptedTypes }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

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
      onFileSelect(null, `Invalid file type. Please upload a PDF or Word document.`);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      onFileSelect(null, `File too large. Maximum size is 5MB.`);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file, null);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    onFileSelect(null, null);
    document.getElementById('file-input').value = ''; // Clear input value
  };

  return (
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
          accept={acceptedTypes}
        />
      </label>

      {selectedFile && (
        <div className="mt-2 flex items-center justify-between bg-gray-100 p-2 rounded-lg">
          <span className="text-sm text-gray-700 truncate max-w-[80%]">{selectedFile.name}</span>
          <button
            onClick={handleRemove}
            className="text-red-500 hover:text-red-700"
            aria-label="Remove selected file"
          >
            <XCircle size={20} />
          </button>
        </div>
      )}
    </div>
  );
}

export default FileUpload;
