import React from "react";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { useSkillBridgeState } from "../../lib/storage";

interface StudentApplicationsProps {
  onNavigate: (tab: string) => void;
}

export const StudentApplications: React.FC<StudentApplicationsProps> = ({ onNavigate }) => {
  const { applications, student } = useSkillBridgeState();

  const myApplications = applications.filter((a) => a.studentId === student.id);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "applied":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">Applied</span>;
      case "under_review":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">Under Review</span>;
      case "shortlisted":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">Shortlisted for Interview</span>;
      case "interviewing":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">Interview Scheduled</span>;
      case "accepted":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white">Offer Extended</span>;
      case "rejected":
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">Not Selected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
            Application Tracker
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Submitted Internship Applications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor real-time recruiter reviews, interview shortlists, and application statuses.
          </p>
        </div>

        <button
          onClick={() => onNavigate("internships")}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>Find More Internships</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {myApplications.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No applications submitted yet</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Browse verified opportunities in the internship marketplace and apply to roles where your skill match score is highest.
          </p>
          <button
            onClick={() => onNavigate("internships")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition cursor-pointer"
          >
            Explore Internships Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {app.companyName}
                  </span>
                  <span className="text-xs text-slate-400">
                    Applied on: {app.appliedAt}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900">
                  {app.internshipTitle}
                </h3>

                {app.coverNote && (
                  <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 max-w-2xl">
                    <strong className="text-slate-700">Cover Note:</strong> "{app.coverNote}"
                  </p>
                )}
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                {getStatusBadge(app.status)}
                <span className="text-xs font-extrabold text-slate-700 mt-1">
                  Candidate Score: {app.matchScore}% Match
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
