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