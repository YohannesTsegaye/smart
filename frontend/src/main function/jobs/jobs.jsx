import React, { useState, useEffect } from "react";
import SearchIcon from "../../assets/icons/SearchIcon";
import TitleIcon from "../../assets/icons/TitleIcon";
import CompanyIcon from "../../assets/icons/CompanyIcon";
import LocationIcon from "../../assets/icons/LocationIcon";
import EmploymentIcon from "../../assets/icons/EmploymentIcon";
import JobTypeIcon from "../../assets/icons/JobTypeIcon";
import FileUpload from "./FileUpload";
import Header from "../../component/comm/header";

export default function Job() {
  // State for job data and loading
  const API_URL = "http://localhost:5000/job-posts";

  const [jobsData, setJobsData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // State for job selection and application
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("all");
  const [department, setDepartment] = useState("all");

  // Filter options
  const employmentTypes = [
    "all",
    "remote",
    "onsite",
    "hybrid",
    "Freelance",
    "Contract",
    "Part-time",
    "Full-time",
  ];

  const departments = [
    "all",
    "Engineering",
    "Design",
    "Marketing",
    "Sales",
    "Finance",
    "HR",
    "Operations",
    "Product",
    "Legal",
    "Customer Support",
  ];

  // Fetch jobs data
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch(API_URL, {
          method: "GET",
        });
        const data = await response.json();
        console.log("Jobs data fetched:", data);
        setJobsData(data || []);
        setFilteredJobs(data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter jobs based on search and filters
  // useEffect(() => {
  //   const filtered = jobsData.filter((job) => {
  //     const matchesSearch =
  //       job.Title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
  //       job.Description?.toLowerCase()?.includes(searchTerm?.toLowerCase());

  //     const matchesEmployment =
  //       employmentType === "all" ||
  //       job.EmploymentType?.toLowerCase() === employmentType.toLowerCase();

  //     const matchesDepartment =
  //       department === "all" ||
  //       job.department?.toLowerCase() === department.toLowerCase();

  //     return matchesSearch && matchesEmployment && matchesDepartment;
  //   });

  //   setFilteredJobs(filtered);
  // }, [searchTerm, employmentType, department, jobsData]);

  // Handle application submission
  const handleSubmitApplication = (formData) => {
    console.log("Application submitted for job:", selectedJob.id, formData);
    alert(`Application submitted successfully for ${selectedJob.title}!`);
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        Loading jobs...
      </div>
    );
  if (!jobsData.length)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        No jobs available
      </div>
    );

  return (
    <>
      <Header />
      {/* Search and Filter Section */}
      <div className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Keyword Search */}
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
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
            <label
              htmlFor="employmentType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Employment Type
            </label>
            <select
              id="employmentType"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black"
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
            >
              {employmentTypes.map((type) => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Department
            </label>
            <select
              id="department"
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="pt-0 w-full flex flex-col items-center bg-gray-50 min-h-screen text-black px-4">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center">
            <h3 className="text-3xl font-bold">Job Openings</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mt-6">
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
                      <h2 className="text-xl font-semibold text-black">
                        {job.title}
                      </h2>
                    </div>
                    <div className="flex items-center">
                      <CompanyIcon className="w-5 h-5 mr-2 text-black-600" />
                      <span className="text-black">{job.company}</span>
                    </div>
                    <div className="flex items-center">
                      <LocationIcon className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-black">{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <EmploymentIcon className="w-5 h-5 mr-2 text-gray-600" />
                      <span className="text-black capitalize">
                        {job.jobType}
                      </span>
                    </div>
                    {job.department && (
                      <div className="flex items-center">
                        <JobTypeIcon className="w-5 h-5 mr-2 text-gray-600" />
                        <span className="text-black">{job.department}</span>
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
                <h3 className="text-lg font-medium text-gray-900">
                  No jobs found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      {selectedJob && !showApplicationForm && (
        <JobDetails
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={() => setShowApplicationForm(true)}
        />
      )}

      {/* File Upload Modal */}
      {showApplicationForm && selectedJob && (
        <FileUpload
          onBack={() => setShowApplicationForm(false)}
          onSubmit={handleSubmitApplication}
          jobTitle={selectedJob.Title}
        />
      )}
    </>
  );
}
