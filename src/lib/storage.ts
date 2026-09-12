import { useEffect, useState } from "react";
import {
  SEED_APPLICATIONS,
  SEED_CAREERS,
  SEED_COMPANIES,
  SEED_FACULTY,
  SEED_INTERNSHIPS,
  SEED_LEARNING_RESOURCES,
  SEED_SKILLS,
  SEED_STUDENTS,
} from "../data/seedData";
import {
  Application,
  Career,
  FacultyProfile,
  IndustryProfile,
  Internship,
  LearningResource,
  Role,
  Skill,
  StudentProfile,
  StudentSkill,
} from "../types";

const STORAGE_KEYS = {
  ROLE: "skillbridge_role",
  ACTIVE_STUDENT_ID: "skillbridge_active_student_id",
  ACTIVE_COMPANY_ID: "skillbridge_active_company_id",
  STUDENTS: "skillbridge_students_v1",
  CAREERS: "skillbridge_careers_v1",
  SKILLS: "skillbridge_skills_v1",
  INTERNSHIPS: "skillbridge_internships_v1",
  LEARNING_RESOURCES: "skillbridge_learning_v1",
  APPLICATIONS: "skillbridge_applications_v1",
  SAVED_INTERNSHIPS: "skillbridge_saved_internships_v1",
};

// Dispatch custom event to notify components of state changes
function emitChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("skillbridge_storage_update"));
  }
}

function getStoredJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn(`Error reading key ${key} from storage:`, e);
    return fallback;
  }
}

function setStoredJson<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    emitChange();
  } catch (e) {
    console.warn(`Error saving key ${key} to storage:`, e);
  }
}

export const storage = {
  getRole(): Role | null {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(STORAGE_KEYS.ROLE) as Role) || null;
  },

  setRole(role: Role | null): void {
    if (typeof window === "undefined") return;
    if (role) {
      localStorage.setItem(STORAGE_KEYS.ROLE, role);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ROLE);
    }
    emitChange();
  },

  getActiveStudentId(): string {
    if (typeof window === "undefined") return "stu-arjun-1";
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_STUDENT_ID) || "stu-arjun-1";
  },

  setActiveStudentId(id: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_STUDENT_ID, id);
    emitChange();
  },

  getActiveCompanyId(): string {
    if (typeof window === "undefined") return "comp-cybershield";
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_COMPANY_ID) || "comp-cybershield";
  },

  setActiveCompanyId(id: string): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEYS.ACTIVE_COMPANY_ID, id);
    emitChange();
  },

  getStudents(): StudentProfile[] {
    return getStoredJson<StudentProfile[]>(STORAGE_KEYS.STUDENTS, SEED_STUDENTS);
  },

  getActiveStudent(): StudentProfile {
    const students = this.getStudents();
    const activeId = this.getActiveStudentId();
    return students.find((s) => s.id === activeId) || students[0] || SEED_STUDENTS[0];
  },

  updateActiveStudent(updated: Partial<StudentProfile>): void {
    const students = this.getStudents();
    const activeId = this.getActiveStudentId();
    const idx = students.findIndex((s) => s.id === activeId);
    if (idx !== -1) {
      students[idx] = { ...students[idx], ...updated };
      setStoredJson(STORAGE_KEYS.STUDENTS, students);
    }
  },

  updateStudentSkills(skills: StudentSkill[]): void {
    const student = this.getActiveStudent();
    this.updateActiveStudent({ skills });
  },

  setTargetCareer(careerId: string, careerTitle: string): void {
    this.updateActiveStudent({
      preferredCareerId: careerId,
      targetCareerTitle: careerTitle,
    });
  },

  getSkills(): Skill[] {
    return getStoredJson<Skill[]>(STORAGE_KEYS.SKILLS, SEED_SKILLS);
  },

  addCustomSkill(newSkill: Skill): void {
    const skills = this.getSkills();
    if (!skills.some((s) => s.name.toLowerCase() === newSkill.name.toLowerCase())) {
      const updated = [...skills, newSkill];
      setStoredJson(STORAGE_KEYS.SKILLS, updated);
    }
  },

  getCareers(): Career[] {
    const rawCareers = getStoredJson<Career[]>(STORAGE_KEYS.CAREERS, SEED_CAREERS);
    if (!Array.isArray(rawCareers) || rawCareers.length === 0) {
      return SEED_CAREERS;
    }
    // Deeply hydrate with SEED_CAREERS to guarantee requiredSkills, recommendedSkills, learningPath exist and have proper shapes
    return rawCareers.map((c) => {
      const seed = SEED_CAREERS.find((s) => s.id === c.id);
      return {
        ...seed,
        ...c,
        requiredSkills:
          Array.isArray(c.requiredSkills) && c.requiredSkills.length > 0
            ? c.requiredSkills
            : seed?.requiredSkills || [],
        recommendedSkills:
          Array.isArray(c.recommendedSkills) && c.recommendedSkills.length > 0
            ? c.recommendedSkills
            : seed?.recommendedSkills || [],
        learningPath:
          Array.isArray(c.learningPath) && c.learningPath.length > 0
            ? c.learningPath
            : seed?.learningPath || [],
      };
    });
  },

  getLearningResources(): LearningResource[] {
    return getStoredJson<LearningResource[]>(STORAGE_KEYS.LEARNING_RESOURCES, SEED_LEARNING_RESOURCES);
  },

  getCompanies(): IndustryProfile[] {
    return SEED_COMPANIES;
  },

  getActiveCompany(): IndustryProfile {
    const companies = this.getCompanies();
    const activeId = this.getActiveCompanyId();
    return companies.find((c) => c.id === activeId) || companies[0];
  },

  getFaculty(): FacultyProfile {
    return SEED_FACULTY;
  },

  getInternships(): Internship[] {
    return getStoredJson<Internship[]>(STORAGE_KEYS.INTERNSHIPS, SEED_INTERNSHIPS);
  },

  postInternship(newInternship: Omit<Internship, "id" | "postedAt">): Internship {
    const internships = this.getInternships();
    const created: Internship = {
      ...newInternship,
      id: `int-cust-${Date.now()}`,
      postedAt: new Date().toISOString().split("T")[0],
    };
    const updated = [created, ...internships];
    setStoredJson(STORAGE_KEYS.INTERNSHIPS, updated);
    return created;
  },

  getApplications(): Application[] {
    return getStoredJson<Application[]>(STORAGE_KEYS.APPLICATIONS, SEED_APPLICATIONS);
  },

  submitApplication(
    internshipId: string,
    coverNote: string,
    matchScore: number
  ): Application {
    const student = this.getActiveStudent();
    const internships = this.getInternships();
    const targetInt = internships.find((i) => i.id === internshipId);

    const applications = this.getApplications();
    const existing = applications.find(
      (a) => a.internshipId === internshipId && a.studentId === student.id
    );

    if (existing) {
      return existing;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      internshipId,
      internshipTitle: targetInt ? targetInt.title : "Internship",
      companyName: targetInt ? targetInt.companyName : "Company",
      studentId: student.id,
      studentName: student.name,
      studentEmail: student.email,
      studentCollege: student.college,
      studentBranch: student.branch,
      studentCgpa: student.cgpa,
      studentSkills: student.skills,
      status: "applied",
      matchScore,
      appliedAt: new Date().toISOString().split("T")[0],
      coverNote,
    };

    const updated = [newApp, ...applications];
    setStoredJson(STORAGE_KEYS.APPLICATIONS, updated);
    return newApp;
  },

  updateApplicationStatus(
    appId: string,
    status: Application["status"]
  ): void {
    const applications = this.getApplications();
    const idx = applications.findIndex((a) => a.id === appId);
    if (idx !== -1) {
      applications[idx].status = status;
      setStoredJson(STORAGE_KEYS.APPLICATIONS, applications);
    }
  },

  getSavedInternships(): string[] {
    return getStoredJson<string[]>(STORAGE_KEYS.SAVED_INTERNSHIPS, ["int-cyber-1"]);
  },

  toggleSaveInternship(internshipId: string): boolean {
    const saved = this.getSavedInternships();
    let updated: string[];
    let isSavedNow = false;

    if (saved.includes(internshipId)) {
      updated = saved.filter((id) => id !== internshipId);
    } else {
      updated = [...saved, internshipId];
      isSavedNow = true;
    }

    setStoredJson(STORAGE_KEYS.SAVED_INTERNSHIPS, updated);
    return isSavedNow;
  },

  resetToDemo(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEYS.ROLE);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_STUDENT_ID);
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_COMPANY_ID);
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.CAREERS);
    localStorage.removeItem(STORAGE_KEYS.SKILLS);
    localStorage.removeItem(STORAGE_KEYS.INTERNSHIPS);
    localStorage.removeItem(STORAGE_KEYS.LEARNING_RESOURCES);
    localStorage.removeItem(STORAGE_KEYS.APPLICATIONS);
    localStorage.removeItem(STORAGE_KEYS.SAVED_INTERNSHIPS);
    emitChange();
  },
};

// React hook to subscribe to state changes
export function useSkillBridgeState() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const handler = () => setTick((t) => t + 1);
    window.addEventListener("skillbridge_storage_update", handler);
    return () => window.removeEventListener("skillbridge_storage_update", handler);
  }, []);

  return {
    role: storage.getRole(),
    student: storage.getActiveStudent(),
    students: storage.getStudents(),
    careers: storage.getCareers(),
    skills: storage.getSkills(),
    internships: storage.getInternships(),
    learningResources: storage.getLearningResources(),
    applications: storage.getApplications(),
    company: storage.getActiveCompany(),
    companies: storage.getCompanies(),
    faculty: storage.getFaculty(),
    savedInternshipIds: storage.getSavedInternships(),
  };
}
