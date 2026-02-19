import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Filter, Grid, List, Search } from 'lucide-react';
import FilterContent from './components/FilterContent';
import LoadingSpinner from './components/LoadingSpinner';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import Navbar from '../../components/layout/Navbar';
import SearchHeader from './components/SearchHeader';
import JobCard from './components/JobCard';

const JobSeekerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    category: "",
    type: "",
    minSalary: "",
    maxSalary: "",
  });

  const [expandedSections, setExpandedSections] = useState({
    jobType: true,
    salary: true,
    categories: true,
  });

  const fetchJobs = async (filterParams = {}) => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();

      if (filterParams.keyword) params.append("keyword", filterParams.keyword);
      if (filterParams.location) params.append("location", filterParams.location);
      if (filterParams.minSalary) params.append("minSalary", filterParams.minSalary);
      if (filterParams.maxSalary) params.append("maxSalary", filterParams.maxSalary);
      if (filterParams.type) params.append("type", filterParams.type);
      if (filterParams.category) params.append("category", filterParams.category);
      if (user) params.append("userId", user?._id);

      const response = await axiosInstance.get(
        `${API_PATHS.JOBS.GET_ALL_JOBS}?${params.toString()}`
      );

      const jobsData = Array.isArray(response.data)
        ? response.data
        : response.data.jobs || [];

      setJobs(jobsData);
    } catch (err) {
      console.error("Error fetching jobs:", err);
      setError("Failed to fetch jobs.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchJobs(filters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters, user]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      category: "",
      type: "",
      minSalary: "",
      maxSalary: "",
    });
  };

  const toggleSaveJobs = async (jobId, isCurrentlySaved) => {
    try {
      if (isCurrentlySaved) {
        await axiosInstance.delete(API_PATHS.JOBS.UNSAVE_JOB(jobId));
        toast.success("Job removed successfully");
      } else {
        await axiosInstance.post(API_PATHS.JOBS.SAVE_JOB(jobId));
        toast.success("Job saved successfully");
      }

      fetchJobs(filters);
    } catch (error) {
      console.error("Error toggling save:", error);
      toast.error("Something went wrong!");
    }
  };

  const applyToJob = async (jobId) => {
    try {
      await axiosInstance.post(API_PATHS.APPLICATIONS.APPLY_TO_JOB(jobId));
      toast.success("Applied successfully");
      fetchJobs(filters);
    } catch (error) {
      const errorMsg = error?.response?.data?.message;
      toast.error(errorMsg || "Failed to apply");
    }
  };

  if (jobs.length === 0 && loading) return <LoadingSpinner />;

  return (
    <div className='bg-linear-to-br from-blue-50 via-white to-purple-50'>
      <Navbar />
      <div className='min-h-screen mt-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8'>

          <SearchHeader
            filters={filters}
            handleFilterChange={handleFilterChange}
          />

          <div className='flex gap-6 lg:gap-8'>

            {/* Sidebar */}
            <div className='hidden lg:block w-80 shrink-0'>
              <div className='bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 sticky top-20'>
                <h3 className='font-bold text-gray-900 text-xl mb-6'>
                  Filter Jobs
                </h3>

                <FilterContent
                  toggleSection={toggleSection}
                  clearAllFilters={clearAllFilters}
                  expandedSections={expandedSections}
                  filters={filters}
                  handleFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Jobs Section */}
            <div className='flex-1 min-w-0'>

              <div className='flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 gap-4'>
                <p className='text-gray-600'>
                  Showing{" "}
                  <span className='font-bold text-gray-900'>
                    {jobs.length}
                  </span>{" "}
                  jobs
                </p>

                <div className='flex items-center gap-4'>

                  <div className='flex items-center border border-gray-200 rounded-xl p-1 bg-white'>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg ${
                        viewMode === "grid"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600"
                      }`}
                    >
                      <Grid className='h-4 w-4' />
                    </button>

                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg ${
                        viewMode === "list"
                          ? "bg-blue-600 text-white"
                          : "text-gray-600"
                      }`}
                    >
                      <List className='h-4 w-4' />
                    </button>
                  </div>
                </div>
              </div>

              {jobs.length === 0 ? (
                <div className='text-center py-20 bg-white/60 rounded-2xl'>
                  <Search className='w-16 h-16 mx-auto text-gray-400 mb-6' />
                  <h3 className='text-2xl font-bold'>No Jobs found</h3>
                  <button
                    onClick={clearAllFilters}
                    className='mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl'
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 lg:grid-cols-2 gap-6"
                      : "space-y-6"
                  }
                >
                  {jobs.map((job) => (
                    <JobCard
                      key={job._id}
                      job={job}

                      // ✅ FIXED: Navigation added
                      onClick={() => navigate(`/job/${job._id}`)}

                      onToggleSave={() =>
                        toggleSaveJobs(job._id, job.isSaved)
                      }
                      onApply={() => applyToJob(job._id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
