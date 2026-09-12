import React from "react";
import { GraduationCap, ShieldCheck, Database, HelpCircle, RotateCcw } from "lucide-react";
import { storage } from "../../lib/storage";

interface FooterProps {
  onOpenSchemaModal: () => void;
  onOpenDemoGuide: () => void;
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSchemaModal,
  onOpenDemoGuide,
  onSelectTab,
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base tracking-tight">SkillBridge</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Smart India Hackathon project addressing the critical gap between academic curriculum, industry competencies, and student career readiness.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 text-[11px] text-emerald-400 font-medium border border-slate-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              Government & SIH Evaluation Ready
            </div>
          </div>

          {/* Student Hub */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Student Hub</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab("dashboard")} className="hover:text-white transition cursor-pointer">
                  Student Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("assessment")} className="hover:text-white transition cursor-pointer">
                  Skill Assessment
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("careers")} className="hover:text-white transition cursor-pointer">
                  Career Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("skill_gap")} className="hover:text-white transition cursor-pointer">
                  Skill-Gap Analysis Engine
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("ai_advisor")} className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer">
                  AI Career & Skill Advisor
                </button>
              </li>
            </ul>
          </div>

          {/* Industry & Recruiters */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Industry & Recruiters</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab("ind_dashboard")} className="hover:text-white transition cursor-pointer">
                  Company Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("ind_post")} className="hover:text-white transition cursor-pointer">
                  Post New Internship
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("ind_applicants")} className="hover:text-white transition cursor-pointer">
                  Candidate Matching & Scoring
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("internships")} className="hover:text-white transition cursor-pointer">
                  Marketplace Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Institutions & Demo Tools */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Institutions & Evaluation</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onSelectTab("fac_dashboard")} className="hover:text-white transition cursor-pointer">
                  Faculty Skill-Gap Overview
                </button>
              </li>
              <li>
                <button onClick={() => onSelectTab("fac_industry_demand")} className="hover:text-white transition cursor-pointer">
                  Industry Skill Demand Trends
                </button>
              </li>
              <li>
                <button onClick={onOpenDemoGuide} className="text-amber-400 hover:text-amber-300 transition cursor-pointer flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  17-Step Demo Walkthrough
                </button>
              </li>
              <li>
                <button onClick={onOpenSchemaModal} className="text-indigo-400 hover:text-indigo-300 transition cursor-pointer flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" />
                  Supabase SQL Schema & RLS
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    if (window.confirm("Reset all test data back to default demo state?")) {
                      storage.resetToDemo();
                      onSelectTab("landing");
                    }
                  }}
                  className="text-rose-400 hover:text-rose-300 transition cursor-pointer flex items-center gap-1.5 pt-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Demo State
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 SkillBridge Platform. Built for Smart India Hackathon (Ministry of Education & AICTE).</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Stack: React • TypeScript • Tailwind CSS • Supabase DDL • Express • Gemini 3.8</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
