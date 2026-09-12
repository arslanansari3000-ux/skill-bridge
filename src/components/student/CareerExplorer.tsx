import React, { useState, useMemo } from "react";
import {
  Compass,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Target,
  Briefcase,
  BookOpen,
  DollarSign,
  Sparkles,
  Search,
  Check,
  Bot,
  Filter,
  Award,
  Layers,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { calculateSkillGap } from "../../lib/skillGapAlgorithm";
import { Career } from "../../types";
import { SEED_CAREERS } from "../../data/seedData";

interface CareerExplorerProps {
  onNavigate: (tab: string) => void;
}

export const CareerExplorer: React.FC<CareerExplorerProps> = ({ onNavigate }) => {
  const { careers: storedCareers, student, internships } = useSkillBridgeState();

  // Ensure careers is always populated and valid
  const careers: Career[] = useMemo(() => {
    if (Array.isArray(storedCareers) && storedCareers.length > 0) {
      return storedCareers;
    }
    return SEED_CAREERS;
  }, [storedCareers]);

  // Selected career tracking by ID for reactivity
  const [selectedCareerId, setSelectedCareerId] = useState<string>(() => {
    return (
      student?.preferredCareerId ||
      careers[0]?.id ||
      "car-cybersec"
    );
  });

  // Search & Category filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Active selected career object with fallback
  const activeCareer: Career = useMemo(() => {
    return (
      careers.find((c) => c.id === selectedCareerId) ||
      careers.find((c) => c.id === student?.preferredCareerId) ||
      careers[0] ||
      SEED_CAREERS[0]
    );
  }, [careers, selectedCareerId, student?.preferredCareerId]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    careers.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [careers]);

  // Filtered careers
  const filteredCareers = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return careers.filter((career) => {
      const matchCategory =
        selectedCategory === "All" ||
        career.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchCategory) return false;

      if (!q) return true;

      const titleMatch = (career.title || "").toLowerCase().includes(q);
      const descMatch = (career.description || "").toLowerCase().includes(q);
      const categoryMatch = (career.category || "").toLowerCase().includes(q);
      const skillMatch = (career.requiredSkills || []).some((s) =>
        (s.skillName || "").toLowerCase().includes(q)
      );

      return titleMatch || descMatch || categoryMatch || skillMatch;
    });
  }, [careers, searchQuery, selectedCategory]);

  const handleSelectTarget = (career: Career) => {
    storage.setTargetCareer(career.id, career.title);
    setSelectedCareerId(career.id);
    setActionNotice(`Target career updated to "${career.title}"! Benchmark synchronized.`);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleSelectAndAnalyze = (career: Career) => {
    storage.setTargetCareer(career.id, career.title);
    setSelectedCareerId(career.id);
    onNavigate("skill_gap");
  };

  // Find relevant internships safely
  const relevantInternships = useMemo(() => {
    if (!activeCareer || !Array.isArray(internships)) return [];
    const cat = (activeCareer.category || "").toLowerCase();
    const firstWord = (activeCareer.title || "").toLowerCase().split(" ")[0];

    return internships.filter((int) => {
      if (!int) return false;
      const intCat = (int.careerCategory || int.domain || "").toLowerCase();
      const intTitle = (int.title || "").toLowerCase();
      return (
        (cat && intCat && (intCat.includes(cat) || cat.includes(intCat))) ||
        (firstWord && intTitle && intTitle.includes(firstWord))
      );
    });
  }, [activeCareer, internships]);

  const activeCareerGap = useMemo(() => {
    return calculateSkillGap(activeCareer, student?.skills || []);
  }, [activeCareer, student?.skills]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
              SIH Career Pathways
            </span>
            {student?.targetCareerTitle && (
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                Current Target: <strong className="text-slate-800">{student.targetCareerTitle}</strong>
              </span>
            )}
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-600" />
            Technology Career Explorer
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Explore industry career tracks, benchmark your current competencies against job prerequisites, and inspect the required learning progression.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate("skill_gap")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Analyze Skill Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate("ai_advisor")}
            className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Career Advisor</span>
          </button>
        </div>
      </div>

      {/* Action Notice Banner */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Search & Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search careers or required skills (e.g., Python, Cloud, Security)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-900">{filteredCareers.length}</strong> of {careers.length} Career Tracks
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Domain:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Empty Filter State */}
      {filteredCareers.length === 0 && (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
          <Compass className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No matching careers found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search query or reset the domain filter to view all available industry career tracks.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Career Cards Grid */}
      {filteredCareers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredCareers.map((career) => {
            const isCurrentTarget = student?.preferredCareerId === career.id;
            const isSelected = activeCareer.id === career.id;
            const gap = calculateSkillGap(career, student?.skills || []);

            return (
              <div
                key={career.id}
                onClick={() => setSelectedCareerId(career.id)}
                className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between relative ${
                  isSelected
                    ? "bg-indigo-50/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-xs"
                }`}
              >
                {isCurrentTarget && (
                  <div className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-600 text-white uppercase tracking-wider shadow-xs flex items-center gap-1">
                    <Check className="w-2.5 h-2.5" />
                    <span>Active Target</span>
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 truncate max-w-[140px]">
                      {career.category}
                    </span>
                    <span
                      className={`text-xs font-black ${
                        gap.overallMatch >= 70
                          ? "text-emerald-600"
                          : gap.overallMatch >= 40
                          ? "text-amber-600"
                          : "text-rose-600"
                      }`}
                    >
                      {gap.overallMatch}% Match
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">{career.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {career.description}
                  </p>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          gap.overallMatch >= 70
                            ? "bg-emerald-500"
                            : gap.overallMatch >= 40
                            ? "bg-amber-500"
                            : "bg-rose-500"
                        }`}
                        style={{ width: `${gap.overallMatch}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key specs */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="font-medium text-slate-700">{career.averageSalary}</span>
                    <span className="text-indigo-600 font-semibold">{career.demandTrend}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectAndAnalyze(career);
                    }}
                    className={`w-full py-1.5 px-2 rounded-lg text-xs font-semibold transition cursor-pointer text-center ${
                      isCurrentTarget
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700"
                    }`}
                  >
                    {isCurrentTarget ? "Analyze Gap →" : "Set Target & Analyze"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Selected Career Detailed View */}
      {activeCareer && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                  {activeCareer.category}
                </span>
                <span className="text-xs text-slate-500">
                  Market Demand: <strong className="text-slate-800">{activeCareer.demandTrend}</strong>
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-bold text-indigo-700">
                  {activeCareerGap.overallMatch}% Match with Your Skills
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900">{activeCareer.title}</h2>
              <p className="text-xs text-slate-600 max-w-3xl mt-1 leading-relaxed">
                {activeCareer.description}
              </p>
            </div>

            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              {student?.preferredCareerId === activeCareer.id ? (
                <div className="px-4 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Current Target Role</span>
                </div>
              ) : (
                <button
                  onClick={() => handleSelectTarget(activeCareer)}
                  className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Set as Target Role</span>
                </button>
              )}

              <button
                onClick={() => handleSelectAndAnalyze(activeCareer)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>Full Skill Gap Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Required Skills Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                Required Industry Competencies ({(activeCareer.requiredSkills || []).length})
              </h3>
              <div className="space-y-2">
                {(activeCareer.requiredSkills || []).map((req, idx) => {
                  const reqSkillName = req.skillName || (req as any).name || "Skill";
                  const reqSkillId = req.skillId || "";
                  const studentSkills = student?.skills || [];
                  const studentHas = studentSkills.find(
                    (s: any) =>
                      (reqSkillId && s.skillId && s.skillId === reqSkillId) ||
                      ((s.name || s.skillName || "").toLowerCase().trim() === reqSkillName.toLowerCase().trim())
                  );

                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{reqSkillName}</span>
                        <span className="text-[10px] text-slate-500">
                          Industry Threshold: <strong className="capitalize">{req.requiredLevel}</strong> (Weight: {req.weight || 1}x)
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          studentHas
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {studentHas ? `Level: ${studentHas.level}` : "Missing"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommended Skills & Salary */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Recommended Bonus Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {(activeCareer.recommendedSkills || []).map((sk: any, idx: number) => {
                  const name = typeof sk === "string" ? sk : sk?.skillName || sk?.name || "Skill";
                  return (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 text-xs font-medium border border-amber-200"
                    >
                      + {name}
                    </span>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Industry Compensation:</span>
                  <strong className="text-slate-900">{activeCareer.averageSalary}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Hiring Trend:</span>
                  <strong className="text-emerald-700">{activeCareer.demandTrend}</strong>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mandatory Skills:</span>
                  <strong className="text-slate-900">{(activeCareer.requiredSkills || []).length} Competencies</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => onNavigate("learning")}
                  className="w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>View Curated Learning Roadmap</span>
                </button>
              </div>
            </div>

            {/* Recommended Learning Path & Internships */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                Structured Learning Progression
              </h3>
              <ol className="space-y-2 text-xs text-slate-700">
                {(activeCareer.learningPath || []).map((stepItem: any, idx: number) => {
                  const isString = typeof stepItem === "string";
                  const stepNumber = !isString && stepItem?.step ? stepItem.step : idx + 1;
                  const stepTitle = isString ? stepItem : stepItem?.title || `Phase ${idx + 1}`;
                  const stepDuration = !isString ? stepItem?.duration : null;
                  const stepDescription = !isString ? stepItem?.description : null;

                  return (
                    <li key={idx} className="flex items-start gap-2.5 bg-indigo-50/60 p-2.5 rounded-lg border border-indigo-100">
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {stepNumber}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-slate-900">{stepTitle}</span>
                          {stepDuration && (
                            <span className="text-[10px] font-medium text-indigo-700 bg-indigo-100/80 px-1.5 py-0.5 rounded shrink-0">
                              {stepDuration}
                            </span>
                          )}
                        </div>
                        {stepDescription && (
                          <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                            {stepDescription}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>

              {relevantInternships.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500">
                      Live Internship Openings ({relevantInternships.length})
                    </span>
                    <button
                      onClick={() => onNavigate("internships")}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Explore all</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {relevantInternships.slice(0, 2).map((int) => (
                      <div
                        key={int.id}
                        onClick={() => onNavigate("internships")}
                        className="p-2 rounded-lg border border-slate-200 hover:border-indigo-300 bg-white flex items-center justify-between cursor-pointer transition text-xs"
                      >
                        <span className="font-semibold text-slate-800">{int.title}</span>
                        <span className="text-indigo-600 font-bold">{int.stipend}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
