import React, { useState } from "react";
import {
  Briefcase,
  Plus,
  Trash2,
  CheckCircle2,
  Save,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { InternshipRequiredSkill, SkillLevel, WorkMode } from "../../types";

interface PostInternshipProps {
  onNavigate: (tab: string) => void;
}

export const PostInternship: React.FC<PostInternshipProps> = ({ onNavigate }) => {
  const { company, skills } = useSkillBridgeState();

  const [title, setTitle] = useState("Cyber Security Analyst Intern");
  const [location, setLocation] = useState("Bangalore, Karnataka");
  const [workMode, setWorkMode] = useState<WorkMode>("hybrid");
  const [duration, setDuration] = useState("3 Months");
  const [stipend, setStipend] = useState("₹25,000 / month");
  const [careerCategory, setCareerCategory] = useState("Cybersecurity");
  const [eligibility, setEligibility] = useState(
    "Pre-final and final year B.Tech/B.E. (CSE, IT, ECE) or M.Tech students with strong fundamentals in Networking and Linux."
  );
  const [deadline, setDeadline] = useState("2026-05-15");
  const [description, setDescription] = useState(
    "Join CyberShield Technologies' threat response unit. You will assist our SOC analysts in monitoring firewall logs, investigating potential phishing vectors, performing vulnerability assessments using Wireshark and Nmap, and configuring defensive endpoint rules."
  );

  // Required skills list
  const [requiredSkills, setRequiredSkills] = useState<InternshipRequiredSkill[]>([
    { skillId: "sk-net", skillName: "Computer Networking", minimumLevel: "intermediate" },
    { skillId: "sk-linux", skillName: "Linux", minimumLevel: "intermediate" },
    { skillId: "sk-py", skillName: "Python", minimumLevel: "intermediate" },
    { skillId: "sk-websec", skillName: "Web Security", minimumLevel: "beginner" },
  ]);

  // Temp for adding a new skill requirement
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>("intermediate");
  const [postSuccess, setPostSuccess] = useState(false);

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const existing = skills.find((s) => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
    const id = existing ? existing.id : `sk-cust-${Date.now()}`;

    setRequiredSkills([
      ...requiredSkills,
      { skillId: id, skillName: newSkillName.trim(), minimumLevel: newSkillLevel },
    ]);
    setNewSkillName("");
  };

  const handleRemoveSkill = (index: number) => {
    setRequiredSkills(requiredSkills.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiredSkills.length === 0) {
      alert("Please add at least one required technical skill.");
      return;
    }

    storage.postInternship({
      companyId: company.id,
      companyName: company.companyName,
      title,
      location,
      workMode,
      duration,
      stipend,
      domain: careerCategory || "Technology",
      careerCategory,
      requiredSkills: requiredSkills.map((r) => ({
        skillId: r.skillId,
        skillName: r.skillName,
        level: r.minimumLevel,
        minimumLevel: r.minimumLevel,
      })),
      eligibility,
      deadline,
      description,
      openings: 2,
    });

    setPostSuccess(true);
    setTimeout(() => {
      onNavigate("ind_internships");
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded">
            Recruiter Console
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Post New Campus Internship
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Define role parameters and required technological proficiencies. The platform will automatically score and rank student candidates based on these exact criteria.
          </p>
        </div>
      </div>

      {postSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Internship successfully published! Redirecting to your active listings...</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Core Role Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            General Internship Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Company Name (Employer)
              </label>
              <input
                type="text"
                disabled
                value={company.companyName}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 text-slate-700 font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Internship Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Cyber Security Analyst Intern"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bangalore, Karnataka"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Work Mode
                </label>
                <select
                  value={workMode}
                  onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Career Domain
                </label>
                <select
                  value={careerCategory}
                  onChange={(e) => setCareerCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Software Development">Software Development</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Data">Data & AI</option>
                  <option value="Cloud/DevOps">Cloud/DevOps</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 3 Months, 6 Months"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Monthly Stipend
                </label>
                <input
                  type="text"
                  required
                  value={stipend}
                  onChange={(e) => setStipend(e.target.value)}
                  placeholder="e.g. ₹25,000 / month"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Application Deadline
                </label>
                <input
                  type="date"
                  required
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Required Skills & Proficiency Thresholds */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Required Skills & Proficiency Levels (Used for Matching Algorithm)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Specify the minimum acceptable competency. Candidates will be ranked transparently against these levels.
            </p>
          </div>

          {/* Current list */}
          <div className="space-y-2">
            {requiredSkills.map((req, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900">{req.skillName}</span>
                  <span className="text-slate-500 ml-2">
                    Min Required: <strong className="capitalize text-indigo-700">{req.minimumLevel}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(idx)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Remove skill requirement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add skill row */}
          <div className="p-3.5 rounded-xl border border-dashed border-slate-300 bg-emerald-50/30 flex flex-wrap gap-2 items-center">
            <input
              type="text"
              list="catalog-skills"
              placeholder="Skill Name (e.g. Cryptography, SQL, React)"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white flex-1 min-w-[180px]"
            />
            <datalist id="catalog-skills">
              {skills.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>

            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
              className="px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
            >
              <option value="beginner">Beginner Level</option>
              <option value="intermediate">Intermediate Level</option>
              <option value="advanced">Advanced Level</option>
            </select>

            <button
              type="button"
              onClick={handleAddSkill}
              disabled={!newSkillName.trim()}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Requirement</span>
            </button>
          </div>
        </div>

        {/* Detailed Requirements & Description */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Eligibility Criteria
            </label>
            <input
              type="text"
              required
              value={eligibility}
              onChange={(e) => setEligibility(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Job Description & Responsibilities
            </label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => onNavigate("ind_dashboard")}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Internship Listing</span>
          </button>
        </div>
      </form>
    </div>
  );
};
