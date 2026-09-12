import React from "react";
import {
  TrendingUp,
  BarChart2,
  Building2,
  BookOpen,
  Award,
  ArrowUpRight,
  Sparkles,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { SEED_INDUSTRY_DEMAND, SEED_TOP_SKILL_GAPS } from "../../data/seedData";

interface IndustryDemandProps {
  onNavigate: (tab: string) => void;
}

export const IndustryDemand: React.FC<IndustryDemandProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded">
            Market Intelligence
          </span>
          <h1 className="text-2xl font-black text-slate-900 mt-1">
            Industry Skill Demand & Hiring Trends
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Aggregated demand signals from 180+ partner corporate hiring portals and campus recruitment drives.
          </p>
        </div>

        <button
          onClick={() => onNavigate("fac_curriculum")}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <BookOpen className="w-3.5 h-3.5 text-amber-400" />
          <span>Curriculum Modernization Advisory</span>
        </button>
      </div>

      {/* Demand Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Fastest Growing Skill</span>
            <span className="text-emerald-600 font-bold">+45% YoY</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Cloud Security & Linux</h3>
          <p className="text-xs text-slate-500">
            Mandated by 68% of IT infrastructure and fintech organizations for entry-level positions.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Highest Wage Premium</span>
            <span className="text-indigo-600 font-bold">₹12 - 18 LPA</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Vulnerability Assessment & SOC</h3>
          <p className="text-xs text-slate-500">
            Candidates holding hands-on Linux + Networking command higher median starting salaries.
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
            <span>Largest Academic Deficit</span>
            <span className="text-rose-600 font-bold">42% Gap</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">Computer Networking & TCP/IP</h3>
          <p className="text-xs text-slate-500">
            Theory taught in semester 5 without hands-on packet capture tools leads to low interview pass rates.
          </p>
        </div>
      </div>

      {/* Comprehensive Demand Radar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            Industry Skill Breakdown by Tech Category
          </h2>
          <span className="text-xs text-slate-400 font-medium">Updated Weekly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SEED_INDUSTRY_DEMAND.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.category}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{item.skill}</h3>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-emerald-600">
                    {item.demandPercentage}%
                  </span>
                  <span className="block text-[10px] text-slate-400">Demand Index</span>
                </div>
              </div>

              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full"
                  style={{ width: `${item.demandPercentage}%` }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Hiring Velocity: <strong className="text-indigo-600">{item.trend}</strong></span>
                <span>Compensation Impact: <strong className="text-slate-800">{item.salaryImpact}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations for Academic Board of Studies */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Institutional Action Plan: Board of Studies Recommendations
            </h2>
            <p className="text-xs text-slate-300">
              Immediate adjustments to bridge university syllabus gaps with employer expectations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-2">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <h3 className="font-bold text-amber-300 text-sm">1. Hands-on Networking Labs</h3>
            <p className="text-slate-300 leading-relaxed">
              Introduce Wireshark, Cisco Packet Tracer, and HTTP/HTTPS packet inspection into 3rd-year CS/IT lab curricula.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <h3 className="font-bold text-amber-300 text-sm">2. Linux System Administration</h3>
            <p className="text-slate-300 leading-relaxed">
              Make Linux CLI, shell scripting, and basic permissions mandatory prerequisites before software engineering electives.
            </p>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 space-y-2">
            <h3 className="font-bold text-amber-300 text-sm">3. Corporate Capstone Mentorship</h3>
            <p className="text-slate-300 leading-relaxed">
              Invite CyberShield Technologies and partner companies to evaluate final-year capstone design milestones.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
