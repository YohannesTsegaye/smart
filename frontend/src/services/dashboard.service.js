import axios from "axios";

const API_URL = "http://localhost:5000";

export class DashboardService {
  static async getStats() {
    try {
      // Get jobs stats
      const jobsResponse = await axios.get(`${API_URL}/job-posts`);
      const jobs = jobsResponse.data || [];

      // Get candidates stats
      const candidatesResponse = await axios.get(`${API_URL}/candidates`);
      const candidates = candidatesResponse.data || [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate stats
      const totalJobs = jobs.length;
      const activeJobs = jobs.filter((job) => job.isActive).length;
      const totalApplications = candidates.length;
      const newToday = candidates.filter((c) => {
        const createdAt = new Date(c.createdAt);
        createdAt.setHours(0, 0, 0, 0);
        return createdAt.getTime() === today.getTime();
      }).length;

      return {
        totalJobs,
        activeJobs,
        totalApplications,
        newToday,
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      throw error;
    }
  }
}
