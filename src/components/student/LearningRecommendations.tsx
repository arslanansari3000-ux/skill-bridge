import React, { useState } from "react";
import {
  BookOpen,
  ExternalLink,
  Clock,
  Award,
  Filter,
  CheckCircle2,
  Bookmark,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useSkillBridgeState } from "../../lib/storage";
import { calculateSkillGap } from "../../lib/skillGapAlgorithm";
import { LearningResource } from "../../types";

interface LearningRecommendationsProps {
  onNavigate: (tab: string) => void;
}

export const LearningRecommendations: React.FC<LearningRecommendationsProps> = ({ onNavigate }) => {
  const { learningResources, student, careers } = useSkillBridgeState();

  const targetCareer =
    careers.find((c) => c.id === student?.preferredCareerId) ||
    careers.find((c) => c.id === "car-cybersec") ||
    careers[0];

  const gap = calculateSkillGap(targetCareer, student?.skills || []);

  const missingSkillNames = [
    ...gap.criticalMissingSkills.map((s) => s.skillName.toLowerCase()),
    ...gap.skillsToImprove.map((s) => s.skillName.toLowerCase()),
  ];

  const [selectedFilter, setSelectedFilter] = useState<"all" | "gaps_only" | "free">("gaps_only");
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>("all");
  const [completedResourceIds, setCompletedResourceIds] = useState<string[]>([]);

  const toggleComplete = (id: string) => {
    if (completedResourceIds.includes(id)) {
      setCompletedResourceIds(completedResourceIds.filter((item) => item !== id));
    } else {
      setCompletedResourceIds([...completedResourceIds, id]);
    }
  };

  const filteredResources = learningResources.filter((res) => {
    if (selectedFilter === "gaps_only") {
      if (!missingSkillNames.includes(res.skillName.toLowerCase())) {
        return false;
      }
    }
    if (selectedSkillFilter !== "all") {
      if (res.skillName !== selectedSkillFilter) {
        return false;
      }
    }
    return true;
  });

  // Unique skills in resources
  const availableSkills = Array.from(new Set(learningResources.map((r) => r.skillName)));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
            Curriculum Bridge
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Targeted Learning Recommendations
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Curated high-yield coursework, interactive security labs, and university certifications mapped directly to your missing competencies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("assessment")}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={() => onNavigate("internships")}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Browse Internships</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target Focus Callout */}
      <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-indigo-950">
              Personalized for: {targetCareer.title} (Match: {gap.overallMatch}%)
            </h3>
            <p className="text-[11px] text-indigo-800/80">
              Prioritizing resources for:{" "}
              <strong>
                {missingSkillNames.length > 0
                  ? missingSkillNames.map((s) => s.toUpperCase()).join(", ")
                  : "All requirements met! Explore advanced topics."}
              </strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-900">
            Completed: {completedResourceIds.length} / {learningResources.length}
          </span>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Show:
          </span>
          <button
            onClick={() => setSelectedFilter("gaps_only")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedFilter === "gaps_only"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            My Skill Gaps ({gap.criticalMissingSkills.length + gap.skillsToImprove.length})
          </button>
          <button
            onClick={() => setSelectedFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              selectedFilter === "all"
                ? "bg-indigo-600 text-white shadow-2xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Resources ({learningResources.length})
          </button>
        </div>

        {/* Filter by specific skill */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-500 font-semibold">Skill Filter:</label>
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="px-2.5 py-1 text-xs border border-slate-300 rounded-lg bg-white"
          >
            <option value="all">All Skills</option>
            {availableSkills.map((sk, idx) => (
              <option key={idx} value={sk}>
                {sk}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Learning Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredResources.map((res) => {
          const isDone = completedResourceIds.includes(res.id);
          const isSkillMissing = missingSkillNames.includes(res.skillName.toLowerCase());

          return (
            <div
              key={res.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                isDone
                  ? "bg-emerald-50/40 border-emerald-300"
                  : isSkillMissing
                  ? "bg-white border-indigo-200 shadow-xs ring-1 ring-indigo-500/10"
                  : "bg-white border-slate-200"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                      isSkillMissing
                        ? "bg-rose-100 text-rose-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {res.skillName} {isSkillMissing ? "• Gap Target" : ""}
                  </span>

                  <span className="text-[11px] font-semibold text-slate-500">
                    {res.resourceType}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 leading-snug mt-1">
                  {res.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {res.description || `Comprehensive ${res.resourceType.toLowerCase()} covering core competencies in ${res.skillName}.`}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-[11px] text-slate-500 gap-2">
                  <span className="font-medium text-slate-700">
                    {res.provider}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 font-semibold text-slate-600">
                      {res.difficulty}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="w-3 h-3" />
                      {res.estimatedHours}h
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleComplete(res.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                    isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{isDone ? "Completed" : "Mark as Done"}</span>
                </button>

                <a
                  href={res.externalUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                >
                  <span>Start Course</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
