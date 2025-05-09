import React, { useState, useEffect } from 'react';
import JobApplicationForm from './JobApplicationForm';
import JobSearchComponent from './JobSearchComponent';

export default function Job() {
  const [jobsData, setJobsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSearchComponent, setShowSearchComponent] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/jobs.json');
        const data = await response.json();
        setJobsData(data.jobs || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

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
      {/* <Header /> */}

      {/* Main content centered */}
      <div className="pt-20 w-full flex flex-col items-center bg-gray-50 min-h-screen text-black px-4">
        <div className="w-full max-w-7xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Job Openings</h1>
            <button
              onClick={() => setShowSearchComponent(!showSearchComponent)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {showSearchComponent ? 'Hide Search' : 'Advanced Search'}
            </button>
          </div>

          {showSearchComponent && (
            <div className="mb-6 w-full">
              <JobSearchComponent
                jobsData={jobsData}
                onJobSelect={(job) => {
                  setSelectedJob(job);
                  setShowApplicationForm(false);
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {jobsData.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow p-6 border hover:shadow-lg transition cursor-pointer"
                onClick={() => {
                  setSelectedJob(job);
                  setShowApplicationForm(false);
                }}
              >
                <h2 className="text-xl font-bold">{job.Title}</h2>
                <p className="text-gray-700">{job.CompanyName}</p>
                <p className="text-gray-500">{job.WorkLocation}</p>
                <button className="w-full mt-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Job Detail Modal - Centered */}
      {selectedJob && !showApplicationForm && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
          <div className="w-full max-w-4xl p-8 text-black">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-3xl font-bold">{selectedJob.Title}</h2>
              <button
                onClick={() => setSelectedJob(null)}
                className="text-white hover:text-black text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <p><strong>Company:</strong> {selectedJob.CompanyName}</p>
              <p><strong>Location:</strong> {selectedJob.WorkLocation}</p>
              <p><strong>Employment Type:</strong> {selectedJob.EmploymentType}</p>
              <p><strong>Job Type:</strong> {selectedJob.JobType}</p>
              <p><strong>Description:</strong> {selectedJob.Description}</p>
              <p><strong>Requirements:</strong> {selectedJob.Requirements}</p>
              <p><strong>Salary:</strong> {selectedJob.Salary}</p>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-6 py-2 border rounded hover:bg-gray-100 text-white"
              >
                Close
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

      {/* Application Form - Centered */}
      {showApplicationForm && selectedJob && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
          <div className="w-full max-w-4xl p-8 text-black">
            <JobApplicationForm
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