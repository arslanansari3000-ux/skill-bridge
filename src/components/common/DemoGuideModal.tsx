import React from "react";
import { X, CheckCircle2, Play, ArrowRight, Sparkles } from "lucide-react";
import { storage } from "../../lib/storage";

interface DemoGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: string) => void;
}

export const DemoGuideModal: React.FC<DemoGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: "Open Landing Page",
      desc: "Review the EdTech/CareerTech introduction, problem statement, and live platform statistics.",
      action: () => {
        storage.setRole(null);
        onNavigate("landing");
        onClose();
      },
      buttonText: "Go to Landing Page",
    },
    {
      step: 2,
      title: "Login as Student (Arjun Sharma)",
      desc: "Authenticate as Arjun Sharma (NIT Trichy, 3rd Year B.Tech CSE).",
      action: () => {
        storage.setRole("student");
        storage.setActiveStudentId("stu-arjun-1");
        onNavigate("dashboard");
        onClose();
      },
      buttonText: "Login as Student",
    },
    {
      step: 3,
      title: "View Student Profile",
      desc: "Inspect academic records, CGPA (8.65), current projects, certifications, and uploaded resume.",
      action: () => {
        storage.setRole("student");
        onNavigate("profile");
        onClose();
      },
      buttonText: "View Profile",
    },
    {
      step: 4,
      title: "Select 'Cybersecurity Analyst' Target Career",
      desc: "Explore 8 structured careers and set Cybersecurity Analyst as the primary target.",
      action: () => {
        storage.setRole("student");
        storage.setTargetCareer("car-cybersec", "Cybersecurity Analyst");
        onNavigate("careers");
        onClose();
      },
      buttonText: "Open Career Explorer",
    },
    {
      step: 5,
      title: "Complete / View Skill Assessment",
      desc: "Self-rate proficiency across Programming, Web, Cybersecurity, and Data categories.",
      action: () => {
        storage.setRole("student");
        onNavigate("assessment");
        onClose();
      },
      buttonText: "Go to Skill Assessment",
    },
    {
      step: 6,
      title: "Show Skill-Gap Analysis (Core Feature)",
      desc: "View the transparent mathematical match score (58%), Strong Skills, Skills to Improve, and Critical Missing Skills.",
      action: () => {
        storage.setRole("student");
        onNavigate("skill_gap");
        onClose();
      },
      buttonText: "View Skill-Gap Analysis",
    },
    {
      step: 7,
      title: "Show Recommended Learning Path",
      desc: "Review targeted courses & labs for missing competencies (Networking, Linux, Web Security).",
      action: () => {
        storage.setRole("student");
        onNavigate("learning");
        onClose();
      },
      buttonText: "Open Learning Resources",
    },
    {
      step: 8,
      title: "Show Matched Internships",
      desc: "Browse live openings with dynamically calculated skill-match percentages (e.g. 58% - 87%).",
      action: () => {
        storage.setRole("student");
        onNavigate("internships");
        onClose();
      },
      buttonText: "Explore Internships",
    },
    {
      step: 9,
      title: "Apply for an Internship",
      desc: "Submit a realistic internship application to CyberShield Technologies.",
      action: () => {
        storage.setRole("student");
        onNavigate("internships");
        onClose();
      },
      buttonText: "Apply Now",
    },
    {
      step: 10,
      title: "Logout from Student Persona",
      desc: "Conclude student flow and return to home.",
      action: () => {
        storage.setRole(null);
        onNavigate("landing");
        onClose();
      },
      buttonText: "Sign Out",
    },
    {
      step: 11,
      title: "Login as Industry (CyberShield Technologies)",
      desc: "Access recruiter portal with verified enterprise credentials.",
      action: () => {
        storage.setRole("industry");
        storage.setActiveCompanyId("comp-cybershield");
        onNavigate("ind_dashboard");
        onClose();
      },
      buttonText: "Login as Industry",
    },
    {
      step: 12,
      title: "View Internship Applicants",
      desc: "See student applications received for active postings.",
      action: () => {
        storage.setRole("industry");
        onNavigate("ind_applicants");
        onClose();
      },
      buttonText: "View Applicants",
    },
    {
      step: 13,
      title: "See Candidate Skill-Match Scores",
      desc: "Review transparent candidate rankings (Candidate A: 92%, Candidate B: 58%) with strong vs missing skills.",
      action: () => {
        storage.setRole("industry");
        onNavigate("ind_applicants");
        onClose();
      },
      buttonText: "Candidate Matching",
    },
    {
      step: 14,
      title: "Logout from Industry Persona",
      desc: "Return to switch to college administrator.",
      action: () => {
        storage.setRole(null);
        onNavigate("landing");
        onClose();
      },
      buttonText: "Sign Out",
    },
    {
      step: 15,
      title: "Login as Faculty / College Administrator",
      desc: "Access institutional analytics as Prof. Rajesh Iyer (Dean of Placements, NIT).",
      action: () => {
        storage.setRole("faculty");
        onNavigate("fac_dashboard");
        onClose();
      },
      buttonText: "Login as Faculty",
    },
    {
      step: 16,
      title: "Show College-Wide Skill-Gap Dashboard",
      desc: "Inspect department distribution, students needing training, and common curricular deficiencies.",
      action: () => {
        storage.setRole("faculty");
        onNavigate("fac_skill_gaps");
        onClose();
      },
      buttonText: "College Skill-Gaps",
    },
    {
      step: 17,
      title: "Show Industry Skill Demand Trends",
      desc: "Review the live employer-demanded skill radar (Python 78%, SQL 72%, Networking 54%).",
      action: () => {
        storage.setRole("faculty");
        onNavigate("fac_industry_demand");
        onClose();
      },
      buttonText: "Industry Demand",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[88vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-indigo-950 px-6 py-5 text-white flex items-center justify-between border-b border-indigo-900">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-300">
                Official SIH Presentation Checklist
              </span>
              <h3 className="text-base font-bold text-white">
                Complete 17-Step Hackathon Demonstration
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-indigo-900 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Intro */}
        <div className="bg-indigo-50/70 px-6 py-3 border-b border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
          <p className="font-medium">
            Click any step below to instantly jump to that exact view with preloaded demo data.
          </p>
        </div>

        {/* Steps List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70 transition flex items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 border border-slate-300 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                    {s.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{s.desc}</p>
                </div>
              </div>

              <button
                onClick={s.action}
                className="shrink-0 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>{s.buttonText}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>All 17 steps fully implemented and functional.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold transition cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
