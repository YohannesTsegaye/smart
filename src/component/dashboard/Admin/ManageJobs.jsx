import { useState, useEffect } from 'react';

const ManageJobs = () => {
  // Sample job data with 10 entries
  const [jobs, setJobs] = useState([
    { 
      id: 1, 
      title: 'Frontend Developer', 
      department: 'Engineering', 
      location: 'Remote', 
      postedDate: '2023-05-10', 
      deadline: '2023-06-10', 
      employmentType: 'Full-time', 
      sector: 'ICT',
      status: 'Active'
    },
    { 
      id: 2, 
      title: 'UX Designer', 
      department: 'Design', 
      location: 'Hybrid', 
      postedDate: '2023-05-15', 
      deadline: '2023-06-15', 
      employmentType: 'Contract', 
      sector: 'Design',
      status: 'Active'
    },
    { 
      id: 3, 
      title: 'Backend Engineer', 
      department: 'Engineering', 
      location: 'Onsite', 
      postedDate: '2023-05-18', 
      deadline: '2023-06-18', 
      employmentType: 'Full-time', 
      sector: 'ICT',
      status: 'Active'
    },
    { 
      id: 4, 
      title: 'Product Manager', 
      department: 'Management', 
      location: 'Hybrid', 
      postedDate: '2023-05-20', 
      deadline: '2023-06-20', 
      employmentType: 'Full-time', 
      sector: 'Business',
      status: 'Active'
    },
    { 
      id: 5, 
      title: 'DevOps Specialist', 
      department: 'Engineering', 
      location: 'Remote', 
      postedDate: '2023-05-22', 
      deadline: '2023-06-22', 
      employmentType: 'Contract', 
      sector: 'ICT',
      status: 'Active'
    },
    { 
      id: 6, 
      title: 'Graphic Designer', 
      department: 'Creative', 
      location: 'Remote', 
      postedDate: '2023-05-25', 
      deadline: '2023-06-25', 
      employmentType: 'Part-time', 
      sector: 'Art & Creative',
      status: 'Active'
    },
    { 
      id: 7, 
      title: 'Financial Analyst', 
      department: 'Finance', 
      location: 'Onsite', 
      postedDate: '2023-05-28', 
      deadline: '2023-06-28', 
      employmentType: 'Full-time', 
      sector: 'Finance',
      status: 'Active'
    },
    { 
      id: 8, 
      title: 'Content Writer', 
      department: 'Marketing', 
      location: 'Remote', 
      postedDate: '2023-05-30', 
      deadline: '2023-06-30', 
      employmentType: 'Freelance', 
      sector: 'Education',
      status: 'Active'
    },
    { 
      id: 9, 
      title: 'Data Scientist', 
      department: 'Engineering', 
      location: 'Hybrid', 
      postedDate: '2023-06-01', 
      deadline: '2023-07-01', 
      employmentType: 'Full-time', 
      sector: 'ICT',
      status: 'Active'
    },
    { 
      id: 10, 
      title: 'HR Manager', 
      department: 'Human Resources', 
      location: 'Onsite', 
      postedDate: '2023-06-05', 
      deadline: '2023-07-05', 
      employmentType: 'Full-time', 
      sector: 'Business',
      status: 'Active'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Add new job
  const addJob = (newJob) => {
    setJobs([...jobs, { 
      ...newJob, 
      id: jobs.length + 1,
      postedDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    }]);
    setIsModalOpen(false);
  };

  // Edit existing job
  const editJob = (updatedJob) => {
    setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
    setIsModalOpen(false);
    setCurrentJob(null);
    setIsEditing(false);
  };

  // Delete job
  const deleteJob = (id) => {
    setJobs(jobs.filter(job => job.id !== id));
  };

  // Toggle job status
  const toggleJobStatus = (id) => {
    setJobs(jobs.map(job => 
      job.id === id 
        ? { ...job, status: job.status === 'Active' ? 'Inactive' : 'Active' } 
        : job
    ));
  };

  // Open edit modal
  const handleEdit = (job) => {
    setCurrentJob(job);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-black">Job Management</h2>
        <div className="space-x-3">
          <button
            onClick={() => {
              setCurrentJob(null);
              setIsEditing(false);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
          >
            <span className="mr-2 text-white" >+</span> Create Job
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posted Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-black" >
            {jobs.map((job) => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{job.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.postedDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.deadline}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.employmentType}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                  <button 
                    onClick={() => handleEdit(job)}
                    className="text-white bg-green-700"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => toggleJobStatus(job.id)}
                    className={`${
                      job.status === 'Active' 
                        ? 'text-yellow-600 hover:text-yellow-800' 
                        : 'text-green-600 hover:text-green-800'
                    }`}
                  >
                    {job.status === 'Active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button 
                    onClick={() => deleteJob(job.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddJobModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentJob(null);
          setIsEditing(false);
        }}
        onSave={isEditing ? editJob : addJob}
        job={currentJob}
        isEditing={isEditing}
      />
    </div>
  );
};

const AddJobModal = ({ isOpen, onClose, onSave, job, isEditing }) => {
  const employmentTypes = ['Full-time', 'Remote', 'Onsite', 'Hybrid', 'Freelance', 'Contract', 'Part-time'];
  const sectors = ['Business', 'ICT', 'Design', 'Art & Creative', 'Education', 'Finance', 'Engineering'];
  const locations = ['Remote', 'Onsite', 'Hybrid'];

  const [newJob, setNewJob] = useState({
    title: '',
    department: '',
    location: 'Remote',
    postedDate: new Date().toISOString().split('T')[0],
    deadline: '',
    employmentType: 'Full-time',
    sector: 'ICT'
  });

  // Set form data when editing
  useEffect(() => {
    if (isEditing && job) {
      setNewJob(job);
    } else {
      setNewJob({
        title: '',
        department: '',
        location: 'Remote',
        postedDate: new Date().toISOString().split('T')[0],
        deadline: '',
        employmentType: 'Full-time',
        sector: 'ICT'
      });
    }
  }, [isEditing, job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewJob({ ...newJob, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newJob);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-black bg-green-600  hover:bg-green-700">{isEditing ? 'Edit Job' : 'Create New Job'}</h3>
          <button onClick={onClose} className="text-white hover:text-gray-700">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Job Title*</label>
              <input
                type="text"
                name="title"
                value={newJob.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md  text-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department*</label>
              <input
                type="text"
                name="department"
                value={newJob.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location*</label>
              <select
                name="location"
                value={newJob.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md  text-black"
                required
              >
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type*</label>
              <select
                name="employmentType"
                value={newJob.employmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md  text-black"
                required
              >
                {employmentTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector*</label>
              <select
                name="sector"
                value={newJob.sector}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md  text-black"
                required
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Deadline*</label>
              <input
                type="date"
                name="deadline"
                value={newJob.deadline}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md  text-black"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
          
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-black mb-1">Status</label>
              <select
                name="status"
                value={newJob.status || 'Active'}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md text-black"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          )}
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              {isEditing ? 'Update Job' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageJobs;