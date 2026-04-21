# Neera SEO — Technical Instructions: Fixes A & B

---

## Fix A1 — Add `/order/` to robots.txt

**File: `public/robots.txt`**

The current file is missing the `/order/` disallow. Individual order detail pages
(`/order/:orderId`) are private, user-specific, and must never be indexed.

Find the existing Disallow block. Add one line after `/order-confirmation`:

```
Disallow: /order/
```

Final file should read:

```
User-agent: *
Allow: /
Disallow: /auth
Disallow: /checkout
Disallow: /cart
Disallow: /profile
Disallow: /order/
Disallow: /order-confirmation
Disallow: /search

Sitemap: https://neera.store/sitemap.xml
```

**Verification:** Open the deployed `https://neera.store/robots.txt` in browser and
confirm all Disallow lines are present exactly as above.

---

## Fix A2 — Wire sitemap generator into build script

**File: `package.json`**

Currently `scripts/generate-sitemap.js` must be run manually. If new products are
added and a deploy happens without running it, the sitemap goes stale. The fix is to
make it run automatically as part of every build.

Find the `"build"` entry inside the `"scripts"` object in `package.json`.

**Current (likely):**
```json
"build": "vite build"
```

**Change to:**
```json
"build": "node scripts/generate-sitemap.js && vite build"
```

**Intent:** The `&&` operator means the sitemap generator runs first. If it fails
(e.g. Supabase is unreachable), the build stops entirely and does not produce a stale
dist. This is the correct behaviour — a deploy without an up-to-date sitemap is worse
than no deploy.

**Dependency check:** The sitemap script uses `@supabase/supabase-js` and `fs`. Both
are already available in the project. No new packages needed.

**Verification:** Run `npm run build` locally. After it completes, open
`dist/sitemap.xml` and confirm the product count in the final console log matches the
number of live products in Supabase. Confirm `dist/robots.txt` is also present (Vite
copies `public/` contents into `dist/` automatically).

---

## Fix A3 — Submit sitemap to Google Search Console

This step happens after the next live deploy, not in development.

**Steps:**
1. Go to `search.google.com/search-console`
2. Select the `neera.store` property (create it if not yet set up — verify ownership
   via the HTML file method: download the verification file Google provides, place it
   in `public/`, deploy, then confirm in GSC)
3. In the left sidebar, click **Sitemaps**
4. In the "Add a new sitemap" field, enter: `sitemap.xml`
5. Click **Submit**

GSC will show status as "Success" within a few minutes if the file is reachable.
If it shows an error, fetch `https://neera.store/sitemap.xml` directly in a browser
to confirm it's accessible and valid XML.

**What to monitor after submission:**
- GSC → Sitemaps: check "Discovered URLs" count matches your product count
- GSC → Pages → "Why pages aren't indexed": check for any pages that should be
  indexed but aren't, or pages that are indexed but shouldn't be (cart, checkout etc.)

---

## Fix B1 — Add preconnect and dns-prefetch for Supabase

**File: `index.html`**

All product images are served from Supabase storage, which is a different origin from
`neera.store`. On a user's first visit, the browser must perform a DNS lookup + TCP
handshake + TLS negotiation before it can fetch the first image. This adds ~300–500ms
to first image load. A preconnect hint eliminates this by starting the connection
during HTML parsing, before any JavaScript runs.

Locate the `<head>` section in `index.html`. Add these two lines **before** any
`<link rel="stylesheet">` or `<script>` tags:

```html
<link rel="preconnect" href="https://qjkyzqvnvcgqejnlhegf.supabase.co" crossorigin>
<link rel="dns-prefetch" href="https://qjkyzqvnvcgqejnlhegf.supabase.co">
```

**Why both:** `preconnect` does DNS + TCP + TLS (full connection warm-up, higher
cost). `dns-prefetch` is a lighter fallback for browsers that don't support
preconnect. Using both together is the correct pattern.

**The `crossorigin` attribute is required** on the preconnect tag because Supabase
images are fetched as cross-origin resources. Without it, the browser opens a
connection that it then can't reuse for the actual image fetch, making the hint
useless.

**Verification:** After adding, open DevTools → Network tab → reload the page.
Click on any Supabase image request in the waterfall. Under the Timing section,
"Stalled" and "DNS Lookup" and "Initial connection" times should all be near 0ms,
indicating the connection was already established.

---

## Fix B2 — Add width and height to desktop thumbnail images

**File: `src/ProductPage.jsx`**

**The problem:** In the desktop view of ProductPage, the thumbnail strip renders
images without explicit `width` and `height` attributes. Without these, the browser
doesn't know the image's aspect ratio before it loads. When the images load in, they
push surrounding content down — this is Cumulative Layout Shift (CLS), which Google
measures as a Core Web Vitals ranking factor. Target CLS is below 0.1.

**Find the thumbnail section.** It is inside the desktop-only block
(`hidden lg:block`) in ProductPage. The thumbnail images are rendered inside a
`.map()` over `product.images`. The `<img>` tag inside that map currently looks like:

```jsx
<img
  src={img}
  alt={`${product.name} thumbnail ${index + 1}`}
  loading="lazy"
  decoding="async"
  className={`w-full h-full object-contain transition-opacity ...`}
/>
```

**Add `width` and `height` attributes** matching the container dimensions. The
container div uses Tailwind class `w-20` (80px wide) and `aspect-[9/16]` which makes
the height `80 * (16/9) = 142px`. Use the nearest whole number:

```jsx
<img
  src={img}
  alt={`${product.name} thumbnail ${index + 1}`}
  loading="lazy"
  decoding="async"
  width={80}
  height={142}
  className={`w-full h-full object-contain transition-opacity ...`}
/>
```

**Why this works:** When `width` and `height` are present, the browser calculates
the aspect ratio (`80/142`) before the image loads and reserves exactly that space in
the layout. The image loading in no longer causes any surrounding elements to move.

**Verification:** Open a product page in DevTools → Lighthouse tab → run a
Performance audit. Check the CLS score. Alternatively, open DevTools → Performance
tab → record a page load → look for "Layout Shift" markers in the timeline. After
the fix, there should be no layout shift events caused by the thumbnails.

---

## Fix B3 — Shorten homepage title

**File: `src/utils/metaTags.js`**

**The problem:** The current homepage title is 68 characters. Google truncates titles
at approximately 60 characters in search results, cutting off the end of your title
and replacing it with `...`. Your brand name and the key value proposition should
both be fully visible in the SERP.

**Current title (68 chars):**
```
Neera Sarees – Cotton & Linen Sarees for Working Women | neera.store
```

**Find `getHomeMetaTags()`** in `metaTags.js`. Near the end of the function, there
is a line that overrides `meta.title` directly (bypassing the 60-char truncation
applied inside `generateMetaTags`). It reads:

```js
meta.title = 'Neera Sarees \u2013 Cotton & Linen Sarees for Working Women | neera.store';
```

**Change it to (47 chars):**
```js
meta.title = 'Neera \u2013 Cotton & Linen Sarees for Working Women';
```

**Reasoning for this specific wording:**
- "Neera" is the brand — keeps it first for brand searches
- "Cotton & Linen Sarees for Working Women" is the primary keyword cluster
- The domain `neera.store` is already shown by Google in the URL below the title —
  repeating it in the title wastes characters
- "Sarees" is dropped from after "Neera" because the rest of the title already
  contains "Sarees" — no keyword loss

**The `og:title` in the `openGraph` object is set separately inside
`generateMetaTags` from the truncated version, so it is already under 60 chars and
does not need to change.** Only the `meta.title` override line needs updating.

**Verification:** After deploying, paste `https://neera.store` into
`search.google.com/test/rich-results` or inspect the page source. The `<title>` tag
should read exactly the new string. To preview how it will look in Google search
results, use `https://www.google.com/webmasters/tools/richsnippets` or any SERP
snippet preview tool — paste the new title and confirm it renders fully without
truncation.

---

## Verification summary

| Fix | Where to verify | Pass condition |
|-----|----------------|----------------|
| A1 robots.txt | `https://neera.store/robots.txt` in browser | `/order/` Disallow line present |
| A2 build script | Run `npm run build`, inspect `dist/sitemap.xml` | File exists, product count logged |
| A3 GSC submission | Google Search Console → Sitemaps | Status shows "Success" |
| B1 preconnect | DevTools → Network → any Supabase image → Timing | DNS Lookup ≈ 0ms |
| B2 thumbnail dimensions | DevTools → Lighthouse → Performance | No CLS from thumbnails |
| B3 title length | View source on homepage | `<title>` is 47 chars |
