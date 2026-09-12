import React, { useState, useEffect } from "react";
import { Role } from "./types";
import { storage, useSkillBridgeState } from "./lib/storage";

// Layout & Modals
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { AuthModal } from "./components/auth/AuthModal";
import { DatabaseSchemaModal } from "./components/common/DatabaseSchemaModal";
import { DemoGuideModal } from "./components/common/DemoGuideModal";

// Landing Page
import { LandingPage } from "./components/landing/LandingPage";

// Student Views
import { StudentDashboard } from "./components/student/StudentDashboard";
import { StudentProfile } from "./components/student/StudentProfile";
import { SkillAssessment } from "./components/student/SkillAssessment";
import { CareerExplorer } from "./components/student/CareerExplorer";
import { SkillGapAnalysis } from "./components/student/SkillGapAnalysis";
import { LearningRecommendations } from "./components/student/LearningRecommendations";
import { InternshipMarketplace } from "./components/student/InternshipMarketplace";
import { StudentApplications } from "./components/student/StudentApplications";
import { AICareerAdvisor } from "./components/student/AICareerAdvisor";

// Industry Views
import { IndustryDashboard } from "./components/industry/IndustryDashboard";
import { PostInternship } from "./components/industry/PostInternship";
import { CandidateMatching } from "./components/industry/CandidateMatching";
import { CompanyProfile } from "./components/industry/CompanyProfile";

// Faculty Views
import { FacultyDashboard } from "./components/faculty/FacultyDashboard";
import { IndustryDemand } from "./components/faculty/IndustryDemand";
import { CurriculumInsights } from "./components/faculty/CurriculumInsights";

export default function App() {
  const { role } = useSkillBridgeState();

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>(role ? (role === "student" ? "dashboard" : role === "industry" ? "ind_dashboard" : "fac_dashboard") : "landing");

  // Modals State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authDefaultRole, setAuthDefaultRole] = useState<Role>("student");
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [demoGuideModalOpen, setDemoGuideModalOpen] = useState(false);

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentTab]);

  const handleSelectTab = (tab: string) => {
    // If selecting a student-specific tab but currently without role, set to student
    if (["dashboard", "profile", "assessment", "careers", "skill_gap", "learning", "internships", "applications", "ai_advisor"].includes(tab)) {
      if (!role) storage.setRole("student");
    } else if (["ind_dashboard", "ind_profile", "ind_post", "ind_internships", "ind_applicants"].includes(tab)) {
      if (!role) storage.setRole("industry");
    } else if (["fac_dashboard", "fac_students", "fac_skill_gaps", "fac_industry_demand", "fac_analytics", "fac_curriculum"].includes(tab)) {
      if (!role) storage.setRole("faculty");
    }

    setCurrentTab(tab);
  };

  const handleOpenAuth = (defaultR: Role = "student") => {
    setAuthDefaultRole(defaultR);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (selectedRole: Role) => {
    if (selectedRole === "student") {
      setCurrentTab("dashboard");
    } else if (selectedRole === "industry") {
      setCurrentTab("ind_dashboard");
    } else {
      setCurrentTab("fac_dashboard");
    }
  };

  // Render current active view
  const renderContent = () => {
    // If on landing view
    if (currentTab === "landing" || (!role && currentTab === "landing")) {
      return (
        <LandingPage
          onSelectRole={(r) => {
            storage.setRole(r);
            handleAuthSuccess(r);
          }}
          onOpenAuth={handleOpenAuth}
          onNavigate={handleSelectTab}
          onOpenDemoGuide={() => setDemoGuideModalOpen(true)}
        />
      );
    }

    // Student tabs
    if (currentTab === "dashboard") {
      return <StudentDashboard onNavigate={handleSelectTab} onOpenDemoGuide={() => setDemoGuideModalOpen(true)} />;
    }
    if (currentTab === "profile") {
      return <StudentProfile />;
    }
    if (currentTab === "assessment") {
      return <SkillAssessment onNavigate={handleSelectTab} />;
    }
    if (currentTab === "careers") {
      return <CareerExplorer onNavigate={handleSelectTab} />;
    }
    if (currentTab === "skill_gap") {
      return <SkillGapAnalysis onNavigate={handleSelectTab} />;
    }
    if (currentTab === "learning") {
      return <LearningRecommendations onNavigate={handleSelectTab} />;
    }
    if (currentTab === "internships" || currentTab === "ind_internships") {
      return <InternshipMarketplace onNavigate={handleSelectTab} />;
    }
    if (currentTab === "applications") {
      return <StudentApplications onNavigate={handleSelectTab} />;
    }
    if (currentTab === "ai_advisor") {
      return <AICareerAdvisor onNavigate={handleSelectTab} />;
    }

    // Industry tabs
    if (currentTab === "ind_dashboard") {
      return <IndustryDashboard onNavigate={handleSelectTab} />;
    }
    if (currentTab === "ind_post") {
      return <PostInternship onNavigate={handleSelectTab} />;
    }
    if (currentTab === "ind_applicants") {
      return <CandidateMatching onNavigate={handleSelectTab} />;
    }
    if (currentTab === "ind_profile") {
      return <CompanyProfile />;
    }

    // Faculty tabs
    if (currentTab === "fac_dashboard" || currentTab === "fac_students" || currentTab === "fac_skill_gaps") {
      return <FacultyDashboard onNavigate={handleSelectTab} />;
    }
    if (currentTab === "fac_industry_demand") {
      return <IndustryDemand onNavigate={handleSelectTab} />;
    }
    if (currentTab === "fac_analytics" || currentTab === "fac_curriculum") {
      return <CurriculumInsights />;
    }

    // Default fallback to Landing
    return (
      <LandingPage
        onSelectRole={(r) => {
          storage.setRole(r);
          handleAuthSuccess(r);
        }}
        onOpenAuth={handleOpenAuth}
        onNavigate={handleSelectTab}
        onOpenDemoGuide={() => setDemoGuideModalOpen(true)}
      />
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Top Sticky Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={handleSelectTab}
        onOpenAuth={handleOpenAuth}
        onOpenDemoGuide={() => setDemoGuideModalOpen(true)}
        onOpenSchemaModal={() => setSchemaModalOpen(true)}
      />

      {/* Main Viewport */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer */}
      <Footer
        onOpenSchemaModal={() => setSchemaModalOpen(true)}
        onOpenDemoGuide={() => setDemoGuideModalOpen(true)}
        onSelectTab={handleSelectTab}
      />

      {/* Modals for Auth, SQL Schema, and SIH Demo Guide */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultRole={authDefaultRole}
        onSuccess={handleAuthSuccess}
      />

      <DatabaseSchemaModal
        isOpen={schemaModalOpen}
        onClose={() => setSchemaModalOpen(false)}
      />

      <DemoGuideModal
        isOpen={demoGuideModalOpen}
        onClose={() => setDemoGuideModalOpen(false)}
        onNavigate={handleSelectTab}
      />
    </div>
  );
}
