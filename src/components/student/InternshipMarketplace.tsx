import React, { useState } from "react";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Bookmark,
  Send,
  Filter,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Check,
  Building,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { calculateInternshipMatch } from "../../lib/skillGapAlgorithm";
import { Internship, WorkMode } from "../../types";

interface InternshipMarketplaceProps {
  onNavigate: (tab: string) => void;
}

export const InternshipMarketplace: React.FC<InternshipMarketplaceProps> = ({ onNavigate }) => {
  const { internships, student, savedInternshipIds, applications } = useSkillBridgeState();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"match" | "deadline" | "stipend">("match");

  // State for Application Modal
  const [applyingInternship, setApplyingInternship] = useState<Internship | null>(null);
  const [coverNote, setCoverNote] = useState("");
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  // State for Details Modal
  const [inspectingInternship, setInspectingInternship] = useState<Internship | null>(null);

  // Calculate matching scores and filter
  const processedInternships = internships
    .map((intern) => {
      const matchScore = calculateInternshipMatch(intern.requiredSkills, student.skills);
      const isSaved = savedInternshipIds.includes(intern.id);
      const isApplied = applications.some(
        (a) => a.internshipId === intern.id && a.studentId === student.id
      );
      return {
        ...intern,
        matchScore,
        isSaved,
        isApplied,
      };
    })
    .filter((intern) => {
      const matchesSearch =
        intern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        intern.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesWorkMode =
        selectedWorkMode === "all" || intern.workMode.toLowerCase() === selectedWorkMode.toLowerCase();

      const matchesCat =
        selectedCategory === "all" ||
        (intern.careerCategory || intern.domain || "")
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      return matchesSearch && matchesWorkMode && matchesCat;
    })
    .sort((a, b) => {
      if (sortBy === "match") return b.matchScore - a.matchScore;
      if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return b.matchScore - a.matchScore;
    });

  const handleToggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    storage.toggleSaveInternship(id);
  };

  const handleOpenApply = (intern: Internship, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplyingInternship(intern);
    setCoverNote(
      `Hello ${intern.companyName} Recruiting Team, I am eager to apply for the ${intern.title} role. My technical background in ${student.branch} at ${student.college} directly aligns with your requirements.`
    );
    setAppliedSuccess(false);
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingInternship) return;

    const matchScore = calculateInternshipMatch(applyingInternship.requiredSkills, student.skills);
    storage.submitApplication(applyingInternship.id, coverNote, matchScore);
    setAppliedSuccess(true);
    setTimeout(() => {
      setApplyingInternship(null);
      setAppliedSuccess(false);
    }, 1500);
  };

  const categories = ["all", "Cybersecurity", "Software Development", "Web Development", "Data", "Cloud & DevOps"];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
            Industry Opportunities
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Internship Marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified campus internships dynamically ranked according to your real skill match compatibility score.
          </p>
        </div>

        <button
          onClick={() => onNavigate("applications")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <span>My Applications ({applications.filter((a) => a.studentId === student.id).length})</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search input */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by role title, company (e.g. CyberShield), or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Work Mode filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Mode:</span>
            <select
              value={selectedWorkMode}
              onChange={(e) => setSelectedWorkMode(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="all">All Modes</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-bold border border-indigo-200 rounded-lg bg-indigo-50/50 text-indigo-900"
            >
              <option value="match">Highest Skill Match %</option>
              <option value="deadline">Application Deadline</option>
            </select>
          </div>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Domains" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Internships List */}
      <div className="space-y-4">
        {processedInternships.map((intern) => (
          <div
            key={intern.id}
            onClick={() => setInspectingInternship(intern)}
            className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 hover:border-indigo-300 hover:shadow-md transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 relative group"
          >
            {/* Left: Role Info */}
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
                  {intern.companyName}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 px-2 py-0.5 rounded bg-slate-100">
                  {intern.workMode}
                </span>
                <span className="text-[10px] text-slate-400">
                  Posted: {intern.postedAt}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                {intern.title}
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {intern.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {intern.stipend}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {intern.duration}
                </span>
                <span>•</span>
                <span className="text-rose-600 font-medium">
                  Apply by: {intern.deadline}
                </span>
              </div>

              {/* Required Skills Badges with student match status */}
              <div className="pt-2 flex flex-wrap items-center gap-1.5">
                <span className="text-[11px] font-semibold text-slate-400 mr-1">Required:</span>
                {intern.requiredSkills.map((req, i) => {
                  const studentHas = student.skills.find(
                    (s) => s.skillId === req.skillId || s.name.toLowerCase() === req.skillName.toLowerCase()
                  );
                  return (
                    <span
                      key={i}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
                        studentHas
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {req.skillName} ({(req.minimumLevel || req.level || "intermediate")[0].toUpperCase()}) {studentHas ? "✓" : ""}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Right: Match Score Gauge & Actions */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-black shadow-2xs ${
                    intern.matchScore >= 80
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : intern.matchScore >= 50
                      ? "bg-amber-100 text-amber-800 border border-amber-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {intern.matchScore}% Skill Match
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Algorithm compatibility
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleToggleSave(intern.id, e)}
                  title={intern.isSaved ? "Remove from saved" : "Save internship"}
                  className={`p-2 rounded-xl border transition cursor-pointer ${
                    intern.isSaved
                      ? "bg-indigo-50 border-indigo-300 text-indigo-600"
                      : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                </button>

                {intern.isApplied ? (
                  <span className="px-4 py-2 bg-slate-100 text-slate-500 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-slate-200">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Applied
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => handleOpenApply(intern, e)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Apply Now</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Submission Modal */}
      {applyingInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  Submit Internship Application
                </span>
                <h3 className="text-base font-bold">{applyingInternship.title}</h3>
                <p className="text-xs text-slate-400">at {applyingInternship.companyName}</p>
              </div>
              <button
                onClick={() => setApplyingInternship(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitApplication} className="p-6 space-y-4">
              {/* Student Application Summary Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{student.name}</span>
                  <span className="text-[11px] text-slate-500">
                    {student.college} • CGPA {student.cgpa}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-800">
                  {calculateInternshipMatch(applyingInternship.requiredSkills, student.skills)}% Match
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cover Note / Pitch to Recruiter
                </label>
                <textarea
                  rows={4}
                  required
                  value={coverNote}
                  onChange={(e) => setCoverNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {appliedSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Application successfully transmitted to recruiter!
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setApplyingInternship(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={appliedSuccess}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Application</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Inspect Internship Details Modal */}
      {inspectingInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-slate-200 p-6 space-y-5 animate-in fade-in">
            <div className="flex items-start justify-between pb-3 border-b border-slate-200">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                  {inspectingInternship.companyName}
                </span>
                <h2 className="text-xl font-bold text-slate-900 mt-0.5">
                  {inspectingInternship.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{inspectingInternship.location} ({inspectingInternship.workMode})</span>
                  <span>•</span>
                  <span className="font-bold text-emerald-600">{inspectingInternship.stipend}</span>
                  <span>•</span>
                  <span>{inspectingInternship.duration}</span>
                </div>
              </div>
              <button
                onClick={() => setInspectingInternship(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <h3 className="font-bold text-slate-900 text-sm">Role Overview</h3>
              <p className="leading-relaxed">{inspectingInternship.description}</p>
            </div>

            <div className="space-y-2 text-xs">
              <h3 className="font-bold text-slate-900 text-sm">Required Technical Skills</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {inspectingInternship.requiredSkills.map((req, i) => {
                  const studentHas = student.skills.find(
                    (s) => s.skillId === req.skillId || s.name.toLowerCase() === req.skillName.toLowerCase()
                  );
                  return (
                    <div
                      key={i}
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        studentHas ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-slate-50 border-slate-200 text-slate-700"
                      }`}
                    >
                      <span>{req.skillName} (Req: {req.minimumLevel || req.level})</span>
                      <span className="font-bold text-[10px]">
                        {studentHas ? `You: ${studentHas.level}` : "Missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-800 block">Eligibility & Deadlines:</span>
              <p>Eligibility: {inspectingInternship.eligibility}</p>
              <p>Applications Close: {inspectingInternship.deadline}</p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setInspectingInternship(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              <button
                onClick={(e) => {
                  const target = inspectingInternship;
                  setInspectingInternship(null);
                  handleOpenApply(target, e);
                }}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
              >
                Apply for Position
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
