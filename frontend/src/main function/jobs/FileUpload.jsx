import React, { useState } from "react";
import UploadIcon from "../../assets/icons/UploadIcon";
import { XCircle } from "lucide-react";

function FileUpload({ onBack, onSubmit, jobTitle }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    coverLetter: "",
    gpa: "",
    resumeLink: "",
    experience: "",
    skills: "",
  });
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    coverLetter: "",
    file: "",
    gpa: "",
    resumeLink: "",
    experience: "",
    skills: "",
  });

  // Experience options
  const experienceOptions = [
    "Entry Level (0-2 years)",
    "Junior (2-5 years)",
    "Mid-Level (5-8 years)",
    "Senior (8+ years)",
    "Lead (10+ years)",
    "Executive (15+ years)",
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
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
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Invalid file type. Please upload a PDF or Word document.",
      }));
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        file: "File too large. Maximum size is 5MB.",
      }));
      return;
    }

    setSelectedFile(file);
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setErrors((prev) => ({ ...prev, file: "" }));
    document.getElementById("file-input").value = "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "gpa") {
      const validatedValue = value.replace(/[^0-9.]/g, "");
      const numValue = parseFloat(validatedValue);
      if (!isNaN(numValue) && (numValue < 0.5 || numValue > 4.0)) {
        setErrors((prev) => ({
          ...prev,
          gpa: "GPA must be between 0.5 and 4.0",
        }));
      } else {
        setErrors((prev) => ({ ...prev, gpa: "" }));
      }
      setFormData((prev) => ({ ...prev, [name]: validatedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let isValid = true;
    const newErrors = {};

    // Validate full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
      isValid = false;
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Validate cover letter
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
      isValid = false;
    } else if (formData.coverLetter.length < 50) {
      newErrors.coverLetter = "Cover letter must be at least 50 characters";
      isValid = false;
    }

    // Validate GPA
    if (!formData.gpa.trim()) {
      newErrors.gpa = "GPA is required";
      isValid = false;
    } else {
      const gpaValue = parseFloat(formData.gpa);
      if (isNaN(gpaValue)) {
        newErrors.gpa = "Please enter a valid GPA";
        isValid = false;
      } else if (gpaValue < 0.5 || gpaValue > 4.0) {
        newErrors.gpa = "GPA must be between 0.5 and 4.0";
        isValid = false;
      }
    }

    // Validate file or resume link
    if (!selectedFile && !formData.resumeLink) {
      newErrors.file = "Please either upload your resume or provide a link";
      newErrors.resumeLink =
        "Please either upload your resume or provide a link";
      isValid = false;
    }

    // Validate resume link format if provided
    if (formData.resumeLink && !validateUrl(formData.resumeLink)) {
      newErrors.resumeLink = "Please enter a valid URL";
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      onSubmit({
        ...formData,
        file: selectedFile,
        jobTitle: jobTitle,
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-2 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-0">
        <h2 className="text-lg font-medium">Apply for {jobTitle}</h2>

        <button
          onClick={onBack}
          className="text-gray-500 hover:text-black text-2xl bg-red-500 border-b-2 border-black"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="John Doe"
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* GPA */}
          <div>
            <label
              htmlFor="gpa"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              GPA (0.5 - 4.0) *
            </label>
            <input
              type="text"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.gpa ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="3.5"
              inputMode="decimal"
            />
            {errors.gpa && (
              <p className="mt-1 text-sm text-red-600">{errors.gpa}</p>
            )}
          </div>

          {/* Resume Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Resume Upload or Link *
            </label>
            <div className="space-y-4">
              {/* File Upload */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-4 text-center ${
                  dragActive
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input
                  type="file"
                  id="file-input"
                  onChange={handleChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                />
                <label
                  htmlFor="file-input"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <UploadIcon className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600">
                    Drag and drop your resume or click to browse
                  </span>
                  <span className="text-xs text-gray-500 mt-1">
                    Supported formats: PDF, DOC, DOCX (Max 5MB)
                  </span>
                </label>
              </div>

              {/* Resume Link Input */}
              <div>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
                <div className="mt-4">
                  <label
                    htmlFor="resumeLink"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Resume Link
                  </label>
                  <input
                    type="url"
                    id="resumeLink"
                    name="resumeLink"
                    value={formData.resumeLink}
                    onChange={handleInputChange}
                    placeholder="https://example.com/your-resume"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm text-black ${
                      errors.resumeLink
                        ? "border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:ring-blue-500"
                    }`}
                  />
                  {errors.resumeLink && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.resumeLink}
                    </p>
                  )}
                </div>
              </div>

              {/* Selected File Display */}
              {selectedFile && (
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <span className="text-sm text-gray-600">
                    {selectedFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>
              )}
              {errors.file && !errors.resumeLink && (
                <p className="text-sm text-red-600">{errors.file}</p>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          <div>
            <label
              htmlFor="coverLetter"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Cover Letter * (Minimum 50 characters)
            </label>
            <textarea
              id="coverLetter"
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={5}
              className={`w-full px-3 py-2 border rounded-md ${
                errors.coverLetter ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Write your cover letter here..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.coverLetter.length}/50 characters (minimum)
            </p>
            {errors.coverLetter && (
              <p className="mt-1 text-sm text-red-600">{errors.coverLetter}</p>
            )}
          </div>

          {/* Experience Dropdown - Increased height */}
          <div>
            <label
              htmlFor="experience"
              className="block text-sm font-medium text-gray-700"
            >
              Experience Level *
            </label>
            <select
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 ${
                errors.experience ? "border-red-500" : ""
              }`}
            >
              <option value="">Select Experience Level</option>
              {experienceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {errors.experience && (
              <p className="mt-1 text-sm text-red-600">{errors.experience}</p>
            )}
          </div>

          {/* Skills Text Input - Increased height */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700"
            >
              Skills * (Separate with commas)
            </label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleInputChange}
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm ${
                errors.skills ? "border-red-500" : ""
              }`}
              placeholder="e.g., JavaScript, React, Node.js, Project Management"
            />
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="text-gray-500 hover:text-black text-2xl bg-red-500 border-b-2 border-black"
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
