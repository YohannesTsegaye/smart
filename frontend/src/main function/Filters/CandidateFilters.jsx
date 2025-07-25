import React, { useState } from "react";

const CandidateFilters = ({
  candidates = [],
  onFilterChange,
  onClearFilters,
}) => {
  const [filters, setFilters] = useState({
    department: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  // Get unique departments from candidates
  const uniqueDepartments = [
    ...new Set(candidates.map((candidate) => candidate.department)),
  ].filter(Boolean);

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Department
          </label>
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-2">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black text-sm"
          >
            <option value="">All Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Received">Received</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Interview">Interview</option>
            <option value="Call for exam">Call for exam</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={onClearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateFilters;
