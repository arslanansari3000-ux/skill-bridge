export type Role = "student" | "industry" | "faculty";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type SkillCategory =
  | "Programming"
  | "Web Development"
  | "Cybersecurity"
  | "Data & AI"
  | "Cloud & DevOps"
  | "Core & Soft Skills";

export type WorkMode = "remote" | "hybrid" | "on-site";

export type ApplicationStatus =
  | "applied"
  | "under_review"
  | "shortlisted"
  | "interviewing"
  | "accepted"
  | "rejected";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface StudentSkill {
  skillId: string;
  name: string;
  category: SkillCategory;
  level: SkillLevel;
}

export interface StudentProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  cgpa: number;
  avatar?: string;
  skills: StudentSkill[];
  interests: string[];
  preferredCareerId: string;
  targetCareerTitle: string;
  certifications: {
    id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
  }[];
  projects: {
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
  }[];
  resumeName: string;
  resumeUploadedDate?: string;
  bio?: string;
}

export interface IndustryProfile {
  id: string;
  userId: string;
  companyName: string;
  tagline: string;
  industryType: string;
  location: string;
  website: string;
  logo: string;
  description: string;
  contactPerson: string;
  contactEmail: string;
  isVerified: boolean;
}

export interface FacultyProfile {
  id: string;
  userId: string;
  name: string;
  college: string;
  department: string;
  designation: string;
  email: string;
}

export interface CareerRequirement {
  skillId: string;
  skillName: string;
  requiredLevel: SkillLevel;
  category: SkillCategory;
  weight: number; // 1 to 3
}

export interface Career {
  id: string;
  title: string;
  category: string;
  description: string;
  averageSalary: string;
  demandTrend: "High" | "Very High" | "Surging";
  requiredSkills: CareerRequirement[];
  recommendedSkills: { skillId: string; skillName: string }[];
  learningPath: {
    step: number;
    title: string;
    description: string;
    duration: string;
  }[];
  relevantInternshipIds: string[];
}

export interface LearningResource {
  id: string;
  skillId: string;
  skillName: string;
  title: string;
  description?: string;
  resourceType: "Course" | "Certification" | "Documentation" | "Interactive Lab" | "Tutorial";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedHours: number;
  externalUrl: string;
  provider: string;
  isFree: boolean;
}

export interface InternshipRequiredSkill {
  skillId: string;
  skillName: string;
  level?: SkillLevel;
  minimumLevel: SkillLevel;
}

export interface Internship {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  title: string;
  location: string;
  workMode: WorkMode;
  duration: string;
  stipend: string;
  requiredSkills: {
    skillId: string;
    skillName: string;
    level: SkillLevel;
    minimumLevel?: SkillLevel;
  }[];
  eligibility: string;
  deadline: string;
  description: string;
  openings: number;
  domain: string;
  careerCategory?: string;
  postedAt: string;
}

export interface Application {
  id: string;
  internshipId: string;
  internshipTitle: string;
  companyName: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentCollege: string;
  studentBranch: string;
  studentCgpa: number;
  studentSkills: StudentSkill[];
  status: ApplicationStatus;
  matchScore: number;
  appliedAt: string;
  coverNote?: string;
}

export interface SavedInternship {
  id: string;
  studentId: string;
  internshipId: string;
  savedAt: string;
}

export interface SkillGapResult {
  careerId: string;
  careerTitle: string;
  overallMatch: number;
  matchedSkillsCount?: number;
  totalRequiredSkillsCount?: number;
  strongSkills: {
    skillName: string;
    studentLevel: SkillLevel;
    requiredLevel: SkillLevel;
  }[];
  skillsToImprove: {
    skillName: string;
    studentLevel: SkillLevel;
    requiredLevel: SkillLevel;
  }[];
  criticalMissingSkills: {
    skillName: string;
    requiredLevel: SkillLevel;
    weight?: number;
  }[];
  formulaBreakdown: {
    earnedPoints: number;
    totalPointsRequired: number;
    matchedSkillsCount: number;
    totalRequiredCount: number;
    explanation: string;
  };
}

export interface AIAdvisorResponse {
  currentPosition: string;
  missingSkillsSummary: string[];
  prioritySkills: {
    skill: string;
    urgency: "High" | "Medium" | "Low";
    reason: string;
  }[];
  learningSequence: {
    step: number;
    phase: string;
    topics: string;
    durationWeeks: number;
  }[];
  suggestedProjects: {
    title: string;
    description: string;
    techStack: string;
    impact: string;
  }[];
  recommendedInternshipRoles: string[];
}
