import React from "react";
import {
  Building2,
  Users,
  Briefcase,
  TrendingUp,
  Plus,
  ArrowRight,
  CheckCircle2,
  MapPin,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { useSkillBridgeState } from "../../lib/storage";

interface IndustryDashboardProps {
  onNavigate: (tab: string) => void;
}

export const IndustryDashboard: React.FC<IndustryDashboardProps> = ({ onNavigate }) => {
  const { company, internships, applications } = useSkillBridgeState();

  // Company internships
  const companyInternships = internships.filter(
    (i) => i.companyId === company.id || i.companyName.toLowerCase().includes("cybershield")
  );

  // Applications to company internships
  const internshipIds = companyInternships.map((i) => i.id);
  const companyApplications = applications.filter(
    (a) => internshipIds.includes(a.internshipId) || a.companyName.toLowerCase().includes("cybershield")
  );

  const avgMatchScore =
    companyApplications.length > 0
      ? Math.round(
          companyApplications.reduce((acc, a) => acc + a.matchScore, 0) / companyApplications.length
        )
      : 75;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-emerald-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Recruiter Portal
              </span>
              <span className="text-xs text-slate-300">{company.industryType} • {company.location}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {company.companyName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {company.tagline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate("ind_post")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post New Internship</span>
            </button>
            <button
              onClick={() => onNavigate("ind_applicants")}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Review Applicants</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recruiter Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Active Listings</span>
          <div className="text-2xl font-black text-slate-900">{companyInternships.length} Postings</div>
          <span className="text-[11px] text-emerald-600 font-medium">Accepting applications</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Total Candidates Applied</span>
          <div className="text-2xl font-black text-indigo-600">{companyApplications.length} Applicants</div>
          <span className="text-[11px] text-slate-400">Scored via transparent rules</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Avg. Candidate Match</span>
          <div className="text-2xl font-black text-emerald-600">{avgMatchScore}%</div>
          <span className="text-[11px] text-slate-400">Aligned to required proficiencies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block mb-1">Campus Hiring Pipeline</span>
          <div className="text-2xl font-black text-slate-900">3 Colleges</div>
          <span className="text-[11px] text-slate-400">NIT Trichy, COEP, IIIT</span>
        </div>
      </div>

      {/* Top Ranked Applicants Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Algorithm Ranked
            </span>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Top Ranked Candidate Matches
            </h2>
            <p className="text-xs text-slate-500">
              Students automatically ranked according to verified requirement match scores.
            </p>
          </div>

          <button
            onClick={() => onNavigate("ind_applicants")}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({companyApplications.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {companyApplications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              onClick={() => onNavigate("ind_applicants")}
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-300 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer bg-slate-50/40"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-xs text-slate-900">{app.studentName}</h3>
                  <span className="text-[11px] text-slate-500">({app.studentCollege})</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                    CGPA {app.studentCgpa}
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Applied for: <strong>{app.internshipTitle}</strong> • Status:{" "}
                  <span className="capitalize font-semibold text-slate-800">{app.status.replace("_", " ")}</span>
                </p>
                {app.coverNote && (
                  <p className="text-[11px] text-slate-500 italic mt-1 line-clamp-1">
                    "{app.coverNote}"
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-black ${
                      app.matchScore >= 80
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {app.matchScore}% Match
                  </span>
                  <span className="block text-[10px] text-slate-400 mt-0.5">Objective Score</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate("ind_applicants");
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Postings Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Active Internship Postings ({companyInternships.length})
          </h2>
          <button
            onClick={() => onNavigate("ind_post")}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Posting</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyInternships.map((int) => (
            <div key={int.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                  {int.workMode}
                </span>
                <span className="text-xs font-bold text-emerald-600">{int.stipend}</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900">{int.title}</h3>
              <p className="text-xs text-slate-500 line-clamp-2">{int.description}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Location: {int.location}</span>
                <span className="text-rose-600">Deadline: {int.deadline}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
