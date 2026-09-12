import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Layers,
  Sparkles,
  Download,
} from "lucide-react";
import { SEED_TOP_SKILL_GAPS } from "../../data/seedData";

export const CurriculumInsights: React.FC = () => {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  const actionItems = [
    {
      course: "CS304: Computer Networks",
      status: "Revision Required",
      currentDeficiency: "70% theoretical evaluation; lack of socket programming and live packet analysis.",
      proposedSyllabus: "Introduce 4 practical lab sessions covering Wireshark packet capture, subnetting calculators, and firewall rulesets.",
      industryPartner: "CyberShield Technologies & Cisco Academy",
    },
    {
      course: "CS308: Operating Systems",
      status: "Lab Upgrade",
      currentDeficiency: "Students learn conceptual paging/scheduling without hands-on Linux system administration.",
      proposedSyllabus: "Mandate Linux environment setup, bash scripting for log processing, and systemd service monitoring.",
      industryPartner: "Red Hat Academic Alliance",
    },
    {
      course: "CS402: Information & Web Security",
      status: "New Elective",
      currentDeficiency: "Current elective focuses only on mathematical cryptography without modern application security.",
      proposedSyllabus: "Adopt OWASP Top 10 hands-on defense, Burp Suite fundamentals, and secure coding practices.",
      industryPartner: "OWASP Student Chapter",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
            Academic Board of Studies
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Curriculum Modernization & Syllabus Alignment
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated recommendations for university department heads to align course syllabi with current industry hiring standards.
          </p>
        </div>

        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-amber-400" />
          <span>{downloaded ? "Report Downloaded!" : "Download BOS Proposal"}</span>
        </button>
      </div>

      {/* Curriculum Revision Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Proposed Course Syllabus Modernizations
        </h2>

        <div className="space-y-4">
          {actionItems.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">{item.course}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                    {item.status}
                  </span>
                </div>
                <span className="text-xs font-semibold text-indigo-700">
                  Partner: {item.industryPartner}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-100">
                  <span className="font-bold text-rose-900 block mb-1">Observed Academic Gap:</span>
                  <p className="text-rose-950">{item.currentDeficiency}</p>
                </div>
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="font-bold text-emerald-900 block mb-1">Recommended Industry Module:</span>
                  <p className="text-emerald-950">{item.proposedSyllabus}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
