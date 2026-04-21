# Neera SEO — Technical Instructions: Fix E (Tracking) & Fix F (Content)

---

# Fix E — Tracking Setup

These steps happen after deploying the fixes from documents A, B, C, and D.
None of these require code changes. They are configuration and verification steps
in external tools.

---

## E1 — Set up Google Search Console

**What it is:** Google's free tool that shows you exactly what Google sees when it
crawls your site — which pages are indexed, which queries are triggering your pages,
how many people clicked through, and any technical errors Google encountered.
This is the single most important SEO tool you have.

**Step 1 — Create the property.**

Go to `search.google.com/search-console`. Sign in with a Google account.
Click "Add Property". Select "Domain" (not URL prefix) and enter `neera.store`.

**Step 2 — Verify ownership.**

GSC will ask you to prove you own the domain. The method depends on where your DNS
is managed. Since you're on Hostinger:
- Log into Hostinger control panel → Domains → DNS Zone Editor
- GSC will give you a TXT record to add (looks like: `google-site-verification=XXXXXXXXX`)
- Add it as a TXT record at the root (`@`) of your DNS
- Return to GSC and click Verify
- DNS propagation can take up to 30 minutes — if verification fails immediately,
  wait 15 minutes and try again

**Step 3 — Submit your sitemap.**

In GSC left sidebar → Sitemaps → enter `sitemap.xml` → Submit.
Wait for GSC to show "Success" status. The "Discovered URLs" count should match
approximately the number of products + category pages in your sitemap.

**Step 4 — Enable email alerts.**

GSC Settings → Email preferences → turn on notifications for:
- Coverage errors (pages Google couldn't index)
- Manual actions (if Google penalises the site for any reason)
- Security issues

**What to monitor weekly after setup:**

Open GSC every Monday and check these three panels:

| Panel | What to look for |
|-------|-----------------|
| Performance → Pages | Which pages are getting impressions. New use-case pages (`/for/*`) should start appearing here within 2–4 weeks of deploy |
| Performance → Queries | Which search terms triggered your pages. Look for "saree for office", "linen saree working women" appearing |
| Pages → Why pages aren't indexed | Any pages in the "Crawled but not indexed" or "Discovered but not indexed" buckets that shouldn't be there |

---

## E2 — Run PageSpeed Insights baseline

**What it is:** Google's free tool that measures your Core Web Vitals — the same
scores Google uses as a ranking signal. Run this before and after performance fixes
so you have a before/after comparison.

**URL:** `pagespeed.web.dev`

**Run on these three pages in this order:**

1. `https://neera.store/products` — your primary target page, highest traffic
2. `https://neera.store/fabric/Linen` — representative collection page
3. Any single product page (e.g. `https://neera.store/products/Linen/pink-plain-linen-saree`)

**For each page, run Mobile first, then Desktop.** Mobile score matters more —
Google uses mobile scores for ranking.

**Record these numbers before any fixes are deployed:**

| Metric | Target | What it means |
|--------|--------|---------------|
| LCP | < 2.5s | How fast the biggest visible element loads |
| CLS | < 0.1 | How much layout shifts during load |
| INP | < 200ms | How fast the page responds to taps |
| Performance score | > 70 | Overall score (70–100 is good, <50 is poor) |

Save screenshots of the results. After the hero image fix (C3), preconnect fix (B1),
and lazy loading fix (red fixes document), run again on the same pages and compare.
Expect LCP to improve by 0.5–1.5s on mobile after those three fixes combined.

**If PageSpeed shows "Avoid serving legacy JavaScript to modern browsers":**
This is a Vite/Babel configuration issue unrelated to the fixes in this document.
Note it separately — it is a future optimisation task.

---

## E3 — Test schema with Google's Rich Results Test

**What it is:** Google's tool that parses the JSON-LD on a page and tells you whether
it qualifies for rich results (star ratings, product prices, breadcrumbs) in search.

**URL:** `search.google.com/test/rich-results`

**Run on these pages after deploying C1, C2, C3, and D steps:**

**Test 1 — Product page:**
Paste any product URL. Expected result: "Product" rich result detected with
`name`, `image`, `offers` (price + availability), `brand`, `breadcrumb`.
If `aggregateRating` is missing, that is expected until C3 Part 3 is implemented
with real review data.

**Test 2 — Homepage:**
Paste `https://neera.store`. Expected result: "Website" with SearchAction,
"Organization" with contactPoint. If these are absent, the Helmet schema scripts
from App.jsx are not rendering — check that the outer Helmet is still emitting
the schema `<script>` tags after the Fix 1 meta tag cleanup.

**Test 3 — Use-case page:**
Paste `https://neera.store/for/office-meetings`. Expected result:
"CollectionPage" detected.

**For any "Invalid item" errors shown by the tool:** Click the error to expand it.
It will point to the exact field and the reason. Common causes are a missing
required property or a mistyped schema.org type name.

---

## E4 — Inspect specific URLs in GSC

After deploying all fixes, use GSC's URL Inspection tool to verify what Google
actually sees for your highest-priority pages.

**How to use:** GSC → URL Inspection → paste a URL → click "Test Live URL".

This triggers a real Googlebot crawl and shows you:
- The rendered HTML (post-JavaScript execution)
- Whether the page is indexable
- The detected canonical URL
- Any crawl errors

**Pages to inspect in this order:**

1. `https://neera.store/products` — confirm title is "All Sarees – Cotton & Linen
   Office Wear Sarees | Neera", not the old homepage title
2. `https://neera.store/for/office-meetings` — confirm it's indexable and the
   correct meta title appears in the rendered HTML
3. `https://neera.store/cart` — confirm Google sees `noindex` and marks it as
   "Excluded by 'noindex' tag". If it says "Indexable", the noindex Helmet fix
   from the red fixes document was not applied correctly.

---

---

# Fix F — Content (Ongoing)

These are not one-time code tasks. They are recurring content responsibilities that
compound over time. SEO content is the only fix in this document that has no
ceiling — code fixes are finite, content is ongoing.

---

## F1 — Write editorial copy for each use-case page

**Files affected:** `src/config/useCaseMap.js` (subheading field) and the rendered
output of `src/UseCasePage.jsx`.

**The problem this solves:** Right now the use-case pages have a headline and a
one-line subheading from `useCaseMap.js`. That is enough to render a page but not
enough for Google to rank it for competitive queries. A page that just shows a
product grid with one sentence of copy gives Google nothing to work with. The copy
*is* the SEO signal for use-case pages.

**What "editorial copy" means here:** A paragraph of 60–100 words, written in the
brand's voice, that answers the question the user was searching for before they
arrived. For "saree for office", the copy should explain *why* Neera's linen sarees
are the right choice — specific, honest, not generic. It is not marketing fluff.
It is the paragraph a working woman in Chennai would want to read before she decides
to buy.

**How to add it:** Add a `bodyCopy` field to each entry in `useCaseMap.js`:

```js
'office-meetings': {
  // ... existing fields ...
  bodyCopy: `Linen holds its drape through back-to-back meetings without 
    wrinkling or wilting. Neera's linen sarees are woven for the working 
    woman who needs to look composed at 9am and still feel comfortable at 6pm. 
    No embellishments, no fuss — just the kind of quiet authority that a 
    well-chosen linen brings to any room.`,
},
```

Then in `UseCasePage.jsx`, render `useCase.bodyCopy` as a `<p>` tag below the
subheading, before the product grid. Apply the same font and colour class as
`neera-product-page__desc` but at a slightly larger line-height for readability
(`style={{ lineHeight: '1.8' }}`).

**Do this for all three use-case entries.** The copy for each one should be distinct
— do not reuse sentences across pages. Google detects duplicate content across pages
on the same domain and discounts the weaker one.

**When to update:** Any time the brand positioning shifts, or when GSC shows that a
particular use-case page is getting impressions for a query you hadn't anticipated —
update the copy to address that query more directly.

---

## F2 — Alt text audit and improvement

**What it is:** Alt text is the text description on every `<img>` tag. Google reads
it to understand what the image shows. For an e-commerce site, alt text on product
images is one of the easiest keyword signals to strengthen.

**Current state across the codebase:**

| Location | Current alt text | Problem |
|----------|-----------------|---------|
| `FabricPage.jsx` | `${product.name} — Neera` | Acceptable but weak — no fabric, no use-case |
| `ProductImage.jsx` (grid) | `altText` prop (passed as `product.name` from callers) | Same — just the product name |
| `ProductPage.jsx` desktop main image | `product.name` | Just the name, no descriptor |
| `ProductPage.jsx` desktop thumbnails | `${product.name} thumbnail ${index + 1}` | "thumbnail 1" adds no value |
| `PrintPage.jsx` | `${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree` | Best in codebase — include fabric and type |

**The target pattern** (model `PrintPage.jsx`'s approach for all grids):

```
{product.name} — {product.fabric_type} saree for working women
```

Example output: `"Pink Plain Linen Saree — Linen saree for working women"`

This adds two keywords ("linen saree", "working women") to every product image
across the site with a single template change.

**Files to update:**

**`src/FabricPage.jsx`** — find the `<img>` in the product grid map. Change:
```jsx
alt={`${product.name} — Neera`}
```
to:
```jsx
alt={`${product.name} — ${product.fabric_type} saree for working women`}
```

**`src/App.jsx`** — find the `HomeProductSection` grid (the "New In" section on the
homepage). Each product card `<img>` has an alt. Apply the same pattern.

**`src/ProductPage.jsx`** — the desktop main image uses `alt={product.name}`. Change
to the full pattern. The thumbnail alt text `thumbnail ${index + 1}` should become
`${product.name} — view ${index + 1}`, which is still short but removes the
meaningless word "thumbnail".

**`src/components/ProductImage.jsx`** — this component receives `altText` as a prop.
The component itself does not need to change. The fix is at every call site that
passes `altText={product.name}` — change those to pass the full pattern instead.
Audit every file that renders `<ProductImage>` and confirm `altText` includes
fabric type and "working women".

**Do not change `PrintPage.jsx`** — its alt text is already the best in the codebase.

**Ongoing rule:** When new products are added to the database, the alt text is
generated from `product.name` and `product.fabric_type`. As long as those two fields
are filled correctly in the admin tool, the alt text formula works automatically.
No manual alt text entry is needed per product.

---

## Verification summary

| Fix | Where to verify | Pass condition |
|-----|----------------|----------------|
| E1 GSC property | GSC dashboard | Property shows "neera.store" verified |
| E1 sitemap | GSC → Sitemaps | Status "Success", discovered URLs ≈ product count |
| E2 baseline | PageSpeed results saved | LCP, CLS, INP scores recorded pre-fix |
| E3 product schema | Rich Results Test → product URL | Product entity with offers detected |
| E3 use-case schema | Rich Results Test → `/for/office-meetings` | CollectionPage detected |
| E4 noindex | GSC URL Inspection → `/cart` | "Excluded by noindex tag" |
| E4 use-case indexable | GSC URL Inspection → `/for/office-meetings` | "URL is on Google" (after ~2 weeks) |
| F1 copy | View `/for/office-meetings` in browser | Body paragraph visible below subheading, above grid |
| F2 alt text | DevTools → inspect any product image in FabricPage | alt reads full pattern with fabric + "working women" |
