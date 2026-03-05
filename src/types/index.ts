export interface CityComment {
  id: string;
  number: string;
  discipline: Discipline;
  sheetReference: string;
  codeReference: string;
  commentText: string;
  status: CommentStatus;
  userResponse: string;
  aiResponse: string;
  priority: "required" | "advisory";
}

export type Discipline =
  | "General"
  | "Architectural"
  | "Structural"
  | "Mechanical"
  | "Electrical"
  | "Plumbing"
  | "Energy"
  | "Fire & Life Safety"
  | "Green Building"
  | "Planning"
  | "Public Works"
  | "Construction & Demolition";

export type CommentStatus = "pending" | "addressed" | "deferred" | "n/a";

export interface PlanCheckCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  projectAddress: string;
  apn: string;
  permitNumber: string;
  planCheckNumber: string;
  planDate: string;
  expirationDate: string;
  submittalNumber: number;
  ownerName: string;
  ownerAddress: string;
  applicantName: string;
  applicantAddress: string;
  applicantPhone: string;
  applicantEmail: string;
  contractorName: string;
  projectDescription: string;
  projectType: ProjectType;
  squareFootage: number;
  jurisdiction: Jurisdiction;
  reviewingDepartment: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerPhone: string;
  departmentAddress: string;
  comments: CityComment[];
  generatedLetter: string;
  letterGeneratedAt: string;
  letterEditedContent: string;
}

export type CaseStatus =
  | "draft"
  | "comments_entered"
  | "responses_in_progress"
  | "letter_generated"
  | "letter_finalized"
  | "submitted";

export type ProjectType =
  | "residential_remodel"
  | "residential_addition"
  | "new_adu_detached"
  | "new_adu_attached"
  | "new_sfr"
  | "commercial_ti"
  | "bathroom_remodel"
  | "kitchen_remodel"
  | "solar_pv"
  | "demolition"
  | "other";

export type Jurisdiction =
  | "san_mateo"
  | "san_leandro"
  | "milpitas"
  | "san_bruno"
  | "union_city"
  | "fremont"
  | "los_angeles"
  | "san_francisco"
  | "san_jose"
  | "sacramento"
  | "other";

export interface CaseSummary {
  id: string;
  projectAddress: string;
  permitNumber: string;
  projectType: ProjectType;
  jurisdiction: Jurisdiction;
  submittalNumber: number;
  totalComments: number;
  addressedComments: number;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
}
