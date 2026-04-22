import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import Navbar from "../../components/layout/Navbar";
import StatusBadge from "../../components/StatusBadge";
import {
  ArrowLeft,
  Bot,
  Briefcase,
  Calendar,
  FileText,
  MapPin,
} from "lucide-react";
import moment from "moment";

const MyApplications = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyApplications = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        API_PATHS.APPLICATIONS.GET_MY_APPLICATIONS,
      );
      setApplications(res.data || []);
    } catch (err) {
      console.error("Failed to load applications:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyApplications();
  }, [user]);

  const handleStartInterview = (app) => {
    const jd = encodeURIComponent(
      `${app.job?.description || ""}\n${app.job?.requirements || ""}`,
    );
    navigate(`/interview?resumeId=${user?.resumeId || ""}&jd=${jd}&limit=5`);
  };

  // ✅ NEW: navigate to assessment instructions page
  const handleStartAssessment = (app) => {
    navigate(`/assessment/${app.assessmentToken}`);
  };

  // ✅ REPLACE WITH THIS
  const handleViewResult = (app) => {
    navigate(`/assessment/${app.assessmentToken}/result`);
  };

  const atsColour = (score) => {
    if (score == null) return "bg-gray-100 text-gray-500";
    if (score >= 70) return "bg-green-100 text-green-700";
    if (score >= 45) return "bg-yellow-100 text-yellow-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      <Navbar />

      <div className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/find-jobs")}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border rounded-lg hover:bg-blue-600 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                My Applications
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Track your job applications and start AI interviews when invited
              </p>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty state */}
          {!loading && applications.length === 0 && (
            <div className="text-center py-20 bg-white rounded-2xl shadow border">
              <FileText className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700">
                No applications yet
              </h3>
              <p className="text-gray-500 mt-1 mb-6">
                Start applying to jobs to see them here.
              </p>
              <button
                onClick={() => navigate("/find-jobs")}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Browse Jobs
              </button>
            </div>
          )}

          {/* Applications list */}
          {!loading && applications.length > 0 && (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app._id}
                  className="bg-white rounded-2xl border shadow-sm hover:shadow-md transition p-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left — Job info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
                          <Briefcase className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">
                            {app.job?.title || "Unknown Position"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-gray-500">
                            {app.job?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                {app.job.location}
                              </span>
                            )}
                            {app.job?.type && (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3.5 w-3.5" />
                                {app.job.type}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              Applied{" "}
                              {moment(app.createdAt).format("Do MMM YYYY")}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* ATS + Status row */}
                      <div className="flex flex-wrap items-center gap-2 mt-3 ml-13">
                        <StatusBadge status={app.status} />

                        {app.atsScore != null ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${atsColour(
                              app.atsScore,
                            )}`}
                          >
                            ATS Score: {app.atsScore.toFixed(1)}%
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                            ATS: Pending
                          </span>
                        )}

                        {app.interviewInvited && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700">
                            <Bot className="h-3 w-3" />
                            Interview Unlocked
                          </span>
                        )}
                        {/* ✅ NEW: assessment invite badge */}
                        {app.assessmentInvited && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
                            <FileText className="h-3 w-3" />
                            Assessment Invited
                          </span>
                        )}
                        {/* ✅ NEW: assessment passed badge */}
                        {app.assessmentPassed && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                            ✓ Assessment Passed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right — Start AI Interview button */}
                    <div className="shrink-0">
                      {app.interviewInvited ? (
                        // ✅ invited — show Start button
                        <button
                          onClick={() => handleStartInterview(app)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 shadow-md shadow-purple-200 transition"
                        >
                          <Bot className="h-4 w-4" />
                          Start AI Interview
                        </button>
                      ) : app.assessmentPassed ? (
                        // ✅ NEW — passed assessment, auto unlocked
                        <button
                          onClick={() => handleStartInterview(app)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 text-white text-sm font-semibold rounded-xl hover:bg-purple-700 shadow-md shadow-purple-200 transition"
                        >
                          <Bot className="h-4 w-4" />
                          Start AI Interview
                        </button>
                      ) : app.assessmentSubmitted && !app.assessmentPassed ? (
                        // ✅ NEW — submitted but failed assessment
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-400 text-sm font-medium rounded-xl border border-red-100 select-none">
                          <Bot className="h-4 w-4" />
                          Assessment Failed
                        </div>
                      ) : (
                        // default — awaiting invite
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed select-none">
                          <Bot className="h-4 w-4" />
                          Awaiting Invite
                        </div>
                      )}
                    </div>
                    {/* ✅ UPDATED: assessment button — 3 states */}
                    <div className="shrink-0 flex flex-col gap-2 items-end">
                      {!app.assessmentInvited ? (
                        // State 1 — no invite yet
                        <div className="flex items-center gap-2 px-5 py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-xl cursor-not-allowed select-none">
                          <FileText className="h-4 w-4" />
                          Awaiting Assessment
                        </div>
                      ) : app.assessmentSubmitted ? (
                        // State 2 — submitted, show View Result button
                        // ✅ CORRECT — clean, no removed variables referenced
                        <button
                          onClick={() => handleViewResult(app)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-200 transition"
                        >
                          <FileText className="h-4 w-4" />
                          View Result
                        </button>
                      ) : (
                        // State 3 — invited but not submitted, show Start button
                        <button
                          onClick={() => handleStartAssessment(app)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-200 transition"
                        >
                          <FileText className="h-4 w-4" />
                          Start Assessment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyApplications;
