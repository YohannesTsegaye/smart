import { useState } from "react";
import CandidateFilters from "../../../main function/Filters/CandidateFilters";

const Candidates = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "John Doe",
      position: "Frontend Developer",
      department: "Engineering",
      location: "United States",
      appliedDate: "2023-05-15",
      status: "Call for exam",
      email: "john.doe@example.com",
      phone: "(123) 456-7890",
      experience: "5 years",
      skills: "React, JavaScript, HTML/CSS",
      descriptions: "Strong portfolio with modern designs",
      resumeLink: "https://example.com/resumes/john-doe-resume.pdf",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "UX Designer",
      department: "Design",
      location: "Canada",
      appliedDate: "2023-05-18",
      status: "Interview",
      email: "jane.smith@example.com",
      phone: "(234) 567-8901",
      experience: "3 years",
      skills: "Figma, User Research, Prototyping",
      descriptions: "Excellent communication skills",
      resumeLink: "https://example.com/resumes/jane-smith-resume.pdf",
    },
    {
      id: 3,
      name: "Robert Johnson",
      position: "Backend Engineer",
      department: "Engineering",
      location: "United Kingdom",
      appliedDate: "2023-05-20",
      status: "Rejected",
      email: "robert.j@example.com",
      phone: "(345) 678-9012",
      experience: "7 years",
      skills: "Node.js, Python, SQL",
      descriptions: "Needs more cloud experience",
    },
    {
      id: 4,
      name: "Emily Davis",
      position: "Product Manager",
      department: "Management",
      location: "Australia",
      appliedDate: "2023-05-22",
      status: "Under Review",
      email: "emily.d@example.com",
      phone: "(456) 789-0123",
      experience: "4 years",
      skills: "Agile, Scrum, Roadmapping",
      descriptions: "Previous startup experience",
    },
    {
      id: 5,
      name: "Michael Wilson",
      position: "DevOps Specialist",
      department: "Engineering",
      location: "Germany",
      appliedDate: "2023-05-25",
      status: "Accepted",
      email: "michael.w@example.com",
      phone: "(567) 890-1234",
      experience: "6 years",
      skills: "AWS, Docker, Kubernetes",
      descriptions: "Certified AWS Architect",
    },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [filteredCandidates, setFilteredCandidates] = useState(candidates);

  const handleFilterChange = (filters) => {
    const filtered = candidates.filter((candidate) => {
      if (filters.department && candidate.department !== filters.department)
        return false;
      if (
        filters.location &&
        !candidate.location
          .toLowerCase()
          .includes(filters.location.toLowerCase())
      )
        return false;
      if (filters.status && candidate.status !== filters.status) return false;
      return true;
    });
    setFilteredCandidates(filtered);
  };

  const handleClearFilters = () => {
    setFilteredCandidates(candidates);
  };

  const updateStatus = (id, newStatus) => {
    setCandidates(
      candidates.map((candidate) =>
        candidate.id === id ? { ...candidate, status: newStatus } : candidate
      )
    );
  };

  const handleView = (candidate) => {
    setSelectedCandidate(candidate);
    setEditStatus(candidate.status);
    setIsModalOpen(true);
  };

  const handleStatusChange = (e) => {
    setEditStatus(e.target.value);
  };

  const saveStatus = () => {
    if (selectedCandidate) {
      updateStatus(selectedCandidate.id, editStatus);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-black">
        Candidate Management
      </h2>

      <CandidateFilters
        candidates={candidates}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium uppercase tracking-wider text-black">
                Position
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Applied Date
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-3 py-2 text-left text-[10px] font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black">
            {filteredCandidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-3 py-2 whitespace-nowrap">
                  <div>
                    <div className="text-[11px] font-medium text-gray-900">
                      {candidate.name}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {candidate.email}
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-[11px] text-black">
                  {candidate.position}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-[11px] text-black">
                  {candidate.location}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-[11px] text-black">
                  {candidate.appliedDate}
                </td>
                <td className="px-3 py-2 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 text-[10px] rounded-full ${
                      candidate.status === "Accepted"
                        ? "bg-green-100 text-green-800"
                        : candidate.status === "Rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {candidate.status}
                  </span>
                </td>
                <td className="px-3 py-2 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleView(candidate)}
                    className="bg-green-600 text-black px-2 py-1 rounded text-[11px] hover:bg-green-700"
                  >
                    View
                  </button>
                  <select
                    value={candidate.status}
                    onChange={(e) => updateStatus(candidate.id, e.target.value)}
                    className="border rounded px-2 py-1 text-[11px]"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Interview">Interview</option>
                    <option value="Call for exam">Call for exam</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Candidate Details Modal */}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="sticky top-0 bg-white p-4 border-b rounded-t-lg z-10">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">
                  Candidate Details
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-black bg-red-500 hover:bg-red-600 transition-colors rounded-full w-6 h-6 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto flex-1 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Name
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.name}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Position
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.position}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Email
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.email}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Phone
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.phone}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Experience
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.experience}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Applied Date
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.appliedDate}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-black">
                    Resume
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.resumeLink ? (
                      <a
                        href={selectedCandidate.resumeLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        View Resume
                      </a>
                    ) : (
                      <span className="text-gray-500">No resume available</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-black">
                    Skills
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.skills}
                  </p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1 text-black">
                    Description
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 whitespace-pre-wrap text-black">
                    {selectedCandidate.descriptions}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Department
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.department}
                  </p>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1 text-black">
                    Location
                  </label>
                  <p className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-black">
                    {selectedCandidate.location}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-medium mb-1 text-black">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={handleStatusChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-black"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Interview">Interview</option>
                  <option value="Call for exam">Call for exam</option>
                </select>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t p-4">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-black rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={saveStatus}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-black rounded transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;
