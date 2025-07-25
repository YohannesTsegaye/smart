import axios from "axios";
import { STATUS_MAPPING } from "../utils/statusConverter";

class CandidateEventEmitter {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  emit(event) {
    this.listeners.forEach((listener) => listener(event));
  }
}

const candidateEventEmitter = new CandidateEventEmitter();

const API_URL = "http://localhost:5000/candidates";

export class CandidatesService {
  static async createCandidate(candidateData) {
    try {
      console.log("Sending candidate data to server:", {
        url: API_URL,
        method: "POST",
        data: candidateData,
      });

      // Add debug headers
      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Debug": "true",
        },
      };

      const response = await axios.post(API_URL, candidateData, config);
      console.log("Server response received:", {
        status: response.status,
        data: response.data,
        headers: response.headers,
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error(`Server returned status ${response.status}`);
      }

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data;
    } catch (error) {
      // Log the raw error
      console.error("Raw error object:", error);

      // Extract all possible error information
      const errorDetails = {
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers,
        config: error.config,
        request: error.request,
        response: error.response?.data,
        message: error.message,
        stack: error.stack,
      };

      console.error("Detailed error information:", errorDetails);

      // Try to get any error details from the server response
      let errorMessage = "Failed to submit application";
      if (error.response?.data) {
        try {
          const data = error.response.data;
          if (data.message) {
            errorMessage = data.message;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (typeof data === "string") {
            errorMessage = data;
          } else {
            errorMessage = "Server error: " + JSON.stringify(data, null, 2);
          }
        } catch (e) {
          console.error("Error parsing server response:", e);
          errorMessage = "Could not parse server response: " + error.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error("No response received from server");
        errorMessage =
          "No response received from server. Please check your connection.";
      } else {
        // Something happened in setting up the request
        console.error("Error setting up request:", error.message);
        errorMessage = "Error setting up request: " + error.message;
      }

      // Create a detailed error object
      const detailedError = new Error(errorMessage);
      detailedError.details = errorDetails;

      // Add more context to the error message
      if (error.response?.status === 500) {
        detailedError.message = `
          ${errorMessage}
          
          Please try again later or contact support if the problem persists.
          
          Technical details:
          - Status: ${error.response.status}
          - Error: ${error.response.data?.error || "Unknown error"}
        `;
      }

      throw detailedError;
    }
  }

  static async uploadResume(file) {
    const formData = new FormData();
    formData.append("resume", file); // Changed from 'file' to 'resume' to match backend expectations
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }

  static async getAllCandidates(filters = {}) {
    const response = await axios.get(API_URL, { params: filters });
    return response.data;
  }

  static async updateStatus(candidateId, status, emailDetails = null) {
    const response = await axios.patch(`${API_URL}/${candidateId}/status`, {
      status,
      emailDetails,
    });
    return response.data;
  }

  static async downloadResume(filename) {
    try {
      console.log(`Attempting to download resume: ${filename}`);
      const response = await axios.get(`${API_URL}/download/${filename}`, {
        responseType: "blob",
        headers: {
          Accept:
            "application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        },
        withCredentials: true, // This ensures cookies are sent with the request
      });

      console.log("Resume download response:", {
        status: response.status,
        contentType: response.headers["content-type"],
        contentLength: response.headers["content-length"],
      });

      return response.data;
    } catch (error) {
      console.error("Error downloading resume:", {
        message: error.message,
        status: error.response?.status,
        filename: filename,
        url: `${API_URL}/download/${filename}`,
        responseData: error.response?.data,
        headers: error.response?.headers,
      });

      if (error.response?.status === 404) {
        throw new Error("Resume file not found on server");
      } else if (error.response?.status === 403) {
        throw new Error("Access denied to resume file");
      } else if (!error.response) {
        throw new Error("Network error while downloading resume");
      } else {
        throw new Error(`Failed to download resume: ${error.message}`);
      }
    }
  }

  static async getStats() {
    const response = await axios.get(`${API_URL}/stats/overview`);
    return response.data;
  }

  static async subscribeToUpdates(listener) {
    return candidateEventEmitter.subscribe(listener);
  }

  static async getCandidateById(id) {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  }

  static async updateCandidate(id, candidateData) {
    const response = await axios.put(`${API_URL}/${id}`, candidateData);
    candidateEventEmitter.emit({ type: "update", candidate: response.data });
    return response.data;
  }

  static async deleteCandidate(id) {
    await axios.delete(`${API_URL}/${id}`);
    candidateEventEmitter.emit({ type: "delete", candidateId: id });
  }

  static async updateCandidateStatus(id, frontendStatus, emailDetails = null) {
    // Validate the status value
    if (!STATUS_MAPPING[frontendStatus]) {
      console.error("Invalid status value:", {
        frontendStatus,
        availableStatuses: Object.keys(STATUS_MAPPING),
      });
      throw new Error(`Invalid status value: ${frontendStatus}`);
    }

    const requestBody = {
      status: frontendStatus,
      emailDetails,
    };

    console.log("Sending status update request:", {
      id,
      status: frontendStatus,
      emailDetails,
      requestBody,
    });

    const response = await axios.patch(`${API_URL}/${id}/status`, requestBody);

    console.log("Status update response:", response.data);
    candidateEventEmitter.emit({ type: "update", candidate: response.data });
    return response.data;
  }

  static async getCandidatesByJob(jobTitle) {
    const response = await axios.get(`${API_URL}/job/${jobTitle}`);
    return response.data;
  }

  static async getCandidatesStats() {
    const response = await axios.get(`${API_URL}/stats/overview`);
    return response.data;
  }

  static async searchCandidates(search) {
    const response = await axios.get(API_URL, {
      params: { search },
    });
    return response.data;
  }

  static async filterByDepartment(department) {
    const response = await axios.get(API_URL, {
      params: { department },
    });
    return response.data;
  }

  static async filterByStatus(status) {
    const response = await axios.get(API_URL, {
      params: { status },
    });
    return response.data;
  }

  static async getEmailPreview(candidateId, status) {
    const response = await axios.get(
      `${API_URL}/${candidateId}/email-preview/${status}`
    );
    return response.data;
  }

  static async checkExistingApplication(email, jobTitle) {
    try {
      const response = await axios.get(`${API_URL}/check-application`, {
        params: { email, jobTitle },
      });
      return response.data;
    } catch (error) {
      console.error("Error checking existing application:", error);
      throw new Error(
        error.response?.data?.message || "Failed to check application status"
      );
    }
  }
}

export default CandidatesService;
