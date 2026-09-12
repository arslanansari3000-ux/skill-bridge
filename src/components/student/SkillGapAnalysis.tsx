import React, { useState, useEffect } from "react";
import {
  Target,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  ArrowRight,
  BookOpen,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { calculateSkillGap } from "../../lib/skillGapAlgorithm";
import { Career } from "../../types";

interface SkillGapAnalysisProps {
  onNavigate: (tab: string) => void;
}

export const SkillGapAnalysis: React.FC<SkillGapAnalysisProps> = ({ onNavigate }) => {
  const { student, careers } = useSkillBridgeState();

  const targetCareer =
    careers.find((c) => c.id === student?.preferredCareerId) ||
    careers.find((c) => c.id === "car-cybersec") ||
    careers[0];

  const [selectedCareer, setSelectedCareer] = useState<Career>(targetCareer);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Synchronize selectedCareer when student target career updates
  useEffect(() => {
    if (student?.preferredCareerId) {
      const matched = careers.find((c) => c.id === student.preferredCareerId);
      if (matched && matched.id !== selectedCareer.id) {
        setSelectedCareer(matched);
      }
    }
  }, [student?.preferredCareerId, careers]);

  const gap = calculateSkillGap(selectedCareer, student?.skills || []);

  const handleSwitchCareer = (newCareerId: string) => {
    const c = careers.find((car) => car.id === newCareerId);
    if (c) {
      setSelectedCareer(c);
      storage.setTargetCareer(c.id, c.title);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
            SIH Core Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Skill-Gap Analysis & Benchmark Engine
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent, rule-based algorithmic evaluation comparing your current competencies directly against industry role benchmarks.
          </p>
        </div>

        {/* Career Selector Dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-500">Target Role:</label>
          <select
            value={selectedCareer.id}
            onChange={(e) => handleSwitchCareer(e.target.value)}
            className="px-3 py-2 text-xs font-bold border border-slate-300 rounded-xl bg-white shadow-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 cursor-pointer"
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} ({c.category})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Evaluation for Role
              </span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                {selectedCareer.title}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Overall Skill Match:{" "}
              <span
                className={
                  gap.overallMatch >= 75
                    ? "text-emerald-600"
                    : gap.overallMatch >= 50
                    ? "text-amber-600"
                    : "text-rose-600"
                }
              >
                {gap.overallMatch}%
              </span>
            </h2>

            <p className="text-xs text-slate-500 max-w-xl">
              Student has acquired <strong className="text-slate-800">{gap.formulaBreakdown.matchedSkillsCount}</strong> of{" "}
              <strong className="text-slate-800">{gap.formulaBreakdown.totalRequiredCount}</strong> required industry skill competencies at or above the requisite proficiency level.
            </p>
          </div>

          {/* Gauge / Circular Visual */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-slate-100"
                  strokeWidth="10"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className={
                    gap.overallMatch >= 75
                      ? "text-emerald-500"
                      : gap.overallMatch >= 50
                      ? "text-amber-500"
                      : "text-rose-500"
                  }
                  strokeWidth="10"
                  strokeDasharray={251.2}
                  strokeDashoffset={251.2 - (251.2 * gap.overallMatch) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-2xl font-black text-slate-900">{gap.overallMatch}%</span>
                <span className="text-[10px] text-slate-400 font-semibold uppercase">Match</span>
              </div>
            </div>
            <span
              className={`mt-2 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                gap.overallMatch >= 75
                  ? "bg-emerald-100 text-emerald-800"
                  : gap.overallMatch >= 50
                  ? "bg-amber-100 text-amber-800"
                  : "bg-rose-100 text-rose-800"
              }`}
            >
              {gap.overallMatch >= 75
                ? "High Placement Readiness"
                : gap.overallMatch >= 50
                ? "Moderate Readiness (Targeted Learning Needed)"
                : "Curriculum Skill Gap Exists"}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-100">
          <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
            <span>Progress Towards Complete Industry Readiness</span>
            <span className="font-bold text-slate-800">{gap.overallMatch} / 100</span>
          </div>
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${
                gap.overallMatch >= 75
                  ? "bg-emerald-500"
                  : gap.overallMatch >= 50
                  ? "bg-amber-500"
                  : "bg-rose-500"
              }`}
              style={{ width: `${gap.overallMatch}%` }}
            ></div>
          </div>
        </div>

        {/* Explanation & Algorithm Transparency Disclosure */}
        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-600" />
              Transparent Scoring Methodology (No Pretend AI / Honest Rule-Based Matching)
            </span>
            <button
              onClick={() => setShowFormulaDetails(!showFormulaDetails)}
              className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
            >
              {showFormulaDetails ? "Hide Formula" : "View Mathematical Formula"}
            </button>
          </div>

          {showFormulaDetails ? (
            <div className="pt-2 text-slate-600 space-y-1.5 border-t border-slate-200">
              <p className="font-mono bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-800">
                Formula: Skill Match Score = ( Σ (Weight_i × ProficiencyRatio_i) / Σ TotalPossibleScore ) × 100
              </p>
              <p className="text-[11px] text-slate-500">
                Proficiency levels are quantified as: Beginner = 1, Intermediate = 2, Advanced = 3. A student's score on each required skill is compared against the industry benchmark. Extra possessed skills (e.g. HTML) are noted in the student portfolio but do not artificially inflate the targeted benchmark.
              </p>
            </div>
          ) : (
            <p className="text-[11px] text-slate-500">
              Calculated dynamically by checking each of the {selectedCareer.requiredSkills.length} required competencies against your self-rated proficiencies.
            </p>
          )}
        </div>
      </div>

      {/* 3 Color-Coded Categorical Breakdown Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Strong Skills (Green) */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-emerald-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Strong Skills ({gap.strongSkills.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Mastered
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Competencies where your proficiency meets or exceeds industry expectations:
            </p>

            {gap.strongSkills.length > 0 ? (
              <ul className="space-y-2">
                {gap.strongSkills.map((sk, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{sk.skillName}</span>
                      <span className="text-[10px] text-slate-500">
                        Required: {sk.requiredLevel}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded capitalize">
                      Your Level: {sk.studentLevel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills currently meet the target benchmark.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-100 text-[11px] text-emerald-800">
            ✓ Highlight these in your resume and recruiter pitch.
          </div>
        </div>

        {/* 2. Skills to Improve (Yellow) */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-amber-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Skills to Improve ({gap.skillsToImprove.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                Needs Work
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Skills you possess at a beginner level that require intermediate/advanced mastery:
            </p>

            {gap.skillsToImprove.length > 0 ? (
              <ul className="space-y-2">
                {gap.skillsToImprove.map((sk, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-amber-50/50 border border-amber-100 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{sk.skillName}</span>
                      <span className="text-[10px] text-slate-500">
                        Current: <strong className="capitalize">{sk.studentLevel}</strong>
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded capitalize">
                      Target: {sk.requiredLevel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No partial gaps detected.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 text-[11px] text-amber-800">
            ⚡ Complete 1-2 practical projects to level up.
          </div>
        </div>

        {/* 3. Critical Missing Skills (Red) */}
        <div className="bg-white rounded-2xl p-5 border border-rose-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-rose-100 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                  <XCircle className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Critical Missing Skills ({gap.criticalMissingSkills.length})
                </h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                Action Required
              </span>
            </div>

            <p className="text-[11px] text-slate-500 mb-3">
              Crucial industry requirements not yet found in your evaluated skill portfolio:
            </p>

            {gap.criticalMissingSkills.length > 0 ? (
              <ul className="space-y-2">
                {gap.criticalMissingSkills.map((sk, idx) => (
                  <li
                    key={idx}
                    className="p-2.5 rounded-xl bg-rose-50/50 border border-rose-100 text-xs flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{sk.skillName}</span>
                      <span className="text-[10px] text-slate-500">
                        Industry Priority: {sk.weight ? `${sk.weight}x Weight` : "High"}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded capitalize">
                      Req: {sk.requiredLevel}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400 italic">No missing skills detected! Ready for interviews.</p>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 text-[11px] text-rose-800">
            🚨 Start with the recommended learning modules below.
          </div>
        </div>
      </div>

      {/* Action Footer to Bridge the Gaps */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            Ready to close these skill gaps?
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Access curated courses mapped precisely to your missing skills in Computer Networking, Linux, and Web Security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate("learning")}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <span>View Recommended Courses</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate("ai_advisor")}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Consult AI Advisor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
