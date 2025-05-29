import { useState } from 'react';

const Candidates = () => {
  const [candidates, setCandidates] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Frontend Developer', 
      appliedDate: '2023-05-15', 
      status: 'Under Review',
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      experience: '5 years',
      skills: 'React, JavaScript, HTML/CSS',
      notes: 'Strong portfolio with modern designs'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'UX Designer', 
      appliedDate: '2023-05-18', 
      status: 'Accepted',
      email: 'jane.smith@example.com',
      phone: '(234) 567-8901',
      experience: '3 years',
      skills: 'Figma, User Research, Prototyping',
      notes: 'Excellent communication skills'
    },
    { 
      id: 3, 
      name: 'Robert Johnson', 
      position: 'Backend Engineer', 
      appliedDate: '2023-05-20', 
      status: 'Rejected',
      email: 'robert.j@example.com',
      phone: '(345) 678-9012',
      experience: '7 years',
      skills: 'Node.js, Python, SQL',
      notes: 'Needs more cloud experience'
    },
    { 
      id: 4, 
      name: 'Emily Davis', 
      position: 'Product Manager', 
      appliedDate: '2023-05-22', 
      status: 'Under Review',
      email: 'emily.d@example.com',
      phone: '(456) 789-0123',
      experience: '4 years',
      skills: 'Agile, Scrum, Roadmapping',
      notes: 'Previous startup experience'
    },
    { 
      id: 5, 
      name: 'Michael Wilson', 
      position: 'DevOps Specialist', 
      appliedDate: '2023-05-25', 
      status: 'Accepted',
      email: 'michael.w@example.com',
      phone: '(567) 890-1234',
      experience: '6 years',
      skills: 'AWS, Docker, Kubernetes',
      notes: 'Certified AWS Architect'
    },
  ]);

  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  const updateStatus = (id, newStatus) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === id ? { ...candidate, status: newStatus } : candidate
    ));
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
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">Candidate Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applied Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black">
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-6 py-4 whitespace-nowrap">{candidate.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{candidate.position}</td>
                <td className="px-6 py-4 whitespace-nowrap">{candidate.appliedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    candidate.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    candidate.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button
                    onClick={() => handleView(candidate)}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  >
                    View
                  </button>
                  <select
                    value={candidate.status}
                    onChange={(e) => updateStatus(candidate.id, e.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Candidate Details Modal */}
      {isModalOpen && selectedCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Candidate Details</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <h4 className="font-medium text-gray-700">Name</h4>
                <p>{selectedCandidate.name}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Position</h4>
                <p>{selectedCandidate.position}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Email</h4>
                <p>{selectedCandidate.email}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Phone</h4>
                <p>{selectedCandidate.phone}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Experience</h4>
                <p>{selectedCandidate.experience}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700">Skills</h4>
                <p>{selectedCandidate.skills}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700">Notes</h4>
                <p>{selectedCandidate.notes}</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={editStatus}
                    onChange={handleStatusChange}
                    className="border rounded px-3 py-2"
                  >
                    <option value="Under Review">Under Review</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveStatus}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Candidates;