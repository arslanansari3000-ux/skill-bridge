import React, { useState } from "react";
import { X, Database, Check, Copy, Shield, Layers, Code2 } from "lucide-react";
import { SUPABASE_SQL_SCHEMA } from "../../lib/supabaseSchema";
import { isSupabaseConfigured } from "../../lib/supabase";

interface DatabaseSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSchemaModal: React.FC<DatabaseSchemaModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"schema" | "architecture">("schema");

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Supabase PostgreSQL Schema & Security Architecture
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  SIH Spec
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Connection Status:{" "}
                <span className={isSupabaseConfigured ? "text-emerald-400 font-semibold" : "text-amber-400 font-semibold"}>
                  {isSupabaseConfigured ? "Connected to Live Supabase Project" : "Active Local Mirror (Ready for Supabase DDL deployment)"}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied SQL" : "Copy SQL DDL"}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="bg-slate-100 px-6 py-2 border-b border-slate-200 flex items-center gap-2">
          <button
            onClick={() => setActiveTab("schema")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "schema"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Code2 className="w-3.5 h-3.5 inline mr-1" />
            Full SQL DDL & RLS Policies
          </button>
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === "architecture"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5 inline mr-1" />
            Schema Entities & Relationships
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 text-slate-200 font-mono text-xs">
          {activeTab === "schema" ? (
            <pre className="leading-relaxed whitespace-pre-wrap select-all">
              {SUPABASE_SQL_SCHEMA}
            </pre>
          ) : (
            <div className="font-sans space-y-6 text-slate-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Authentication & Identity
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li><strong className="text-slate-200">profiles:</strong> Extends Supabase auth.users with user_role enum</li>
                    <li><strong className="text-slate-200">student_profiles:</strong> Academic metadata (college, degree, branch, year, cgpa)</li>
                    <li><strong className="text-slate-200">industry_profiles:</strong> Company credentials & recruiter verification</li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-400" />
                    Skill Catalog & Gap Engine
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li><strong className="text-slate-200">skills:</strong> Master dictionary of 35+ technology competencies</li>
                    <li><strong className="text-slate-200">student_skills:</strong> Student self-assessment proficiency levels</li>
                    <li><strong className="text-slate-200">careers & career_skills:</strong> Industry benchmark requirements & weights</li>
                    <li><strong className="text-slate-200">learning_resources:</strong> Curated courses mapped to skill deficiencies</li>
                  </ul>
                </div>

                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <h4 className="font-bold text-white text-sm mb-2 flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    Internships & Applications
                  </h4>
                  <ul className="text-xs space-y-1.5 text-slate-400">
                    <li><strong className="text-slate-200">internships:</strong> Opportunities posted by verified recruiters</li>
                    <li><strong className="text-slate-200">internship_skills:</strong> Prerequisite skill proficiencies</li>
                    <li><strong className="text-slate-200">applications:</strong> Evaluated submissions with rule-based match scores</li>
                    <li><strong className="text-slate-200">saved_internships:</strong> Student bookmarks</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                <h4 className="font-bold text-emerald-400 text-xs uppercase tracking-wider mb-2">
                  Row Level Security (RLS) Guarantees
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  All tables enforce strict PostgreSQL policies: students can only view or mutate their own academic records; recruiters can only manage their own internship postings and view applicants to their jobs; college administrators/faculty have analytical read-only visibility over aggregate cohort metrics.
                </p>
                <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-3 rounded-lg border border-slate-800">
                  CREATE POLICY "Students can update own profile" ON public.student_profiles FOR ALL USING (auth.uid() = user_id);
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
