## PHASE 1: TECHNICAL FOUNDATION

### Execute

Load and run @phase-1.mdc

Follow all instructions in phase-1.mdc from top to bottom:

- Read Objective
- Execute all steps (1 through 8)
- Complete the Phase 1 self-check checklist
- Follow Phase 1 DECISION logic (PASS / PARTIAL / FAILED)

**After phase-1.mdc execution completes, return here for external verification.**

***

### Part 1: Project \& Configuration Verification (Ralph Loop)

#### PLAN

**Vision:** Confirm that the Next.js project, App Router, and core configuration are correctly established as the foundation for further work.

**What We’re Verifying:**

- Next.js project exists and is recognized in the repo
- App Router (app directory) is in use
- Tailwind CSS and global styles are wired
- Phase 1 section exists in PROGRESS.md with basic status and notes

**Success Criteria:**

- 4/4 checks pass → Part 1 PASS
- 3/4 checks pass → Part 1 PARTIAL (retry once)
- <3/4 checks pass → Part 1 FAIL


#### EXECUTE

Run these verification checks:

**Check 1.1: Next.js Project Presence**

- Verify package.json contains a `next` dependency
- Expected: `next` dependency present

**Check 1.2: App Router Usage**

- Verify app directory exists in the project root (e.g., /app)
- Expected: app directory present and used

**Check 1.3: Tailwind \& Styles**

- Confirm tailwind.config.js exists
- Confirm global stylesheet (e.g., app/globals.css) includes Tailwind directives
- Expected: Tailwind configured and hooked into global styles

**Check 1.4: PROGRESS.md Phase 1 Entry**

- Open PROGRESS.md
- Verify a Phase 1 section exists with at least:
    - Status field (IN PROGRESS / COMPLETED / etc.)
    - At least one log line related to Phase 1 (e.g., project initialization, configuration)
- Expected: Phase 1 entry present and populated

Record the result of each check.

#### VALIDATE

**Expected Results:**

- Check 1.1: ✓ (Next.js dependency present)
- Check 1.2: ✓ (app directory present)
- Check 1.3: ✓ (Tailwind and global styles configured)
- Check 1.4: ✓ (Phase 1 entry in PROGRESS.md)

**Actual Results:**
Count how many checks passed: [X]/4

#### DECIDE

**If 4/4 checks passed:**

- Part 1 Status: ✅ PASS
- Log: “Part 1 (Project \& Config): All 4 checks passed”
- Action: Continue to Part 2 verification

**If 3/4 checks passed:**

- Part 1 Status: ⚠️ PARTIAL
- Action:
    - Retry Part 1 verification once:
        - Focus on the failed check(s)
        - Re-run all 4 checks
    - If after retry 4/4 pass → Part 1 PASS, continue to Part 2
    - If still 3/4 → Escalate to Part 1 FAIL

**If <3/4 checks passed:**

- Part 1 Status: ❌ FAIL
- Action:
    - Log failure details in PROGRESS.md under Phase 1
    - Continue to Part 2 (because routing/data can still be inspected), but Part 1 failure will weigh heavily in the final Phase 1 decision

***

### Part 2: Routes \& Data Verification (Ralph Loop)

#### PLAN

**Vision:** Ensure that product and category routes exist and are connected to real data from Supabase.

**What We’re Verifying:**

- Product detail route implemented in App Router
- Category route implemented in App Router
- Supabase data fetching wired for products
- Supabase data fetching wired for categories

**Success Criteria:**

- 4/4 checks pass → Part 2 PASS
- 3/4 checks pass → Part 2 PARTIAL (retry once)
- <3/4 checks pass → Part 2 FAIL


#### EXECUTE

Run these verification checks:

**Check 2.1: Product Route**

- Verify a route exists for product detail pages (e.g., app/products/[fabric]/[slug]/page)
- Expected: Product route file present

**Check 2.2: Category Route**

- Verify a route exists for category pages (e.g., app/categories/[fabric]/page)
- Expected: Category route file present

**Check 2.3: Supabase Data for Products**

- Check PROGRESS.md Phase 1 logs:
    - Look for “Supabase data fetching (products): [Working/Partial/Broken]”
- Expected for PASS: Marked as “Working” (or at least not “Broken”)

**Check 2.4: Supabase Data for Categories**

- Check PROGRESS.md Phase 1 logs:
    - Look for “Supabase data fetching (categories): [Working/Partial/Broken]”
- Expected for PASS: Marked as “Working” (or at least not “Broken”)

Record results for each check.

#### VALIDATE

**Expected Results:**

- Check 2.1: ✓ (product route exists)
- Check 2.2: ✓ (category route exists)
- Check 2.3: ✓ (product data fetching Working/Partial)
- Check 2.4: ✓ (category data fetching Working/Partial)

**Actual Results:**
Count how many checks passed: [X]/4

#### DECIDE

**If 4/4 checks passed:**

- Part 2 Status: ✅ PASS
- Log: “Part 2 (Routes \& Data): All 4 checks passed”
- Action: Continue to Part 3 verification

**If 3/4 checks passed:**

- Part 2 Status: ⚠️ PARTIAL
- Action:
    - Retry Part 2 verification once:
        - Re-check missing route or broken data entry
    - If after retry 4/4 pass → Part 2 PASS, continue to Part 3
    - If still 3/4 → Escalate to Part 2 FAIL

**If <3/4 checks passed:**

- Part 2 Status: ❌ FAIL
- Action:
    - Log failure in PROGRESS.md
    - Note: Missing routes or broken data access are critical for SEO/content phases
    - Continue to Part 3, but this will strongly influence final Phase 1 decision

***

### Part 3: SSG/SSR \& Builds Verification (Ralph Loop)

#### PLAN

**Vision:** Confirm that SSG for product pages, SSR for category pages, and both dev and prod builds are working without critical errors.

**What We’re Verifying:**

- SSG enabled for products
- SSR enabled for categories
- Dev build passes
- Prod build passes

**Success Criteria:**

- 4/4 checks pass → Part 3 PASS
- 3/4 checks pass → Part 3 PARTIAL (retry once)
- <3/4 checks pass → Part 3 FAIL


#### EXECUTE

Run these verification checks:

**Check 3.1: SSG (Products)**

- Check PROGRESS.md Phase 1 logs:
    - “SSG (products): [Enabled/Not Enabled]”
- Expected for PASS: “Enabled”

**Check 3.2: SSR (Categories)**

- Check PROGRESS.md Phase 1 logs:
    - “SSR (categories): [Enabled/Not Enabled]”
- Expected for PASS: “Enabled”

**Check 3.3: Dev Build**

- Check PROGRESS.md Phase 1 logs:
    - “Dev build: [Pass/Fail]”
- Expected for PASS: “Pass”

**Check 3.4: Prod Build**

- Check PROGRESS.md Phase 1 logs:
    - “Prod build: [Pass/Fail]”
- Expected for PASS: “Pass”

Record results for each check.

#### VALIDATE

**Expected Results:**

- Check 3.1: ✓ (SSG enabled)
- Check 3.2: ✓ (SSR enabled)
- Check 3.3: ✓ (Dev build Pass)
- Check 3.4: ✓ (Prod build Pass)

**Actual Results:**
Count how many checks passed: [X]/4

#### DECIDE

**If 4/4 checks passed:**

- Part 3 Status: ✅ PASS
- Log: “Part 3 (SSG/SSR \& Builds): All 4 checks passed”
- Action: Continue to Part 4 holistic verification

**If 3/4 checks passed:**

- Part 3 Status: ⚠️ PARTIAL
- Action:
    - Retry Part 3 verification once:
        - Focus on failed area (e.g., SSG not enabled, build failure)
    - If after retry 4/4 pass → Part 3 PASS, continue to Part 4
    - If still 3/4 → Escalate to Part 3 FAIL

**If <3/4 checks passed:**

- Part 3 Status: ❌ FAIL
- Action:
    - Log critical failures in PROGRESS.md
    - Note: Build failures or missing SSG/SSR are hard blockers for later phases

***

### Part 4: Holistic Phase 1 Vision (Ralph Loop)

#### PLAN

**Vision:** Decide whether the technical foundation is solid enough to support Phase 2 (Content Optimization) and beyond.

**What We’re Verifying:**

- Part 1, Part 2, and Part 3 results together
- Phase 1 Status in PROGRESS.md
- Existence of any critical blockers

**Success Criteria:**

- Parts 1–3 all PASS + no critical blockers → Phase 1 COMPLETE
- Any PARTIAL / minor issues only → Phase 1 NEEDS ATTENTION (but possibly usable)
- Any FAIL in Parts 1–3 or critical blockers → Phase 1 BLOCKED


#### EXECUTE

Aggregate results:

- Part 1 (Project \& Config): [PASS / PARTIAL / FAIL]
- Part 2 (Routes \& Data): [PASS / PARTIAL / FAIL]
- Part 3 (SSG/SSR \& Builds): [PASS / PARTIAL / FAIL]

Additional holistic checks:

**Check 4.1: Phase 1 Status in PROGRESS.md**

- Open PROGRESS.md
- Verify Phase 1 Status field is set (IN PROGRESS / COMPLETED / INCOMPLETE / FAILED)
- Expected for “COMPLETE” scenario: ✅ COMPLETED

**Check 4.2: Critical Blockers**

- Review Phase 1 issues in PROGRESS.md
- Look for:
    - Build failures
    - Missing routes
    - Completely broken data fetching
- Expected for “COMPLETE” scenario: No critical blockers listed

Record overall impression.

#### VALIDATE

**Scenario A: Ideal Technical Foundation**

- Part 1: PASS
- Part 2: PASS
- Part 3: PASS
- Check 4.1: Phase 1 status = ✅ COMPLETED
- Check 4.2: No critical blockers

**Result:** Phase 1 COMPLETE

***

**Scenario B: Acceptable with Warnings**

- Parts 1–3: Mostly PASS, with at most one PARTIAL and no FAIL
- Phase 1 status may be ✅ COMPLETED or ⚠️ INCOMPLETE
- Issues are minor (e.g., small config gaps, non-critical regressions)

**Result:** Phase 1 NEEDS ATTENTION, but may still allow Phase 2 with clear risk notes

***

**Scenario C: Blocked**

- Any of Parts 1–3 = FAIL
- Or Phase 1 status = ❌ FAILED in PROGRESS.md
- Or critical blockers listed (build failures, missing routes, no data)

**Result:** Phase 1 BLOCKED

#### DECIDE

**If Scenario A (Phase 1 COMPLETE):**

- Update PROGRESS.md:
    - Ensure Phase 1 Status: ✅ COMPLETED
    - Add summary:
        - “External verification: Phase 1 COMPLETE – technical foundation ready for Phase 2”
- Action: Phase 2 is allowed in the next workflow execution.

***

**If Scenario B (Phase 1 NEEDS ATTENTION):**

- Update PROGRESS.md:
    - Status: ⚠️ NEEDS ATTENTION (or keep ✅ COMPLETED but add strong warnings)
    - List specific issues and risks
- Action:
    - Note that Phase 2 can proceed, but with explicit awareness of technical debts.
    - Recommend addressing issues early in later phases.

***

**If Scenario C (Phase 1 BLOCKED):**

- Update PROGRESS.md:
    - Status: ❌ FAILED (if not already)
    - Add:
        - “Phase 1 BLOCKED – technical foundation not stable”
        - List of blocking issues
- Action:
    - Do NOT proceed to Phase 2.
    - Require Phase 1 fixes and a re-run before continuing.