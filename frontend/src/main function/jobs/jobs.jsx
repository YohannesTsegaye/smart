import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchIcon from "../../assets/icons/SearchIcon";
import TitleIcon from "../../assets/icons/TitleIcon";
import CompanyIcon from "../../assets/icons/CompanyIcon";
import LocationIcon from "../../assets/icons/LocationIcon";
import EmploymentIcon from "../../assets/icons/EmploymentIcon";
import JobTypeIcon from "../../assets/icons/JobTypeIcon";
import DescriptionIcon from "../../assets/icons/DescriptionIcon";
import RequirementsIcon from "../../assets/icons/RequirementsIcon";
import SalaryIcon from "../../assets/icons/SalaryIcon";
import JobsService from "../../services/jobs.service";
import { useQueryClient } from "@tanstack/react-query";
import CandidatesService from "../../services/candidates.service";

import FileUpload from "./FileUpload";
import Header from "../../component/comm/header";

export default function Job() {
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [employmentType, setEmploymentType] = useState("all");
  const [department, setDepartment] = useState("all");
  const [appliedJobs, setAppliedJobs] = useState(new Set());

  const queryClient = useQueryClient();

  // Use React Query to fetch jobs
  const {
    data: jobsData = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      try {
        console.log("Fetching jobs...");
        const data = await JobsService.getAllJobs({ isActive: true });
        console.log("Jobs data received:", data);
        return data.filter((job) => job.isActive === true);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        throw error; // Let React Query handle the error
      }
    },
    refetchInterval: 30000, // Changed to 30 seconds to prevent too frequent updates
    refetchOnWindowFocus: false, // Disabled to prevent unnecessary refetches
    retry: 1, // Reduced retry attempts
    staleTime: 10000, // Data stays fresh for 10 seconds
  });

  // Subscribe to job updates - only invalidate on actual changes
  useEffect(() => {
    const unsubscribe = JobsService.subscribeToUpdates((event) => {
      console.log("Job update received:", event);
      if (
        event.type === "create" ||
        event.type === "update" ||
        event.type === "delete"
      ) {
        queryClient.invalidateQueries(["jobs"]);
      }
    });

    return () => unsubscribe();
  }, [queryClient]);

  const employmentTypes = [
    "all",
    "Remote",
    "Onsite",
    "Hybrid",
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

  // Update filtered jobs whenever jobsData or filters change
  useEffect(() => {
    const filtered = jobsData.filter((job) => {
      const jobTitle = job.title?.toLowerCase() || "";
      const jobDescription = job.description?.toLowerCase() || "";
      const jobEmploymentType = job.jobType?.toLowerCase() || "";
      const jobDepartment = job.department?.toLowerCase() || "";
      const searchDepartment = department.toLowerCase();

      const matchesSearch =
        jobTitle.includes(searchTerm.toLowerCase()) ||
        jobDescription.includes(searchTerm.toLowerCase());

      const matchesEmployment =
        employmentType === "all" ||
        jobEmploymentType === employmentType.toLowerCase();

      const matchesDepartment =
        department === "all" ||
        (jobDepartment && jobDepartment.startsWith(searchDepartment));

      return matchesSearch && matchesEmployment && matchesDepartment;
    });

    setFilteredJobs(filtered);
  }, [jobsData, searchTerm, employmentType, department]);

  // Check if user has applied to a specific job
  const checkIfApplied = async (jobTitle, userEmail) => {
    if (!userEmail) return false;
    
    try {
      const response = await CandidatesService.checkExistingApplication(userEmail, jobTitle);
      return response.hasApplied;
    } catch (error) {
      console.error("Error checking application status:", error);
      return false;
    }
  };

  // Get user email from localStorage or prompt user
  const getUserEmail = () => {
    return localStorage.getItem('userEmail') || '';
  };

  // Set user email in localStorage
  const setUserEmail = (email) => {
    localStorage.setItem('userEmail', email);
  };

  // Check for existing applications when component loads
  useEffect(() => {
    const userEmail = getUserEmail();
    if (userEmail && jobsData.length > 0) {
      const checkApplications = async () => {
        const appliedJobsSet = new Set();
        
        for (const job of jobsData) {
          const hasApplied = await checkIfApplied(job.title, userEmail);
          if (hasApplied) {
            appliedJobsSet.add(job.title);
          }
        }
        
        setAppliedJobs(appliedJobsSet);
      };
      
      checkApplications();
    }
  }, [jobsData]);

  const handleSubmitApplication = (formData) => {
    console.log("Application submitted for job:", selectedJob.id, formData);
    
    // Save user email to localStorage
    setUserEmail(formData.email);
    
    // Add job to applied jobs set
    setAppliedJobs(prev => new Set([...prev, selectedJob.title]));
    
    alert(`Application submitted successfully for ${selectedJob.title}!`);
    setShowApplicationForm(false);
    setSelectedJob(null);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600">
          Error loading jobs. Please make sure the server is running and try
          again.
        </div>
      </div>
    );
  }

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        Loading jobs...
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
            <div className="relative">
              <input
                type="text"
                id="department"
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md text-black"
                value={department === "all" ? "" : department}
                onChange={(e) => {
                  const value = e.target.value;
                  setDepartment(value || "all");
                }}
                onFocus={() => {
                  if (department === "all") {
                    setDepartment("");
                  }
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    setDepartment("all");
                  }
                }}
                placeholder="Search departments..."
                list="department-suggestions"
                autoComplete="off"
              />
              <datalist id="department-suggestions">
                {departments
                  .filter(
                    (dept) =>
                      dept !== "all" &&
                      (department === "" ||
                        dept.toLowerCase().includes(department.toLowerCase()))
                  )
                  .map((dept) => (
                    <option key={dept} value={dept} />
                  ))}
              </datalist>
            </div>
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
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <TitleIcon className="w-5 h-5 mr-2 text-blue-600" />
                      <h2 className="text-xl font-semibold text-black">
                        {job.title}
                      </h2>
                    </div>
                    {appliedJobs.has(job.title) && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        Applied
                      </span>
                    )}
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
                    <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      View Details
                    </button>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 bg-white rounded-lg shadow-lg border border-gray-200 mx-4">
                <div className="max-w-2xl mx-auto">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    No Jobs Available
                </h3>
                  <p className="text-xl text-gray-600 mb-8">
                    {jobsData.length === 0
                      ? "There are currently no job openings. Please check back later."
                      : "No jobs match your current filters. Try adjusting your search criteria."}
                  </p>
                  {jobsData.length > 0 && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setEmploymentType("all");
                        setDepartment("all");
                      }}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-medium shadow-md hover:shadow-lg"
                    >
                      Clear All Filters
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Job Details Modal */}
      {selectedJob && !showApplicationForm && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
          <div className="w-full max-w-4xl p-8 text-black">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center">
                <TitleIcon className="w-6 h-6 mr-2 text-blue-600" />
                <h2 className="text-3xl font-bold">{selectedJob.title}</h2>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-black text-2xl bg-red-500 border-b-2 border-black"
              >
                X
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center">
                <CompanyIcon className="w-5 h-5 mr-2 text-gray-600" />
                <p>
                  <strong>Company:</strong> {selectedJob.company}
                </p>
              </div>
              <div className="flex items-center">
                <LocationIcon className="w-5 h-5 mr-2 text-gray-600" />
                <p>
                  <strong>Location:</strong> {selectedJob.location}
                </p>
              </div>
              <div className="flex items-center">
                <EmploymentIcon className="w-5 h-5 mr-2 text-gray-600" />
                <p>
                  <strong>Employment Type:</strong> {selectedJob.jobType}
                </p>
              </div>
              {selectedJob.department && (
                <div className="flex items-center">
                  <JobTypeIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <p>
                    <strong>Department:</strong> {selectedJob.department}
                  </p>
                </div>
              )}
              <div className="flex items-start">
                <DescriptionIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
                <div>
                  <p>
                    <strong>Description:</strong>
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">
                    {selectedJob.description}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <RequirementsIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
                <div>
                  <p>
                    <strong>Requirements:</strong>
                  </p>
                  <ul className="list-disc pl-5">
                    {selectedJob.requirements?.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              </div>
              {selectedJob.skills && selectedJob.skills.length > 0 && (
                <div className="flex items-start">
                  <RequirementsIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
                  <div>
                    <p>
                      <strong>Skills:</strong>
                    </p>
                    <ul className="list-disc pl-5">
                      {selectedJob.skills?.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {selectedJob.salary && (
                <div className="flex items-center">
                  <SalaryIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <p>
                    <strong>Salary:</strong> $
                    {selectedJob.salary?.toLocaleString()}
                  </p>
                </div>
              )}
              {selectedJob.deadline && (
                <div className="flex items-center">
                  <JobTypeIcon className="w-5 h-5 mr-2 text-gray-600" />
                  <p>
                    <strong>Application Deadline:</strong>{" "}
                    {new Date(selectedJob.deadline).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Back
              </button>
              {appliedJobs.has(selectedJob.title) ? (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
                >
                  Already Applied
                </button>
              ) : (
              <button
                onClick={() => setShowApplicationForm(true)}
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Apply Now
              </button>
              )}
            </div>
          </div>
        </div>
      )}
      {/* File Upload Modal */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-white z-60 overflow-y-auto flex justify-center items-start pt-20">
          <FileUpload
            onBack={() => {
              setShowApplicationForm(false);
              // Keep the job selected so we can return to details
              setSelectedJob(selectedJob);
            }}
            onSubmit={handleSubmitApplication}
            jobTitle={selectedJob.title}
            department={selectedJob.department}
            location={selectedJob.location}
          />
        </div>
      )}
    </>
  );
}
