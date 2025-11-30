## Image Delivery and Layout Stability Optimization

### 1) Context snapshot
- Problem context: Product-heavy pages were loading many images up front, causing slower first paint and occasional layout shifts as images appeared. This mostly affected mobile shoppers on average networks.
- Persona at the center: Prospective shopper (mobile-first) who expects fast, smooth browsing; business stakeholder (founder) who cares about conversion, polish, and bandwidth cost.
- Solution delivered: Native browser lazy-loading, async decoding, fixed intrinsic sizes/aspect-ratios, IntersectionObserver gating for carousels/offscreen items, and a modern WebP logo with PNG fallback.
- Use case takeaways: Catalog/e‑commerce pages must prioritize above-the-fold content, defer offscreen work, and prevent layout jumps to build trust and reduce bounce.

### 2) Goals & success criteria
- Goals:
  - Faster first meaningful view of product pages and grids.
  - Eliminate layout shifts caused by images.
  - Reduce unnecessary initial network and CPU work.
- Success criteria (acceptance/KPIs):
  - LCP ≤ 2.5s (mobile) on key pages (home, product list, product detail).
  - CLS < 0.10 sitewide due to fixed image dimensions/aspect-ratio.
  - Fewer initial image requests at load (only above-the-fold).
  - Lower initial KB transferred for images before user scrolls.
  - Carousel loads only first frame eagerly; subsequent frames on demand.

### 3) Decisions & rationale
- Native `loading="lazy"` + `decoding="async"` on all product images and thumbnails.
  - Rationale: Lowest effort, broad browser support, immediate impact on network and main-thread decoding.
- Set explicit `width`/`height` or CSS `aspect-ratio` on images.
  - Rationale: Prevents layout shifts (improves CLS) without requiring design changes.
- IntersectionObserver gating for carousel/offscreen image containers.
  - Rationale: Ensures images render only when in/near viewport; avoids preloading dozens of frames.
- Prefer modern logo format via `<picture>` (WebP + PNG fallback).
  - Rationale: Smaller asset for the header/footer without breaking older browsers.
- Deferred choices (tradeoffs for speed of delivery):
  - Not adding responsive `srcset`/`sizes` for all product images yet (belongs to the responsive-delivery phase).
  - Not adding CDN transforms/build-time variants yet (requires coordination and QA). Prioritized quick wins first.

### 4) Constraints & surprises
- Constraints:
  - Current product images are stored as original URLs in Supabase; variants/responsive delivery not yet wired.
  - Maintain the visual design (3:4 product imagery) while preventing CLS.
  - Keep code changes surgical and low-risk to avoid regressions during ongoing development.
- Surprises/notes:
  - Many components reused similar image patterns; centralizing best practices required touching multiple files.
  - Logo optimization was straightforward once WebP was present in the same bucket.

### 5) Outcome & metrics
- Outcomes observed/expected:
  - Initial page loads request significantly fewer images (only those visible).
  - No visible layout jumps from image loads due to intrinsic sizing.
  - Smoother scroll on product grids due to deferred image work.
- Quantitative metrics (to validate post‑deploy):
  - Lighthouse/PageSpeed: improved Performance score, LCP lower, CLS < 0.10.
  - DevTools Network: fewer image requests before scroll; reduced initial image KB.
  - Real-user monitoring (if enabled): improved Core Web Vitals for mobile viewers.
  - Note: Exact deltas not measured yet; should be captured after deploy.

### 6) UX/Feature reasoning
- Feature → Problem → Impact
  - Lazy-loading → Too many images loading at once → Faster first paint and lower bandwidth on mobile.
  - Async decoding → Main thread blocked by image decode → Smoother render, fewer stalls.
  - Intrinsic sizes/aspect-ratio → Content jumping as images load → Stable layout, higher perceived quality (CLS drop).
  - IO gating for carousel/offscreen → Carousels preloading all frames → Less waste, faster interaction.
  - WebP logo fallback → Heavy header image → Faster header render and smaller repeated transfers.

> Bottom line: We reduced up-front work, stopped layout shifting, and improved perceived speed—directly supporting conversion and brand polish, especially on mobile catalog browsing. 

