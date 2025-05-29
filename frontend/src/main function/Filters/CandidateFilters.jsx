import React, { useState } from "react";
const CandidateFilters = ({ candidates, onFilterChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    department: "",
    location: "",
    status: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const resetFilters = {
      department: "",
      location: "",
      status: "",
    };
    setFilters(resetFilters);
    onClearFilters();
  };

  return (
    <div className="mb-4 bg-gray-50 p-3 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-medium mb-1 text-black">
            Department
          </label>
          <select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            className="w-full px-2 py-1 border border-gray-300 rounded text-[11px] text-black"
          >
            <option value="">All Departments</option>
            {[
              ...new Set(candidates.map((candidate) => candidate.department)),
            ].map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[10px] font-medium mb-1 text-black">
            Country
          </label>
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={handleFilterChange}
            placeholder="Enter country name"
            className="w-full px-2 py-1 border border-gray-300 rounded text-[11px] text-black"
          />
        </div>

        <div>
          <label className="block text-[10px] font-medium mb-1 text-black">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-2 py-1 border border-gray-300 rounded text-[11px] text-black"
          >
            <option value="">All Statuses</option>
            <option value="Under Review">Under Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Interview">Interview</option>
            <option value="Call for exam">Call for exam</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-[11px] text-black"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateFilters;
