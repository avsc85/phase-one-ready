# 🏛️ CalPlanCheck AI — LOVABLE PROMPT PHASE 1 OF 4
# FOUNDATION: Design System + Data Models + App Shell
# Paste this FIRST. Wait for Lovable to complete before pasting Phase 2.

---

## WHAT WE ARE BUILDING

A professional AI-powered California Plan Check Response Letter Generator called **CalPlanCheck AI**. 

This tool is used by **architects, contractors, and homeowners** in California who receive official Plan Check Correction Letters from city building departments. They upload those city comment letters, the system parses all the corrections by discipline, and generates a professional **Response Letter** that addresses each comment one by one — ready to submit back to the city.

### Real Cities / Jurisdictions Supported (from actual documents):
- City of San Mateo — Building Division (330 West 20th Ave)
- City of San Leandro — Community Development Dept (835 E. 14th St)
- City of Milpitas — Building Safety & Housing Dept (455 E. Calaveras Blvd)
- City of San Bruno — Community Development Dept
- City of Union City — Planning
- City of Fremont — Development Review (39550 Liberty Street)

### Real Permit Types Observed in Documents:
- Residential Remodel / Addition
- New Detached ADU
- Bathroom + Bedroom Remodel
- Single Family Home Addition/Alteration
- Kitchen Remodel with structural addition

---

## PHASE 1 TASK: Build the complete app shell with routing, design system, and data models only. Do NOT build any page content yet — just the structure.

---

## TECH STACK

- React + TypeScript
- Tailwind CSS (utility classes only)
- React Router v6 (client-side routing)
- shadcn/ui component library
- lucide-react icons
- OpenAI API (GPT-4o) — key from env var `VITE_OPENAI_API_KEY`
- localStorage for demo persistence (no backend needed)

---

## DESIGN SYSTEM

### Brand Identity: "CalPlanCheck AI"
Tagline: "From City Comments to Response Letters in Minutes"

### Color Palette (CSS variables in index.css):
```css
:root {
  --navy: #0d2b5e;
  --navy-light: #1a4d8f;
  --navy-dark: #081a3a;
  --gold: #c8a84b;
  --gold-light: #e8d5a0;
  --gold-dark: #9e7d2e;
  --cream: #f8f5ef;
  --warm-white: #fffef9;
  --border: #d4cfc4;
  --text-primary: #1a1a2e;
  --text-secondary: #4a4a6a;
  --text-muted: #888899;
  --success: #1a6b4a;
  --success-bg: #e8f5ee;
  --warning: #7b5c00;
  --warning-bg: #fef8e8;
  --danger: #8b0000;
  --danger-bg: #fceaea;
  --info: #1a4d8f;
  --info-bg: #e8eef8;
}
```

### Typography (Google Fonts — import in index.html):
```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Serif+4:wght@400;600&family=DM+Mono:wght@400;500&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```
- **Display/Headers:** `Playfair Display` — authoritative, government-official feel
- **Body/Documents:** `Source Serif 4` — readable serif for letter content
- **Code/Labels/Badges:** `DM Mono` — plan check numbers, code citations
- **UI/Forms:** `Inter` — clean for inputs and navigation

### Overall Aesthetic:
Professional California government meets modern legal SaaS. Think: the credibility of a law firm's letterhead combined with the usability of a modern document platform. Navy + Gold like the California State Seal. Paper-textured backgrounds. Clean white document areas. NOT generic startup purple/blue.

---

## DATA MODELS (TypeScript interfaces — create in src/types/index.ts)

```typescript
// A single correction comment from the city
export interface CityComment {
  id: string;
  number: string;           // "1", "A1", "S2", "E3", etc.
  discipline: Discipline;   // "Architectural" | "Structural" | etc.
  sheetReference: string;   // "Sheet A-1.1", "Sheet A3.1", etc.
  codeReference: string;    // "CRC 311.3", "CEC 210.52(D)", etc.
  commentText: string;      // Full text of the city comment
  status: CommentStatus;    // "pending" | "addressed" | "deferred"
  userResponse: string;     // Applicant's typed response
  aiResponse: string;       // AI-generated response
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

// A full plan check case
export interface PlanCheckCase {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: CaseStatus;
  
  // Project Info (from city letter header)
  projectAddress: string;
  apn: string;
  permitNumber: string;       // "BD-2025-297718", "BRADU-25-0016", "B-BP25-0187"
  planCheckNumber: string;
  planDate: string;
  expirationDate: string;
  submittalNumber: number;    // 1st, 2nd, 3rd review
  
  // Parties
  ownerName: string;
  ownerAddress: string;
  applicantName: string;
  applicantAddress: string;
  applicantPhone: string;
  applicantEmail: string;
  contractorName: string;
  
  // Project Description
  projectDescription: string;
  projectType: ProjectType;
  squareFootage: number;
  
  // Jurisdiction
  jurisdiction: Jurisdiction;
  reviewingDepartment: string;
  reviewerName: string;
  reviewerEmail: string;
  reviewerPhone: string;
  departmentAddress: string;
  
  // Comments
  comments: CityComment[];
  
  // Generated Letter
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

// For the dashboard list view
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
```

---

## ROUTES (React Router — create all routes in App.tsx)

```
/                     → Homepage (landing page)
/dashboard            → Case Management Dashboard  
/new-case             → New Case Wizard (multi-step form)
/case/:id             → Case Detail / Comment Review
/case/:id/letter      → Letter Generator & Editor
/case/:id/preview     → Print Preview (clean, no UI chrome)
```

---

## APP SHELL (create now)

### Persistent Top Navigation Bar:
- Height: 56px
- Background: var(--navy)
- Bottom border: 3px solid var(--gold)
- Left: Logo — seal emoji 🏛️ + "CalPlanCheck" in Playfair Display bold white + "AI" in gold
- Center links (DM Mono, 11px, uppercase, letter-spacing 2px, white/60% → white on hover):
  - Dashboard | New Case | Active Reviews
- Right: 
  - Small gold badge "DEMO" 
  - User pill: "Plan Checker · Bay Area" with avatar initials

### Demo Mode Banner (very top, above nav):
- Height: 28px  
- Background: var(--gold)
- Text: "🚧 DEMO MODE — For Presentation Purposes Only — Not for Official Submission" 
- DM Mono, 10px, centered, color: var(--navy-dark)

### Footer (on homepage only):
- Navy background
- "CalPlanCheck AI · Powered by GPT-4o · 2022 CBC / CRC / CMC / CPC / CEC · © 2025"
- Disclaimer: "This tool is for demonstration purposes. Always verify code compliance with licensed professionals."

---

## SAMPLE DATA (create in src/data/sampleCases.ts)

Create 6 pre-loaded sample cases matching the REAL documents provided:

### Case 1: 12 Norfolk St, San Mateo
```typescript
{
  id: "case-001",
  projectAddress: "12 N Norfolk St, San Mateo, CA 94403",
  apn: "033201210",
  permitNumber: "BD-2025-297718",
  planCheckNumber: "BD-2025-297718 Plan Review",
  submittalNumber: 1,
  status: "comments_entered",
  ownerName: "LB Construction and Remodeling",
  applicantName: "LB Construction and Remodeling",
  applicantAddress: "2485 West Ave 133 Rd, San Leandro, CA 94577",
  applicantPhone: "510-213-4564",
  applicantEmail: "chentrefler@gmail.com",
  jurisdiction: "san_mateo",
  reviewingDepartment: "City of San Mateo Building Division",
  departmentAddress: "330 West 20th Avenue, San Mateo, CA 94403-1388",
  reviewerName: "Bryan Lee",
  reviewerEmail: "blee@cityofsanmateo.org",
  projectType: "residential_remodel",
  projectDescription: "Residential remodel with new gas fireplace, kitchen remodel, bathroom remodel",
  totalComments: 20,  // 20 building + C&D + Public Works
}
```

### Case 2: 784 Elsie Ave, San Leandro
```typescript
{
  id: "case-002", 
  projectAddress: "784 Elsie Ave, San Leandro, CA 94577",
  apn: "077 0517 004 00",
  permitNumber: "BRADU-25-0016",
  submittalNumber: 1,
  ownerName: "Poon Stephen TR",
  applicantName: "Vidushi Jain",
  applicantPhone: "650-464-0056",
  contractorName: "Soto Fernando",
  jurisdiction: "san_leandro",
  reviewingDepartment: "City of San Leandro Building and Safety Division",
  departmentAddress: "835 E. 14th Street, San Leandro, CA 94577",
  projectType: "new_adu_detached",
  projectDescription: "(N) 748 SF 2-BED/2-BATH Detached ADU with 68 SF covered porch, central split heat pump, 100A subpanel, 50 gallon heat pump water heater - Main panel upgrade to 200A. Deferred PV system.",
  totalComments: 35,  // Architectural + Structural + Mechanical + Plumbing + Electrical + Fire
}
```

### Case 3: 1864 Shenandoah Ave, Milpitas (1st Review)
```typescript
{
  id: "case-003",
  projectAddress: "1864 Shenandoah Av, Milpitas CA 95035",
  permitNumber: "B-BP25-0187",
  planCheckNumber: "B-BP25-0187",
  submittalNumber: 1,
  applicantName: "Marjorio Rafanan",
  jurisdiction: "milpitas",
  reviewingDepartment: "City of Milpitas Building Safety & Housing Department",
  departmentAddress: "455 East Calaveras Boulevard, Milpitas, CA 95035",
  reviewerName: "Vaishali Prasad",
  reviewerEmail: "vprasad@milpitas.gov",
  reviewerPhone: "408-586-3265",
  projectType: "bathroom_remodel",
  projectDescription: "RAFANAN RESIDENCE: Remodeling (190 sqft) existing bathroom (3) and bedroom (5) to add new bath, extend existing bedroom (3) and remove bedroom (5).",
  totalComments: 14,
  expirationDate: "8/30/25",
}
```

### Case 4: 1864 Shenandoah Ave, Milpitas (2nd Review)
```typescript
{
  id: "case-004",
  projectAddress: "1864 Shenandoah Av, Milpitas CA 95035",
  permitNumber: "B-BP25-0187",
  submittalNumber: 2,  // SECOND REVIEW
  status: "comments_entered",
  applicantName: "Marjorio Rafanan",
  jurisdiction: "milpitas",
  reviewingDepartment: "City of Milpitas Office of Building Safety",
  projectDescription: "RAFANAN RESIDENCE: 2nd Submittal — Remodeling (190 sqft) existing bathroom (3) and bedroom (5)",
  totalComments: 4,  // Fewer comments on 2nd review
}
```

### Case 5: 2741 Berkshire Dr, San Bruno
```typescript
{
  id: "case-005",
  projectAddress: "2741 Berkshire Dr, San Bruno, CA",
  permitNumber: "BLD-2025-584",
  submittalNumber: 1,
  jurisdiction: "san_bruno",
  reviewingDepartment: "City of San Bruno Community Development Department",
  reviewerName: "Talha Amar",
  reviewerEmail: "tamar@sanbruno.ca.gov",
  reviewerPhone: "650-616-7065",
  projectType: "residential_addition",
  totalComments: 7,  // Public Works + Planning
}
```

### Case 6: 43353 Cedarwood Dr, Fremont
```typescript
{
  id: "case-006",
  projectAddress: "43353 Cedarwood Dr, Fremont, CA 94538",
  permitNumber: "BLD2025-07108",
  submittalNumber: 1,
  applicantName: "Neha Singh / Villa, Rosalinda",
  applicantEmail: "aquineha@gmail.com",
  applicantPhone: "559-681-5853",
  jurisdiction: "fremont",
  reviewingDepartment: "City of Fremont Development Review",
  departmentAddress: "39550 Liberty Street, Fremont, CA 94537",
  reviewerName: "Manoja Dalavai",
  reviewerEmail: "mdalavai@fremont.gov",
  projectType: "residential_addition",
  projectDescription: "Villa, Rosalinda - Addition / Alteration (270 sq ft addition + kitchen remodel)",
  totalComments: 12,
}
```

---

## END OF PHASE 1

After building this phase, you should have:
✅ Complete app shell with navigation
✅ Demo mode banner  
✅ All TypeScript data models
✅ React Router routes (pages can be empty/placeholder for now)
✅ Design system CSS variables
✅ Sample data file with 6 real cases
✅ Google Fonts imported
✅ shadcn/ui configured

**DO NOT build page content yet. Confirm completion and wait for Phase 2.**
