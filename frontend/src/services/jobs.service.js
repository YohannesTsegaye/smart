import axios from "axios";

const API_URL = "http://localhost:5000/job-posts";

export const JobsService = {
  // Get all jobs with optional filters
  getAllJobs: async (filters = {}) => {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  },

  // Get a single job by ID
  getJobById: async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  // Create a new job
  createJob: async (jobData) => {
    console.log(API_URL, "API_URL");
    const response = await axios.post(API_URL, jobData);
    return response.data;
  },

  // Update an existing job
  updateJob: async (id, jobData) => {
    const response = await axios.put(`${API_URL}/${id}`, jobData);
    return response.data;
  },

  // Delete a job
  deleteJob: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
  },

  // Toggle job status
  toggleJobStatus: async (id) => {
    const response = await axios.put(`${API_URL}/${id}/toggle-status`);
    return response.data;
  },

  // Search jobs by keyword
  searchJobs: async (keyword) => {
    const response = await axios.get(`${API_URL}/search`, {
      params: { keyword },
    });
    return response.data;
  },

  // Get jobs by salary range
  getJobsBySalaryRange: async (minSalary, maxSalary) => {
    const response = await axios.get(`${API_URL}/salary-range`, {
      params: { min: minSalary, max: maxSalary },
    });
    return response.data;
  },
};

export default JobsService;
