# 🏛️ CalPlanCheck AI — LOVABLE PROMPT PHASE 3 OF 4
# CORE FEATURE: Case Detail + Comment Entry + Response Interface
# Paste this AFTER Phase 2 is complete.

---

## PHASE 3 TASK: Build the Case Detail page `/case/:id` — the main working screen where users enter city comments and write responses.

This is the MOST IMPORTANT page. It must be fully functional.

---

## REAL COMMENT DATA (Pre-load for sample cases)

**CRITICAL:** Pre-load the following REAL comments from actual city documents into the sample cases. This is what makes the demo convincing.

### Case 001 — 12 N Norfolk St, San Mateo (BD-2025-297718)
Pre-load these comments EXACTLY as written:

```typescript
const norfolkComments: CityComment[] = [
  // GENERAL
  { id: "n-gen-1", number: "1", discipline: "General", sheetReference: "General", codeReference: "", 
    commentText: "Additional comments may follow from any additional information provided. Comments need to be addressed in plan submittals not through response letters. Drawings must be consistent throughout the submittal. Please provide revision clouds and delta numbers on drawings for clarity and conciseness.", priority: "required" },
  
  // GREEN BUILDING
  { id: "n-gb-1", number: "2", discipline: "Green Building", sheetReference: "Sheet A0.0", codeReference: "CGC 4.304.1 / Title 23 Chapter 2.7 Division 2",
    commentText: "Please submit MWELO screening form for any work affecting landscape. Per CGC 4.304.1, outdoor water use shall comply with local water efficient landscape ordinance or California MWELO, whichever is more stringent.", priority: "required" },
  
  // ARCHITECTURAL
  { id: "n-a-1", number: "3", discipline: "Architectural", sheetReference: "Sheet A1.1", codeReference: "SMMC 7.30.040",
    commentText: "Please attach specifications sheet (not installation guide) to this plan set for the outdoor AC unit. Add note that, 'Per SMMC 7.30.040, noise levels are not to exceed 50db from 10pm-7am and 60db from 7am-10pm. Relocate the unit or provide a sound blanket if necessary.'", priority: "required" },
  
  { id: "n-a-2", number: "4", discipline: "Architectural", sheetReference: "Sheet A0.0", codeReference: "",
    commentText: "On proposed site plan, please show the location of the new chimney exhaust (with material), and new and existing attic vents. Additionally, please show proposed chimney on proposed elevations.", priority: "required" },
  
  { id: "n-a-3", number: "5", discipline: "Architectural", sheetReference: "Sheet A3.1", codeReference: "",
    commentText: "Please provide specifications sheet to this plan (not installation guide) for the new gas fireplace and chimney exhaust. Clarify on the plans if either will be custom-built or if they are prefabricated.", priority: "required" },
  
  { id: "n-a-4", number: "6", discipline: "Architectural", sheetReference: "Sheet A3.1", codeReference: "CRC 311.3 / CRC 311.3.1",
    commentText: "For both exterior landings at door 14/16 and door 15, please provide a landing/floor on both sides of the exterior doors. Per CRC 311.3, a landing OR floor area shall be provided at each side of the exterior door with minimum width equal to door served and 36\" minimum depth in direction of travel. Threshold at exterior egress door shall not exceed 7.75\" (door not swinging over) or 1.5\" (door swinging over).", priority: "required" },
  
  { id: "n-a-5", number: "7", discipline: "Architectural", sheetReference: "Sheet A3.1", codeReference: "CRC 310.2",
    commentText: "In bedroom 2, there is no emergency egress opening that meets minimum requirements. Per CRC 310.2, emergency escape and rescue openings shall have a net clear opening of no less than 5.7 square feet, minimum dimensions of 24\" tall and 20\" wide, and a sill height of no more than 44\". The net opening is less than 20\".", priority: "required" },
  
  { id: "n-a-6", number: "8", discipline: "Architectural", sheetReference: "Sheet A3.1", codeReference: "CRC 807.1",
    commentText: "Please clarify dimensions of attic access opening. Per CRC 807.1, the rough-framed opening shall be not less than 22\" by 30\".", priority: "required" },
  
  { id: "n-a-7", number: "9", discipline: "Architectural", sheetReference: "Sheet A3.1", codeReference: "CRC 308.4",
    commentText: "On door and window schedule, please specify that door 20 is the egress door. Additionally, add a note that window 9 and 10 at the front door are to be provided with safety glazing as it is identified as a hazardous location per CRC 308.4.", priority: "required" },
  
  { id: "n-a-8", number: "10", discipline: "Architectural", sheetReference: "Sheet A4.1", codeReference: "CRC 301.5 / CRC 312.1.1 / CRC 312.1.2",
    commentText: "For drawing 5, add a note that the rail can withstand a 200 pound concentrated load per CRC 301.5. For the exterior stairs, guards will need to be provided for dropoffs greater than 30\" per CRC 312.1.1. Guards shall be not less than 42\" in height per CRC 312.1.2.", priority: "required" },
  
  { id: "n-a-9", number: "11", discipline: "Architectural", sheetReference: "Sheet A6.0", codeReference: "CRC 314.3 / NFPA 29.8.3.4",
    commentText: "Show another smoke detector in bedroom 3. Per CRC 314.3 and NFPA 29.8.3.4, smoke alarms are required in each sleeping room, outside each sleeping area, each additional story, and in the ceiling of a hall that rises by 24\".", priority: "required" },
  
  // ELECTRICAL
  { id: "n-e-1", number: "12", discipline: "Electrical", sheetReference: "Sheet A6.0", codeReference: "CEC 210.52(D)",
    commentText: "For bathroom 2 and bathroom 1, please provide additional GFCI receptacles. Per CEC 210.52(D), a GFCI receptacle shall be installed within 3' of the outside edge of each basin. Receptacle to be no higher than 20\" from counter and 12\" below.", priority: "required" },
  
  { id: "n-e-2", number: "13", discipline: "Electrical", sheetReference: "Sheet A6.0", codeReference: "CEC 210.52(C)(2)(a)",
    commentText: "Add 2 receptacles for kitchen island. Per CEC 210.52(C)(2)(a), at least one receptacle outlet shall be provided for the first 9 square feet of countertop or work surface. A receptacle outlet shall be provided for every additional 18 square feet.", priority: "required" },
  
  // MECHANICAL
  { id: "n-m-1", number: "14", discipline: "Mechanical", sheetReference: "Sheet A3.1", codeReference: "CMC 405.4",
    commentText: "Show the kitchen exhaust. Attach specifications sheet (not installation guide) to this plan set. Per CMC 405.4, kitchen exhaust shall vent directly to the outdoors and shall be minimum 100 cfm for range hoods and 300 cfm for mechanical fans. Continuous operation shall have no fewer than 5 air changes per hour.", priority: "required" },
  
  { id: "n-m-2", number: "15", discipline: "Mechanical", sheetReference: "Sheet A6.0", codeReference: "CMC 301.4",
    commentText: "For the outdoor AC unit, per CMC 301.4, a 120 volt receptacle shall be located within 25' of the equipment for service and maintenance purposes. The receptacle outlet shall be on the supply side of the disconnect switch. Show the receptacle in plan.", priority: "required" },
  
  { id: "n-m-3", number: "16", discipline: "Mechanical", sheetReference: "Sheet A6.0", codeReference: "CMC 701 / CMC 701.10 / CMC 908.2.1 / CMC 504.4",
    commentText: "Please provide specifications sheet for the dryer. Clarify if gas or electric. If gas, show on gas diagram. Provide adequate combustion air per CMC 701, louvers/screens per CMC 701.10, minimum clearances per CMC 908.2.1, and exhaust requirements per CMC 504.4 and CMC 502.2.1.", priority: "required" },
  
  // PLUMBING
  { id: "n-p-1", number: "17", discipline: "Plumbing", sheetReference: "Sheet A3.1", codeReference: "CPC 1208.1 / CPC 1215",
    commentText: "For the new gas fireplace, per CPC 1208.1, provide a gas line diagram clearly indicating piping length, size, material, branches, point of delivery, and ALL gas appliances. Gas piping sizing shall comply with CPC 1215. Identify the table used and provide calculations showing sizing is adequate.", priority: "required" },
  
  { id: "n-p-2", number: "18", discipline: "Plumbing", sheetReference: "Sheet A3.1", codeReference: "",
    commentText: "For the cooktop in the new kitchen, please show in plan if it is gas or electric. Attach specifications sheet (not installation guide) to this plan set. If gas, then show in gas piping diagram.", priority: "required" },
  
  { id: "n-p-3", number: "19", discipline: "Plumbing", sheetReference: "Sheet A3.1", codeReference: "CPC 408.5",
    commentText: "For bathroom 2, provide a curbless shower detail with notching and drain slope. Per CPC 408.5, the finished dam/curb/threshold shall not be less than 1\" lower than sides and back. Dam shall not be less than 2\" or exceed 9\" in depth. The finished floor shall slope uniformly toward drain not less than 1/8\" per foot nor more than 1/2\" per foot.", priority: "required" },
  
  // ENERGY
  { id: "n-en-1", number: "20", discipline: "Energy", sheetReference: "Sheet A6.0", codeReference: "CEnC 150.0(k)(1)(A)",
    commentText: "Add a note that per CEnC 150.0(k)(1)(A), all installed luminaires shall be classified as high-efficacy light sources per table 150.0-A.", priority: "required" },
  
  // C&D
  { id: "n-cd-1", number: "CD-1", discipline: "Construction & Demolition", sheetReference: "N/A", codeReference: "Green Halo",
    commentText: "A Construction and Demolition Recycling Plan needs to be submitted. A Green Halo account is REQUIRED. Please visit https://wastetracking.com/city/sanmateo/ to create your C&D Plan. Your C&D deposit will be $10,000.00 due at permit issuance.", priority: "required" },
  
  // PUBLIC WORKS
  { id: "n-pw-1", number: "PW-1", discipline: "Public Works", sheetReference: "Plans", codeReference: "SMCWPPP",
    commentText: "Per the San Mateo Countywide Water Pollution Prevention Program, follow BMP requirements for Architectural Copper installation. Include the BMP sheet in plans minimum 11\"x17\".", priority: "required" },
  
  { id: "n-pw-2", number: "PW-2", discipline: "Public Works", sheetReference: "Plans", codeReference: "",
    commentText: "Insert the BMP construction sheet from flowstobay.org. Sheet minimum 11\"x17\" or same size as other plan sheets.", priority: "required" },
  
  { id: "n-pw-3", number: "PW-3", discipline: "Public Works", sheetReference: "Site Plan", codeReference: "",
    commentText: "Please dimension the minimum driveway width.", priority: "required" },
  
  { id: "n-pw-4", number: "PW-4", discipline: "Public Works", sheetReference: "Plans", codeReference: "",
    commentText: "Add note to the plans: 'All new roof drainage shall be directed to landscaped areas to the extent feasible and not onto adjacent properties.'", priority: "required" },
  
  { id: "n-pw-5", number: "PW-5", discipline: "Public Works", sheetReference: "Plans", codeReference: "Municipal Code Section 7.38.432",
    commentText: "SEWER LATERAL INSPECTION: Applicant shall hire a licensed plumber to perform a sewer lateral inspection and submit a completed Sewer Lateral Inspection Form. Video inspection shall be completed prior to building permit issuance.", priority: "required" },
  
  { id: "n-pw-6", number: "PW-6", discipline: "Public Works", sheetReference: "Plans", codeReference: "STOPPP Type II",
    commentText: "This project requires a Stormwater Pollution Prevention Permit (STOPPP) Type II incorporated with the building permit. Add note to plans: 'The first STOPPP inspection shall occur prior to starting any construction. Contractor shall contact City of San Mateo Public Works Inspection to schedule STOPPP inspections.'", priority: "required" },
];
```

---

## CASE DETAIL PAGE `/case/:id` — LAYOUT

### Left Sidebar (260px, fixed, navy background, gold accents):

**Project Info Panel:**
- Address in Playfair Display white
- Permit # in DM Mono gold
- Jurisdiction badge
- Submittal # badge (e.g., "1ST REVIEW" or "2ND REVIEW")
- Plan expiration date with warning if < 30 days

**Progress Ring:**
- Large circular progress indicator (SVG)
- Center: "14 / 27" 
- Below: "Comments Addressed"

**Discipline Navigation:**
Clickable list — clicking scrolls to that section:
```
📋 General          (1) ✓
🏗️ Green Building   (1) pending
📐 Architectural    (9) 3/9
⚡ Electrical       (2) 0/2
🔧 Mechanical       (3) 0/3
🔩 Structural       (0) ✓
🚿 Plumbing         (3) 0/3
⚡ Energy           (1) 0/1
🔥 Fire & Life Safety (0) ✓
🌿 CALGreen         (0) ✓
🏛️ Planning         (0) ✓
🏗️ Public Works     (6) 0/6
♻️ C&D              (1) 0/1
```
Each discipline shows: icon + name + count badge + mini progress bar

**Action Buttons (bottom of sidebar, sticky):**
- Gold button: "📄 Generate Response Letter"
- White outline button: "📋 Preview Case Summary"

---

### Main Content Area:

**Top Bar:**
- Case title: "12 N Norfolk St · BD-2025-297718"
- Status badge
- Stats row: `X Passed · X In Progress · X Pending · X N/A`
- Right: "Add Comment +" button

**Comment Section Header** (jurisdiction-specific intro text, e.g.):
> *"City of San Mateo — Building Division comments dated April 23, 2025. Your plans have been reviewed for conformance of the current California Building Codes, City Ordinances, and City standards."*

---

### Comment Cards (the main UI element):

Each discipline has a **section header** with collapsible accordion:

```
┌─────────────────────────────────────────────────────────┐
│ 📐 ARCHITECTURAL    9 comments · 3 addressed · 6 pending │ [collapse ▼]
└─────────────────────────────────────────────────────────┘
```

Each comment is a **card**:

```
┌──────────────────────────────────────────────────────────────────┐
│ [#6]  Sheet A3.1  │  CRC 311.3 / CRC 311.3.1  │  ARCHITECTURAL  │
│                                                   [PENDING ▼]    │
│                                                                   │
│ 📌 CITY COMMENT:                                                  │
│ For both exterior landings at door 14/16 and door 15, please     │
│ provide a landing/floor on both sides of the exterior doors.     │
│ Per CRC 311.3, a landing OR floor area shall be provided...      │
│                                                                   │
│ ─────────────────────────────────────────────────────────────    │
│                                                                   │
│ ✏️ YOUR RESPONSE:                                                  │
│ ┌──────────────────────────────────────────────────────────┐     │
│ │ Type your response here, or click AI Generate below...  │     │
│ │                                                          │     │
│ └──────────────────────────────────────────────────────────┘     │
│                                                                   │
│ [🤖 AI Generate Response]  [✓ Mark Addressed]  [— Mark N/A]      │
└──────────────────────────────────────────────────────────────────┘
```

**Comment Card States:**
- **Pending:** White background, gray-blue left border (3px)
- **In Progress (has text but not marked):** Light yellow background, gold left border
- **Addressed:** Light green background, green left border, green checkmark badge
- **N/A:** Gray background, gray left border, "N/A" badge

**Status Toggle Dropdown:**
```
[PENDING ▼]
─────────────
○ Pending
○ In Progress  
● Addressed ✓
○ N/A
○ Deferred
```

**Code Reference Badge:**
Small pill in DM Mono showing "CRC 311.3" in navy background, gold text — clicking it could someday link to code (for now just display).

**Sheet Reference:**
Gray badge "Sheet A3.1"

**AI Generate Button:**
When clicked:
1. Button shows spinner "Generating..."
2. Calls OpenAI API GPT-4o with:
   - System prompt: "You are a California licensed architect preparing a Plan Check Response Letter. Write a professional, specific response to this city plan check comment. The response should: (1) acknowledge the comment, (2) state specifically what was done on the plans to address it (reference specific sheet numbers and details), (3) confirm code compliance. Be concise but complete. 2-4 sentences. Do NOT use generic responses like 'see plans' — be specific about what was revised."
   - User prompt: `Comment: "${commentText}"\nCode Reference: "${codeReference}"\nSheet: "${sheetReference}"\nProject: "${projectDescription}"\nProject Address: "${projectAddress}"`
3. Response streams into the textarea word by word
4. After complete: button changes to "🔄 Regenerate"

**"Add Comment" button:**
Opens a modal/drawer to manually add a new comment:
- Discipline dropdown
- Comment number (auto-increment)
- Sheet reference (text)
- Code reference (text)
- Comment text (textarea)
- Priority toggle (Required / Advisory)

---

### "Generate All AI Responses" Bulk Action:

Yellow banner at top of main content (if any comments have empty responses):
```
⚡ 18 comments have no response yet.  [Generate All AI Responses]
```
When clicked: processes all empty comments sequentially with a progress bar.

---

### Resubmittal Requirements Section:

At the bottom of the page, jurisdiction-specific resubmittal checklist:

**For San Mateo:**
- [ ] Revisions identified with revision clouds and delta numbers on all revised sheets
- [ ] Revision date and deltas marked on each revised sheet
- [ ] Sheet # noted in left margin where corrections are indicated
- [ ] All 4 complete sets returned for review
- [ ] All responses submitted to Building Division counter
- [ ] C&D Recycling Plan submitted to Green Halo
- [ ] C&D deposit of $10,000 paid at permit issuance

**For San Leandro:**
- [ ] Response Letter prepared with written responses to each comment
- [ ] Full set of digitally stamped plans with Clouds and Delta
- [ ] Construction & Waste Diversion form with Green Halo reference number
- [ ] Plans resubmitted within 180 days (expiration date shown)

**For Milpitas:**
- [ ] Written response letter for each review discipline
- [ ] Changes not in response to comments: separate narrative letter with sheet references
- [ ] Responses of "see plans" not acceptable — must be specific
- [ ] Full resubmittal package via eplan.ci.milpitas.ca.gov

---

## END OF PHASE 3

After building this phase you should have:
✅ Case Detail page `/case/:id` fully functional
✅ All 12 disciplines shown as accordion sections
✅ Comment cards with status toggles (Pending/Addressed/N/A)
✅ AI Generate Response button calling GPT-4o for individual comments
✅ Bulk "Generate All AI Responses" action
✅ Left sidebar with navigation, progress ring, project info
✅ Pre-loaded real comments for Case 001 (12 Norfolk St, San Mateo)
✅ Add Comment modal
✅ Resubmittal requirements checklist (jurisdiction-aware)
✅ Comment status persisted to localStorage

**Confirm completion. Wait for Phase 4.**
