import { CityComment, CommentStatus, Discipline } from "@/types";
import { sampleCasesFull } from "@/data/sampleComments";

const STORAGE_KEY = "calplancheck_comments_";

export function loadComments(caseId: string): CityComment[] {
  const stored = localStorage.getItem(STORAGE_KEY + caseId);
  if (stored) return JSON.parse(stored);
  const sample = sampleCasesFull[caseId];
  if (sample) {
    localStorage.setItem(STORAGE_KEY + caseId, JSON.stringify(sample.comments));
    return sample.comments;
  }
  return [];
}

export function saveComments(caseId: string, comments: CityComment[]) {
  localStorage.setItem(STORAGE_KEY + caseId, JSON.stringify(comments));
}

export function getCaseInfo(caseId: string) {
  return sampleCasesFull[caseId] || null;
}

export const ALL_DISCIPLINES: Discipline[] = [
  "General", "Green Building", "Architectural", "Structural", "Mechanical",
  "Electrical", "Plumbing", "Energy", "Fire & Life Safety",
  "Planning", "Public Works", "Construction & Demolition",
];

export const disciplineIcons: Record<Discipline, string> = {
  "General": "📋",
  "Green Building": "🌿",
  "Architectural": "📐",
  "Structural": "🔩",
  "Mechanical": "🔧",
  "Electrical": "⚡",
  "Plumbing": "🚿",
  "Energy": "💡",
  "Fire & Life Safety": "🔥",
  "Planning": "🏛️",
  "Public Works": "🏗️",
  "Construction & Demolition": "♻️",
};

export const resubmittalRequirements: Record<string, string[]> = {
  san_mateo: [
    "Revisions identified with revision clouds and delta numbers on all revised sheets",
    "Revision date and deltas marked on each revised sheet",
    "Sheet # noted in left margin where corrections are indicated",
    "All 4 complete sets returned for review",
    "All responses submitted to Building Division counter",
    "C&D Recycling Plan submitted to Green Halo",
    "C&D deposit of $10,000 paid at permit issuance",
  ],
  san_leandro: [
    "Response Letter prepared with written responses to each comment",
    "Full set of digitally stamped plans with Clouds and Delta",
    "Construction & Waste Diversion form with Green Halo reference number",
    "Plans resubmitted within 180 days (expiration date shown)",
  ],
  milpitas: [
    "Written response letter for each review discipline",
    "Changes not in response to comments: separate narrative letter with sheet references",
    "Responses of 'see plans' not acceptable — must be specific",
    "Full resubmittal package via eplan.ci.milpitas.ca.gov",
    "B-Recycling Report required",
    "B-Special Inspection if applicable",
  ],
  fremont: [
    "Responses to Comments document uploaded as 'New' in Citizen Access",
    "Complete revised plan set",
    "GH tracking number obtained",
    "Contact record Team Lead with questions",
  ],
};
