import React, { useState } from "react";
import {
  Sparkles,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FolderGit2,
  Briefcase,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Target,
  Copy,
  Check,
} from "lucide-react";
import { useSkillBridgeState } from "../../lib/storage";
import { calculateSkillGap } from "../../lib/skillGapAlgorithm";
import { AIAdvisorResponse } from "../../types";

interface AICareerAdvisorProps {
  onNavigate: (tab: string) => void;
}

export const AICareerAdvisor: React.FC<AICareerAdvisorProps> = ({ onNavigate }) => {
  const { student, careers } = useSkillBridgeState();

  const targetCareer =
    careers.find((c) => c.id === student.preferredCareerId) ||
    careers.find((c) => c.id === "car-cybersec") ||
    careers[0];

  const gap = calculateSkillGap(targetCareer, student.skills);

  const [question, setQuestion] = useState(
    `What skills should I learn to become a ${targetCareer.title}?`
  );
  const [loading, setLoading] = useState(false);
  const [advice, setAdvice] = useState<AIAdvisorResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const suggestedQuestions = [
    `What skills should I learn to become a ${targetCareer.title}?`,
    "How can I bridge my Computer Networking & Linux gaps within 8 weeks?",
    "What hands-on portfolio projects will make me stand out to campus recruiters?",
    "Which certifications should I prioritize: CompTIA Security+ or CEH?",
  ];

  const handleAsk = async (queryText?: string) => {
    const q = queryText || question;
    if (!q.trim()) return;

    setLoading(true);
    setAdvice(null);

    try {
      const payload = {
        question: q,
        studentProfile: {
          name: student.name,
          college: student.college,
          branch: student.branch,
          year: student.year,
          cgpa: student.cgpa,
          skills: student.skills,
          targetCareer: targetCareer.title,
        },
        targetCareer,
        skillGap: gap,
      };

      const res = await fetch("/api/ai-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data: AIAdvisorResponse = await res.json();
      setAdvice(data);
    } catch (err) {
      console.error("AI Advisor error:", err);
      // Fallback response in case server is unreachable
      setAdvice({
        currentPosition: `${student.name} possesses ${student.skills.length} evaluated skills with a verified ${gap.overallMatch}% benchmark alignment toward ${targetCareer.title}. Strengths in Python, HTML, and SQL provide a firm algorithmic foundation.`,
        missingSkills: gap.criticalMissingSkills.map((s) => s.skillName),
        prioritySkills: [
          "Computer Networking (OSI Model, TCP/IP, Wireshark packet capture)",
          "Linux System Administration (File permissions, Bash scripting, systemd)",
          "Web Security Fundamentals (OWASP Top 10, SQLi, XSS defense)",
        ],
        learningSequence: [
          {
            phase: "Weeks 1 - 2: Network Fundamentals",
            topics: ["OSI 7-Layer Model", "Packet inspection with Wireshark", "Subnetting and Routing"],
            estimatedHours: 25,
          },
          {
            phase: "Weeks 3 - 5: Linux Mastery & Shell Scripting",
            topics: ["Linux commands & directory hierarchy", "Process control & services", "Automated threat monitoring scripts in Bash"],
            estimatedHours: 35,
          },
          {
            phase: "Weeks 6 - 8: Web Security Labs & Defensive Architecture",
            topics: ["PortSwigger Web Security Academy", "OWASP Top 10 remediation", "Network Vulnerability Scanner project"],
            estimatedHours: 40,
          },
        ],
        suggestedProjects: [
          {
            title: "Automated Packet Analyzer & Intrusion Detector",
            description: "Build a Python-based utility utilizing Scapy to capture live promiscuous network packets, flag anomalous traffic bursts, and export alert logs.",
            skillsDemonstrated: ["Python", "Computer Networking", "Linux"],
          },
          {
            title: "OWASP Vulnerable Web Application Security Audit",
            description: "Deploy a deliberately vulnerable web app locally, execute controlled penetration testing against XSS and SQL injection, and document a remediation audit report.",
            skillsDemonstrated: ["Web Security", "SQL", "Linux"],
          },
        ],
        suggestedInternships: [
          "CyberShield Technologies: Cyber Security Intern (Bangalore / Hybrid)",
          "DataPulse Systems: Junior Security Analyst (Hyderabad)",
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyAdvice = () => {
    if (!advice) return;
    const text = `SkillBridge AI Career Roadmap for ${targetCareer.title}\n\nCurrent Position: ${advice.currentPosition}\n\nPriority Skills:\n${advice.prioritySkills.join("\n")}\n\nLearning Phases:\n${advice.learningSequence.map((l) => `${l.phase}: ${l.topics.join(", ")} (${l.estimatedHours}h)`).join("\n")}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
            Intelligent Guidance Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            AI Career & Skill Advisor
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
              Gemini Server-Side + Fallback Engine
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Generates personalized 6-phase curriculum advice synthesizing your academic transcript, current skill ratings, and industry benchmark targets.
          </p>
        </div>
      </div>

      {/* Input Console */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        {/* Suggested Queries */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Quick Inquiries:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {suggestedQuestions.map((sq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(sq);
                  handleAsk(sq);
                }}
                className="text-left px-3 py-1.5 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 text-slate-700 rounded-lg text-xs font-medium border border-slate-200 transition cursor-pointer"
              >
                💡 {sq}
              </button>
            ))}
          </div>
        </div>

        {/* Query Input */}
        <div className="relative">
          <textarea
            rows={2}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about bridging your skills, target careers, or technical roadmap..."
            className="w-full px-3.5 py-2.5 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-24"
          />
          <button
            onClick={() => handleAsk()}
            disabled={loading || !question.trim()}
            className="absolute right-2.5 bottom-3.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Advise Me</span>
              </>
            )}
          </button>
        </div>

        {/* Current Student Context Badge */}
        <div className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <span>
            Active Student: <strong>{student.name}</strong> ({student.college})
          </span>
          <span>
            Target Role: <strong>{targetCareer.title}</strong>
          </span>
          <span>
            Calculated Match: <strong className="text-amber-600">{gap.overallMatch}%</strong>
          </span>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Synthesizing Personalized Career Roadmap...</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Cross-referencing {student.skills.length} current skills against {targetCareer.title} requirements and curriculum benchmarks.
          </p>
        </div>
      )}

      {/* Advice Output: 6-Part Structured Response */}
      {advice && !loading && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  AI Career Advisory Report
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  Roadmap for {targetCareer.title}
                </h2>
              </div>
            </div>

            <button
              onClick={handleCopyAdvice}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Advice"}</span>
            </button>
          </div>

          {/* 1. Current Position */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" />
              1. Current Position Assessment
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-indigo-50/50 p-3.5 rounded-xl border border-indigo-100">
              {advice.currentPosition}
            </p>
          </div>

          {/* 2 & 3. Missing Skills & Priority Skills */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Missing Skills */}
            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-100 space-y-2">
              <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                2. Missing Competencies
              </h3>
              <ul className="space-y-1 text-xs text-rose-950">
                {advice.missingSkills.map((sk, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span>•</span>
                    <span className="font-semibold">{sk}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Priority Skills */}
            <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
              <h3 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                3. Immediate Priority Focus
              </h3>
              <ul className="space-y-1 text-xs text-amber-950">
                {advice.prioritySkills.map((sk, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span>•</span>
                    <span className="font-semibold">{sk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 4. Recommended Learning Sequence */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              4. Recommended Learning Sequence & Milestones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {advice.learningSequence.map((seq, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between text-xs space-y-2"
                >
                  <div>
                    <span className="font-bold text-indigo-600 text-xs block mb-1">
                      {seq.phase}
                    </span>
                    <ul className="space-y-1 text-slate-600 text-[11px]">
                      {seq.topics.map((t, ti) => (
                        <li key={ti}>• {t}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-slate-200 text-[10px] font-semibold text-slate-400">
                    Est. Time: {seq.estimatedHours} Hours
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. Suggested Projects */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-emerald-600" />
              5. High-Impact Portfolio Projects
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {advice.suggestedProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 text-xs"
                >
                  <h4 className="font-bold text-slate-900">{proj.title}</h4>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {proj.description}
                  </p>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {proj.skillsDemonstrated.map((sk, si) => (
                      <span
                        key={si}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 6. Suggested Internships */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              6. Suggested Internship Matches
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              {advice.suggestedInternships.map((intName, idx) => (
                <div key={idx} className="flex items-center justify-between text-slate-800 font-semibold">
                  <span>• {intName}</span>
                  <button
                    onClick={() => onNavigate("internships")}
                    className="text-[11px] text-indigo-600 hover:underline font-bold cursor-pointer"
                  >
                    View in Marketplace →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
