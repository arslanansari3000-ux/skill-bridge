import React, { useState } from "react";
import {
  Users,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  GraduationCap,
  FileText,
  Mail,
  ChevronDown,
  ArrowRight,
  Filter,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { Application } from "../../types";

interface CandidateMatchingProps {
  onNavigate: (tab: string) => void;
}

export const CandidateMatching: React.FC<CandidateMatchingProps> = ({ onNavigate }) => {
  const { applications, company, internships, students } = useSkillBridgeState();

  const [selectedInternshipFilter, setSelectedInternshipFilter] = useState<string>("all");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("all");
  const [activeCandidateModal, setActiveCandidateModal] = useState<Application | null>(null);

  // Filter applications for company postings
  const companyInternshipIds = internships
    .filter((i) => i.companyId === company.id || i.companyName.toLowerCase().includes("cybershield"))
    .map((i) => i.id);

  const candidateList = applications
    .filter((app) => {
      const belongsToCompany =
        companyInternshipIds.includes(app.internshipId) ||
        app.companyName.toLowerCase().includes("cybershield");

      if (!belongsToCompany) return false;

      if (selectedInternshipFilter !== "all" && app.internshipId !== selectedInternshipFilter) {
        return false;
      }

      if (selectedStatusFilter !== "all" && app.status !== selectedStatusFilter) {
        return false;
      }

      return true;
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  const handleUpdateStatus = (appId: string, newStatus: Application["status"]) => {
    storage.updateApplicationStatus(appId, newStatus);
    if (activeCandidateModal && activeCandidateModal.id === appId) {
      setActiveCandidateModal({ ...activeCandidateModal, status: newStatus });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
            Candidate Intelligence
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Applicant Skill-Matching & Evaluation
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Objective candidate rankings calculated against your job requirements. Zero resume noise, 100% verified competency evaluation.
          </p>
        </div>

        <button
          onClick={() => onNavigate("ind_post")}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>Post Another Internship</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Filter Role:</span>
            <select
              value={selectedInternshipFilter}
              onChange={(e) => setSelectedInternshipFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Internship Postings</option>
              {internships
                .filter((i) => companyInternshipIds.includes(i.id))
                .map((int) => (
                  <option key={int.id} value={int.id}>
                    {int.title}
                  </option>
                ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewing">Interviewing</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <span className="text-xs text-slate-500 font-semibold">
          Showing <strong>{candidateList.length}</strong> evaluated candidates
        </span>
      </div>

      {/* Candidate Cards List */}
      <div className="space-y-4">
        {candidateList.map((app) => {
          // Identify corresponding student profile
          const studentProfile = students.find((s) => s.id === app.studentId);
          const studentSkills = app.studentSkills || studentProfile?.skills || [];

          // Target internship requirements
          const targetInt = internships.find((i) => i.id === app.internshipId);
          const requiredSkills = targetInt ? targetInt.requiredSkills : [];

          // Classify strong vs missing
          const strongSkills = studentSkills.filter((s) =>
            requiredSkills.some(
              (r) =>
                r.skillName.toLowerCase() === s.name.toLowerCase() ||
                r.skillId === s.skillId
            )
          );

          const missingSkills = requiredSkills.filter(
            (r) =>
              !studentSkills.some(
                (s) =>
                  s.name.toLowerCase() === r.skillName.toLowerCase() ||
                  s.skillId === r.skillId
              )
          );

          return (
            <div
              key={app.id}
              className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-md transition space-y-4"
            >
              {/* Top Row: Candidate Details & Match Score */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-base font-extrabold text-slate-900">
                      {app.studentName}
                    </h3>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {app.studentCollege}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      CGPA {app.studentCgpa}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">
                    Applying for: <strong className="text-slate-800">{app.internshipTitle}</strong> • Applied on {app.appliedAt}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span
                      className={`inline-block px-3.5 py-1.5 rounded-full text-sm font-black shadow-xs ${
                        app.matchScore >= 80
                          ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                          : app.matchScore >= 50
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-rose-100 text-rose-900 border border-rose-300"
                      }`}
                    >
                      {app.matchScore}% Skill Match
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-0.5">
                      {app.matchScore >= 80 ? "Top Recommendation" : "Partial Skill Gaps"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle Row: Skill Breakdown (Strong vs Missing) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Strong Skills */}
                <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-1.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Strong Skills ({strongSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {strongSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[11px]"
                      >
                        {sk.name} ({sk.level})
                      </span>
                    ))}
                    {strongSkills.length === 0 && (
                      <span className="text-slate-400 italic">No direct matching skills</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <span className="font-bold text-rose-900 block mb-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    Missing / Unmet Requirements ({missingSkills.length})
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {missingSkills.map((sk, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold text-[11px]"
                      >
                        {sk.skillName} (Req: {sk.minimumLevel || sk.level})
                      </span>
                    ))}
                    {missingSkills.length === 0 && (
                      <span className="text-emerald-700 font-semibold">
                        Full requirement coverage!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Education & Projects Preview */}
              {studentProfile && studentProfile.projects && studentProfile.projects.length > 0 && (
                <div className="pt-2 text-xs text-slate-600 border-t border-slate-100 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5 text-indigo-600" />
                    Recent Project: <strong>{studentProfile.projects[0].title}</strong> ({studentProfile.projects[0].techStack.join(", ")})
                  </span>
                  {app.coverNote && (
                    <span className="text-[11px] text-slate-400 italic max-w-sm truncate">
                      Note: "{app.coverNote}"
                    </span>
                  )}
                </div>
              )}

              {/* Bottom Actions Row: Status change buttons */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Current Status:</span>
                  <span className="font-bold text-slate-900 capitalize px-2 py-0.5 rounded bg-slate-100 border border-slate-200">
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => handleUpdateStatus(app.id, "shortlisted")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      app.status === "shortlisted"
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100"
                    }`}
                  >
                    Shortlist
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app.id, "interviewing")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      app.status === "interviewing"
                        ? "bg-purple-600 text-white"
                        : "bg-purple-50 text-purple-800 hover:bg-purple-100"
                    }`}
                  >
                    Schedule Interview
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app.id, "accepted")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      app.status === "accepted"
                        ? "bg-emerald-700 text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                  >
                    Extend Offer
                  </button>

                  <button
                    onClick={() => handleUpdateStatus(app.id, "rejected")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      app.status === "rejected"
                        ? "bg-rose-600 text-white"
                        : "bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
                    }`}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
