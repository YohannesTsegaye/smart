import React, { useState, useEffect } from 'react';
import SearchIcon from '../../assets/icons/SearchIcon';
import TitleIcon from '../../assets/icons/TitleIcon';
import CompanyIcon from '../../assets/icons/CompanyIcon';
import LocationIcon from '../../assets/icons/LocationIcon';
import EmploymentIcon from '../../assets/icons/EmploymentIcon';
import JobTypeIcon from '../../assets/icons/JobTypeIcon';
import SalaryIcon from '../../assets/icons/SalaryIcon';
import DescriptionIcon from '../../assets/icons/DescriptionIcon';
import RequirementsIcon from '../../assets/icons/RequirementsIcon';
import FileUpload from './FileUpload';
import Header from '../../component/comm/header';
export default function Job() {
  // State for job data and loading
  const [jobsData, setJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for job selection and application
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [employmentType, setEmploymentType] = useState('all');
  const [sector, setSector] = useState('all');

  // Filter options
  const employmentTypes = ['all', 'remote', 'onsite', 'hybrid','Freelance','Contarct','Part-time'];
  const sectors = ['all', 'Business', 'ICT', 'Design', 'Art & Creative', 'Education', 'Finance', 'Engineering'];

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/jobs.json');
        const data = await response.json();
        setJobsData(data.jobs || []);
        setFilteredJobs(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  useEffect(() => {
    const filtered = jobsData.filter(job => {
      const matchesSearch = job.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.Description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEmployment = employmentType === 'all' ||
        job.EmploymentType.toLowerCase() === employmentType.toLowerCase();

      const matchesSector = sector === 'all' ||
        job.Sector?.toLowerCase() === sector.toLowerCase();

      return matchesSearch && matchesEmployment && matchesSector;
    });

    setFilteredJobs(filtered);
  }, [searchTerm, employmentType, sector, jobsData]);

  // Handle application submission
  const handleSubmitApplication = (formData) => {
    console.log('Application submitted for job:', selectedJob.id, formData);
    alert(`Application submitted successfully for ${selectedJob.Title}!`);
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-white">Loading jobs...</div>;
  if (!jobsData.length) return <div className="flex items-center justify-center min-h-screen bg-white">No jobs available</div>;

  return (
    <>
    <Header />
      {/* Main content */}
      <div className="pt-20 w-full flex flex-col items-center bg-gray-50 min-h-screen text-black px-4">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Job Openings</h1>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Keyword Search */}
              <div className="col-span-1 md:col-span-2">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Keyword
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    id="search"
                    className="block w-full pr-10 pl-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-black"
                    placeholder="Job title, description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5" />
                  </div>
                </div>
              </div>

              {/* Employment Type Filter */}
              <div>
                <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
                  Employment Type
                </label>
                <select
                  id="employmentType"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black"
                  value={employmentType}
                  onChange={(e) => setEmploymentType(e.target.value)}
                >
                  {employmentTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sector Filter */}
              <div>
                <label htmlFor="sector" className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  id="sector"
                  className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                >
                  {sectors.map(sec => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow p-6 border hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedJob(job);
                    setShowApplicationForm(false);
                  }}
                >
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <TitleIcon className="w-5 h-5 mr-2 text-blue-600" />
                      <h2 className="text-xl font-semibold text-black">{job.Title}</h2>
                    </div>
                    <div className="flex items-center">
                      <CompanyIcon className="w-5 h-5 mr-2 text-black-600" />
                      <span className="text-black">{job.CompanyName}</span>
                    </div>
                    <div className="flex items-center">
                      <LocationIcon className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-black">{job.WorkLocation}</span>
                    </div>
                    <div className="flex items-center">
                      <EmploymentIcon className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-black capitalize">{job.EmploymentType}</span>
                    </div>
                    {job.Sector && (
                      <div className="flex items-center">
                        <JobTypeIcon className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="text-black">{job.Sector}</span>
                      </div>
                    )}
                    <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">Try adjusting your search filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && !showApplicationForm && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
          <div className="w-full max-w-4xl p-8 text-black">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <TitleIcon className="w-6 h-6 mr-2 text-blue-600" />
                <h2 className="text-3xl font-bold">{selectedJob.Title}</h2>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <CompanyIcon className="w-5 h-5 mr-2 text-gray-600" />
                <p><strong>Company:</strong> {selectedJob.CompanyName}</p>
              </div>
              <div className="flex items-center">
                <LocationIcon className="w-5 h-5 mr-2 text-gray-600" />
                <p><strong>Location:</strong> {selectedJob.WorkLocation}</p>
              </div>
              <div className="flex items-center">
                <EmploymentIcon className="w-5 h-5 mr-2 text-gray-600" />
                <p><strong>Employment Type:</strong> {selectedJob.EmploymentType}</p>
              </div>
              {selectedJob.Sector && (
                <div className="flex items-center">
                  <JobTypeIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <p><strong>Sector:</strong> {selectedJob.Sector}</p>
                </div>
              )}
              <div className="flex items-start">
                <DescriptionIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
                <div>
                  <p><strong>Description:</strong></p>
                  <p className="mt-1">{selectedJob.Description}</p>
                </div>
              </div>
              <div className="flex items-start">
                <RequirementsIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
                <div>
                  <p><strong>Requirements:</strong></p>
                  <p className="mt-1">{selectedJob.Requirements}</p>
                </div>
              </div>
              {selectedJob.Salary && (
                <div className="flex items-center">
                  <SalaryIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <p><strong>Salary:</strong> {selectedJob.Salary}</p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 text-white"
              >
                Back 
              </button>
              <button
                onClick={() => setShowApplicationForm(true)}
                className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
          <div className="w-full max-w-4xl p-8 text-black">
            <FileUpload
              onBack={() => setShowApplicationForm(false)}
              onSubmit={handleSubmitApplication}
              jobTitle={selectedJob.Title}
            />
          </div>
        </div>
      )}
    </>
  );
}