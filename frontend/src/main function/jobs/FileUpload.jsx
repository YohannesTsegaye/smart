import React, { useState } from "react";
import UploadIcon from "../../assets/icons/UploadIcon";
import { XCircle } from "lucide-react";
import { CandidatesService } from "../../services/candidates.service";

function FileUpload({ onBack, onSubmit, jobTitle, department, location }) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: localStorage.getItem('userEmail') || "",
    phoneNumber: "+251",
    coverLetter: "",
    gpa: "",
    resumeLink: "",
    experience: "",
    skills: "",
    department: department || "Engineering",
    location: location || "Ethiopia",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    coverLetter: "",
    file: "",
    gpa: "",
    resumeLink: "",
    experience: "",
    skills: "",
  });

  const experienceOptions = [
    "Entry Level (0-2 years)",
    "Junior (2-5 years)",
    "Mid-Level (5-8 years)",
    "Senior (8+ years)",
    "Lead (10+ years)",
    "Executive (15+ years)",
  ];

  const handleDrag = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setDragActive(true);
    } else if (event.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      validateFile(event.dataTransfer.files[0]);
    }
  };

  const handleChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      validateFile(event.target.files[0]);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Save email to localStorage when user starts typing
    if (name === 'email' && value.trim()) {
      localStorage.setItem('userEmail', value.trim());
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "phoneNumber") {
      // Ensure the phone number always starts with +251
      let phoneValue = value;
      if (!phoneValue.startsWith("+251")) {
        phoneValue = "+251" + phoneValue.replace(/^\+251/, "");
      }
      // Only allow numbers after +251
      phoneValue = phoneValue.replace(/[^+\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: phoneValue }));
      if (phoneValue.length !== 13) {
        setErrors((prev) => ({
          ...prev,
          [name]: "Phone number must be 9 digits after +251",
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (name === "gpa") {
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
    } else if (name === "fullName") {
      // Only allow letters and spaces for full name
      const nameValue = value.replace(/[^A-Za-z\s]/g, "");
      setFormData((prev) => ({ ...prev, [name]: nameValue }));
      if (!validateName(nameValue) && nameValue.trim()) {
        setErrors((prev) => ({
          ...prev,
          [name]:
            "Please enter a valid full name (only letters, at least first and last name)",
        }));
      } else {
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
    } catch {
      return false;
    }
  };

  const validateName = (name) => {
    // Only letters and spaces allowed, at least two words for full name
    const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)+$/;
    return nameRegex.test(name.trim());
  };

  const validateSkills = (skills) => {
    // Split by comma and trim each skill
    const skillsArray = skills.split(",").map((skill) => skill.trim());
    // Filter out empty strings and check if we have at least 2 valid skills
    const validSkills = skillsArray.filter((skill) => skill.length > 0);
    return validSkills.length >= 2;
  };

  const validateCoverLetter = (letter) => {
    // Minimum 50 chars, maximum 1000 chars, must contain complete sentences
    return (
      letter.trim().length >= 50 &&
      letter.trim().length <= 1000 &&
      /[.!?](\s|$)/.test(letter)
    ); // Checks for proper sentence ending
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Use validateForm function here
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if user has already applied to this job
      try {
        const checkResponse = await CandidatesService.checkExistingApplication(
          formData.email.trim(),
          jobTitle
        );
        
        if (checkResponse.hasApplied) {
          alert(checkResponse.message);
          setIsSubmitting(false);
          return;
        }
      } catch (checkError) {
        console.error("Error checking existing application:", checkError);
        // Continue with submission if check fails
      }

      let resumePath = formData.resumeLink;

      if (selectedFile) {
        try {
          const uploadResponse = await CandidatesService.uploadResume(
            selectedFile
          );
          resumePath = uploadResponse.path;
        } catch (error) {
          console.error("Upload failed:", error);
          throw new Error(
            error.response?.data?.message || "Failed to upload file"
          );
        }
      }

      // Format data to match PostgreSQL schema
      const candidateData = {
        fullname: formData.fullName.trim(),
        email: formData.email.trim(),
        gpa: parseFloat(formData.gpa).toFixed(2),
        experience: formData.experience,
        skills: formData.skills.trim(),
        coverletter: formData.coverLetter.trim(),
        jobTitle: jobTitle,
        location: location || formData.location,
        department: department || formData.department,
        status: "Received",
        phoneNumber: formData.phoneNumber.trim(),
      };

      // Add either resumepath or link, but not both
      if (resumePath) {
        candidateData.resumepath = resumePath;
      } else if (formData.resumeLink) {
        candidateData.link = formData.resumeLink;
      }

      console.log("Submitting candidate data:", candidateData);

      try {
        const response = await CandidatesService.createCandidate(candidateData);
        console.log("Server response:", response);

        // Check if the response contains any errors
        if (response.error) {
          throw new Error(response.error);
        }

        alert("Application submitted successfully!");
        onSubmit(response);
      } catch (error) {
        // Log the complete error object for debugging
        console.error("Complete error object:", error);
        console.error("Error response data:", error.response?.data);
        console.error("Error status:", error.response?.status);

        // Extract detailed error information
        const errorDetails = error.details || {};
        const errorMessage = error.message;
        const serverResponse = error.response?.data;

        // Log the full error details
        console.error("Detailed submission error:", {
          error,
          details: errorDetails,
          status: error.response?.status,
          statusText: error.response?.statusText,
          serverResponse,
        });

        // Display a user-friendly error message
        const displayMessage =
          serverResponse?.message ||
          error.response?.data?.message ||
          errorMessage ||
          "Failed to submit application";

        // Check if this is a duplicate application error
        if (displayMessage.includes("already applied") || displayMessage.includes("already exists")) {
          alert(displayMessage);
        } else {
        alert(displayMessage);
        }

        setErrors((prev) => ({
          ...prev,
          server: displayMessage,
        }));

        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      setErrors((prev) => ({
        ...prev,
        server:
          error.response?.data?.message ||
          "Failed to submit application. Please try again.",
      }));
      setIsSubmitting(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (!validateName(formData.fullName)) {
      newErrors.fullName =
        "Please enter a valid full name (only letters, at least first and last name)";
    }

    // Email Validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Phone Number Validation
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^[+]251\d{9}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone must be +251 followed by 9 digits";
    }

    // Cover Letter Validation
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = "Cover letter is required";
    } else if (!validateCoverLetter(formData.coverLetter)) {
      newErrors.coverLetter =
        "Cover letter must be between 50-1000 characters and contain complete sentences";
    }

    // GPA Validation
    const gpa = parseFloat(formData.gpa);
    if (!formData.gpa) {
      newErrors.gpa = "GPA is required";
    } else if (isNaN(gpa) || gpa < 0.0 || gpa > 4.0) {
      newErrors.gpa = "GPA must be between 0.00 and 4.00";
    }

    // Resume Validation
    if (!selectedFile && !formData.resumeLink) {
      newErrors.file = "Please upload resume or provide a link";
      newErrors.resumeLink = "Please upload resume or provide a link";
    }
    if (formData.resumeLink && !validateUrl(formData.resumeLink)) {
      newErrors.resumeLink = "Please enter a valid URL";
    }

    // Experience Validation
    if (!formData.experience) {
      newErrors.experience = "Experience is required";
    }

    // Skills Validation
    if (!formData.skills.trim()) {
      newErrors.skills = "Skills are required";
    } else if (!validateSkills(formData.skills)) {
      newErrors.skills =
        "Please enter at least 2 valid skills, separated by commas";
    }

    return newErrors;
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-2 rounded-md shadow-sm">
      <div className="flex justify-between items-center mb-0">
        <h2 className="text-lg font-medium text-black">Apply for {jobTitle}</h2>
        <div className="text-sm text-gray-600">
          <p>Department: {department}</p>
          <p>Location: {location}</p>
        </div>
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
              className={`w-full px-3 py-2 border rounded-md text-black ${
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
              className={`w-full px-3 py-2 border rounded-md text-black ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="your.email@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number *
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-black ${
                errors.phoneNumber ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="+251"
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
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
              className={`w-full px-3 py-2 border rounded-md text-black ${
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
                <p className="mt-1 text-sm text-red-600">{errors.resumeLink}</p>
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
              className={`w-full px-3 py-2 border rounded-md text-black ${
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-3 text-black ${
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
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-black ${
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
              className="text-black-500 hover:text-black text-2xl bg-red-500 border-b-2 border-black"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default FileUpload;
