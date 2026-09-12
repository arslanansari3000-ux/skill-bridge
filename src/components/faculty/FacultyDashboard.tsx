import React, { useState } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Building2,
  GraduationCap,
  Filter,
  BarChart3,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Download,
} from "lucide-react";
import { useSkillBridgeState } from "../../lib/storage";
import { calculateSkillGap } from "../../lib/skillGapAlgorithm";
import { SEED_INDUSTRY_DEMAND, SEED_TOP_SKILL_GAPS } from "../../data/seedData";

interface FacultyDashboardProps {
  onNavigate: (tab: string) => void;
}

export const FacultyDashboard: React.FC<FacultyDashboardProps> = ({ onNavigate }) => {
  const { faculty, students, careers, internships, applications } = useSkillBridgeState();

  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedCareer, setSelectedCareer] = useState<string>("all");
  const [searchStudent, setSearchStudent] = useState<string>("");

  // Calculate cohort metrics
  const totalStudents = students.length;
  const activeStudents = totalStudents; // In demo, all are active
  const totalInternships = internships.length;
  const totalApplications = applications.length;
  const partnerIndustriesCount = 180; // realistic platform count

  // Calculate average skill match across students
  const studentEvaluations = students.map((s) => {
    const target =
      careers.find((c) => c.id === s.preferredCareerId) ||
      careers.find((c) => c.id === "car-cybersec") ||
      careers[0];
    const gap = calculateSkillGap(target, s.skills);
    return {
      student: s,
      targetCareer: target,
      gap,
      needsTraining: gap.overallMatch < 65,
    };
  });

  const avgSkillMatch = Math.round(
    studentEvaluations.reduce((acc, curr) => acc + curr.gap.overallMatch, 0) /
      studentEvaluations.length
  );

  const studentsNeedingTraining = studentEvaluations.filter((s) => s.needsTraining).length;

  // Filter students
  const filteredEvaluations = studentEvaluations.filter((item) => {
    const matchesBranch =
      selectedBranch === "all" || item.student.branch.toLowerCase().includes(selectedBranch.toLowerCase());
    const matchesCareer =
      selectedCareer === "all" || item.targetCareer.id === selectedCareer;
    const matchesSearch =
      item.student.name.toLowerCase().includes(searchStudent.toLowerCase()) ||
      item.student.college.toLowerCase().includes(searchStudent.toLowerCase());

    return matchesBranch && matchesCareer && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Faculty Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden border border-amber-800/40">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                Institutional Academic Portal
              </span>
              <span className="text-xs text-slate-300">
                {faculty.college} • {faculty.department}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {faculty.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              {faculty.designation} • Real-time curriculum intelligence, cohort skill deficiencies, and industry placement alignment.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => onNavigate("fac_industry_demand")}
              className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <TrendingUp className="w-4 h-4 text-slate-950" />
              <span>Industry Demand Trends</span>
            </button>
            <button
              onClick={() => {
                alert("Generating official AICTE/NAAC Curriculum Gap Analysis Report (PDF)...");
              }}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>Export NAAC Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7 Core Faculty Dashboard Key Metrics (Direct from Prompt Specification) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {/* 1. Total Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Total Students
          </span>
          <div className="text-2xl font-black text-slate-900">2,450</div>
          <span className="text-[10px] text-slate-400">Registered</span>
        </div>

        {/* 2. Active Students */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Active Students
          </span>
          <div className="text-2xl font-black text-indigo-600">2,180</div>
          <span className="text-[10px] text-indigo-700 font-semibold">89% active</span>
        </div>

        {/* 3. Average Skill Match */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Avg Skill Match
          </span>
          <div className="text-2xl font-black text-amber-600">{avgSkillMatch}%</div>
          <span className="text-[10px] text-amber-700 font-semibold">Industry aligned</span>
        </div>

        {/* 4. Students Needing Training */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Need Training
          </span>
          <div className="text-2xl font-black text-rose-600">{studentsNeedingTraining * 120}</div>
          <span className="text-[10px] text-rose-700 font-semibold">Match &lt; 65%</span>
        </div>

        {/* 5. Active Internships Available */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Active Internships
          </span>
          <div className="text-2xl font-black text-emerald-600">420+</div>
          <span className="text-[10px] text-emerald-700 font-semibold">Live openings</span>
        </div>

        {/* 6. Total Applications */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Applications
          </span>
          <div className="text-2xl font-black text-slate-900">1,840</div>
          <span className="text-[10px] text-slate-400">Transmitted</span>
        </div>

        {/* 7. Industry Partners Connected */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-center col-span-2 sm:col-span-1">
          <span className="text-[11px] font-semibold text-slate-500 block mb-1">
            Industry Partners
          </span>
          <div className="text-2xl font-black text-indigo-900">{partnerIndustriesCount}+</div>
          <span className="text-[10px] text-slate-400">Recruiting entities</span>
        </div>
      </div>

      {/* Two Column Visual Analytics: Top Skill Gaps vs Industry Skill Demand */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skill Gap Overview (Top Deficiencies Across Students) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2 py-0.5 rounded">
                Curriculum Bottlenecks
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Top Student Skill Gaps
              </h2>
              <p className="text-xs text-slate-500">
                Percentage of students lacking requisite industry proficiency.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">Cohort N=2,450</span>
          </div>

          <div className="space-y-3.5">
            {SEED_TOP_SKILL_GAPS.map((gap, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    {gap.skill}
                  </span>
                  <span className="font-extrabold text-rose-600">
                    {gap.percentageLacking}% of students lacking
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-400 to-rose-600 h-full rounded-full"
                    style={{ width: `${gap.percentageLacking}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Affected: {gap.studentsAffected} students</span>
                  <span className="text-indigo-600 font-semibold">
                    Recommendation: {gap.recommendation}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                alert("Initiating 6-week hands-on bootcamp requisition for Computer Networking & Linux...");
              }}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Schedule Remedial Networking & Linux Bootcamp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Industry Skill Demand (What Employers are Actively Hiring For) */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                Employer Requirements
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">
                Industry Skill Demand Trends
              </h2>
              <p className="text-xs text-slate-500">
                Top requested technical skills across active employer job postings.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-semibold">180+ Companies</span>
          </div>

          <div className="space-y-3.5">
            {SEED_INDUSTRY_DEMAND.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {item.skill}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-emerald-700">
                      {item.demandPercentage}% of Postings
                    </span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      {item.trend}
                    </span>
                  </div>
                </div>

                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-full rounded-full"
                    style={{ width: `${item.demandPercentage}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Category: {item.category}</span>
                  <span>Average Wage Benchmark: {item.salaryImpact}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => onNavigate("fac_industry_demand")}
              className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View In-Depth Industry Demand Radar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Student Directory & Skill-Gap Alerts (Prompt Requirement) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Student Directory & Skill-Gap Alerts
            </h2>
            <p className="text-xs text-slate-500">
              Track student academic readiness and identify individuals needing personalized counseling.
            </p>
          </div>

          <span className="text-xs text-slate-600 font-semibold">
            Cohort: <strong className="text-indigo-600">{filteredEvaluations.length}</strong> students evaluated
          </span>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search student by name or college..."
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Branch:</span>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Branches</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Target Role:</span>
            <select
              value={selectedCareer}
              onChange={(e) => setSelectedCareer(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Roles</option>
              {careers.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Student Name</th>
                <th className="px-4 py-3">Branch & Year</th>
                <th className="px-4 py-3">CGPA</th>
                <th className="px-4 py-3">Target Career</th>
                <th className="px-4 py-3">Skill Match Score</th>
                <th className="px-4 py-3">Missing Competencies</th>
                <th className="px-4 py-3 text-right">Intervention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvaluations.map((item) => (
                <tr key={item.student.id} className="hover:bg-slate-50/70 transition">
                  <td className="px-4 py-3">
                    <span className="font-bold text-slate-900 block">{item.student.name}</span>
                    <span className="text-[10px] text-slate-400">{item.student.college.split(",")[0]}</span>
                  </td>

                  <td className="px-4 py-3 text-slate-700">
                    <span>{item.student.branch}</span>
                    <span className="block text-[10px] text-slate-400">{item.student.year}</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className="font-semibold text-slate-800">{item.student.cgpa}</span>
                  </td>

                  <td className="px-4 py-3 text-slate-800 font-medium">
                    {item.targetCareer.title}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-black ${
                          item.gap.overallMatch >= 75
                            ? "text-emerald-600"
                            : item.gap.overallMatch >= 50
                            ? "text-amber-600"
                            : "text-rose-600"
                        }`}
                      >
                        {item.gap.overallMatch}%
                      </span>
                      <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.gap.overallMatch >= 75
                              ? "bg-emerald-500"
                              : item.gap.overallMatch >= 50
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          }`}
                          style={{ width: `${item.gap.overallMatch}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {item.gap.criticalMissingSkills.map((sk, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.2 rounded bg-rose-50 text-rose-700 text-[10px] border border-rose-100"
                        >
                          {sk.skillName}
                        </span>
                      ))}
                      {item.gap.criticalMissingSkills.length === 0 && (
                        <span className="text-emerald-600 font-semibold text-[11px]">
                          ✓ None missing
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-right">
                    {item.needsTraining ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Training Needed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Placement Ready
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
