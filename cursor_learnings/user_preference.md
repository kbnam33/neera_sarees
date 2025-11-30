## Founder & Workflow Preferences — Optimization Sprint

### What I learned (insights)
- You prioritize business outcomes over implementation details. You want clear “why it helps” and “how we’ll measure it” framed in Founder terms.
- You like concrete, low‑friction actions: “Tell me exactly what to upload/change, I’ll do it; you wire the rest.”
- You prefer phased, prioritized roadmaps with quick wins first, then scalable improvements.
- You value minimal ceremony: accept changes fast if the rationale and impact are clear.
- You want documentation of lessons, but only when asked or at milestones—with explicit permission before writing to shared notes.

### Process & design lessons
- Keep the plan in business language (KPIs: LCP/CLS/TBT, initial image KB, fewer requests) and map directly to user impact (faster, no jumps, smoother browsing).
- Provide “owner tasks” vs “engineer tasks” clearly split (e.g., “Upload WebP to bucket; we’ll update code”). This lowers cognitive load and speeds execution.
- Default to native/browser capabilities first (lazy, async decoding, intrinsic sizes) before larger infra decisions (CDN transforms, variants). It gets results quickly.
- Show acceptance criteria up front so you can judge success without diving into code.

### Your strengths
- Fast decision-making when impact is clear.
- Willingness to supply assets or settings (e.g., WebP logo) to unblock speed.
- Desire for performance validation (Lighthouse, PageSpeed) aligns with sound product practice.

### Potential drawbacks to watch
- Skipping measurement can hide wins or regressions. We should snapshot Lighthouse before/after to quantify improvements.
- Quick acceptance across many files can mask small regressions; a short checklist (smoke test + key metrics) keeps quality high.

### Suggestions for effective collaboration
- Continue using a prioritized checklist with owner vs engineer actions.
- After each milestone, run a lightweight validation ritual (Lighthouse mobile, CLS check, Network “Img” filter) and store the report link/screenshot.
- When assets change (e.g., new logo), keep the same filename or notify—our code can then auto‑benefit without extra edits.

> Summary: Clear outcomes, fast decisions, and explicit “what I do vs what you do” make this move quickly while staying grounded in metrics that matter to the business. 

