# 🏛️ CalPlanCheck AI — MID-POINT FIX + CONTINUE PROMPT
# Paste this into Lovable to fix Phase 1-3 issues AND complete Phase 4
# This is a single self-contained prompt — covers everything remaining

---

## CONTEXT: What's Already Built (Phases 1–3)
The app shell, routing, design system, data models, homepage, dashboard, 
new case wizard, and case detail page are partially built. 

## YOUR JOB NOW: Fix + Complete + Add the Core AI Upload Flow

---

## PART A — FIX THESE THINGS FIRST

### A1. Design Consistency Check
Make sure ALL pages use these exact values — fix any deviations:
- Background: `#f8f5ef` (warm cream) — not plain white, not gray
- Nav bar: `#0d2b5e` navy with `3px solid #c8a84b` gold bottom border
- All headings: `Playfair Display` font
- All code/permit numbers: `DM Mono` font  
- Primary buttons: `#0d2b5e` background, white text, `DM Mono` font
- Gold accent buttons: `#c8a84b` background, `#0d2b5e` navy text
- Card borders: `1px solid #d4cfc4`
- Card backgrounds: `#ffffff`
- Demo banner at very top: `#c8a84b` background, `#081a3a` text, 
  text: "🚧 DEMO MODE — CalPlanCheck AI — For Presentation Purposes Only"

### A2. Fix Case Detail Page `/case/:id`
Ensure these all work correctly:
- Left sidebar shows discipline list with comment counts per discipline
- Each discipline section is a collapsible accordion  
- Comment cards show: comment number + sheet reference + code reference badge
- Status toggle buttons work: PENDING → IN PROGRESS → ADDRESSED → N/A
- When status = ADDRESSED → card gets green left border + green background tint
- When status = N/A → card gets gray styling
- Progress ring in sidebar updates live as comments are marked
- "Add Comment" button opens a modal with fields: 
  Discipline, Number, Sheet Reference, Code Reference, Comment Text, Priority
- All state saved to localStorage so refresh doesn't lose data

### A3. Fix the AI Response Button on Each Comment Card
Each comment card must have a "🤖 Generate AI Response" button.
When clicked:
1. Show spinner inside button, text changes to "Generating..."
2. Call OpenAI API: `POST https://api.anthropic.com/v1/messages`
   - Model: `claude-sonnet-4-20250514`
   - Max tokens: 1000
   - System: "You are a California licensed architect writing a Plan Check Response Letter. Write a professional, specific 2-4 sentence response to this city plan check comment. Reference specific sheet numbers. Never say 'see plans' or 'plans comply' — be specific about what was revised or added."
   - User message: "Comment #{number} — {discipline}\nSheet: {sheetReference}\nCode: {codeReference}\nCity Comment: {commentText}\nProject: {projectDescription} at {projectAddress}"
3. Stream the response text into the textarea word by word
4. After complete: button changes to "🔄 Regenerate"
5. Auto-mark comment status as "In Progress"

### A4. Fix the "Generate All Responses" Feature
Yellow banner at top of main content area:
"⚡ X comments have no AI response yet. [Generate All AI Responses]"
When clicked:
- Show a progress modal: "Generating responses... (3 of 18 complete)"
- Process comments one by one with 500ms delay between each
- Progress bar fills as each completes
- When done: "✅ All responses generated! Review and edit before generating letter."

---

## PART B — ADD THE CORE UPLOAD FLOW (NEW — Most Important)

This is the PRIMARY workflow. Add it now.

### B1. New Upload Page `/upload`

Add "Upload Plans" to the main navigation between "Dashboard" and "New Case".

**Page Layout:**
Large centered upload area on cream background.

**Hero text:**
- Title (Playfair Display 32px navy): "Upload Your Plan Set for AI Review"
- Subtitle (Source Serif 4 16px): "Our AI agents will analyze your drawings against California building codes and automatically identify all non-compliant items."

**Upload Zone (large dashed border box, 400px tall):**
```
        📁
   Drop PDF plans here
   or click to browse
   
   Supports: PDF (up to 50MB)
   
   [Browse Files]
```
On hover: border changes to gold, background tints light gold

**After file selected — show file card:**
```
┌─────────────────────────────────────┐
│ 📄 plans_43353_cedarwood.pdf        │
│    2.4 MB · 18 pages                │
│                              [✕]    │
└─────────────────────────────────────┘
```

**Project Info (quick form below upload zone):**
- Project Address *
- Jurisdiction * (dropdown of 6 cities)
- Project Type * (dropdown)
- Permit Number (optional)

**Big gold button:** "🚀 Start AI Plan Review"

---

### B2. Processing Page `/processing/:id`

After upload, navigate here. This shows the multi-agent AI pipeline running.
This is ANIMATED — it must look impressive for the demo.

**Full page, dark navy background (`#081a3a`).**

**Top:** File name + project address in white

**Center: Agent Pipeline Visualization**

Show 5 agents as vertical steps with connecting animated line:

```
  ●━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━●
  
  [AGENT 1]              STATUS
  📄 Plan Analyzer       ✅ COMPLETE
  Reading 18 PDF pages   18 sheets analyzed
  ─────────────────────────────────────────
  
  [AGENT 2]              STATUS  
  📋 Checklist Engine    ✅ COMPLETE
  Applying 847 rules     CBC 2022 + CRC + Title 24
  ─────────────────────────────────────────
  
  [AGENT 3]              STATUS
  🔍 Compliance Checker  ⏳ RUNNING...
  Identifying violations  [████████░░░░] 67%
  ─────────────────────────────────────────
  
  [AGENT 4]              STATUS
  ✍️ Comment Generator   ⏸ WAITING
  Writing corrections    —
  ─────────────────────────────────────────
  
  [AGENT 5]              STATUS
  📄 Letter Formatter    ⏸ WAITING
  Formatting output      —
```

**Animation behavior:**
- Each agent lights up gold when active, shows green checkmark when done
- Agent 3 "Compliance Checker" — animate for 4 seconds showing % progress
- Agent 4 "Comment Generator" — animate for 3 seconds  
- Agent 5 "Letter Formatter" — animate for 2 seconds
- After all complete: big gold button appears "→ Review Generated Comments"

**Live feed (right side panel, 280px):**
Scrolling log of what's being found (fake/simulated for demo):
```
[12:34:01] Reading Sheet A-1.1: Site Plan
[12:34:02] Reading Sheet A-2.0: Floor Plan  
[12:34:03] Reading Sheet A-3.0: Elevations
[12:34:04] ⚠ CRC 310.2: Bedroom egress window — net clear opening < 5.7 sf
[12:34:05] ⚠ CRC 311.3: Exterior landing missing at Door 14
[12:34:06] ✓ CRC 314.3: Smoke detectors — compliant
[12:34:07] ⚠ CEC 210.52(D): GFCI receptacle missing at Bathroom 2
[12:34:08] ✓ CBC §107.2.5: Site plan — compliant  
[12:34:09] ⚠ CMC 405.4: Kitchen exhaust not shown
[12:34:10] ✓ CRC 807.1: Attic access — compliant
[12:34:11] ⚠ CPC 1208.1: Gas line diagram missing
[12:34:12] Generating correction comments...
[12:34:14] Formatting plan check letter...
[12:34:15] ✅ Review complete — 9 items require correction
```
(Animate these lines appearing one by one with typewriter effect)

**After completion — Summary card appears:**
```
┌─────────────────────────────────────────────┐
│  ✅ AI Plan Review Complete                  │
│                                             │
│  📊 Results Summary                         │
│  ─────────────────                          │
│  Total items checked:    847                │
│  Items compliant:        838  ✓             │
│  Items requiring action:   9  ⚠             │
│                                             │
│  Disciplines with issues:                   │
│  Architectural (4) · Electrical (1)         │
│  Mechanical (2) · Plumbing (2)              │
│                                             │
│  [→ Review All Comments & Generate Letter]  │
└─────────────────────────────────────────────┘
```

**IMPORTANT:** For the demo, after the animation completes, navigate to 
the Case Detail page `/case/demo-001` which already has the real pre-loaded 
comments from 12 Norfolk St, San Mateo. This makes the demo fully functional 
without needing real AI plan analysis.

---

## PART C — BUILD THE LETTER GENERATOR PAGE `/case/:id/letter`

### Layout: Two-panel

**Left config panel (360px, navy background):**

Header: "Letter Configuration" in gold Playfair Display

Fields:
- Letter Date (date picker, default today)
- Your Name / Signatory
- Your Title (Architect / Engineer / Owner / Contractor)
- Your License # (optional)
- Your Phone
- Your Email

Section: "Include in Letter" — checkboxes per discipline
(pre-check all disciplines that have addressed comments)

Section: "Letter Format"
Auto-detected based on jurisdiction. Show read-only badge:
e.g., "📋 San Mateo Format — Standard Correction Response"

Big gold button: "📄 Generate Response Letter"
After generation: "🔄 Regenerate Letter"

Stats below button:
- X comments included
- X disciplines covered
- Estimated pages: ~X

**Right document panel (main area):**

Before generation: Show a ghosted/watermarked preview mockup:
```
[DOCUMENT PREVIEW]

_________________________________
[Your Name]
[Your Address]
[Date]

City of [Jurisdiction]
Building Division
[Address]

RE: Plan Check Response Letter
Project: [Address]
Permit: [Number]

Dear Building Official,

[AI will generate your complete
 response letter here...]

─────────────────────────────────
Click "Generate Response Letter"
to create your letter →
```

After generation: Real letter appears, fully editable (contentEditable div).

**Toolbar above document (shown after generation):**
`[✏️ Edit] [🖨 Print] [📋 Copy All] [💾 Save]`

---

### Letter Generation API Call:

```javascript
const generateLetter = async () => {
  const addressedComments = comments.filter(c => 
    c.status === 'addressed' || c.status === 'in_progress'
  );
  
  const commentsList = addressedComments.map(c => 
    `[${c.number}] ${c.discipline} — ${c.sheetReference} (${c.codeReference})\n` +
    `City Comment: ${c.commentText}\n` +
    `Response: ${c.userResponse || c.aiResponse || '[RESPONSE NEEDED]'}`
  ).join('\n\n');

  const prompt = `
Generate a complete, formal Plan Check Response Letter.

JURISDICTION: ${jurisdiction} 
PROJECT ADDRESS: ${projectAddress}
PERMIT NUMBER: ${permitNumber}
SUBMITTAL: ${submittalNumber}st Submittal
OWNER: ${ownerName}
APPLICANT: ${applicantName}
PROJECT DESCRIPTION: ${projectDescription}
REVIEWING DEPARTMENT: ${reviewingDepartment}
DEPARTMENT ADDRESS: ${departmentAddress}
TODAY'S DATE: ${new Date().toLocaleDateString('en-US', {month:'long',day:'numeric',year:'numeric'})}

COMMENTS AND RESPONSES:
${commentsList}

FORMAT REQUIREMENTS for ${jurisdiction}:
- Use professional government letter format
- Group responses by discipline
- Include code citations with each response  
- Include resubmittal instructions at end
- Include signature block
- Professional, formal tone throughout
- Never use "see plans" — be specific about what sheet/detail was revised
`;

  // Call Anthropic API
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
  });
  
  const data = await response.json();
  return data.content[0].text;
};
```

---

## PART D — ADD DEMO SHORTCUT BUTTONS

On the Homepage hero section, add two shortcut buttons below the main CTAs:

**Quick Demo Row:**
```
── Quick Demo ──────────────────────────────────────
[📋 View Pre-loaded Case]   [🎬 Watch AI Processing]
  12 Norfolk St, San Mateo    See upload → AI → letter
────────────────────────────────────────────────────
```

"View Pre-loaded Case" → goes directly to `/case/case-001`
"Watch AI Processing" → goes to `/upload` then auto-starts the processing demo

---

## PART E — CONNECT ALL NAVIGATION

Make sure these flows work end-to-end:

**Flow 1: Upload Flow**
`/upload` → select file + fill form → click Start → `/processing/:id` 
→ animation runs → click Review → `/case/demo-001` (pre-loaded)
→ review comments → generate AI responses → `/case/demo-001/letter`
→ generate letter → print

**Flow 2: Direct Entry Flow**  
`/new-case` → fill 4-step wizard → create → `/case/:newId`
→ manually add comments OR use "Add Comment" 
→ generate AI responses → `/case/:newId/letter`
→ generate letter → print

**Flow 3: Dashboard Flow**
`/dashboard` → click any case row "Open" → `/case/:id`
→ click "Letter" column button → `/case/:id/letter`

---

## PART F — FINAL DETAILS

### Add to Case Detail page — Summary Bar:
Fixed bar at very bottom of case detail page (above footer):
```
[12 N Norfolk St · BD-2025-297718 · San Mateo]
[9 addressed ✓] [8 pending ⚠] [3 N/A] [6 not started]  
                              [→ Generate Letter (17 addressed)]
```

### Add "View Original City Letter" button:
In the case detail top bar — gray outlined button: "📄 View Original Letter"
For demo cases, show a modal with the real text from the city letter.

### Jurisdiction-specific resubmittal footer on Letter page:
After the letter, show a gray box with resubmittal checklist:

**San Mateo:**
"□ Revision clouds on all revised sheets □ Delta numbers on each sheet 
□ 4 complete sets returned □ C&D Recycling Plan submitted (Green Halo) 
□ C&D deposit $10,000 at permit issuance"

**San Leandro:**
"□ Response Letter prepared □ Complete digitally stamped plan set with clouds/deltas
□ Construction & Waste Diversion form with Green Halo reference number
□ Resubmit within 180 days of original comments"

**Milpitas:**
"□ Written response per discipline □ Specific sheet/detail references in each response
□ No 'see plans' responses □ Submit via eplan.ci.milpitas.ca.gov
□ B-Recycling Report required □ B-Special Inspection if applicable"

**Fremont:**
"□ Responses to Comments document uploaded as 'New' in Citizen Access
□ Complete revised plan set □ GH tracking number obtained
□ Contact record Team Lead with questions"

---

## SUMMARY OF WHAT THIS PROMPT ADDS/FIXES

✅ Design consistency fixed across all pages
✅ Case Detail page fully functional (status toggles, progress, localStorage)
✅ AI response generation per comment (Anthropic API)
✅ Bulk "Generate All" responses with progress modal
✅ NEW: Upload page with drag-and-drop
✅ NEW: Processing page with 5-agent animated pipeline
✅ NEW: Live compliance log feed (animated)
✅ NEW: Results summary after processing
✅ Letter Generator page fully built
✅ Letter generation via Anthropic API (jurisdiction-specific format)
✅ Editable letter (contentEditable)
✅ Print functionality
✅ All 3 flows connected end-to-end
✅ Demo shortcut buttons on homepage
✅ Resubmittal checklists per jurisdiction
✅ Summary bar at bottom of case detail page
