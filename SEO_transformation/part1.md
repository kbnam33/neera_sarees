The red critical fixes are three distinct problems. Here they are as precise engineering instructions.

---

## Fix 1 — Meta tag inheritance bug
**File: `src/App.jsx`**

**The problem:** The `currentMeta` variable only handles `/` and `/products`. Every other route falls through to `homeMeta`. Pages like `/story`, `/search`, `/cart`, `/checkout`, `/auth`, `/profile`, `/order-confirmation` all broadcast the homepage title to Google.

**Step 1 — Remove the broken `currentMeta` logic entirely.**

Find this block in `AppContent`:
```js
const currentMeta = location.pathname === '/products' ? allSareesMeta : 
                   location.pathname === '/' ? homeMeta : homeMeta;
```
Delete it. The outer `<Helmet>` in `AppContent` should only carry sitewide schema (Organization, WebSite) — not page-level meta. Page-level meta belongs inside each page component.

**Step 2 — Strip meta tags from the outer `<Helmet>` in `AppContent`.**

Keep only the schema `<script>` tags in the outer Helmet block. Remove `<title>`, `<meta name="description">`, `<link rel="canonical">`, and all OG/Twitter tags from it. The outer Helmet should look like:
```jsx
<Helmet>
  <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
  {isHomepage && <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>}
</Helmet>
```

**Step 3 — Add `noindex` Helmet to transactional pages.**

These four components have no Helmet at all. Open each file and add a minimal Helmet at the top of the return statement. The intent is: tell Google these pages must never appear in search results.

- **`src/CartPage.jsx`** — add `<Helmet><meta name="robots" content="noindex, nofollow"/></Helmet>`
- **`src/CheckoutPage.jsx`** — same as above
- **`src/AuthPage.jsx`** — same as above
- **`src/ProfilePage.jsx`** — same as above
- **`src/OrderDetailPage.jsx`** — same as above
- **`src/OrderConfirmationPage.jsx`** — same as above

**Step 4 — Add a proper Helmet to `StoryPage`.**

**File: `src/StoryPage.jsx`**

Import `getStoryMetaTags` from `metaTags.js` (you'll create this in step 5). Add a Helmet block with title, description, canonical, and OG tags, same pattern as `PrivacyPolicy.jsx` or `TermsAndConditions.jsx` which are already correct.

**Step 5 — Add `getStoryMetaTags` function.**

**File: `src/utils/metaTags.js`**

Add a new exported function `getStoryMetaTags`. Intent: the story page is an evergreen brand page, title should include the brand value proposition, canonical should be `/story`. Follow the exact same call signature as `getPrivacyPolicyMetaTags` — call `generateMetaTags({title, description, canonical, type: 'website'})` internally.

---

## Fix 2 — Print page canonical URL mismatch
**File: `src/utils/metaTags.js`**

**The problem:** `getPrintCategoryMetaTags` sets canonical to `` `/prints/${printType}` `` (plural). The actual route in App.jsx is `/print/:printName` (singular). Canonical points to a 404.

**Step 1 — One character fix.**

Inside `getPrintCategoryMetaTags`, find the `canonical` field in the `generateMetaTags` call. Change:
```js
canonical: `/prints/${printType}`
```
to:
```js
canonical: `/print/${printType}`
```

That's the entire fix. Verify the route in `App.jsx` reads `path="/print/:printName"` to confirm the singular form.

---

## Fix 3 — Hero image LCP (assets folder images)
**Files: `index.html`, hero component in `src/App.jsx`, `public/` folder**

**The problem:** The hero background image is discovered late (only after CSS parses), it's probably a large unoptimised JPEG or PNG, and the browser has no signal to prioritise it. The grey screen you see is the render before the image arrives.

**Step 1 — Move the hero image to `public/`.**

Currently the hero image is in `src/assets/` which means Vite hashes its filename on every build (e.g. `hero-Dj3kXp9a.jpg`). This makes it impossible to write a stable preload tag in `index.html`. Move it to `public/hero-bg.jpg` (or whatever your filename is). Files in `public/` are copied as-is with no hashing, so the filename is always predictable.

**Step 2 — Add a preload link in `index.html`.**

**File: `index.html`**

In the `<head>`, before any `<link rel="stylesheet">` or `<script>` tags, add:
```html
<link rel="preload" as="image" href="/hero-bg.jpg" fetchpriority="high">
```
This tells the browser to start downloading the hero image in parallel with HTML parsing — before it even executes any JavaScript or CSS.

**Step 3 — Update the image reference in the hero component.**

**File: `src/App.jsx`** (or wherever the hero `<img>` is rendered)

Change the `src` of the hero `<img>` from the old assets import (which was something like `import heroBg from './assets/hero-bg.jpg'`) to the string `"/hero-bg.jpg"`. Remove the import statement entirely.

Add two attributes to the `<img>` element:
- `fetchPriority="high"` — tells the browser this image is the most important resource
- `decoding="sync"` — don't defer decoding, paint it immediately when ready

Remove `loading="lazy"` from this image if it exists.

**Step 4 — Delay the hero animation until image is ready.**

**File: `src/App.jsx`** (hero section) and **`src/styles/hero.css`**

In the hero component, add a `useState(false)` called `heroLoaded`. On the `<img>` element, add `onLoad={() => setHeroLoaded(true)}`.

Pass `heroLoaded` as a conditional CSS class to the `<img>`: when false, the element has no animation class; when true, add a class like `is-loaded`.

In `hero.css`, move the `animation: hero-breathe` declaration so it only applies when `.neera-hero__bg-img.is-loaded` — not on the base `.neera-hero__bg-img` selector. This prevents the animation running on an invisible element and eliminates the visible pop when the image finally arrives.

**Step 5 — Compress the hero image before placing it in `public/`.**

Before moving the file, run it through [Squoosh.app](https://squoosh.app) manually. Export as WebP at quality 82. Target file size under 200KB for a full-viewport image. If the original is a PNG, this step alone will likely cut the file size by 60–80%.

Replace `hero-bg.jpg` with `hero-bg.webp`. Update the preload `href` and the `<img src>` to `.webp`. For Safari compatibility, wrap in a `<picture>` element in the hero component:
```
<picture>
  <source srcSet="/hero-bg.webp" type="image/webp" />
  <img src="/hero-bg.jpg" ... />  ← keep a jpg fallback in public/ too
</picture>
```

---

## Fix 4 — First product images lazy-loaded (LCP on collection pages)
**File: `src/FabricPage.jsx`**

**The problem:** Every product card image has `loading="lazy"` regardless of position. The first 3–4 images on a collection page are always above the fold — lazy-loading them delays the LCP signal.

**Step 1 — Thread the array index into the image render.**

In `FabricPage.jsx`, the product list is rendered with `.map((product) => ...)`. Change the map callback to `.map((product, index) => ...)` to get the position of each product in the list.

**Step 2 — Make `loading` and `fetchpriority` conditional on index.**

On the `<img>` element inside the map, change the static `loading="lazy"` to a ternary:
- If `index < 3`: `loading="eager"` and add `fetchPriority="high"` (only on `index === 0`) or `fetchPriority="auto"` (for index 1 and 2)
- If `index >= 3`: `loading="lazy"`, no fetchPriority attribute

The intent: the browser eagerly fetches the first three product images because they're guaranteed to be visible on load. Everything below the fold stays lazy.

**Step 3 — Same fix for `src/components/ProductImage.jsx`.**

`ProductImage` uses an `IntersectionObserver` that gates loading behind viewport entry. For the very first card on the page this is wrong — it's already in the viewport.

Add an `isPriority` boolean prop to `ProductImage`. When `isPriority` is true, set `shouldLoad` to `true` immediately in the initial `useState` call (`useState(true)` instead of `useState(false)`) and skip the IntersectionObserver setup entirely in the `useEffect`.

In every place `ProductImage` is rendered inside a list, pass `isPriority={index === 0}` for the first card.

---

## Verification checklist after all fixes

| Fix | How to verify |
|---|---|
| Meta bug | Open `/story` in browser, inspect `<title>` in DevTools — should NOT say "Neera Sarees" anymore |
| noindex pages | Open `/cart`, view page source, search for `noindex` |
| Print canonical | Open `/print/Floral`, inspect `<link rel="canonical">` — should say `/print/Floral` not `/prints/Floral` |
| Hero preload | Open DevTools → Network → filter by Img — hero image should appear at the very top of the waterfall |
| LCP lazy fix | Open `/fabric/Linen`, DevTools → Network → filter Img — first 3 images should have `Priority: High` not `Low` |