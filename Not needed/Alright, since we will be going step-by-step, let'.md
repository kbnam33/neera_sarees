---
description: Main orchestrator for Neera Sarees SEO \& Technical Transformation
globs:
---

- "**/*.{jsx,tsx,ts,js,mdc,md}"
- "app/**/*"
- "components/**/*"
- "lib/**/*"
alwaysTry: false

# NEERA SAREES: SEO \& TECHNICAL TRANSFORMATION

## Main Workflow Orchestrator - generate.mdc

**Version:** 1.0 (Phase 0 Test)
**Execution Command:** @generate.mdc Execute the SEO \& Technical Transformation workflow

***

## EXECUTION OVERVIEW

This orchestrator executes the complete SEO \& Technical Transformation for Neera Sarees. It follows a phase-by-phase progression with Ralph loop validation at every level.

**Current Scope:** Phase 0 (Project Initialization)

**Your Role as AI Agent:**

- Execute phase files sequentially
- Verify outcomes through part-wise checks
- Make decisions based on verification results
- Update PROGRESS.md only after verification passes
- Monitor user.md for confirmations when paused
- Follow instructions exactly as written

***

## CONTEXT MANAGEMENT

**Keep Loaded Throughout:**

- This file (generate.mdc)
- PROGRESS.md (once created in Phase 0)

**Load Temporarily:**

- phase-X.mdc files (one at a time, unload after phase)
- Reference files (technical-migration.mdc, seo-optimization.mdc) only when explicitly referenced

**Never Load:**

- PRD.md (source document, not needed during execution)

***

# PHASE 0: PROJECT INITIALIZATION

## Execute

Load and run @phase-0.mdc

Follow all instructions in phase-0.mdc from top to bottom:

- Read Objective
- Execute all steps (1 through 6)
- If user action required, pause and monitor user.md
- Complete verification checklist
- Follow decision logic

**After phase-0.mdc execution completes, return here for external verification.**

***

## Verify Phase 0 Completion

### Part 1: Progress Tracking Verification (Ralph Loop)

#### PLAN

**Vision:** Establish audit trail foundation

**What We're Verifying:**

- PROGRESS.md file exists and is accessible
- File contains correct structure (headers, sections, metadata)
- Initialization template is properly populated

**Success Criteria:**

- 5/5 checks pass → Part 1 PASS
- 3-4/5 checks pass → Part 1 RETRY
- <3/5 checks pass → Part 1 FAIL


#### EXECUTE

Run these verification checks:

**Check 1.1: File Existence**

- Verify PROGRESS.md file exists in project root directory
- Expected: File is present and readable

**Check 1.2: Header Structure**

- Open PROGRESS.md file
- Verify it contains "NEERA SAREES TRANSFORMATION - PROGRESS LOG" header
- Expected: Header text found

**Check 1.3: Phase 0 Entry**

- Check PROGRESS.md contains "Phase 0: Project Initialization" section
- Expected: Phase 0 section exists

**Check 1.4: Metadata Fields**

- Verify PROGRESS.md contains Start Date field
- Verify PROGRESS.md contains Start Time field
- Expected: Both fields present

**Check 1.5: Content Quality**

- Open PROGRESS.md and read content
- Verify Start Date is populated (actual date, not placeholder)
- Verify Start Time is populated (actual time, not placeholder)
- Verify Phase 0 status shows either "IN PROGRESS" or "COMPLETED"
- Expected: All fields have real values

Record results for each check.

#### VALIDATE

**Expected Results:**

- Check 1.1: ✓ (file exists)
- Check 1.2: ✓ (header present)
- Check 1.3: ✓ (Phase 0 entry exists)
- Check 1.4: ✓ (metadata fields present)
- Check 1.5: ✓ (fields populated with real values)
- Total: 5/5 checks pass

**Actual Results:**
Count how many checks passed: [X]/5

#### DECIDE

**If 5/5 checks passed:**

- Part 1 Status: ✅ PASS
- Log: "Part 1 (Progress Tracking): All 5 checks passed"
- Action: Continue to Part 2 verification

**If 3-4/5 checks passed:**

- Part 1 Status: ⚠️ PARTIAL
- Action: Retry Part 1 verification once
    - Re-check the failed items
    - If now 5/5: Part 1 PASS, continue to Part 2
    - If still 3-4/5: Escalate to Part 1 FAIL

**If <3/5 checks passed:**

- Part 1 Status: ❌ FAIL
- Action: Stop verification immediately
- Reason: Progress tracking foundation not established
- Cannot proceed without audit trail capability
- Escalate to Phase 0 critical failure (skip remaining parts)

***

### Part 2: Backup Safety Verification (Ralph Loop)

#### PLAN

**Vision:** Ensure rollback capability exists

**What We're Verifying:**

- Backup branch exists locally
- Backup branch pushed to remote repository
- Branch is valid and accessible

**Success Criteria:**

- 3/3 checks pass → Part 2 PASS
- 2/3 checks pass → Part 2 RETRY
- <2/3 checks pass → Part 2 FAIL


#### EXECUTE

Run these verification checks:

**Check 2.1: Local Branch Exists**

- List all Git branches
- Look for backup-react-spa in the branch list
- Expected: Branch name appears

**Check 2.2: Remote Branch Exists**

- List remote branches
- Look for backup-react-spa in remote branch list
- Expected: origin/backup-react-spa or similar exists

**Check 2.3: Branch Integrity**

- Checkout backup-react-spa branch temporarily
- Verify branch has commits (check git log)
- Return to main branch
- Expected: Branch is valid with commit history

Record results for each check.

#### VALIDATE

**Expected Results:**

- Check 2.1: ✓ (local branch exists)
- Check 2.2: ✓ (remote branch exists)
- Check 2.3: ✓ (branch is valid)
- Total: 3/3 checks pass

**Actual Results:**
Count how many checks passed: [X]/3

#### DECIDE

**If 3/3 checks passed:**

- Part 2 Status: ✅ PASS
- Log: "Part 2 (Backup Safety): All 3 checks passed"
- Action: Continue to Part 3 verification

**If 2/3 checks passed:**

- Part 2 Status: ⚠️ PARTIAL
- Action: Retry Part 2 verification once
    - Identify which check failed
    - If Check 2.2 failed (remote push), retry: Push backup branch to remote
    - If Check 2.3 failed (integrity), retry: Verify branch validity
    - Re-check all 3 items
    - If now 3/3: Part 2 PASS, continue to Part 3
    - If still 2/3: Escalate to Part 2 FAIL

**If <2/3 checks passed:**

- Part 2 Status: ❌ FAIL
- Action: Log failure but continue to Part 3
- Reason: Backup is safety feature, not blocker for initialization
- Note: Transformation will proceed without rollback capability (risky)
- Log warning in PROGRESS.md

***

### Part 3: Data Access Verification (Ralph Loop)

#### PLAN

**Vision:** Confirm ability to access product data

**What We're Verifying:**

- Credentials file exists
- Required variables present
- Supabase connection works
- Product data accessible

**Success Criteria:**

- 4/4 checks pass → Part 3 PASS
- 3/4 checks pass → Part 3 RETRY
- <3/4 checks pass → Part 3 FAIL


#### EXECUTE

Run these verification checks:

**Check 3.1: Credentials File Exists**

- Verify .env.local file exists in project root
- Expected: File is present

**Check 3.2: Supabase URL Present**

- Check .env.local file contains NEXT_PUBLIC_SUPABASE_URL variable
- Expected: Variable line found in file

**Check 3.3: Supabase Key Present**

- Check .env.local file contains NEXT_PUBLIC_SUPABASE_ANON_KEY variable
- Expected: Variable line found in file

**Check 3.4: Connection Successful**

- Verify Supabase connection test in phase-0.mdc Step 4 succeeded
- Check PROGRESS.md shows product count was logged
- Expected: Connection worked, count is a number (any count acceptable)

Record results for each check.

#### VALIDATE

**Expected Results:**

- Check 3.1: ✓ (file exists)
- Check 3.2: ✓ (URL variable present)
- Check 3.3: ✓ (key variable present)
- Check 3.4: ✓ (connection succeeded)
- Total: 4/4 checks pass

**Actual Results:**
Count how many checks passed: [X]/4

#### DECIDE

**If 4/4 checks passed:**

- Part 3 Status: ✅ PASS
- Log: "Part 3 (Data Access): All 4 checks passed"
- Action: Continue to Part 4 holistic verification

**If 3/4 checks passed:**

- Part 3 Status: ⚠️ PARTIAL
- Action: Determine which check failed
    - If Check 3.1-3.3 failed: Credentials issue, likely user needs to add them
    - If Check 3.4 failed: Connection issue, credentials might be wrong
- Do NOT retry automatically (credentials need user verification)
- Escalate to Part 3 FAIL

**If <3/4 checks passed:**

- Part 3 Status: ❌ FAIL
- Action: Critical - cannot proceed without data access
- This blocks entire transformation
- Escalate to Phase 0 critical failure

***

### Part 4: Holistic Phase 0 Vision (Ralph Loop)

#### PLAN

**Vision:** Project baseline established and ready for technical transformation

**What We're Verifying:**

- All verification parts passed (Parts 1-3)
- Git repository is in workable state
- No critical blockers present
- Foundation is solid for Next.js migration

**Success Criteria:**

- All parts PASS + No blockers → Phase 0 COMPLETE
- 1 part PARTIAL/FAIL → Phase 0 NEEDS ATTENTION
- 2+ parts FAIL → Phase 0 BLOCKED


#### EXECUTE

**Aggregate Part Results:**

- Part 1 (Progress Tracking) status: [PASS/PARTIAL/FAIL]
- Part 2 (Backup Safety) status: [PASS/PARTIAL/FAIL]
- Part 3 (Data Access) status: [PASS/PARTIAL/FAIL]

**Additional Holistic Checks:**

**Check 4.1: Git Repository Ready**

- Verify currently on main or master branch
- Verify no critical uncommitted changes
- Expected: Repository in clean state

**Check 4.2: No Critical Blockers**

- Review PROGRESS.md BLOCKERS section
- Expected: Empty or only minor warnings

**Check 4.3: Foundation Complete**

- Can we track progress? (Part 1 status)
- Can we rollback if needed? (Part 2 status)
- Can we access data? (Part 3 status)
- Expected: All yes


#### VALIDATE

**Critical Path Assessment:**

Can we safely proceed to Phase 1 (Next.js migration)?

**Requirements:**

- Progress tracking works (Part 1 PASS)
- Data access works (Part 3 PASS)
- Repository is stable (Check 4.1 PASS)
- No critical blockers (Check 4.2 PASS)

**Optional but Recommended:**

- Backup exists (Part 2 PASS) - provides safety net


#### DECIDE

**Scenario A: Ideal Success**

- Part 1: PASS
- Part 2: PASS
- Part 3: PASS
- Checks 4.1-4.2: PASS

**Result:** Phase 0 COMPLETE (all criteria met)
**Action:** Proceed to final phase decision

***

**Scenario B: Acceptable Success**

- Part 1: PASS
- Part 2: FAIL (backup not created - acceptable risk)
- Part 3: PASS
- Checks 4.1-4.2: PASS

**Result:** Phase 0 COMPLETE (critical criteria met, backup optional)
**Warning:** Log in PROGRESS.md that backup is missing, transformation proceeds at higher risk
**Action:** Proceed to final phase decision

***

**Scenario C: Needs Attention**

- Part 1: PASS
- Part 2: PASS/FAIL
- Part 3: PARTIAL or FAIL
- OR Check 4.1: FAIL (Git issues)

**Result:** Phase 0 INCOMPLETE
**Action:** Cannot proceed to Phase 1 without data access or stable repository
**Escalate:** To Phase 0 blocked status

***

**Scenario D: Critical Failure**

- Part 1: FAIL (cannot track progress)
- OR Part 3: FAIL (cannot access data)
- OR Multiple parts FAIL

**Result:** Phase 0 BLOCKED
**Action:** Stop workflow, request user intervention
**Escalate:** To Phase 0 critical failure

***

## Final Phase 0 Decision

Based on Part 4 holistic verification outcome:

### ✅ If Phase 0 COMPLETE (Scenarios A or B)

**Update PROGRESS.md:**

Change Phase 0 section to:

- Status: Change to ✅ COMPLETED
- Completed: Add current timestamp
- Duration: Calculate from start to completion
- Verification Results:
    - Part 1 (Progress Tracking): PASS
    - Part 2 (Backup Safety): PASS or FAIL with note
    - Part 3 (Data Access): PASS
    - Part 4 (Holistic): COMPLETE
- All external verifications: PASSED
- Next: Phase 1 - Technical Foundation

**Add completion summary:**

Update PROGRESS.md with:

═══════════════════════════════════════════════════════════════════
Phase 0: ✅ SUCCESSFULLY COMPLETED
═══════════════════════════════════════════════════════════════════

**Completion Time:** [timestamp]
**Duration:** [X] minutes
**Verifications:** All critical checks passed
**Status:** Ready for Phase 1 execution

**What Was Achieved:**
✅ Progress tracking established (PROGRESS.md)
✅ Safety backup created (backup-react-spa branch)
✅ Supabase connection verified
✅ Product data accessible ([X] products)
✅ Repository baseline confirmed

**Next Step:** Phase 1 - Technical Foundation
(Will begin in next workflow execution)

═══════════════════════════════════════════════════════════════════

**For this test execution, Phase 0 is complete.**

**Display to user:**

═══════════════════════════════════════════════════════════════════
✅ PHASE 0 COMPLETED SUCCESSFULLY
═══════════════════════════════════════════════════════════════════

Phase 0: Project Initialization has completed successfully.

**What Was Accomplished:**
✅ PROGRESS.md tracking initialized
✅ Backup branch created: backup-react-spa
✅ Supabase connection verified
✅ Product data accessible: [X] products
✅ Repository baseline confirmed
✅ All verification checks passed

**Project Status:** Ready for Phase 1 (Next.js migration)

**Next Steps:**
This is a Phase 0 test execution. Phase 1 will be added after Phase 0 is validated.

Review PROGRESS.md for complete execution log.

═══════════════════════════════════════════════════════════════════

**Unload phase-0.mdc from context.**

**Phase 0 workflow execution complete.**

***

### ⚠️ If Phase 0 NEEDS ATTENTION (Scenario C)

**Update PROGRESS.md:**

Change Phase 0 section to:

- Status: ⚠️ INCOMPLETE
- Issues: List which parts failed or are partial
- Blockers: Data access issues or Git repository issues
- User Actions Required: Resolve identified issues

**Add to BLOCKERS section:**

Phase 0 cannot complete due to:

- [List specific issues from Parts 1-3 that failed]
- Critical: Cannot proceed without [data access / stable repository]

**⛔ PAUSE WORKFLOW**

Display message to user:

═══════════════════════════════════════════════════════════════════
⚠️ PHASE 0 INCOMPLETE - Issues Require Resolution
═══════════════════════════════════════════════════════════════════

Phase 0 verification found issues that must be resolved:

**Failed Verifications:**
[List which parts failed: Part 1, Part 2, Part 3]

**Specific Issues:**
[Detail what failed in each part]

**Resolution Required:**

[Provide specific steps based on which parts failed]

**After resolving:**
Update user.md with: "Phase 0 issues resolved"

The workflow will re-verify Phase 0 after your confirmation.

═══════════════════════════════════════════════════════════════════

**Monitor user.md for confirmation.**

**After user confirms resolution:**

- Re-run Phase 0 verification (Parts 1-4 above)
- If now complete → Update PROGRESS.md with COMPLETED, proceed
- If still incomplete → Report as unresolvable, end workflow

***

### ❌ If Phase 0 BLOCKED (Scenario D)

**Update PROGRESS.md:**

Change Phase 0 section to:

- Status: ❌ FAILED
- Failed At: Current timestamp
- Critical Failures: List Parts 1-3 that failed
- Issues: Detailed description of each failure
- Blockers: Cannot proceed to transformation without resolving critical issues

**Add to BLOCKERS section:**

Phase 0 CRITICAL FAILURE:

- [List all failed parts and their issues]
- Transformation cannot proceed
- Manual intervention required

**⛔ STOP WORKFLOW EXECUTION**

Display message to user:

═══════════════════════════════════════════════════════════════════
❌ PHASE 0 BLOCKED - Critical Failures Detected
═══════════════════════════════════════════════════════════════════

Phase 0 initialization has encountered critical failures.

**Failed Verifications:**

- Part 1 (Progress Tracking): [PASS/FAIL with details]
- Part 2 (Backup Safety): [PASS/FAIL with details]
- Part 3 (Data Access): [PASS/FAIL with details]

**Critical Issues:**
[List specific problems that caused failure]

**Why This Blocks Transformation:**

- Without progress tracking: Cannot track workflow state
- Without data access: Cannot fetch products for optimization
- Without stable repository: Cannot safely modify codebase

**Resolution Steps:**

[Provide detailed resolution steps based on failures]

**After resolving all critical issues:**

1. Verify each issue is fixed
2. Update user.md with: "Critical issues resolved - ready to restart Phase 0"
3. Restart workflow execution: @generate.mdc Execute the transformation

The workflow will restart Phase 0 from the beginning after confirmation.

═══════════════════════════════════════════════════════════════════

**Workflow execution STOPPED.**

Review PROGRESS.md for failure details.