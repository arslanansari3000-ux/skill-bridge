import React, { useState } from "react";
import { X, GraduationCap, Building2, Cpu, CheckCircle2, ArrowRight } from "lucide-react";
import { Role } from "../../types";
import { storage } from "../../lib/storage";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: Role;
  onSuccess: (role: Role) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = "student",
  onSuccess,
}) => {
  const [selectedRole, setSelectedRole] = useState<Role>(defaultRole);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleQuickDemoLogin = (role: Role) => {
    storage.setRole(role);
    if (role === "student") {
      storage.setActiveStudentId("stu-arjun-1");
    } else if (role === "industry") {
      storage.setActiveCompanyId("comp-cybershield");
    }
    onSuccess(role);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Please enter an email address.");
      return;
    }
    storage.setRole(selectedRole);
    if (selectedRole === "student" && fullName) {
      storage.updateActiveStudent({ name: fullName, email });
    }
    onSuccess(selectedRole);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
              Role-Based Access
            </span>
            <h3 className="text-lg font-bold">
              {isSignUp ? "Create SkillBridge Account" : "Sign In to SkillBridge"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Quick Demo Login Option for Judges */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                SIH Evaluator Quick Access (1-Click)
              </span>
            </div>
            <p className="text-xs text-indigo-700/80 mb-3">
              Instant login as pre-seeded demo personas without typing credentials:
            </p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("student")}
                className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-indigo-600 hover:text-white text-slate-800 rounded-lg border border-indigo-200 text-xs font-semibold shadow-xs transition group cursor-pointer"
              >
                <GraduationCap className="w-5 h-5 mb-1 text-indigo-600 group-hover:text-white" />
                <span>Student</span>
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-100 font-normal">Arjun Sharma</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("industry")}
                className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-emerald-600 hover:text-white text-slate-800 rounded-lg border border-indigo-200 text-xs font-semibold shadow-xs transition group cursor-pointer"
              >
                <Building2 className="w-5 h-5 mb-1 text-emerald-600 group-hover:text-white" />
                <span>Industry</span>
                <span className="text-[10px] text-slate-400 group-hover:text-emerald-100 font-normal">CyberShield</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin("faculty")}
                className="flex flex-col items-center justify-center p-2.5 bg-white hover:bg-amber-600 hover:text-white text-slate-800 rounded-lg border border-indigo-200 text-xs font-semibold shadow-xs transition group cursor-pointer"
              >
                <Cpu className="w-5 h-5 mb-1 text-amber-600 group-hover:text-white" />
                <span>Faculty</span>
                <span className="text-[10px] text-slate-400 group-hover:text-amber-100 font-normal">NIT Dean</span>
              </button>
            </div>
          </div>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-xs font-medium text-slate-400 uppercase">
              Or Sign In Manually
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Role selector tabs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">Select Your Role</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole("student")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === "student"
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("industry")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === "industry"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                Industry
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole("faculty")}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedRole === "faculty"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <Cpu className="w-3.5 h-3.5" />
                Faculty
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Arjun Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                placeholder={
                  selectedRole === "student"
                    ? "student@college.edu"
                    : selectedRole === "industry"
                    ? "recruiter@company.com"
                    : "faculty@university.ac.in"
                }
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg("");
                }}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {errorMsg && <p className="text-xs text-rose-600 font-medium">{errorMsg}</p>}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isSignUp ? "Create Account & Enter" : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            {isSignUp ? "Already registered?" : "Don't have an account yet?"}{" "}
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-indigo-600 hover:underline cursor-pointer"
            >
              {isSignUp ? "Sign In" : "Register here"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
