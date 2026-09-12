import { Career, SkillGapResult, SkillLevel, StudentSkill } from "../types";

const LEVEL_SCORE: Record<SkillLevel, number> = {
  beginner: 1,
  intermediate: 2,
  advanced: 3,
};

export function calculateSkillGap(
  career: Career,
  studentSkills: StudentSkill[] = []
): SkillGapResult {
  const strongSkills: SkillGapResult["strongSkills"] = [];
  const skillsToImprove: SkillGapResult["skillsToImprove"] = [];
  const criticalMissingSkills: SkillGapResult["criticalMissingSkills"] = [];

  let earnedPoints = 0;
  let totalPointsRequired = 0;
  let fullyMatchedCount = 0;

  // Safe career defaults
  const careerId = career?.id || "unknown-career";
  const careerTitle = career?.title || "Career Path";
  const requiredSkills = Array.isArray(career?.requiredSkills) ? career.requiredSkills : [];

  // Map student skills for fast lookup (case-insensitive)
  const studentSkillMap = new Map<string, StudentSkill>();
  (studentSkills || []).forEach((s) => {
    if (!s) return;
    const name = (s.name || (s as any).skillName || "").toLowerCase().trim();
    if (name) {
      studentSkillMap.set(name, s);
    }
  });

  requiredSkills.forEach((req) => {
    if (!req) return;
    const reqSkillName = req.skillName || (req as any).name || "Skill";
    const reqLevelKey = req.requiredLevel || (req as any).level || "intermediate";
    const reqLevelVal = LEVEL_SCORE[reqLevelKey] || 2;
    const weight = req.weight || 1;
    const maxReqPoints = reqLevelVal * weight;
    totalPointsRequired += maxReqPoints;

    const studentSkill = studentSkillMap.get(reqSkillName.toLowerCase().trim());

    if (studentSkill) {
      const studentLevelVal = LEVEL_SCORE[studentSkill.level] || 1;

      if (studentLevelVal >= reqLevelVal) {
        // Strong skill (meets or exceeds industry requirement)
        earnedPoints += maxReqPoints;
        fullyMatchedCount += 1;
        strongSkills.push({
          skillName: reqSkillName,
          studentLevel: studentSkill.level,
          requiredLevel: req.requiredLevel || "intermediate",
        });
      } else {
        // Partial match: student possesses skill but needs higher proficiency
        const partialPoints = (studentLevelVal / reqLevelVal) * maxReqPoints;
        earnedPoints += partialPoints;
        skillsToImprove.push({
          skillName: reqSkillName,
          studentLevel: studentSkill.level,
          requiredLevel: req.requiredLevel || "intermediate",
        });
      }
    } else {
      // Critical missing skill
      criticalMissingSkills.push({
        skillName: reqSkillName,
        requiredLevel: req.requiredLevel || "intermediate",
        weight,
      });
    }
  });

  const overallMatch =
    totalPointsRequired > 0
      ? Math.min(100, Math.round((earnedPoints / totalPointsRequired) * 100))
      : 0;

  const explanation = `Score calculated as (Earned Proficiency Points: ${earnedPoints.toFixed(
    1
  )} / Total Required Points: ${totalPointsRequired}) × 100 = ${overallMatch}%. Fully matched ${fullyMatchedCount} of ${
    requiredSkills.length
  } mandatory industry requirements.`;

  return {
    careerId,
    careerTitle,
    overallMatch,
    matchedSkillsCount: fullyMatchedCount,
    totalRequiredSkillsCount: requiredSkills.length,
    strongSkills,
    skillsToImprove,
    criticalMissingSkills,
    formulaBreakdown: {
      earnedPoints: Math.round(earnedPoints * 10) / 10,
      totalPointsRequired,
      matchedSkillsCount: fullyMatchedCount,
      totalRequiredCount: requiredSkills.length,
      explanation,
    },
  };
}

export function calculateInternshipMatch(
  requiredSkills: { skillName: string; level?: SkillLevel; minimumLevel?: SkillLevel }[],
  studentSkills: StudentSkill[] = []
): number {
  if (!requiredSkills || requiredSkills.length === 0) return 100;

  const studentSkillMap = new Map<string, StudentSkill>();
  (studentSkills || []).forEach((s) => {
    if (!s) return;
    const name = (s.name || (s as any).skillName || "").toLowerCase().trim();
    if (name) {
      studentSkillMap.set(name, s);
    }
  });

  let earned = 0;
  let total = 0;

  requiredSkills.forEach((req) => {
    if (!req) return;
    const skillName = req.skillName || (req as any).name || "";
    const levelKey = req.level || req.minimumLevel || "intermediate";
    const reqLevel = LEVEL_SCORE[levelKey] || 1;
    total += reqLevel;

    const studentSkill = studentSkillMap.get(skillName.toLowerCase().trim());
    if (studentSkill) {
      const studentLevel = LEVEL_SCORE[studentSkill.level] || 1;
      if (studentLevel >= reqLevel) {
        earned += reqLevel;
      } else {
        earned += (studentLevel / reqLevel) * reqLevel;
      }
    }
  });

  return total > 0 ? Math.min(100, Math.round((earned / total) * 100)) : 0;
}
