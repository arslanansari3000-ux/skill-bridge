import React from "react";
import {
  GraduationCap,
  Target,
  Briefcase,
  BookOpen,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  MapPin,
  Building,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { calculateSkillGap, calculateInternshipMatch } from "../../lib/skillGapAlgorithm";

interface StudentDashboardProps {
  onNavigate: (tab: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { student, careers, learningResources, internships, applications } = useSkillBridgeState();

  // Find target career (defaults to Cybersecurity Analyst if none selected)
  const targetCareer =
    careers.find((c) => c.id === student.preferredCareerId) ||
    careers.find((c) => c.id === "car-cybersec") ||
    careers[0];

  // Calculate live skill-gap analysis
  const skillGap = calculateSkillGap(targetCareer, student.skills);

  // Compute profile completion percentage
  let profileScore = 0;
  if (student.name && student.email) profileScore += 20;
  if (student.college && student.branch && student.cgpa) profileScore += 25;
  if (student.skills && student.skills.length > 0) profileScore += 25;
  if (student.projects && student.projects.length > 0) profileScore += 15;
  if (student.certifications && student.certifications.length > 0) profileScore += 15;

  // Filter recommended learning resources targeting missing or improvement skills
  const missingSkillNames = [
    ...skillGap.criticalMissingSkills.map((s) => s.skillName.toLowerCase()),
    ...skillGap.skillsToImprove.map((s) => s.skillName.toLowerCase()),
  ];

  const recommendedResources = learningResources
    .filter((lr) => missingSkillNames.includes(lr.skillName.toLowerCase()))
    .slice(0, 3);

  // Filter and sort internships by skill match score
  const matchedInternships = internships
    .map((intern) => {
      const matchScore = calculateInternshipMatch(intern.requiredSkills, student.skills);
      return { ...intern, matchScore };
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  // Recent applications
  const myApplications = applications.filter((a) => a.studentId === student.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-indigo-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                Student Portal
              </span>
              <span className="text-xs text-indigo-300">
                {student.college} • {student.branch} (CGPA {student.cgpa})
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, {student.name}!
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl">
              Target Career: <strong className="text-white">{targetCareer.title}</strong> • Current Industry Alignment: <strong className="text-amber-300">{skillGap.overallMatch}%</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate("skill_gap")}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Skill Gap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onNavigate("ai_advisor")}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Ask AI Advisor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Grid of Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span className="font-semibold">Profile Completion</span>
              <span className="font-bold text-indigo-600">{profileScore}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${profileScore}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              {profileScore === 100
                ? "Profile fully verified with resume & projects."
                : "Add more certifications or projects to reach 100%."}
            </p>
          </div>
          <button
            onClick={() => onNavigate("profile")}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Edit Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Current Skills Count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Current Evaluated Skills</span>
            <div className="text-2xl font-black text-slate-900">{student.skills.length} Skills</div>
            <div className="flex flex-wrap gap-1 mt-2">
              {student.skills.slice(0, 3).map((s, idx) => (
                <span
                  key={idx}
                  className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium text-[10px] border border-indigo-100"
                >
                  {s.name} ({s.level[0].toUpperCase()})
                </span>
              ))}
              {student.skills.length > 3 && (
                <span className="text-[10px] text-slate-400 self-center">
                  +{student.skills.length - 3} more
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onNavigate("assessment")}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Rate New Skills</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Target Career Match */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span className="font-semibold">Career Skill Match</span>
              <span className="font-extrabold text-amber-600">{skillGap.overallMatch}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-amber-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${skillGap.overallMatch}%` }}
              ></div>
            </div>
            <p className="text-[11px] text-slate-600 mt-2 font-medium">
              Target: <span className="text-slate-900 font-bold">{targetCareer.title}</span>
            </p>
          </div>
          <button
            onClick={() => onNavigate("careers")}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Change Target Career</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Applications Track */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-1">Active Applications</span>
            <div className="text-2xl font-black text-slate-900">{myApplications.length} Submitted</div>
            <p className="text-[11px] text-slate-500 mt-2">
              {myApplications.length > 0
                ? `Latest: ${myApplications[0].internshipTitle} (${myApplications[0].status.replace('_', ' ')})`
                : "No applications submitted yet."}
            </p>
          </div>
          <button
            onClick={() => onNavigate("applications")}
            className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
          >
            <span>Track Applications</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Core Highlight: Skill-Gap Card (Matching Prompt Example) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2 mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold border border-amber-200">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Career</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                  {targetCareer.category}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                "{targetCareer.title}"
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Current Skill Match</span>
              <span className="text-xl font-black text-amber-600">"{skillGap.overallMatch}%"</span>
            </div>
            <button
              onClick={() => onNavigate("skill_gap")}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition cursor-pointer"
            >
              Analyze Breakdown
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Missing Skills Card */}
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Missing Skills ({skillGap.criticalMissingSkills.length})
              </span>
            </div>
            {skillGap.criticalMissingSkills.length > 0 ? (
              <ul className="space-y-1.5">
                {skillGap.criticalMissingSkills.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs text-rose-950 font-semibold bg-white p-2 rounded-lg border border-rose-100">
                    <span>• {s.skillName}</span>
                    <span className="text-[10px] font-normal text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                      Req: {s.requiredLevel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">No critical missing skills!</p>
            )}
          </div>

          {/* Skills to Improve */}
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                Skills to Improve ({skillGap.skillsToImprove.length})
              </span>
            </div>
            {skillGap.skillsToImprove.length > 0 ? (
              <ul className="space-y-1.5">
                {skillGap.skillsToImprove.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs text-amber-950 font-semibold bg-white p-2 rounded-lg border border-amber-100">
                    <span>• {s.skillName}</span>
                    <span className="text-[10px] font-normal text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                      {s.studentLevel} → {s.requiredLevel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">All possessed skills meet the target proficiency level.</p>
            )}
          </div>

          {/* Strong Skills */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Strong Skills ({skillGap.strongSkills.length})
              </span>
            </div>
            {skillGap.strongSkills.length > 0 ? (
              <ul className="space-y-1.5">
                {skillGap.strongSkills.map((s, idx) => (
                  <li key={idx} className="flex items-center justify-between text-xs text-emerald-950 font-semibold bg-white p-2 rounded-lg border border-emerald-100">
                    <span>• {s.skillName}</span>
                    <span className="text-[10px] font-normal text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Level: {s.studentLevel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Rate skills to identify verified strengths.</p>
            )}
          </div>
        </div>
      </div>

      {/* Two Column Section: Recommended Learning & Matched Internships */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recommended Learning Resources */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recommended Learning Resources
                </h3>
              </div>
              <button
                onClick={() => onNavigate("learning")}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Directly targeted to bridge your missing skills in <strong>Computer Networking</strong>, <strong>Linux</strong>, and <strong>Web Security</strong>.
            </p>

            <div className="space-y-3">
              {recommendedResources.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition flex items-start justify-between gap-3 bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">
                        {res.skillName}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {res.resourceType} • {res.difficulty}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900">{res.title}</h4>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                      <span>Provider: {res.provider}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {res.estimatedHours} hrs
                      </span>
                    </div>
                  </div>

                  <a
                    href={res.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-white hover:bg-indigo-50 text-indigo-600 border border-slate-200 shadow-2xs transition shrink-0"
                    title="Open Learning Portal"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("learning")}
            className="w-full mt-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Explore Complete Learning Curriculum</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recommended Matched Internships */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Recommended Internships For You
                </h3>
              </div>
              <button
                onClick={() => onNavigate("internships")}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Browse All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Opportunities ranked by your real-time skill matching score against employer criteria.
            </p>

            <div className="space-y-3">
              {matchedInternships.map((int) => (
                <div
                  key={int.id}
                  className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition flex items-start justify-between gap-3 bg-slate-50/50"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xs text-slate-900">{int.title}</span>
                      <span className="text-[10px] text-slate-500">at {int.companyName}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {int.location} ({int.workMode})
                      </span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{int.stipend}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {int.requiredSkills.map((req, i) => (
                        <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                          {req.skillName}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        int.matchScore >= 80
                          ? "bg-emerald-100 text-emerald-800"
                          : int.matchScore >= 50
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {int.matchScore}% Match
                    </span>
                    <button
                      onClick={() => onNavigate("internships")}
                      className="block mt-2 text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => onNavigate("internships")}
            className="w-full mt-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open Internship Marketplace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
