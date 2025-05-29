import { useState, useEffect, useCallback } from "react";
import JobsService from "../../../services/jobs.service";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    status: "",
    postedDate: "",
  });

  const API_URL = "http://localhost:5000/job-posts";

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      department: "",
      location: "",
      status: "",
      postedDate: "",
    });
  };

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const apiFilters = {
        ...(filters.location && { location: filters.location }),
        ...(filters.status === "Active" && { isActive: true }),
        ...(filters.status === "Inactive" && { isActive: false }),
        ...(filters.department && { department: filters.department }),
      };
      const response = await JobsService.getAllJobs(apiFilters);

      let filteredResponse = response;
      if (filters.postedDate) {
        const now = new Date();
        const days = parseInt(filters.postedDate);
        const cutoffDate = new Date(now.setDate(now.getDate() - days));

        filteredResponse = response.filter((job) => {
          const jobDate = new Date(job.createdAt);
          return jobDate >= cutoffDate;
        });
      }

      setJobs(filteredResponse);
    } catch (error) {
      toast.error("Failed to fetch jobs: " + error.message);
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (jobData) => {
    try {
      console.log("Received form data:", jobData);

      const formattedJob = {
        title: jobData.title,
        description: jobData.description,
        company: jobData.company,
        department: jobData.department,
        location: jobData.location,
        jobType: jobData.employmentType,
        experience: jobData.experience,
        salary: Number(jobData.salary),
        deadline: new Date(jobData.deadline).toISOString(),
        requirements: jobData.requirements
          .split("\n")
          .filter((req) => req.trim()),
        skills: jobData.skills.split("\n").filter((skill) => skill.trim()),
        responsibilities: [],
        isActive: true,
      };

      console.log("Sending to API:", formattedJob);
      const response = await JobsService.createJob(formattedJob);
      console.log("API Response:", response);

      toast.success("Job created successfully!");
      fetchJobs();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        stack: error.stack,
      });
      toast.error(
        "Failed to create job: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const editJob = async (updatedJobData) => {
    try {
      const formattedJob = {
        ...updatedJobData,
        jobType: updatedJobData.employmentType,
        requirements: updatedJobData.requirements
          .split("\n")
          .filter((req) => req.trim()),
        skills: updatedJobData.skills
          .split("\n")
          .filter((skill) => skill.trim()),
      };
      await JobsService.updateJob(updatedJobData.id, formattedJob);
      toast.success("Job updated successfully!");
      fetchJobs();
      setIsModalOpen(false);
      setCurrentJob(null);
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update job: " + error.message);
    }
  };

  const deleteJob = async (id) => {
    try {
      await JobsService.deleteJob(id);
      toast.success("Job deleted successfully!");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to delete job: " + error.message);
    }
  };

  const toggleJobStatus = async (id) => {
    try {
      await JobsService.toggleJobStatus(id);
      toast.success("Job status updated successfully!");
      fetchJobs();
    } catch (error) {
      toast.error("Failed to update job status: " + error.message);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".relative")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col text-black">
      {/* Filter Section */}
      <div className="mb-4 bg-gray-50 p-3 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[10px] font-medium mb-1">
              Department
            </label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
            >
              <option value="">All Departments</option>
              {[...new Set(jobs.map((job) => job.department))].map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium mb-1">
              Country
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter country name"
              className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium mb-1">Status</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex items-end space-x-2">
            <button
              onClick={clearFilters}
              className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-[11px]"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                setCurrentJob(null);
                setIsEditing(false);
                setIsModalOpen(true);
              }}
              className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded text-[11px]"
            >
              + Create Job
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto flex-grow">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-xs">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left">Company</th>
                <th className="px-3 py-2 text-left">Job Title</th>
                <th className="px-3 py-2 text-left">Department</th>
                <th className="px-3 py-2 text-left">Location</th>
                <th className="px-3 py-2 text-left">Posted</th>
                <th className="px-3 py-2 text-left">Deadline</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Salary</th>
                <th className="px-3 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {jobs.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-3 py-4 text-center text-gray-500"
                  >
                    No jobs found
                  </td>
                </tr>
              ) : (
                jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 whitespace-nowrap">
                      {job.company}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium">
                      {job.title}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {job.department}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {job.location}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {new Date(job.deadline).toLocaleDateString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {job.jobType}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          job.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {job.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      ${job.salary?.toLocaleString()}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      <div className="relative inline-block text-left">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(
                              activeDropdown === job.id ? null : job.id
                            );
                          }}
                          className="inline-flex items-center px-3 py-1 text-sm text-gray-700 bg-white border rounded-md hover:bg-gray-50"
                        >
                          Actions ▼
                        </button>

                        {activeDropdown === job.id && (
                          <div
                            className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              onClick={() => {
                                setSelectedJob(job);
                                setActiveDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                            >
                              View
                            </button>
                            <button
                              onClick={() => {
                                setCurrentJob(job);
                                setIsEditing(true);
                                setIsModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                toggleJobStatus(job.id);
                                setActiveDropdown(null);
                              }}
                              className={`block w-full text-left px-4 py-2 text-sm ${
                                job.isActive
                                  ? "text-yellow-600 hover:bg-yellow-50"
                                  : "text-green-600 hover:bg-green-50"
                              }`}
                            >
                              {job.isActive ? "Deactivate" : "Activate"}
                            </button>
                            <button
                              onClick={() => {
                                deleteJob(job.id);
                                setActiveDropdown(null);
                              }}
                              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-start justify-center z-50 pt-10 pb-10">
          <div className="bg-white rounded-lg w-full max-w-4xl max-h-[80vh] flex flex-col">
            <div className="sticky top-0 bg-white p-4 border-b z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold">{selectedJob.title}</h3>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-black hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto p-4">
              <div className="space-y-4 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-medium">Company:</p>
                    <p>{selectedJob.company}</p>
                  </div>
                  <div>
                    <p className="font-medium">Location:</p>
                    <p>{selectedJob.location}</p>
                  </div>
                  <div>
                    <p className="font-medium">Department:</p>
                    <p>{selectedJob.department}</p>
                  </div>
                  <div>
                    <p className="font-medium">Job Type:</p>
                    <p>{selectedJob.jobType}</p>
                  </div>
                  <div>
                    <p className="font-medium">Deadline:</p>
                    <p>{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="font-medium">Salary:</p>
                    <p>${selectedJob.salary?.toLocaleString()}</p>
                  </div>
                </div>
                <div>
                  <p className="font-medium">Description:</p>
                  <p className="whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Requirements:</p>
                  <ul className="list-disc pl-5">
                    {selectedJob.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Skills:</p>
                  <ul className="list-disc pl-5">
                    {selectedJob.skills?.map((skill, index) => (
                      <li key={index}>{skill}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="sticky bottom-0 bg-white p-4 border-t">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Job Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white p-4 border-b rounded-t-lg z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  {isEditing ? "Edit Job" : "Create New Job"}
                </h3>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setCurrentJob(null);
                    setIsEditing(false);
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              <JobForm
                job={currentJob}
                isEditing={isEditing}
                onSubmit={isEditing ? editJob : addJob}
                onClose={() => {
                  setIsModalOpen(false);
                  setCurrentJob(null);
                  setIsEditing(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const JobForm = ({ job, isEditing, onSubmit, onClose }) => {
  const initialState = job || {
    title: "",
    company: "",
    department: "",
    location: "",
    deadline: "",
    employmentType: "",
    description: "",
    requirements: "",
    skills: "",
    salary: "",
    experience: "0-1 years",
  };

  const [formData, setFormData] = useState(initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields

    const requiredFields = [
      "title",
      "company",
      "department",
      "location",
      "employmentType",
      "salary",
      "deadline",
      "description",
      "requirements",
      "skills",
    ];

    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(`Missing required fields: ${missingFields.join(", ")}`);
      return;
    }

    // Validate salary is a number
    if (isNaN(Number(formData.salary))) {
      toast.error("Salary must be a number");
      return;
    }

    // Validate deadline is in the future
    if (new Date(formData.deadline) < new Date()) {
      toast.error("Deadline must be in the future");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium mb-1">Job Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Company*</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Department*
            </label>
            <input
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Country*</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter country name"
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Employment Type*
            </label>
            <select
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-black"
              required
            >
              <option value="">Select Type</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Freelance">Freelance</option>
              <option value="Remote">Remote</option>
              <option value="Onsite">Onsite</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Experience Level*
            </label>
            <select
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-black"
              required
            >
              <option value="0-1 years">0-1 years</option>
              <option value="1-3 years">1-3 years</option>
              <option value="3-5 years">3-5 years</option>
              <option value="5+ years">5+ years</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Salary (USD)*
            </label>
            <input
              type="number"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              placeholder="Enter annual salary"
              className="w-full p-2 border rounded text-black"
              required
              min="0"
              step="1000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Deadline*</label>
            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleInputChange}
              className="w-full p-2 border rounded text-black"
              required
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">Description*</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 border rounded h-32 text-black"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Requirements* (One per line)
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            placeholder="Enter each requirement on a new line"
            className="w-full p-2 border rounded h-32 text-black"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium mb-1">
            Skills* (One per line)
          </label>
          <textarea
            name="skills"
            value={formData.skills}
            onChange={handleInputChange}
            placeholder="Enter each required skill on a new line"
            className="w-full p-2 border rounded h-32 text-black"
            required
          />
        </div>
      </div>
      <div className="sticky bottom-0 bg-white pt-4 border-t">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
          >
            {isEditing ? "Update Job" : "Create Job"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ManageJobs;
