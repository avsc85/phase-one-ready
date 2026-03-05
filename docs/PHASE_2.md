# 🏛️ CalPlanCheck AI — LOVABLE PROMPT PHASE 2 OF 4
# PAGES: Homepage + Dashboard + New Case Wizard
# Paste this AFTER Phase 1 is complete.

---

## PHASE 2 TASK: Build the Homepage, Dashboard, and New Case Wizard.

---

## PAGE 1: HOMEPAGE `/`

### Hero Section:
Full-width, navy gradient background (`#081a3a` to `#1a4d8f`), subtle diagonal lines texture overlay.

Left column (60%):
- Small gold label above headline: `DM Mono, 11px` — "CALIFORNIA BUILDING DEPARTMENTS · PLAN CHECK AI"
- Headline: `Playfair Display, 52px, white` — "Turn City Comments Into Professional Response Letters"
- Subheadline: `Source Serif 4, 18px, white/70%` — "Upload your city's Plan Check Correction Letter. Our AI reads every comment, generates code-accurate responses, and produces a formatted letter ready to submit — in minutes, not days."
- Two buttons:
  - Primary: Gold background, navy text, `DM Mono` — "START NEW PLAN CHECK →"
  - Secondary: White border, white text — "VIEW DEMO CASE"
- Below buttons: Three trust indicators with checkmarks: "✓ 2022 CBC / CRC Compliant" · "✓ 6 Bay Area Jurisdictions" · "✓ GPT-4o Powered"

Right column (40%): 
- A mock "letter preview card" showing a miniature version of a real plan check letter with redacted fields, giving visual context of what gets generated. Use real-looking government styling.

### Stats Bar (below hero, gold background):
Four stat blocks separated by vertical dividers, navy text:
- "73%" — "Average Time Saved vs Manual Response"
- "12+" — "Disciplines Covered (Arch, Struct, MEP, Fire...)"  
- "6" — "CA Jurisdictions Pre-Configured"
- "2022" — "Code Cycle (CBC / CRC / CMC / CPC / CEC)"

### How It Works Section (white background):
Title: `Playfair Display` — "From City Comments to Approved Plans"
Three horizontal steps with connecting arrows:

**Step 1 — Enter City Comments** 📋
"Manually enter or paste the corrections from your city's plan check letter. Organized by discipline: Architectural, Structural, MEP, Fire, Planning, and more."

**Step 2 — Review & Respond** ✅  
"Review each comment, add your notes, and let AI generate professional, code-accurate responses for every item. Edit anything before finalizing."

**Step 3 — Generate & Submit** 📄
"Generate a formatted Response Letter with your project header, numbered responses for each comment, and the correct resubmittal language for your jurisdiction."

### Jurisdictions Section (cream background):
Title: "Pre-Configured for Bay Area Jurisdictions"
Subtitle: "Each jurisdiction has its own letter format, code citations, and resubmittal requirements — all built in."

Six jurisdiction cards in a grid (2 rows × 3 cols):
Each card has: city seal-style colored circle + city name + department name + sample permit format
1. 🏛️ **City of San Mateo** — Building Division — `BD-20XX-XXXXXX`
2. 🏛️ **City of San Leandro** — Community Development — `BRADU-XX-XXXX`
3. 🏛️ **City of Milpitas** — Building Safety & Housing — `B-BPXX-XXXX`
4. 🏛️ **City of San Bruno** — Community Development — `BLD-20XX-XXX`
5. 🏛️ **City of Fremont** — Development Review — `BLD20XX-XXXXX`
6. 🏛️ **City of Union City** — Planning Department — `Planning Comments`
Plus "More cities coming soon..." gray card.

### Disciplines Covered Section:
Title: "Every Review Discipline. Every Comment. Covered."
Show 12 discipline badges in a flowing tag cloud layout:
`Architectural` `Structural` `Mechanical` `Electrical` `Plumbing` `Energy / Title 24` `Fire & Life Safety` `Green Building / CALGreen` `Planning` `Public Works` `Construction & Demolition` `Geotechnical`

### CTA Section (navy background):
"Ready to cut your response time by 73%?" + big gold button "Create Your First Plan Check Case"

---

## PAGE 2: DASHBOARD `/dashboard`

### Layout: Full page, cream background

### Top section:
- Page title: `Playfair Display 28px` — "Plan Check Cases"
- Subtitle: `Source Serif 4` — "Manage all your active and completed plan check response projects"
- Right side: Gold button "＋ New Case"

### Stats Row (4 cards):
- **Active Cases** — count with yellow dot
- **Letters Generated** — count with green dot  
- **Avg. Comments/Case** — average number
- **Completion Rate** — percentage

### Filter Bar:
- Search input: "Search by address, permit number, applicant..."
- Filter dropdowns: Status | Project Type | Jurisdiction | Submittal #
- Sort: "Newest First" dropdown

### Cases Table:
Professional table with alternating row colors. Columns:

| # | Project Address | Permit No. | Type | Jurisdiction | Submittal | Comments | Status | Actions |
|---|----------------|------------|------|--------------|-----------|----------|--------|---------|

**Status badges** (pill shaped, DM Mono 10px):
- `DRAFT` — gray
- `COMMENTS ENTERED` — yellow  
- `IN PROGRESS` — blue
- `LETTER READY` — green
- `SUBMITTED` — navy with gold border

**Actions column:** Three buttons per row:
- "Open" → navigates to `/case/:id`
- "Letter" → navigates to `/case/:id/letter` (disabled if no letter yet)
- "⋯" dropdown: Duplicate, Archive, Delete

### Pre-populate with all 6 sample cases from Phase 1 data.

**Empty State** (when no cases): 
Large centered illustration area + "No plan check cases yet" + "Create your first case to get started" + gold button

### Recent Activity Feed (right sidebar, 280px):
Timeline of recent actions:
- "Letter generated for 784 Elsie Ave · 2 hours ago"
- "12 comments entered for 1864 Shenandoah · Yesterday"
- "Case created: 43353 Cedarwood Dr · 2 days ago"

---

## PAGE 3: NEW CASE WIZARD `/new-case`

Multi-step wizard. Show step progress bar at top with 4 steps.

### Step Indicator:
```
[1 Project Info] ——— [2 Jurisdiction] ——— [3 Project Details] ——— [4 Review & Create]
```
Current step filled in gold. Completed steps show gold checkmark. Future steps gray.

---

### STEP 1: Project Information

**Section title:** "Project & Applicant Information"

Form fields (two-column grid where applicable):

**Project Details:**
- Project Address * (full address, large input)
- APN — Assessor's Parcel Number
- Permit / Application Number * (e.g., BD-2025-297718)
- Plan Check Number (if different)
- Plan Date (date picker)
- Plan Check Expiration Date (date picker)
- Submittal Number * (radio: 1st Review / 2nd Review / 3rd Review / 4th+)

**Property Owner:**
- Owner Name *
- Owner Address
- Owner Phone
- Owner Email

**Applicant / Architect / Contractor:**
- Applicant Name * 
- Applicant Address
- Applicant Phone
- Applicant Email
- Contractor Name
- Contractor Phone

Validation: Red border + helper text on empty required fields when attempting to proceed.

---

### STEP 2: Jurisdiction & Department

**Section title:** "Reviewing Department"

**Jurisdiction Selector** — Large card grid (3 columns):
Each card shows: city name + department name + address + typical permit format

Cards:
1. City of San Mateo · Building Division · 330 West 20th Ave
2. City of San Leandro · Community Development · 835 E. 14th Street  
3. City of Milpitas · Building Safety & Housing · 455 E. Calaveras Blvd
4. City of San Bruno · Community Development Dept
5. City of Fremont · Development Review · 39550 Liberty Street
6. City of Union City · Planning Department
7. Other / Custom → reveals text inputs for department name + address

**Reviewer Information** (auto-fills based on jurisdiction, but editable):
- Reviewer Name
- Reviewer Email
- Reviewer Phone
- Department Address (auto-filled)

---

### STEP 3: Project Details

**Section title:** "Project Type & Scope"

**Project Type** — Large card selector (2 columns, 4 rows):
- 🏠 Residential Remodel
- 🏗️ Residential Addition
- 🏡 New Detached ADU  
- 🏘️ New Attached ADU
- 🏠 New Single Family Residence
- 🏢 Commercial Tenant Improvement
- 🚿 Bathroom / Kitchen Remodel
- ☀️ Solar / PV System
- 🔨 Demolition
- 📦 Other

**Project Scope Details:**
- Project Description * (textarea, 4 rows) — "Describe the scope of work as it appears on plans"
- Square Footage (number input)
- Number of Stories (1 / 2 / 3+)
- Construction Type (Type I-A through Type V-B)
- Occupancy Group (R-3, B, A-2, etc.)

---

### STEP 4: Review & Create

**Section title:** "Review Case Details"

Show a clean summary card of everything entered:
- Two-column layout
- Left: Project & Permit info
- Right: Jurisdiction & Project type

Below: Large gold "Create Case & Start Entering Comments →" button
And a secondary "← Back" button

On create: Save to localStorage, navigate to `/case/:id`

---

## END OF PHASE 2

After building this phase you should have:
✅ Homepage with hero, stats, how-it-works, jurisdictions sections
✅ Dashboard with cases table, stats, filters, 6 sample cases shown
✅ New Case Wizard with 4-step form, validation, jurisdiction cards
✅ Navigation between all pages working
✅ Case created on Step 4 → navigates to case detail page (even if that page is placeholder)

**Confirm completion. Wait for Phase 3.**
