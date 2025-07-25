import axios from "axios";

const API_URL = "http://localhost:5000/auth/login";

export const EmailService = {
  sendStatusUpdateEmail: async (candidateData) => {
    try {
      const response = await axios.post(
        `${API_URL}/status-update`,
        candidateData
      );
      return response.data;
    } catch (error) {
      console.error("Failed to send status update email:", error);
      throw error;
    }
  },
};

export default EmailService;
