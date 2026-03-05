# 🏛️ CalPlanCheck AI — COMPLETE REBUILD FIX PROMPT
# ONE SINGLE PROMPT — paste this into Lovable now
# This fixes the WRONG product concept and rebuilds with the CORRECT flow
# ============================================================

## ⚠️ CRITICAL: THE PRODUCT CONCEPT WAS WRONG — READ THIS FIRST

What was built so far is a "comment entry tool" where humans type comments manually.

THE REAL PRODUCT IS DIFFERENT:
- The PLAN CHECKER (city building department inspector) is the USER
- They upload the APPLICANT'S PDF plans  
- AI agents automatically READ the plans and CHECK every item against code rules
- AI generates ALL the correction comments automatically
- The plan checker only REVIEWS and APPROVES/EDITS what AI found
- Then one click generates the official correction letter to send to the applicant

THE HUMAN DOES: Upload → Review AI findings → Edit if needed → Generate letter → Send
THE AI DOES: Read plans → Check rules → Find violations → Write comments → Format letter

This saves the plan checker from 10–14 hours of manual work down to 30–60 minutes.

---

## WHAT TO KEEP FROM WHAT'S ALREADY BUILT:
✅ Keep the design system (navy/gold colors, fonts, CSS variables)
✅ Keep the navigation bar and demo banner
✅ Keep the 6 sample cases data
✅ Keep the TypeScript data models (just update CaseStatus values)
✅ Keep the dashboard page layout
✅ Keep the letter generator page structure

## WHAT TO CHANGE/FIX:
❌ Remove "manual comment entry" as the primary workflow
❌ Remove the wizard that asks humans to type comments
✅ Replace with: Upload → AI Processing Pipeline → Human Review → Letter
✅ Fix all page copy to say "AI-generated" not "enter your comments"
✅ Add the correct workflow steps throughout the UI

---

## THE 5 SCREENS TO BUILD/FIX (in order of the workflow)

---

# SCREEN 1: HOMEPAGE `/` — FIX THE MESSAGING

Keep the visual design. Change ALL the copy to reflect the correct product:

**Hero headline:** 
"AI Agents Review Building Plans. You Just Approve."

**Hero subheadline:**
"Upload applicant plans. Our AI reads every sheet, checks against 800+ California code rules, and generates all correction comments automatically. You review, approve, and send the official letter — in under an hour."

**How It Works — 4 steps (not 3):**

Step 1 — 📤 Upload Plans
"Plan checker uploads the applicant's PDF plan set. Any project type — residential, ADU, commercial TI, addition."

Step 2 — 🤖 AI Agents Analyze
"5 specialized AI agents read every sheet, dimension, and note. They check compliance against CBC 2022, CRC, Title 24, CALGreen, CMC, CPC, CEC, and local ordinances."

Step 3 — 👁️ Human Review
"The plan checker reviews every AI-generated finding. Approve, edit, or remove each item. Add manual comments if needed. Full control stays with the inspector."

Step 4 — 📄 Generate & Send
"One click generates the official correction letter in the exact format required by your jurisdiction — ready to send to the applicant."

**Stats bar — change to:**
- "800+" — Code Rules Checked Per Submittal
- "10–14 hrs" → "30–60 min" — Review Time Reduction  
- "6" — Bay Area Jurisdictions Supported
- "5" — Specialized AI Agents Working in Parallel

---

# SCREEN 2: UPLOAD PAGE `/upload` — BUILD THIS (PRIMARY ENTRY POINT)

Add "Upload Plans" as the FIRST nav item. This is the main entry point.

**Full page layout — cream background:**

**Left side (55%):**

Page title (Playfair Display 32px navy):
"Upload Plan Set for AI Review"

Subtitle (Source Serif 4 16px muted):
"Our AI agents will read the plans, check every item against California building codes, and generate all correction comments automatically."

**Upload Zone — large dashed border card:**
```
┌─────────────────────────────────────────┐
│                                         │
│              📋                         │
│                                         │
│      Drop PDF Plan Set Here             │
│      or click to browse                 │
│                                         │
│   Supports: PDF up to 100MB             │
│   Multi-page plan sets accepted         │
│                                         │
│         [  Browse Files  ]              │
│                                         │
└─────────────────────────────────────────┘
```
On file selected — show file info card:
```
┌─────────────────────────────────────┐
│ 📄  plans_12_norfolk_st.pdf    [✕]  │
│     18 pages · 4.2 MB               │
│     ████████████████████  100%      │
└─────────────────────────────────────┘
```

**Project Info Form (below upload zone):**
- Project Address * 
- APN (Assessor's Parcel Number)
- Permit / Application Number *
- Jurisdiction * (dropdown: San Mateo / San Leandro / Milpitas / San Bruno / Fremont / Union City / Other)
- Project Type * (dropdown: Residential Remodel / New ADU / Addition / Commercial TI / Bathroom Remodel / Other)
- Applicant Name
- Applicant Email (for sending letter)

**Big gold button:**
"🚀 Start AI Plan Review →"

---

**Right side (45%) — "What the AI Checks" panel:**

Navy card with gold title: "AI Checklist Coverage"
Subtitle: "Every item checked for this project type"

Show discipline checklist that updates based on selected Project Type:

For Residential Remodel (default):
```
📐 Architectural (CBC/CRC)
   ✓ Egress windows — CRC 310.2
   ✓ Exterior landings — CRC 311.3  
   ✓ Guards & handrails — CRC 312
   ✓ Attic access — CRC 807.1
   ✓ Smoke detectors — CRC 314.3
   ✓ Safety glazing — CRC 308.4
   + 12 more items

⚡ Electrical (CEC)
   ✓ GFCI receptacles — CEC 210.52(D)
   ✓ Kitchen island outlets — CEC 210.52(C)
   ✓ AFCI protection — CEC 210.12(B)
   + 8 more items

🔧 Mechanical (CMC)
   ✓ Kitchen exhaust — CMC 405.4
   ✓ AC receptacle — CMC 301.4
   ✓ Dryer venting — CMC 504.4
   + 6 more items

🚿 Plumbing (CPC)
   ✓ Gas line diagram — CPC 1208.1
   ✓ Gas sizing — CPC 1215
   ✓ Shower receptor — CPC 408.5
   + 5 more items

⚡ Energy (Title 24)
   ✓ High-efficacy lighting — CEnC 150.0
   ✓ CF1R forms — Title 24 Part 6
   + 4 more items

🌿 Green Building (CALGreen)
   ✓ MWELO screening — CGC 4.304.1
   ✓ C&D waste plan
   + 3 more items

🏗️ Public Works
   ✓ Stormwater — STOPPP Type II
   ✓ BMP requirements
   ✓ Sewer lateral inspection
   + 3 more items
```

Total at bottom: "**847 rules checked** across 8 disciplines"

---

# SCREEN 3: AI PROCESSING PAGE `/processing/:id`

Navigate here immediately after clicking "Start AI Plan Review".

**Full page — dark navy background `#081a3a`.**

**Top bar:**
- Left: "🏛️ CalPlanCheck AI" logo
- Center: File name + address in white/gold
- Right: "Processing... do not close this tab"

**Main content — centered, max-width 900px:**

Title (Playfair Display 36px white): "AI Agents Analyzing Your Plans"
Subtitle (DM Mono 12px gold): "5 AGENTS WORKING IN PARALLEL"

**The 5 Agent Cards — animate sequentially:**

Each agent card:
```
┌─────────────────────────────────────────────────────┐
│  [ICON]  Agent Name              [STATUS BADGE]      │
│          What it does                                │
│          ─────────────────────────────────           │
│          [Progress bar or result]                    │
└─────────────────────────────────────────────────────┘
```

Agent 1 — 📄 Plan Reader (starts immediately, completes in 2s)
- "Reading PDF pages and extracting all drawing content"
- Status: RUNNING → ✅ COMPLETE
- Result: "18 sheets analyzed · 847 elements extracted"

Agent 2 — 📋 Rule Engine (starts after Agent 1, completes in 1.5s)
- "Loading jurisdiction rules for City of San Mateo · Residential Remodel"
- Status: WAITING → RUNNING → ✅ COMPLETE  
- Result: "847 rules loaded · CBC 2022 + CRC + Title 24 + CALGreen + CMC + CPC + CEC"

Agent 3 — 🔍 Compliance Checker (starts after Agent 2, takes 4s with animated progress)
- "Comparing plan elements against all loaded rules"
- Status: WAITING → RUNNING (show animated % bar: 0% → 100%)
- Live feed appears on right side (see below)
- Result: "847 items checked · 9 violations found · 838 compliant"

Agent 4 — ✍️ Comment Writer (starts after Agent 3, takes 3s)
- "Writing professional correction comments for each violation"
- Status: WAITING → RUNNING → ✅ COMPLETE
- Result: "9 correction comments written · All code citations included"

Agent 5 — 📄 Letter Formatter (starts after Agent 4, takes 1.5s)
- "Formatting output for City of San Mateo correction letter format"
- Status: WAITING → RUNNING → ✅ COMPLETE
- Result: "Letter template applied · Ready for plan checker review"

**Right side live feed panel (300px, appears when Agent 3 starts):**
Title: "COMPLIANCE LOG" in DM Mono gold

Animate these lines appearing one at a time (typewriter effect, 400ms apart):
```
[●] Reading Sheet A-0.0: Cover Sheet
[●] Reading Sheet A-1.1: Site Plan  
[●] Reading Sheet A-2.0: Floor Plan
[●] Reading Sheet A-3.0: Elevations
[●] Reading Sheet A-3.1: Floor Plan Detail
[●] Reading Sheet A-4.1: Details
[●] Reading Sheet A-6.0: Electrical Plan
[⚠] CRC 310.2 — Bedroom 2 egress window
    Net clear opening < 5.7 sf required
[⚠] CRC 311.3 — Door 14/16 exterior landing
    Landing required both sides of door
[✓] CRC 314.3 — Smoke detectors OK
[⚠] CEC 210.52(D) — Bathroom GFCI missing
    Required within 3ft of each basin
[✓] CBC §107.2.5 — Site plan OK
[⚠] CMC 405.4 — Kitchen exhaust not shown
    Min 100 CFM required, vent to exterior
[✓] CRC 807.1 — Attic access OK
[⚠] CPC 1208.1 — Gas line diagram missing
    Required for new gas fireplace
[⚠] CGC 4.304.1 — MWELO form missing
    Required for landscaping work
[●] Generating correction comments...
[●] Applying San Mateo letter format...
[✅] Analysis complete — 9 items flagged
```

**After all 5 agents complete — Results Summary Card appears:**
```
┌────────────────────────────────────────────────┐
│  ✅  AI Plan Review Complete                    │
│                                                 │
│  📊  RESULTS                                    │
│  ────────────────────────────────               │
│  Total rules checked:        847    │
│  ✅ Compliant items:          838    │
│  ⚠️  Corrections required:      9    │
│                                                 │
│  DISCIPLINES WITH CORRECTIONS:                  │
│  Architectural (4) · Electrical (1)             │
│  Mechanical (2) · Plumbing (2)                  │
│  Green Building (1) · Public Works (3)          │
│                                                 │
│  Time saved vs manual review: ~11 hours         │
│                                                 │
│  [ → Review AI-Generated Comments ]  (gold btn) │
└────────────────────────────────────────────────┘
```

Clicking "Review AI-Generated Comments" navigates to `/case/case-001`
(the pre-loaded Norfolk St case with all real comments already in the data)

---

# SCREEN 4: HUMAN REVIEW PAGE `/case/:id` — FIX THIS PAGE

This is where the plan checker reviews what the AI found.
Keep the existing layout but fix the copy and workflow.

**Change the page header copy to:**
Title: "AI-Generated Plan Check Comments — Human Review"
Subtitle: "Review each finding below. Approve, edit, or remove. Add manual comments if needed."

**Change the status banner at top:**
```
┌─────────────────────────────────────────────────────────┐
│ 🤖 AI generated 9 correction comments for review        │
│    Approve all findings or edit individual items         │
│    [✅ Approve All]  [Review Item by Item →]             │
└─────────────────────────────────────────────────────────┘
```

**Fix each Comment Card — change the workflow:**

BEFORE (wrong): Card shows "Type your response here"
AFTER (correct): Card shows the AI-GENERATED comment, human approves or edits it

New comment card structure:
```
┌──────────────────────────────────────────────────────────┐
│  ⚠️ [#7]  Sheet A3.1  │  CRC 310.2  │  ARCHITECTURAL     │
│                                    [AI GENERATED] [PENDING]│
│                                                            │
│  🤖 AI-GENERATED CORRECTION COMMENT:                      │
│  ┌──────────────────────────────────────────────────┐    │
│  │ In bedroom 2, there is no emergency egress        │    │
│  │ opening that meets minimum requirements per CRC   │    │
│  │ 310.2. Provide a window with net clear opening    │    │
│  │ of no less than 5.7 sf, minimum 24" tall × 20"   │    │
│  │ wide, sill height no more than 44" AFF.           │    │
│  └──────────────────────────────────────────────────┘    │
│  (Click text to edit if needed)                           │
│                                                            │
│  📋 CODE BASIS: CRC 310.2                                 │
│  📄 SHEET REFERENCE: Sheet A3.1                           │
│  ⚡ AI CONFIDENCE: High (clear violation detected)         │
│                                                            │
│  [✅ Approve]  [✏️ Edit]  [🗑 Remove]  [+ Add Sub-item]   │
└──────────────────────────────────────────────────────────┘
```

**Card States:**
- Default (AI generated, awaiting review): white background, blue-gray left border, "AI GENERATED" gold badge
- Approved: green background tint, green left border, "✅ APPROVED" badge
- Edited + Approved: green with pencil icon, "✏️ EDITED & APPROVED" badge
- Removed: strikethrough gray, "REMOVED" badge (kept visible so inspector can undo)
- Manually Added: white with "👤 MANUAL" badge instead of "AI GENERATED"

**"Edit" mode on a card:**
When inspector clicks Edit, the comment text becomes a textarea they can modify.
Below the textarea:
- "Save Edit" button → marks as "EDITED & APPROVED"
- "Cancel" → reverts to original AI text

**"Add Manual Comment" button (at bottom of each discipline section):**
Opens inline form:
```
┌──────────────────────────────────────────┐
│ + Add Manual Correction Comment          │
│ Sheet Reference: [________]              │
│ Code Reference:  [________]              │
│ Comment Text:    [__________________]    │
│                  [__________________]    │
│                                          │
│ [Add Comment]  [Cancel]                  │
└──────────────────────────────────────────┘
```

**Left sidebar changes:**
- Remove "AI Generate Response" button (that was for the wrong workflow)
- Add "Review Progress" showing:
  ```
  ✅ Approved:   5
  ✏️  Edited:     2  
  ⏳ Pending:    2
  🗑  Removed:   0
  👤 Manual:    0
  ─────────────
  Total:         9
  ```
- Bottom button changes to:
  "📄 Generate Correction Letter (7 approved)"
  (Disabled until at least 1 comment is approved)

---

# SCREEN 5: LETTER GENERATOR PAGE `/case/:id/letter` — FIX THIS

**Change the concept:**
This generates the CORRECTION LETTER that the plan checker sends TO the applicant.
Not a response letter FROM the applicant.

**Left config panel — fix copy:**

Title: "Generate Correction Letter"

Fields:
- Letter Date (date picker)
- Plan Checker Name *
- Plan Checker Title (e.g., "Building Inspector", "Plan Check Engineer")
- Department (auto-filled from jurisdiction)
- Department Address (auto-filled)
- Include: only APPROVED comments (not removed ones)

**Letter count summary:**
```
✅ 7 approved comments will be included
🗑  2 removed comments excluded  
👤 0 manual comments added
─────────────────────────────
Total in letter: 7 corrections
```

**Generate button:** "📄 Generate Official Correction Letter"

---

**Right panel — the generated letter:**

The letter IS the city's correction letter going to the applicant.
Use the REAL format from the uploaded documents:

**San Mateo format template:**
```
                    PLAN CHECK CORRECTIONS LIST

Applicant Name:    [applicantName]
Applicant Address: [applicantAddress]
Applicant Phone:   [applicantPhone]  
Email Address:     [applicantEmail]

Date Plan Check Completed: [date]
Plan Check Number:         [permitNumber]
APN Number:                [apn]
Project Address:           [projectAddress]

Your plans have been reviewed for conformance of the current California 
Building Codes, City Ordinances, and City standards. The following 
corrections or clarifications are required.

Guidelines for submittal of revised plans:
• Revisions must be identified with revision clouds and delta numbers
• Note in left margin where corrections are indicated and sheet number
• Return at least four complete sets for review
• All responses must be submitted to the Building Division counter

───────────────────────────────────────────────
Building Code Comments:

[DISCIPLINE GROUP — e.g., "Architectural"]

Comment [number]. [Sheet reference]: [Full correction comment text]

[NEXT DISCIPLINE GROUP]

Comment [number]. [Sheet reference]: [Full correction comment text]

───────────────────────────────────────────────
Construction & Demolition Comments:
[C&D comments if any]

───────────────────────────────────────────────  
Public Works Comments:
[Public works comments if any]

If you have any questions, please contact [reviewerName] at [reviewerEmail].

[departmentAddress]  Phone: [departmentPhone]
```

**San Leandro format** uses "CONSOLIDATED PLAN REVIEW COMMENTS" header
**Milpitas format** uses "PLAN REVIEW COMMENTS" with discipline sections labeled B-ARCHITECTURAL, B-STRUCTURAL etc.
**Fremont format** uses "Development Review Comment Letter" with comment numbers like "00006", "00007"

The AI generates letter content by filling in the approved comments into the correct template for the jurisdiction.

**API call for letter generation:**
```javascript
const prompt = `
You are a California Building Official generating an official Plan Check 
Correction Letter to send to the applicant.

JURISDICTION: ${jurisdiction}
DEPARTMENT: ${reviewingDepartment}  
DEPARTMENT ADDRESS: ${departmentAddress}
PLAN CHECKER: ${planCheckerName}, ${planCheckerTitle}
DATE: ${date}

APPLICANT INFO:
Name: ${applicantName}
Address: ${applicantAddress}  
Phone: ${applicantPhone}
Email: ${applicantEmail}

PROJECT INFO:
Address: ${projectAddress}
APN: ${apn}
Permit Number: ${permitNumber}
Project Description: ${projectDescription}

APPROVED CORRECTION COMMENTS (include ALL of these in the letter):
${approvedComments.map(c => 
  `[${c.discipline}] Comment ${c.number} — ${c.sheetReference} (${c.codeReference}):
   ${c.commentText}`
).join('\n\n')}

Generate the complete official correction letter using the standard format 
for ${jurisdiction}. Group comments by discipline. Use formal government 
language. Include resubmittal instructions at the end. Include all approved 
comments exactly as written — do not summarize or shorten them.
`;
```

**After generation:**
- Letter renders in paper-style white document area
- Fully editable (contentEditable)
- Toolbar: [✏️ Edit Mode] [🖨 Print] [📧 Email to Applicant] [💾 Save Draft]
- "Email to Applicant" opens mailto: link with applicant email pre-filled

---

# NAVIGATION FLOW — CONNECT EVERYTHING

Update nav bar:
`Upload Plans | Dashboard | Active Cases`

Complete end-to-end flow:

```
Homepage
  → [Upload Plans] button → /upload
  → [View Demo Case] button → /case/case-001

/upload
  → fill form + select file
  → [Start AI Plan Review] → /processing/new-id

/processing/:id  
  → animation runs (12 seconds total)
  → [Review AI Comments] → /case/case-001

/case/:id (Human Review)
  → review/approve/edit each AI comment
  → [Generate Correction Letter] → /case/:id/letter

/case/:id/letter
  → configure + generate letter
  → edit if needed
  → [Print] or [Email to Applicant]

/dashboard
  → shows all cases with status
  → click any case → /case/:id
```

---

# DASHBOARD — SMALL FIXES

Update status labels to match new workflow:
- "UPLOADING" — gray
- "AI PROCESSING" — blue animated pulse
- "AWAITING REVIEW" — yellow (AI done, human hasn't reviewed yet)
- "IN REVIEW" — orange (human is reviewing)
- "LETTER READY" — green
- "SENT" — navy with gold border

Update table column "Comments" to show format: "7 approved / 9 total"

---

# FINAL CHECKLIST — EVERYTHING THIS PROMPT SHOULD PRODUCE

✅ Homepage — correct product messaging (AI does the work, human reviews)
✅ Upload page — PDF upload + project info form + "what AI checks" panel
✅ Processing page — 5 agent animated pipeline + live compliance log
✅ Results summary card after processing completes
✅ Case Detail — AI-generated comment cards with Approve/Edit/Remove
✅ Correct card states (AI Generated / Approved / Edited / Removed / Manual)
✅ Review progress tracker in sidebar
✅ Add Manual Comment inline form per discipline
✅ Letter Generator — generates city's correction letter TO applicant
✅ Correct letter templates per jurisdiction (San Mateo / San Leandro / Milpitas / Fremont)
✅ Letter is editable after generation
✅ Print and Email to Applicant buttons
✅ Dashboard with correct status labels
✅ All navigation flows connected end-to-end
✅ Demo shortcut: "View Demo Case" goes to case-001 (Norfolk St, 9 pre-loaded AI comments)
✅ All 6 sample cases in dashboard with realistic data
✅ localStorage persistence throughout
✅ Design system consistent (navy/gold, Playfair Display, DM Mono)
