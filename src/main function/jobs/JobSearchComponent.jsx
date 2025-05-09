import React, { useState, useEffect } from 'react';
import JobApplicationForm from './JobApplicationForm';
import SearchIcon from '../../assets/icons/SearchIcon';
import TitleIcon from '../../assets/icons/TitleIcon';
import CompanyIcon from '../../assets/icons/CompanyIcon';
import LocationIcon from '../../assets/icons/LocationIcon';
import EmploymentIcon from '../../assets/icons/EmploymentIcon';
import JobTypeIcon from '../../assets/icons/JobTypeIcon';

export default function JobSearchComponent() {
  const [jobsData, setJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [employmentType, setEmploymentType] = useState('all');
  const [sector, setSector] = useState('all');

  const employmentTypes = ['all', 'remote', 'onsite', 'hybrid'];
  const sectors = ['all', 'Business', 'ICT', 'Design', 'Art & Creative', 'Education', 'Finance', 'Engineering'];

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

  const handleSubmitApplication = (formData) => {
    console.log('Application submitted for job:', selectedJob.id, formData);
    alert(`Application submitted successfully for ${selectedJob.Title}!`);
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  if (loading) return <div className="text-center p-8 bg-white">Loading jobs...</div>;
  if (!jobsData.length) return <div className="text-center p-8 bg-white">No jobs available</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white min-h-screen">
   
    
    

      {/* Search Form */}
      <div className="mb-8 bg-gray-50 p-4 rounded-lg">
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

        {/* Search Button */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => {}}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <SearchIcon className="mr-2 -ml-1 h-5 w-5" />
            Search
          </button>
        </div>
      </div>

      {/* Job Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedJob(job)}
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
                <button className="w-full mt-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
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

      {/* Job Details Modal */}
      {selectedJob && !showApplicationForm && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          {/* ... your job details modal content */}
        </div>
      )}

      {/* Application Form */}
      {showApplicationForm && selectedJob && (
        <JobApplicationForm
          onBack={() => setShowApplicationForm(false)}
          onSubmit={handleSubmitApplication}
          jobTitle={selectedJob.Title}
        />
      )}
    </div>
  );
}
