import React from "react";
import {
  GraduationCap,
  Building2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Target,
  BookOpen,
  Briefcase,
  Users,
  Compass,
  Layers,
  Award,
  BarChart3,
  Search,
} from "lucide-react";
import { Role } from "../../types";
import { storage } from "../../lib/storage";

interface LandingPageProps {
  onSelectRole: (role: Role) => void;
  onOpenAuth: (role?: Role) => void;
  onNavigate: (tab: string) => void;
  onOpenDemoGuide: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectRole,
  onOpenAuth,
  onNavigate,
  onOpenDemoGuide,
}) => {
  const handleStartRole = (role: Role) => {
    storage.setRole(role);
    if (role === "student") {
      storage.setActiveStudentId("stu-arjun-1");
      onNavigate("dashboard");
    } else if (role === "industry") {
      storage.setActiveCompanyId("comp-cybershield");
      onNavigate("ind_dashboard");
    } else {
      onNavigate("fac_dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#818cf8_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-400/30 mb-6">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Smart India Hackathon • Academic to Industry Skill Synchronization
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-4xl mx-auto text-white">
            Bridging the Gap Between <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-300 via-cyan-300 to-emerald-300 bg-clip-text text-transparent">
              Education and Industry
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Discover the skills you need, build your career path, and connect with real-world opportunities.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => handleStartRole("student")}
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center gap-2 cursor-pointer"
            >
              <span>Get Started as Student</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                storage.setRole("student");
                onNavigate("internships");
              }}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-indigo-400" />
              <span>Explore Opportunities</span>
            </button>

            <button
              onClick={onOpenDemoGuide}
              className="px-5 py-3.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 font-bold text-sm rounded-xl border border-amber-500/30 transition flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-400" />
              <span>17-Step Demo Tour</span>
            </button>
          </div>

          {/* 3 Quick Role Entry Cards */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
            {/* Student Card */}
            <div
              onClick={() => handleStartRole("student")}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500/50 p-5 rounded-2xl transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                For Students
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Take skill assessment, calculate your match against target careers, learn missing competencies, and apply for internships.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-indigo-400">
                Demo Student: Arjun Sharma (NIT Trichy) →
              </span>
            </div>

            {/* Industry Card */}
            <div
              onClick={() => handleStartRole("industry")}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500/50 p-5 rounded-2xl transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                For Industry & Recruiters
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Post internships with required proficiencies, view student applicants, and rank candidates by verified skill match %.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-emerald-400">
                Demo Recruiter: CyberShield Tech →
              </span>
            </div>

            {/* Faculty Card */}
            <div
              onClick={() => handleStartRole("faculty")}
              className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 p-5 rounded-2xl transition cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 text-amber-300 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-base flex items-center justify-between">
                For Faculty & Administrators
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 group-hover:translate-x-1 transition" />
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Analyze cohort-wide skill gaps, view industry demand trends, and guide curriculum enhancements to boost placement rates.
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-amber-400">
                Demo Dean: Prof. Rajesh Iyer (NIT) →
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Realistic Platform Statistics */}
      <section className="bg-white py-12 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-600">2,450+</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Students Assessed</div>
              <div className="text-[11px] text-slate-400">Across 35+ partner institutions</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600">180+</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Active Industry Recruiters</div>
              <div className="text-[11px] text-slate-400">Verified technology employers</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-amber-600">64%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Average Skill-Gap Reduction</div>
              <div className="text-[11px] text-slate-400">Within 8 weeks of targeted learning</div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-900">89%</div>
              <div className="text-xs font-semibold text-slate-700 mt-1">Internship Match Accuracy</div>
              <div className="text-[11px] text-slate-400">Rule-based candidate scoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: How It Works */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
            System Workflow
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-3">How It Works</h2>
          <p className="text-slate-600 text-sm mt-2">
            A seamless five-step methodology bridging academic learning with practical employment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: "01",
              title: "Build Your Profile",
              desc: "Record academic background, college, CGPA, projects, certifications, and target career interest.",
              icon: Users,
            },
            {
              step: "02",
              title: "Assess Your Skills",
              desc: "Self-rate proficiency (Beginner, Intermediate, Advanced) across programming, web, data, and security.",
              icon: Target,
            },
            {
              step: "03",
              title: "Identify Skill Gaps",
              desc: "Transparent mathematical comparison between student abilities and industry job benchmark requirements.",
              icon: BarChart3,
            },
            {
              step: "04",
              title: "Learn & Improve",
              desc: "Follow curated, modular learning paths to master specific missing skills efficiently.",
              icon: BookOpen,
            },
            {
              step: "05",
              title: "Connect With Industry",
              desc: "Apply to high-affinity internship postings with automated skill-match rankings visible to recruiters.",
              icon: Briefcase,
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition relative flex flex-col"
              >
                <div className="text-xs font-black text-indigo-600 mb-2">{item.step}</div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1.5">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-auto">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 2: For Students */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-5">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                Student Centricity
              </span>
              <h2 className="text-3xl font-bold text-slate-900">
                Eliminate Career Guesswork With Precision Analytics
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Students often complete their degrees without knowing which practical technologies industry recruiters demand. SkillBridge gives you immediate clarity.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: "Career Guidance", desc: "Explore 8 high-growth technology pathways with average compensation benchmarks." },
                  { title: "Skill-Gap Analysis", desc: "See your exact match % and pinpoint the specific missing skills holding you back." },
                  { title: "Learning Recommendations", desc: "Access curated NPTEL, Coursera, and freeCodeCamp resources aligned to your gaps." },
                  { title: "Internship Matching", desc: "Discover live openings ranked by your real skill compatibility score." },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleStartRole("student")}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer"
                >
                  <span>Launch Student Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl p-6 text-white shadow-xl border border-slate-800">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200">Target Career: Cybersecurity Analyst</h4>
                    <p className="text-[11px] text-slate-400">Student: Arjun Sharma (NIT Trichy)</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  58% Skill Match
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400 font-medium">Readiness Threshold</span>
                    <span className="font-bold text-indigo-400">58% of 100%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-amber-500 to-indigo-500 h-full w-[58%]"></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/40">
                    <span className="font-bold text-emerald-400 block mb-1">Strong Skills</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px]">Python</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px]">HTML</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-200 text-[10px]">SQL</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40">
                    <span className="font-bold text-rose-400 block mb-1">Critical Missing Skills</span>
                    <div className="flex flex-wrap gap-1">
                      <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 text-[10px]">Networking</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 text-[10px]">Linux</span>
                      <span className="px-1.5 py-0.5 rounded bg-rose-900/60 text-rose-200 text-[10px]">Web Security</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="text-slate-300">Top Matched Internship: <strong>CyberShield Tech</strong></span>
                  <span className="text-indigo-400 font-bold">87% Fit</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: For Industries */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Recruiter UI mock */}
          <div className="lg:col-span-7 order-2 lg:order-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded">
                  Recruiter Console
                </span>
                <h4 className="font-bold text-slate-900 text-sm mt-1">Applicant Matching: CyberShield Tech</h4>
              </div>
              <span className="text-xs text-slate-500">4 Active Applications</span>
            </div>

            <div className="space-y-3">
              {[
                { name: "Manish Kulkarni", match: 92, college: "COEP Pune", strong: "Linux, Networking", missing: "Penetration Testing" },
                { name: "Arjun Sharma", match: 58, college: "NIT Trichy", strong: "Python, SQL", missing: "Linux, Networking" },
              ].map((c, i) => (
                <div key={i} className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{c.name}</span>
                      <span className="text-[10px] text-slate-500">({c.college})</span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">
                      <span className="text-emerald-700 font-semibold">Strong:</span> {c.strong} | <span className="text-rose-600 font-semibold">Gaps:</span> {c.missing}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className={`text-sm font-extrabold ${c.match > 80 ? "text-emerald-600" : "text-amber-600"}`}>
                      {c.match}%
                    </span>
                    <span className="block text-[10px] text-slate-400">Match Score</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 order-1 lg:order-2 space-y-5">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              For Industry & Recruiters
            </span>
            <h2 className="text-3xl font-bold text-slate-900">
              Zero-Noise Campus Hiring Based on Objective Competency
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Tired of sifting through hundreds of generic resumes? SkillBridge scores every candidate according to your exact technological proficiency requirements.
            </p>

            <ul className="space-y-2.5 text-xs text-slate-700">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Post internships</strong> with specific skill proficiency thresholds (Beginner / Intermediate / Advanced).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Automated candidate ranking</strong> eliminates manual resume screening fatigue.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span><strong>Direct pipeline to academia</strong> to communicate upcoming technology requirements.</span>
              </li>
            </ul>

            <div>
              <button
                onClick={() => handleStartRole("industry")}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition flex items-center gap-2 cursor-pointer"
              >
                <span>Access Industry Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: For Institutions */}
      <section className="py-16 bg-slate-900 text-white border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              For Colleges & Academicians
            </span>
            <h2 className="text-3xl font-bold text-white mt-3">
              Actionable Visibility Into Industry Curriculum Demand
            </h2>
            <p className="text-slate-400 text-sm mt-2">
              Faculty deans and placement directors gain real-time intelligence into the gaps between their syllabus and what employers are actively hiring for.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Analyze Student Skill Gaps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Spot cohort-wide deficiencies across departments. Identify when 40%+ of final year students lack hands-on Linux or cloud infrastructure skills.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center mb-4">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Understand Industry Demand</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track top requested skills from 180+ verified technology partners (e.g. Python 78%, SQL 72%, Computer Networking 54%) to modernize academic syllabi.
              </p>
            </div>

            <div className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-2">Targeted Bootcamp Intervention</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Organize high-impact campus bootcamps directly addressing the missing requirements, raising campus placement readiness above 90%.
              </p>
            </div>
          </div>

          <div className="text-center mt-10">
            <button
              onClick={() => handleStartRole("faculty")}
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 mx-auto cursor-pointer"
            >
              <span>View Faculty Institutional Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
