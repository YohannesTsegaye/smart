
// import React, { useState, useEffect } from 'react';
// import TitleIcon from '../../assets/icons/TitleIcon';
// import CompanyIcon from '../../assets/icons/CompanyIcon';
// import LocationIcon from '../../assets/icons/LocationIcon';
// import EmploymentIcon from '../../assets/icons/EmploymentIcon';
// import JobTypeIcon from '../../assets/icons/JobTypeIcon';
// import SalaryIcon from '../../assets/icons/SalaryIcon';
// import DescriptionIcon from '../../assets/icons/DescriptionIcon';
// import RequirementsIcon from '../../assets/icons/RequirementsIcon';
// import FileUpload from './FileUpload';


// export default function Job() {
//   const [jobsData, setJobsData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedJob, setSelectedJob] = useState(null);
//   const [showFileUpload, setShowFileUpload] = useState(false);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch('/jobs.json');
//         const data = await response.json();
//         setJobsData(data.jobs || []);
//       } catch (error) {
//         console.error("Error fetching jobs:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchJobs();
//   }, []);

//   const handleFileUpload = (fileData) => {
//     console.log('File uploaded for job:', selectedJob.id, fileData);
   
//     setShowFileUpload(false);
//     setSelectedJob(null);
//   };

//   if (loading) return <div className="flex items-center justify-center min-h-screen bg-white">Loading jobs...</div>;
//   if (!jobsData.length) return <div className="flex items-center justify-center min-h-screen bg-white">No jobs available</div>;

//   return (
//     <>
//       {/* Job Detail Modal - This now appears directly */}
//       {selectedJob && !showFileUpload && (
//         <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
//           <div className="w-full max-w-4xl p-8 text-black">
//             <div className="flex justify-between items-start mb-6">
//               <div className="flex items-center">
//                 <TitleIcon className="w-6 h-6 mr-2 text-blue-600" />
//                 <h2 className="text-3xl font-bold">{selectedJob.Title}</h2>
//               </div>
//               <button
//                 onClick={() => setSelectedJob(null)}
//                 className="text-gray-500 hover:text-black text-2xl"
//               >
//                 ✕
//               </button>
//             </div>

//             <div className="space-y-4">
//               <div className="flex items-center">
//                 <CompanyIcon className="w-5 h-5 mr-2 text-gray-600" />
//                 <p><strong>Company:</strong> {selectedJob.CompanyName}</p>
//               </div>
//               <div className="flex items-center">
//                 <LocationIcon className="w-5 h-5 mr-2 text-gray-600" />
//                 <p><strong>Location:</strong> {selectedJob.WorkLocation}</p>
//               </div>
//               <div className="flex items-center">
//                 <EmploymentIcon className="w-5 h-5 mr-2 text-gray-600" />
//                 <p><strong>Employment Type:</strong> {selectedJob.EmploymentType}</p>
//               </div>
//               {selectedJob.Sector && (
//                 <div className="flex items-center">
//                   <JobTypeIcon className="w-5 h-5 mr-2 text-gray-600" />
//                   <p><strong>Sector:</strong> {selectedJob.Sector}</p>
//                 </div>
//               )}
//               <div className="flex items-start">
//                 <DescriptionIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
//                 <div>
//                   <p><strong>Description:</strong></p>
//                   <p className="mt-1">{selectedJob.Description}</p>
//                 </div>
//               </div>
//               <div className="flex items-start">
//                 <RequirementsIcon className="w-5 h-5 mr-2 text-gray-600 mt-1" />
//                 <div>
//                   <p><strong>Requirements:</strong></p>
//                   <p className="mt-1">{selectedJob.Requirements}</p>
//                 </div>
//               </div>
//               {selectedJob.Salary && (
//                 <div className="flex items-center">
//                   <SalaryIcon className="w-5 h-5 mr-2 text-gray-600" />
//                   <p><strong>Salary:</strong> {selectedJob.Salary}</p>
//                 </div>
//               )}
//             </div>

//             <div className="mt-8 flex justify-end gap-4">
//               <button
//                 onClick={() => setSelectedJob(null)}
//                 className="px-6 py-2 border border-gray-300 rounded hover:bg-gray-100 text-gray-700"
//               >
//                 Back to Jobs
//               </button>
//               <button
//                 onClick={() => setShowFileUpload(true)}
//                 className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
//               >
//                 Upload Files
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* File Upload Modal */}
//       {showFileUpload && selectedJob && (
//         <div className="fixed inset-0 bg-white z-50 overflow-y-auto flex justify-center items-start pt-20">
//           <div className="w-full max-w-4xl p-8 text-black">
//             <FileUpload
//               onBack={() => {
//                 setShowFileUpload(false);
//                 setSelectedJob(null);
//               }}
//               onSubmit={handleFileUpload}
//               jobTitle={selectedJob.Title}
//             />
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


