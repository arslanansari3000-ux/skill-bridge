import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini if API key is provided
  const apiKey = process.env.GEMINI_API_KEY;
  let ai: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    } catch (err) {
      console.warn("Failed to initialize GoogleGenAI with provided key:", err);
    }
  }

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      service: "SkillBridge SIH Backend",
      aiConfigured: !!ai,
      timestamp: new Date().toISOString(),
    });
  });

  // AI Career & Skill Advisor Endpoint
  app.post("/api/ai-advisor", async (req, res) => {
    const {
      studentName = "Student",
      targetCareer = "Cybersecurity Analyst",
      currentSkills = [],
      missingSkills = [],
      toImproveSkills = [],
      matchScore = 58,
      query = "What skills should I learn to become a cybersecurity analyst?",
    } = req.body;

    // Prompt for Gemini
    const prompt = `You are an expert AI Career & Skill Advisor for India's Smart India Hackathon education-to-industry platform.
A student named "${studentName}" is aspiring to become a "${targetCareer}".
Current Skill Match Score: ${matchScore}%
Possessed Skills: ${JSON.stringify(currentSkills)}
Skills needing improvement: ${JSON.stringify(toImproveSkills)}
Missing critical skills: ${JSON.stringify(missingSkills)}

Student's question: "${query}"

Provide an authoritative, structured, and actionable advisory in JSON format with these exact keys:
{
  "currentPosition": "Clear 2-3 sentence assessment of their readiness and strengths for ${targetCareer}",
  "missingSkillsSummary": ["List of 3-5 key gaps with brief 1-line reason why each is critical"],
  "prioritySkills": [
    {"skill": "Skill Name", "urgency": "High | Medium", "reason": "Why learn this first"}
  ],
  "learningSequence": [
    {"step": 1, "phase": "Foundations", "topics": "Topic details", "durationWeeks": 3},
    {"step": 2, "phase": "Core Competency", "topics": "Topic details", "durationWeeks": 4},
    {"step": 3, "phase": "Industry Readiness", "topics": "Topic details", "durationWeeks": 4}
  ],
  "suggestedProjects": [
    {"title": "Project Title", "description": "What to build", "techStack": "Technologies used", "impact": "Why recruiters value it"}
  ],
  "recommendedInternshipRoles": ["Role 1", "Role 2", "Role 3"]
}
Only output valid JSON without markdown wrapping.`;

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3,
          },
        });

        const rawText = response.text || "";
        const parsed = JSON.parse(rawText);
        return res.json({ success: true, source: "gemini-3.8-flash", data: parsed });
      } catch (err: any) {
        console.warn("Gemini API call failed, using rule-based fallback:", err?.message || err);
      }
    }

    // High-quality rule-based fallback when Gemini API key is missing or encounters rate limits
    const fallbackResponse = generateRuleBasedAdvisory(
      studentName,
      targetCareer,
      currentSkills,
      missingSkills,
      toImproveSkills,
      matchScore,
      query
    );

    return res.json({
      success: true,
      source: "rule-based-engine",
      data: fallbackResponse,
    });
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SkillBridge SIH Server running on http://localhost:${PORT}`);
  });
}

function generateRuleBasedAdvisory(
  studentName: string,
  targetCareer: string,
  currentSkills: any[],
  missingSkills: any[],
  toImproveSkills: any[],
  matchScore: number,
  query: string
) {
  const missingNames = missingSkills.map((s: any) => (typeof s === "string" ? s : s.name));
  const toImproveNames = toImproveSkills.map((s: any) => (typeof s === "string" ? s : s.name));
  const currentNames = currentSkills.map((s: any) => (typeof s === "string" ? s : s.name));

  const allGaps = [...missingNames, ...toImproveNames];

  return {
    currentPosition: `${studentName} has a solid academic foundation with a ${matchScore}% skill match for ${targetCareer}. Key foundational strengths include ${currentNames.slice(0, 3).join(", ") || "general technical proficiency"}. Bridging the remaining practical industry requirements will elevate qualification for Tier-1 internships.`,
    missingSkillsSummary: allGaps.slice(0, 4).map((skill) => `Lack of hands-on ${skill} is currently the primary barrier in clearing technical screening rounds for ${targetCareer}.`),
    prioritySkills: [
      {
        skill: allGaps[0] || "Core Fundamentals",
        urgency: "High",
        reason: "Mandatory qualification prerequisite listed across 85% of active job postings.",
      },
      {
        skill: allGaps[1] || "Hands-on Tooling",
        urgency: "High",
        reason: "Crucial for practical lab assessments and live technical interviews.",
      },
      {
        skill: allGaps[2] || "System Architecture",
        urgency: "Medium",
        reason: "Distinguishes high-potential candidates during behavioral and system design discussions.",
      },
    ],
    learningSequence: [
      {
        step: 1,
        phase: "Phase 1: Foundational Theory & CLI",
        topics: `Master ${allGaps[0] || "prerequisite basics"} and core Linux/networking command line utilities.`,
        durationWeeks: 3,
      },
      {
        step: 2,
        phase: "Phase 2: Applied Tooling & Lab Simulations",
        topics: `Implement hands-on security/dev tools, packet analysis, or framework pipelines with ${allGaps[1] || "industry frameworks"}.`,
        durationWeeks: 4,
      },
      {
        step: 3,
        phase: "Phase 3: Portfolio Project & Mock Assessments",
        topics: `Build an end-to-end demonstrable capstone project addressing realistic industry vulnerabilities.`,
        durationWeeks: 4,
      },
    ],
    suggestedProjects: [
      {
        title: targetCareer.toLowerCase().includes("security")
          ? "Network Intrusion & Log Analysis Homelab"
          : `${targetCareer} Enterprise Microservice Capstone`,
        description: targetCareer.toLowerCase().includes("security")
          ? "Set up a virtualized lab environment with Snort/Wireshark to monitor traffic, detect simulated DDoS attacks, and generate forensic incident reports."
          : "Develop a high-throughput, containerized application with automated CI/CD testing, JWT authentication, and structured error telemetry.",
        techStack: targetCareer.toLowerCase().includes("security")
          ? "Linux, Wireshark, Snort, Python, Bash"
          : "React, Node.js/Express, Docker, SQL, Git",
        impact: "Proves real-world capability beyond theoretical textbook multiple-choice questions.",
      },
      {
        title: "Automated Vulnerability & Compliance Auditor",
        description: "A lightweight script that scans configurations against CIS benchmarks and generates an executive PDF report.",
        techStack: "Python, Shell Scripting, Regular Expressions, SQLite",
        impact: "Shows automation skills highly coveted by recruiters during technical rounds.",
      },
    ],
    recommendedInternshipRoles: [
      `${targetCareer} Intern`,
      `Junior Associate - ${targetCareer}`,
      "Technology Solutions Intern",
    ],
  };
}

startServer();
