import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import InterviewSession from "../../components/interview/InterviewSession";
import { FileText, ArrowLeft } from "lucide-react";

const InterviewPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const resumeId = params.get("resumeId") || user?.resumeId || "";
  const jobDescription = params.get("jd")
    ? decodeURIComponent(params.get("jd"))
    : "";
  const questionLimit = parseInt(params.get("limit") || "5", 10);

  if (!resumeId) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-md w-full text-center mx-4">
          <div className="w-14 h-14 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-blue-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            No Resume Found
          </h2>
          <p className="text-sm text-slate-500 mb-6 leading-relaxed">
            You need to upload a resume before starting an interview. Go to your
            profile and upload a PDF resume first.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="flex-1 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-xl transition-all shadow-sm shadow-blue-200"
            >
              Upload Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen">
      <InterviewSession
        resumeId={resumeId}
        jobDescription={jobDescription}
        questionLimit={questionLimit}
        userId={user?._id || null}
        onComplete={(data) => {
          console.log("Interview complete:", data);
        }}
        onEnd={() => navigate("/interview-history")}
      />
    </div>
  );
};

export default InterviewPage;
