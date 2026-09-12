import React, { useState } from "react";
import {
  Briefcase,
  GraduationCap,
  Building2,
  Cpu,
  Database,
  HelpCircle,
  LogOut,
  Menu,
  X,
  RotateCcw,
  Sparkles,
  ChevronDown,
  UserCheck,
} from "lucide-react";
import { Role } from "../../types";
import { storage, useSkillBridgeState } from "../../lib/storage";

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAuth: (role?: Role) => void;
  onOpenDemoGuide: () => void;
  onOpenSchemaModal: () => void;
}

interface NavItem {
  id: string;
  label: string;
  highlight?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenAuth,
  onOpenDemoGuide,
  onOpenSchemaModal,
}) => {
  const { role, student, company, faculty } = useSkillBridgeState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);

  const handleLogout = () => {
    storage.setRole(null);
    onSelectTab("landing");
  };

  const handleSwitchRole = (newRole: Role) => {
    storage.setRole(newRole);
    setRoleMenuOpen(false);
    onSelectTab(newRole === "student" ? "dashboard" : newRole === "industry" ? "ind_dashboard" : "fac_dashboard");
  };

  const studentNavItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard" },
    { id: "profile", label: "My Profile" },
    { id: "assessment", label: "Skill Assessment" },
    { id: "careers", label: "Career Explorer" },
    { id: "skill_gap", label: "Skill Gap" },
    { id: "learning", label: "Learning" },
    { id: "internships", label: "Internships" },
    { id: "applications", label: "Applications" },
    { id: "ai_advisor", label: "AI Advisor", highlight: true },
  ];

  const industryNavItems: NavItem[] = [
    { id: "ind_dashboard", label: "Dashboard" },
    { id: "ind_profile", label: "Company Profile" },
    { id: "ind_post", label: "Post Internship" },
    { id: "ind_internships", label: "My Internships" },
    { id: "ind_applicants", label: "Applicants & Candidates" },
  ];

  const facultyNavItems: NavItem[] = [
    { id: "fac_dashboard", label: "Dashboard" },
    { id: "fac_students", label: "Students" },
    { id: "fac_skill_gaps", label: "Skill Gaps" },
    { id: "fac_industry_demand", label: "Industry Demand" },
    { id: "fac_analytics", label: "Curriculum Analytics" },
  ];

  const navItems: NavItem[] =
    role === "student"
      ? studentNavItems
      : role === "industry"
      ? industryNavItems
      : role === "faculty"
      ? facultyNavItems
      : [];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      {/* SIH Hackathon Top Notice Ribbon */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-slate-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Smart India Hackathon Prototype
          </span>
          <span className="hidden sm:inline text-slate-300">
            Problem Statement: Bridging Higher Education Academic Curriculum with Real-Time Industry Skill Demand
          </span>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={onOpenDemoGuide}
              className="text-indigo-300 hover:text-white flex items-center gap-1 font-medium transition cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>17-Step Demo Guide</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={onOpenSchemaModal}
              className="text-slate-300 hover:text-white flex items-center gap-1 font-medium transition cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Supabase SQL</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              onClick={() => {
                if (window.confirm("Reset all test and demo data to original pristine state?")) {
                  storage.resetToDemo();
                  onSelectTab("landing");
                }
              }}
              title="Reset state to pristine demo"
              className="text-rose-300 hover:text-rose-100 flex items-center gap-1 font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab(role ? (role === "student" ? "dashboard" : role === "industry" ? "ind_dashboard" : "fac_dashboard") : "landing")}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg text-slate-900 tracking-tight">SkillBridge</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    SIH
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium leading-none">Education ↔ Industry Match</p>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          {role && (
            <nav className="hidden lg:flex items-center gap-1 overflow-x-auto py-1">
              {navItems.map((item) => {
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectTab(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/25"
                        : item.highlight
                        ? "text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.highlight && <Sparkles className="w-3 h-3 inline mr-1 text-indigo-500" />}
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {role ? (
              <div className="flex items-center gap-2">
                {/* Role Switcher Pill */}
                <div className="relative">
                  <button
                    onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold transition border border-slate-200 cursor-pointer"
                  >
                    {role === "student" && <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                    {role === "industry" && <Building2 className="w-3.5 h-3.5 text-emerald-600" />}
                    {role === "faculty" && <Cpu className="w-3.5 h-3.5 text-amber-600" />}
                    <span className="capitalize">{role} View</span>
                    <ChevronDown className="w-3 h-3 text-slate-500" />
                  </button>

                  {roleMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                      <div className="px-3 py-1.5 border-b border-slate-100 mb-1">
                        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Switch Persona</p>
                      </div>
                      <button
                        onClick={() => handleSwitchRole("student")}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-indigo-50 transition cursor-pointer ${
                          role === "student" ? "font-bold text-indigo-700 bg-indigo-50/50" : "text-slate-700"
                        }`}
                      >
                        <div className="w-6 h-6 rounded bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                          S
                        </div>
                        <div>
                          <p className="font-semibold">Student: {student.name.split(" ")[0]}</p>
                          <p className="text-[10px] text-slate-400">Target: {student.targetCareerTitle}</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSwitchRole("industry")}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-emerald-50 transition cursor-pointer ${
                          role === "industry" ? "font-bold text-emerald-700 bg-emerald-50/50" : "text-slate-700"
                        }`}
                      >
                        <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          I
                        </div>
                        <div>
                          <p className="font-semibold">Industry: {company.companyName}</p>
                          <p className="text-[10px] text-slate-400">Cybersecurity Recruiter</p>
                        </div>
                      </button>

                      <button
                        onClick={() => handleSwitchRole("faculty")}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2.5 hover:bg-amber-50 transition cursor-pointer ${
                          role === "faculty" ? "font-bold text-amber-700 bg-amber-50/50" : "text-slate-700"
                        }`}
                      >
                        <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                          F
                        </div>
                        <div>
                          <p className="font-semibold">Faculty: {faculty.name}</p>
                          <p className="text-[10px] text-slate-400">Dean of Placements</p>
                        </div>
                      </button>
                    </div>
                  )}
                </div>

                {/* User Name & Logout */}
                <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-900 leading-tight">
                      {role === "student" ? student.name : role === "industry" ? company.companyName : faculty.name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {role === "student" ? student.college.split(",")[0] : role === "industry" ? "Recruiter" : "NIT Trichy Dean"}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Logout to landing page"
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth("student")}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth("student")}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Get Started
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            {role && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {role && mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-100 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentTab === item.id
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between px-2">
              <span className="text-xs text-slate-500">Logged in as {role}</span>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
