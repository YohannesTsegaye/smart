import { useState, useEffect, useCallback } from "react";
import CandidateFilters from "../../../main function/Filters/CandidateFilters";
import { CandidatesService } from "../../../services/candidates.service";
import { toast } from "react-hot-toast";
import { format, isValid } from "date-fns";

// Constants
const ITEMS_PER_PAGE = 15;

// Status options for the status dropdown
const STATUS_OPTIONS = [
  {
    value: "Under Review",
    label: "Under Review",
    className: "bg-gray-100 text-gray-900",
  },
  {
    value: "Received",
    label: "Received",
    className: "bg-green-100 text-green-900",
  },
  {
    value: "Accepted",
    label: "Accepted",
    className: "bg-blue-100 text-blue-900",
  },
  {
    value: "Rejected",
    label: "Rejected",
    className: "bg-red-100 text-red-900",
  },
  {
    value: "Interview",
    label: "Interview",
    className: "bg-purple-100 text-purple-900",
  },
  {
    value: "Call for exam",
    label: "Call for exam",
    className: "bg-yellow-100 text-yellow-900",
  },
];

// Add a safe date formatting function
const formatSafeDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    if (!isValid(date)) return "N/A";
    return format(date, "MMM dd, yyyy");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

// Component for rendering candidate avatar
const CandidateAvatar = ({ name }) => (
  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
    <span className="text-blue-600 font-medium text-xs">
      {name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)}
    </span>
  </div>
);

// Component for rendering the status badge
const StatusBadge = ({ status }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
        status === "Received"
          ? "bg-green-50 text-green-900"
          : status === "Accepted"
          ? "bg-blue-50 text-blue-900"
          : status === "Rejected"
          ? "bg-red-50 text-red-900"
          : status === "Interview"
          ? "bg-purple-50 text-purple-900"
          : status === "Call for exam"
          ? "bg-yellow-50 text-yellow-900"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      {status}
    </span>
  );
};

const Candidates = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    department: "",
    status: "",
    search: "",
    appliedDate: "",
  });

  // Calculate pagination values
  const totalPages = Math.ceil(candidates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCandidates = candidates.slice(startIndex, endIndex);

  // Add state for status change confirmation
  const [statusChangeConfirm, setStatusChangeConfirm] = useState({
    isOpen: false,
    candidateId: null,
    newStatus: "",
    oldStatus: "",
    candidateName: "",
    loading: false,
  });

  // Add state for email content
  const [emailContent, setEmailContent] = useState("");
  const [emailDetails, setEmailDetails] = useState({
    recipientEmail: "",
    recipientName: "",
    subject: "Application Status Update",
  });

  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleStatusChange = useCallback(
    async (candidateId, newStatus) => {
      const candidate = candidates.find((c) => c.id === candidateId);
      if (!candidate) return;

      // First, just show the confirmation modal without loading data
      setStatusChangeConfirm({
        isOpen: true,
        candidateId,
        newStatus,
        oldStatus: candidate.status,
        candidateName: candidate.fullname,
        loading: false,
      });

      // Set initial recipient details
      setEmailDetails({
        recipientEmail: candidate.email,
        recipientName: candidate.fullname,
        subject: "Application Status Update",
      });

      // Set initial email content
      setEmailContent(`Dear ${candidate.fullname},

We hope this email finds you well. We are writing to inform you about your application for the ${candidate.jobTitle} position.

Your application status has been updated to: ${newStatus}

Best regards,
Smart Recruit Team`);

      // Enable email editing by default
      setIsEditingEmail(true);

      // Show the preview modal
      setPreviewModalOpen(true);
    },
    [candidates]
  );

  // New function to load email preview
  const loadEmailPreview = useCallback(async () => {
    if (!statusChangeConfirm.candidateId || !statusChangeConfirm.newStatus)
      return;

    try {
      setStatusChangeConfirm((prev) => ({ ...prev, loading: true }));

      // Fetch email preview from backend
      const previewResponse = await CandidatesService.getEmailPreview(
        statusChangeConfirm.candidateId,
        statusChangeConfirm.newStatus
      );

      // Only set the email content if it hasn't been set or edited yet
      if (!emailContent || emailContent.trim() === "") {
        const candidate = candidates.find(
          (c) => c.id === statusChangeConfirm.candidateId
        );

        setEmailContent(
          previewResponse.emailPreview ||
            `Dear ${statusChangeConfirm.candidateName},

We hope this email finds you well. We are writing to inform you about your application${
              candidate ? ` for the ${candidate.jobTitle} position` : ""
            }.

Your application status has been updated to: ${statusChangeConfirm.newStatus}

Thank you for your interest in our organization.

Best regards,
Smart Recruit Team`
        );
      }
    } catch (error) {
      console.error("Error fetching email preview:", error);

      // Set default content only if content is empty
      if (!emailContent || emailContent.trim() === "") {
        const candidate = candidates.find(
          (c) => c.id === statusChangeConfirm.candidateId
        );
        if (candidate) {
          setEmailContent(`Dear ${candidate.fullname},

We hope this email finds you well. We are writing to inform you about your application for the ${candidate.jobTitle} position.

Your application status has been updated to: ${statusChangeConfirm.newStatus}

We appreciate your interest in joining our team and thank you for taking the time to apply.

Best regards,
Smart Recruit Team`);
        }
      }
    } finally {
      setStatusChangeConfirm((prev) => ({ ...prev, loading: false }));
    }
  }, [
    statusChangeConfirm.candidateId,
    statusChangeConfirm.newStatus,
    statusChangeConfirm.candidateName,
    candidates,
    emailContent,
  ]);

  // Add useEffect to load preview when modal opens
  useEffect(() => {
    if (previewModalOpen && statusChangeConfirm.isOpen) {
      loadEmailPreview();
    }
  }, [previewModalOpen, statusChangeConfirm.isOpen, loadEmailPreview]);

  // Function to handle the final status change and email sending
  const handleConfirmStatusChange = async () => {
    if (!statusChangeConfirm.candidateId || !statusChangeConfirm.newStatus)
      return;

    try {
      setIsSaving(true);

      // Call the backend to update status and send email
      await CandidatesService.updateCandidateStatus(
        statusChangeConfirm.candidateId,
        statusChangeConfirm.newStatus,
        {
          content: emailContent,
          recipientEmail: emailDetails.recipientEmail,
          recipientName: emailDetails.recipientName,
        }
      );

      // Update the local state
      setCandidates((prevCandidates) =>
        prevCandidates.map((candidate) =>
          candidate.id === statusChangeConfirm.candidateId
            ? { ...candidate, status: statusChangeConfirm.newStatus }
            : candidate
        )
      );

      // Show success message
      toast.success("Status updated and email sent successfully!");

      // Close modals and reset states
      setStatusChangeConfirm((prev) => ({ ...prev, isOpen: false }));
      setPreviewModalOpen(false);
      setIsEditingEmail(false);
      setEmailContent("");
      setEmailDetails({ recipientEmail: "", recipientName: "" });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleView = useCallback(async (candidate) => {
    try {
      const detailedCandidate = await CandidatesService.getCandidateById(
        candidate.id
      );
      setSelectedCandidate(detailedCandidate);
      setShowDetailsModal(true);
    } catch (error) {
      console.error("Error fetching candidate details:", error);
      toast.error("Failed to load candidate details");
    }
  }, []);

  const fetchCandidates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await CandidatesService.getAllCandidates(filters);

      if (!data || !Array.isArray(data)) {
        throw new Error("Invalid data received from server");
      }

      setCandidates(data);
    } catch (err) {
      console.error("Error fetching candidates:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch candidates. Please try again later.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Function to handle editing email content
  const handleEditEmail = () => {
    setIsEditingEmail(true);
  };

  const handleEmailContentChange = (e) => {
    e.preventDefault(); // Prevent default handling
    const newContent = e.target.value;
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    setEmailContent(newContent);

    // Preserve cursor position after state update
    requestAnimationFrame(() => {
      textarea.selectionStart = start;
      textarea.selectionEnd = end;
    });
  };

  const handleFinishEditing = () => {
    setIsEditingEmail(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const clearFilters = () => {
    setFilters({
      department: "",
      status: "",
      search: "",
      appliedDate: "",
    });
  };

  const handleDownloadResume = async (resumePath) => {
    try {
      const filename = resumePath.split("/").pop();
      const response = await CandidatesService.downloadResume(filename);

      // Create a blob from the response data
      const blob = new Blob([response], { type: "application/pdf" });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      // Append to document, click, and cleanup
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the blob URL
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast.error("Failed to download resume. Please try again.");
    }
  };

  useEffect(() => {
    console.log("Component mounted or filters changed");
    fetchCandidates();
  }, [fetchCandidates]);

  if (loading && candidates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
          aria-hidden="true"
        />
        <p className="text-gray-600">Loading candidates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded relative"
          role="alert"
        >
          <div className="flex items-center">
            <div className="py-1">
              <svg
                className="fill-current h-6 w-6 text-red-500 mr-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.07 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 5h2v6H9V5zm0 8h2v2H9v-2z" />
              </svg>
            </div>
            <div>
              <p className="font-bold">Error loading candidates</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
        <button
          onClick={fetchCandidates}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg
            className="-ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Try Again
        </button>
      </div>
    );
  }

  // Render empty state when no candidates are found
  if (candidates.length === 0 && !loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No candidates found
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {Object.values(filters).some(Boolean)
            ? "No candidates match the selected filters. Try adjusting your filter criteria."
            : "Get started by adding a new candidate."}
        </p>
        <div className="mt-6">
          <button
            onClick={clearFilters}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              !Object.values(filters).some(Boolean)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={!Object.values(filters).some(Boolean)}
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Clear filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg w-full">
      <div className="px-4 sm:px-6 py-5 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-black mb-4 sm:mb-0">
            Candidate Management
          </h2>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {candidates.length}{" "}
              {candidates.length === 1 ? "candidate" : "candidates"}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <div className="bg-white rounded-lg shadow p-4 h-full flex flex-col text-black">
            {/* Filter Section */}
            <div className="mb-4 bg-gray-50 p-3 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
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
                    {[...new Set(candidates.map((candidate) => candidate.department))].map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
        </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
                  >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
      </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name, email, or job title"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-medium mb-1">
                    Applied Date
                  </label>
                  <select
                    name="appliedDate"
                    value={filters.appliedDate}
                    onChange={handleFilterChange}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-[11px]"
              >
                    <option value="">All Time</option>
                    <option value="1">Last 24 hours</option>
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                  </select>
                </div>
                <div className="flex items-end space-x-2">
                  <button
                    onClick={clearFilters}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-[11px]"
              >
                    Clear All
                  </button>
                </div>
              </div>
            </div>

            {/* Candidates Table */}
            <div className="overflow-x-auto flex-grow">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200 text-xs">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">Name</th>
                      <th className="px-3 py-2 text-left">Position</th>
                      <th className="px-3 py-2 text-left">Status</th>
                      <th className="px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentCandidates.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-3 py-4 text-center text-gray-500"
                        >
                          No candidates found
                        </td>
                      </tr>
                    ) : (
                      currentCandidates.map((candidate) => (
                        <tr key={candidate.id} className="hover:bg-gray-50">
                          <td className="px-3 py-2 whitespace-nowrap">
                  <div className="flex items-center">
                    <CandidateAvatar name={candidate.fullname} />
                              <div className="ml-2">
                      <div className="text-xs font-medium text-black">
                        {candidate.fullname}
                      </div>
                      <div className="text-xs text-gray-900">
                        {candidate.email}
                      </div>
                    </div>
                  </div>
                </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                  <div className="text-xs font-medium text-black">
                    {candidate.jobTitle || "N/A"}
                  </div>
                  <div className="text-xs text-gray-900">
                    {candidate.department || "No department"}
                  </div>
                </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                  <StatusBadge status={candidate.status} />
                </td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleView(candidate)}
                                className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                                View
                    </button>
                    <select
                      value={candidate.status}
                      onChange={(e) =>
                        handleStatusChange(candidate.id, e.target.value)
                      }
                                className={`text-xs px-2 py-1 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 min-w-[120px] ${
                        candidate.status === "Received"
                          ? "bg-green-50 text-green-900 border-green-200"
                          : candidate.status === "Accepted"
                          ? "bg-blue-50 text-blue-900 border-blue-200"
                          : candidate.status === "Rejected"
                          ? "bg-red-50 text-red-900 border-red-200"
                          : candidate.status === "Interview"
                          ? "bg-purple-50 text-purple-900 border-purple-200"
                          : candidate.status === "Call for exam"
                          ? "bg-yellow-50 text-yellow-900 border-yellow-200"
                          : "bg-gray-50 text-gray-900 border-gray-200"
                      }`}
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-white text-black py-1 text-xs"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
              </tr>
                      ))
                    )}
          </tbody>
        </table>
              )}
            </div>
          </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-end items-center space-x-4 mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
        >
          Prev
        </button>
        <span className="text-sm text-black">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-700'}`}
        >
          Next
        </button>
      </div>

      {/* Candidate Details Modal */}
      {showDetailsModal && selectedCandidate && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-black">
                Candidate Details
              </h3>
              <button
                onClick={() => {
                  setShowDetailsModal(false);
                  setSelectedCandidate(null);
                  setIsEditingEmail(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-xs font-medium text-gray-500">
                    Applied Date
                  </p>
                    <p className="mt-1 text-xs text-black">
                    {formatSafeDate(selectedCandidate.appliedDate)}
                  </p>
                </div>
                <div>
                    <p className="text-xs font-medium text-gray-500">Status</p>
                  <div className="mt-1">
                    <StatusBadge status={selectedCandidate.status} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Full Name
                    </h4>
                    <p className="text-black">{selectedCandidate.fullname}</p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">Email</h4>
                    <p className="text-black">{selectedCandidate.email}</p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Phone Number
                    </h4>
                    <p className="text-black">
                      {selectedCandidate.phoneNumber}
                    </p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">GPA</h4>
                    <p className="text-black">{selectedCandidate.gpa}</p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Experience
                    </h4>
                    <p className="text-black whitespace-pre-wrap">
                      {selectedCandidate.experience}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Position Applied
                    </h4>
                    <p className="text-black">{selectedCandidate.jobTitle}</p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Department
                    </h4>
                    <p className="text-black">{selectedCandidate.department}</p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Location
                    </h4>
                    <p className="text-black">{selectedCandidate.location}</p>
                  </div>
                  <div>
                      <h4 className="text-xs font-medium text-gray-500">
                      Skills
                    </h4>
                    <p className="text-black whitespace-pre-wrap">
                      {selectedCandidate.skills}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2">
                    <h4 className="text-xs font-medium text-gray-500 mb-2">
                    Cover Letter
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-black whitespace-pre-wrap">
                      {selectedCandidate.coverletter}
                    </p>
                  </div>
                </div>

                {selectedCandidate.resumepath && (
                  <div className="col-span-1 md:col-span-2">
                      <h4 className="text-xs font-medium text-gray-500 mb-2">
                      Resume
                    </h4>
                    <button
                      onClick={() =>
                        handleDownloadResume(selectedCandidate.resumepath)
                      }
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                        />
                      </svg>
                      Download Resume
                    </button>
                  </div>
                )}

                <div className="col-span-1 md:col-span-2 flex justify-end space-x-4">
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      handleStatusChange(
                        selectedCandidate.id,
                        selectedCandidate.status
                      );
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <svg
                      className="-ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    See Status
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setEmailDetails({
                        recipientEmail: selectedCandidate.email,
                        recipientName: selectedCandidate.fullname,
                        subject: "Application Status Update",
                      });
                      setEmailContent(`Dear ${selectedCandidate.fullname},

We hope this email finds you well. We are writing to inform you about your application for the ${selectedCandidate.jobTitle} position.

Best regards,
Smart Recruit Team`);
                      setIsEditingEmail(true);
                      setPreviewModalOpen(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
                  >
                    <svg
                      className="-ml-1 mr-2 h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    Send Email
                  </button>
                  <button
                    onClick={() => {
                      setShowDetailsModal(false);
                      setSelectedCandidate(null);
                      setIsEditingEmail(false);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      {statusChangeConfirm.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto my-8">
            <div className="p-6 max-h-[90vh] flex flex-col">
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-base font-semibold text-black">
                  {isEditingEmail
                    ? "Edit Email Content"
                    : "Confirm Status Change"}
                </h3>
                <button
                  onClick={() => {
                    setStatusChangeConfirm((prev) => ({
                      ...prev,
                      isOpen: false,
                    }));
                    setPreviewModalOpen(false);
                    setIsEditingEmail(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0 space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-xs text-black">
                    Change status for{" "}
                    <span className="font-semibold">
                      {statusChangeConfirm.candidateName}
                    </span>{" "}
                    from{" "}
                    <span className="font-semibold">
                      {statusChangeConfirm.oldStatus}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold">
                      {statusChangeConfirm.newStatus}
                    </span>
                  </p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-medium text-black">
                      Email Content
                    </label>
                    {!isEditingEmail && (
                      <button
                        onClick={handleEditEmail}
                        className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Edit Email
                      </button>
                    )}
                  </div>
                  <div className="mt-1">
                    {statusChangeConfirm.loading ? (
                      <div className="flex items-center justify-center py-4">
                        <svg
                          className="animate-spin h-5 w-5 text-blue-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                    ) : isEditingEmail ? (
                      <textarea
                        value={emailContent}
                        onChange={handleEmailContentChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm font-mono min-h-[200px] max-h-[300px] resize-y"
                        rows="12"
                        style={{
                          whiteSpace: "pre-wrap",
                          lineHeight: "1.5",
                          tabSize: 2,
                        }}
                        spellCheck="true"
                        wrap="soft"
                      />
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-md max-h-[300px] overflow-y-auto">
                        <pre className="text-sm text-black whitespace-pre-wrap font-mono">
                          {emailContent}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                {isEditingEmail && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-black mb-2">
                        Recipient Email
                      </label>
                      <input
                        type="email"
                        value={emailDetails.recipientEmail}
                        onChange={(e) =>
                          setEmailDetails((prev) => ({
                            ...prev,
                            recipientEmail: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-black mb-2">
                        Recipient Name
                      </label>
                      <input
                        type="text"
                        value={emailDetails.recipientName}
                        onChange={(e) =>
                          setEmailDetails((prev) => ({
                            ...prev,
                            recipientName: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => {
                    setStatusChangeConfirm((prev) => ({
                      ...prev,
                      isOpen: false,
                    }));
                    setPreviewModalOpen(false);
                    setIsEditingEmail(false);
                    setEmailContent("");
                    setEmailDetails({ recipientEmail: "", recipientName: "" });
                  }}
                  className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-xs font-medium"
                >
                  Cancel
                </button>
                {!isEditingEmail ? (
                  <button
                    onClick={handleEditEmail}
                    className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xs font-medium"
                  >
                    Edit Email
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleFinishEditing}
                      className="px-3 py-1.5 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-xs font-medium"
                    >
                      Done Editing
                    </button>
                    <button
                      onClick={handleConfirmStatusChange}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-xs font-medium inline-flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-3 w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Email & Update Status"
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Preview Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-lg bg-white mb-10">
            <div className="flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-lg font-medium text-black">
                  Email Preview
                </h3>
                {!isEditingEmail && (
                  <button
                    onClick={handleEditEmail}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit Email
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 min-h-0">
                <div className="space-y-6">
                  <div>
                    <label className="block text-xs font-medium text-black mb-2">
                      To:
                    </label>
                    {isEditingEmail ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <input
                            type="email"
                            value={emailDetails.recipientEmail}
                            onChange={(e) =>
                              setEmailDetails((prev) => ({
                                ...prev,
                                recipientEmail: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
                            placeholder="Recipient Email"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={emailDetails.recipientName}
                            onChange={(e) =>
                              setEmailDetails((prev) => ({
                                ...prev,
                                recipientName: e.target.value,
                              }))
                            }
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
                            placeholder="Recipient Name"
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-black bg-gray-50 p-3 rounded-md">
                        {emailDetails.recipientName} (
                        {emailDetails.recipientEmail})
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-2">
                      Subject:
                    </label>
                    {isEditingEmail ? (
                      <input
                        type="text"
                        value={`${emailDetails.subject} - ${statusChangeConfirm.newStatus}`}
                        onChange={(e) =>
                          setEmailDetails((prev) => ({
                            ...prev,
                            subject: e.target.value,
                          }))
                        }
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
                        placeholder="Email Subject"
                      />
                    ) : (
                      <div className="text-xs text-black bg-gray-50 p-3 rounded-md">
                        {emailDetails.subject} - {statusChangeConfirm.newStatus}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-black mb-2">
                      Message:
                    </label>
                    {isEditingEmail ? (
                      <textarea
                        value={emailContent}
                        onChange={handleEmailContentChange}
                        rows={15}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm font-sans p-3 min-h-[300px] max-h-[400px] resize-y"
                        placeholder="Enter your email message here..."
                      />
                    ) : (
                      <div className="bg-gray-50 p-4 rounded-md max-h-[400px] overflow-y-auto">
                        <pre className="text-sm text-black whitespace-pre-wrap font-sans">
                          {emailContent}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3 flex-shrink-0 bg-white">
                <button
                  onClick={() => {
                    setPreviewModalOpen(false);
                    setIsEditingEmail(false);
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm font-medium"
                >
                  Close
                </button>
                {isEditingEmail ? (
                  <>
                    <button
                      onClick={handleFinishEditing}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 text-sm font-medium"
                    >
                      Done Editing
                    </button>
                    <button
                      onClick={handleConfirmStatusChange}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium inline-flex items-center"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        "Send Email & Update Status"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleConfirmStatusChange}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium inline-flex items-center"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      "Send Email & Update Status"
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Candidates;
