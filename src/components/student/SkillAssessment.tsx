import React, { useState } from "react";
import {
  CheckCircle2,
  Plus,
  Save,
  Search,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { SkillCategory, SkillLevel, StudentSkill } from "../../types";

interface SkillAssessmentProps {
  onNavigate: (tab: string) => void;
}

export const SkillAssessment: React.FC<SkillAssessmentProps> = ({ onNavigate }) => {
  const { student, skills } = useSkillBridgeState();

  // Working state for student's ratings
  const [ratings, setRatings] = useState<Record<string, SkillLevel>>(() => {
    const map: Record<string, SkillLevel> = {};
    student.skills.forEach((s) => {
      map[s.skillId] = s.level;
    });
    return map;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>("Cybersecurity");
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Set skill level
  const handleLevelSelect = (skillId: string, level: SkillLevel | "none") => {
    setRatings((prev) => {
      const copy = { ...prev };
      if (level === "none") {
        delete copy[skillId];
      } else {
        copy[skillId] = level;
      }
      return copy;
    });
  };

  const handleSave = () => {
    // Convert ratings to StudentSkill[]
    const updatedSkills: StudentSkill[] = Object.entries(ratings).map(([skillId, level]) => {
      const meta = skills.find((s) => s.id === skillId);
      return {
        skillId,
        name: meta ? meta.name : skillId,
        level: level as SkillLevel,
        category: meta ? meta.category : "Programming",
      };
    });

    storage.updateStudentSkills(updatedSkills);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleSaveAndAnalyze = () => {
    handleSave();
    onNavigate("skill_gap");
  };

  const handleAddNewSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const newId = `sk-cust-${Date.now()}`;
    const created = {
      id: newId,
      name: newSkillName.trim(),
      category: newSkillCategory,
      description: `Custom ${newSkillCategory} competency`,
    };

    storage.addCustomSkill(created);
    // Rate as beginner by default
    setRatings((prev) => ({ ...prev, [newId]: "beginner" }));
    setNewSkillName("");
    setShowAddSkill(false);
  };

  // Categories list
  const categories: { id: string; label: string }[] = [
    { id: "all", label: "All Skills" },
    { id: "Cybersecurity", label: "Cybersecurity" },
    { id: "Programming", label: "Programming" },
    { id: "Web", label: "Web Development" },
    { id: "Data", label: "Data & Algorithms" },
    { id: "Cloud/DevOps", label: "Cloud & DevOps" },
  ];

  // Filter skills
  const filteredSkills = skills.filter((skill) => {
    const matchesCat = selectedCategory === "all" || skill.category === selectedCategory;
    const matchesSearch =
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalRated = Object.keys(ratings).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
            Self-Assessment Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Student Technical Skill Assessment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Self-rate your proficiency level in core engineering competencies. Your ratings feed directly into the skill-gap and internship matching algorithms.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Saved to profile!
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Ratings</span>
          </button>

          <button
            onClick={handleSaveAndAnalyze}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Analyze Skill Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Assessment Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search skills (e.g. Linux, Python, React, SQL)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Quick Stats & Add Skill */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600">
              Rated: <strong className="text-indigo-600">{totalRated}</strong> of {skills.length} available
            </span>
            <button
              onClick={() => setShowAddSkill(true)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition cursor-pointer border border-indigo-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Skill</span>
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-2xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Add Custom Skill Modal */}
      {showAddSkill && (
        <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Add Custom Skill to Platform Catalog
            </h3>
            <button
              onClick={() => setShowAddSkill(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddNewSkill} className="flex flex-wrap gap-2 items-center">
            <input
              type="text"
              required
              placeholder="Skill Name (e.g. Reverse Engineering, GraphQL, Rust)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white flex-1 min-w-[200px]"
            />
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
              className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Programming">Programming</option>
              <option value="Web">Web Development</option>
              <option value="Data">Data & Algorithms</option>
              <option value="Cloud/DevOps">Cloud & DevOps</option>
            </select>
            <button
              type="submit"
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Save & Rate
            </button>
          </form>
        </div>
      )}

      {/* Skills Matrix Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill) => {
          const currentLevel = ratings[skill.id];
          return (
            <div
              key={skill.id}
              className={`p-4 rounded-xl border transition flex flex-col justify-between ${
                currentLevel
                  ? "bg-white border-indigo-200 shadow-xs"
                  : "bg-white/80 border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-bold text-slate-900">{skill.name}</h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {skill.category}
                    </span>
                  </div>
                  {skill.description && (
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {skill.description}
                    </p>
                  )}
                </div>

                {currentLevel && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 capitalize">
                    {currentLevel}
                  </span>
                )}
              </div>

              {/* Proficiency Level Selector */}
              <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => handleLevelSelect(skill.id, "none")}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition cursor-pointer text-center ${
                    !currentLevel
                      ? "bg-slate-200 text-slate-700 font-bold"
                      : "text-slate-400 hover:bg-slate-100"
                  }`}
                >
                  Unrated
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelSelect(skill.id, "beginner")}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition cursor-pointer text-center ${
                    currentLevel === "beginner"
                      ? "bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-2xs"
                      : "text-slate-600 hover:bg-amber-50"
                  }`}
                >
                  Beginner
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelSelect(skill.id, "intermediate")}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition cursor-pointer text-center ${
                    currentLevel === "intermediate"
                      ? "bg-indigo-100 text-indigo-900 font-bold border border-indigo-300 shadow-2xs"
                      : "text-slate-600 hover:bg-indigo-50"
                  }`}
                >
                  Intermediate
                </button>

                <button
                  type="button"
                  onClick={() => handleLevelSelect(skill.id, "advanced")}
                  className={`py-1.5 px-2 text-[11px] font-medium rounded-lg transition cursor-pointer text-center ${
                    currentLevel === "advanced"
                      ? "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 shadow-2xs"
                      : "text-slate-600 hover:bg-emerald-50"
                  }`}
                >
                  Advanced
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Bar */}
      <div className="sticky bottom-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl flex items-center justify-between z-20 border border-slate-800">
        <div>
          <span className="text-xs text-slate-400 block">Assessment Status</span>
          <p className="text-sm font-bold text-white">
            {totalRated} skills rated • Changes ready to save
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Save Progress
          </button>
          <button
            onClick={handleSaveAndAnalyze}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <span>Proceed to Skill-Gap Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
