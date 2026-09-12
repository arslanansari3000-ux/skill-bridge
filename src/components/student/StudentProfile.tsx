import React, { useState } from "react";
import {
  User,
  GraduationCap,
  Award,
  FolderGit2,
  FileText,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  ExternalLink,
  Target,
} from "lucide-react";
import { useSkillBridgeState, storage } from "../../lib/storage";
import { StudentProfile as StudentProfileType } from "../../types";

interface StudentProfileProps {
  onNavigate: (tab: string) => void;
}

export const StudentProfile: React.FC<StudentProfileProps> = ({ onNavigate }) => {
  const { student, careers } = useSkillBridgeState();

  const [formData, setFormData] = useState<StudentProfileType>({ ...student });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Local state for adding new project
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [newProjectTech, setNewProjectTech] = useState("");
  const [newProjectGithub, setNewProjectGithub] = useState("");

  // Local state for adding new certification
  const [newCertName, setNewCertName] = useState("");
  const [newCertIssuer, setNewCertIssuer] = useState("");
  const [newCertYear, setNewCertYear] = useState("2024");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    storage.updateActiveStudent(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddProject = () => {
    if (!newProjectTitle) return;
    const proj = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      description: newProjectDesc,
      techStack: newProjectTech.split(",").map((t) => t.trim()).filter(Boolean),
      githubUrl: newProjectGithub || undefined,
    };
    const updatedProjects = [...(formData.projects || []), proj];
    setFormData({ ...formData, projects: updatedProjects });
    storage.updateActiveStudent({ projects: updatedProjects });
    setNewProjectTitle("");
    setNewProjectDesc("");
    setNewProjectTech("");
    setNewProjectGithub("");
  };

  const handleRemoveProject = (id: string) => {
    const updated = (formData.projects || []).filter((p) => p.id !== id);
    setFormData({ ...formData, projects: updated });
    storage.updateActiveStudent({ projects: updated });
  };

  const handleAddCert = () => {
    if (!newCertName) return;
    const cert = {
      id: `cert-${Date.now()}`,
      name: newCertName,
      issuer: newCertIssuer || "Institution",
      issueDate: newCertYear,
    };
    const updatedCerts = [...(formData.certifications || []), cert];
    setFormData({ ...formData, certifications: updatedCerts });
    storage.updateActiveStudent({ certifications: updatedCerts });
    setNewCertName("");
    setNewCertIssuer("");
  };

  const handleRemoveCert = (id: string) => {
    const updated = (formData.certifications || []).filter((c) => c.id !== id);
    setFormData({ ...formData, certifications: updated });
    storage.updateActiveStudent({ certifications: updated });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded">
            Student Profile
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Academic & Professional Portfolio
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your verified student credentials, academic standing, and project repositories.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              Saved successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Profile</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Basic & Academic Information */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            Basic & Academic Credentials
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">College / University</label>
              <input
                type="text"
                required
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Degree Program</label>
              <input
                type="text"
                required
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Branch / Major</label>
              <input
                type="text"
                required
                value={formData.branch}
                onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Year</label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate">Postgraduate</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CGPA (0 - 10)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Preferred Career & Interests */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Target className="w-4 h-4 text-amber-600" />
            Career Aspirations & Target
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Career Pathway (Used by Gap-Analysis Engine)
              </label>
              <select
                value={formData.preferredCareerId}
                onChange={(e) => {
                  const selectedId = e.target.value;
                  const target = careers.find((c) => c.id === selectedId);
                  setFormData({
                    ...formData,
                    preferredCareerId: selectedId,
                    targetCareerTitle: target ? target.title : formData.targetCareerTitle,
                  });
                }}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold text-slate-800"
              >
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Selecting a career dynamically re-benchmarks your skill gaps and internship recommendations.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Areas of Interest (Comma-separated)
              </label>
              <input
                type="text"
                value={formData.interests.join(", ")}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    interests: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                  })
                }
                placeholder="Cybersecurity, Threat Detection, Web Dev..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Projects */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-indigo-600" />
              Academic & Personal Projects ({formData.projects?.length || 0})
            </h2>
          </div>

          <div className="space-y-3">
            {formData.projects?.map((proj) => (
              <div
                key={proj.id}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-start justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{proj.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {proj.techStack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {proj.githubUrl && (
                      <a
                        href={proj.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <ExternalLink className="w-3 h-3" />
                        Code Repository
                      </a>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveProject(proj.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                  title="Remove Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add Project Sub-form */}
          <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 space-y-3">
            <span className="text-xs font-bold text-slate-700 block">Add New Project</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Project Title (e.g. Network Traffic Monitor)"
                value={newProjectTitle}
                onChange={(e) => setNewProjectTitle(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <input
                type="text"
                placeholder="Tech Stack (comma-separated, e.g. Python, Scapy)"
                value={newProjectTech}
                onChange={(e) => setNewProjectTech(e.target.value)}
                className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
            </div>
            <textarea
              placeholder="Brief project description & technical problem solved..."
              rows={2}
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
            />
            <div className="flex items-center justify-between">
              <input
                type="text"
                placeholder="GitHub Repository URL (Optional)"
                value={newProjectGithub}
                onChange={(e) => setNewProjectGithub(e.target.value)}
                className="w-2/3 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
              />
              <button
                type="button"
                onClick={handleAddProject}
                disabled={!newProjectTitle}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Project
              </button>
            </div>
          </div>
        </div>

        {/* Section 4: Certifications & Resume */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Certifications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <Award className="w-4 h-4 text-amber-600" />
              Certifications ({formData.certifications?.length || 0})
            </h2>

            <div className="space-y-2">
              {formData.certifications?.map((c) => (
                <div
                  key={c.id}
                  className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{c.name}</span>
                    <span className="text-[11px] text-slate-500">
                      {c.issuer} • {c.issueDate}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(c.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Certification */}
            <div className="flex gap-2 pt-2">
              <input
                type="text"
                placeholder="Certification Name"
                value={newCertName}
                onChange={(e) => setNewCertName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <input
                type="text"
                placeholder="Issuer"
                value={newCertIssuer}
                onChange={(e) => setNewCertIssuer(e.target.value)}
                className="w-24 px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
              />
              <button
                type="button"
                onClick={handleAddCert}
                disabled={!newCertName}
                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>

          {/* Resume Upload & Link */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="w-4 h-4 text-emerald-600" />
              Verified Resume
            </h2>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  PDF
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Arjun_Sharma_Resume_2026.pdf</h4>
                  <p className="text-[11px] text-slate-400">Uploaded • Verified NIT Trichy Format (240 KB)</p>
                </div>
              </div>

              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                Active
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Portfolio / LinkedIn URL
              </label>
              <input
                type="url"
                value={formData.portfolioUrl || ""}
                onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Save button at bottom */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
};
