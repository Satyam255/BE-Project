import React, { useState, useEffect } from "react";

const SalaryRangeSlider = ({ filters, handleFilterChange }) => {
  const [minSalary, setMinSalary] = useState(filters?.minSalary || "");
  const [maxSalary, setMaxSalary] = useState(filters?.maxSalary || "");

  // Sync local state when filters change
  useEffect(() => {
    setMinSalary(filters?.minSalary || "");
    setMaxSalary(filters?.maxSalary || "");
  }, [filters]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {/* Min Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Min Salary
          </label>
          <input
            type="number"
            placeholder="0"
            min="0"
            step="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={minSalary}
            onChange={(e) => setMinSalary(e.target.value)}
            onBlur={() =>
              handleFilterChange(
                "minSalary",
                minSalary ? parseInt(minSalary) : ""
              )
            }
          />
        </div>

        {/* Max Salary */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Max Salary
          </label>
          <input
            type="number"
            placeholder="No Limit"
            min="0"
            step="10000"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            value={maxSalary}
            onChange={(e) => setMaxSalary(e.target.value)}
            onBlur={() =>
              handleFilterChange(
                "maxSalary",
                maxSalary ? parseInt(maxSalary) : ""
              )
            }
          />
        </div>
      </div>

      {/* Display current range */}
      {(minSalary || maxSalary) && (
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded">
          Range: {minSalary ? Number(minSalary).toLocaleString() : "₹0"} -{" "}
          {maxSalary ? Number(maxSalary).toLocaleString() : "No Limit"}
        </div>
      )}
    </div>
  );
};

export default SalaryRangeSlider;
