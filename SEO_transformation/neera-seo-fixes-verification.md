# Neera SEO — Technical Instructions: Verification Fixes

Fixes identified during development verification session.
Four independent fixes — each can be executed in any order.

---

## Fix V1 — Hero image 404

**Problem:** `index.html` preload tag and hero component reference `hero-bg.webp`
but the file does not exist in `public/`. Browser fetches it, gets 404, hero
remains invisible.

**The actual filename is `hero-bg.jpeg`.**

---

**Step 1 — Copy the image file.**

Take the hero background image file from wherever it currently lives
(likely `src/assets/`) and copy it into the `public/` folder at the project root.
The destination path must be exactly:

```
public/hero-bg.jpeg
```

Do not rename it. Do not place it in a subfolder like `public/images/`.
Vite serves `public/` contents at the root URL — `public/hero-bg.jpeg` becomes
accessible at `https://neera.store/hero-bg.jpeg`.

---

**Step 2 — Fix the preload tag in `index.html`.**

**File: `index.html`**

Find the preload link that was added as part of the hero image fix. It currently
references `.webp`. Change the `href` to match the actual filename:

```html
<!-- Wrong -->
<link rel="preload" as="image" href="/hero-bg.webp" fetchpriority="high">

<!-- Correct -->
<link rel="preload" as="image" href="/hero-bg.jpeg" fetchpriority="high">
```

---

**Step 3 — Fix the image reference in the hero component.**

**File: `src/App.jsx`** (hero section — look for the `BrandHero` component or the
`<img>` tag with the hero background)

The `<img src>` and/or `<source srcSet>` currently reference `.webp`. Change both
to `.jpeg`:

```jsx
<!-- If using a <picture> element -->
<source srcSet="/hero-bg.jpeg" type="image/jpeg" />
<img src="/hero-bg.jpeg" ... />

<!-- If using a plain <img> -->
<img src="/hero-bg.jpeg" fetchPriority="high" decoding="sync" ... />
```

Also remove any `import heroBg from './assets/...'` statement at the top of the
file if it exists — the image is now served from `public/` as a static path string,
not as a Vite module import.

---

**Step 4 — Remove the `<source type="image/webp">` tag if present.**

If a `<picture>` element was added with a WebP source and JPEG fallback, simplify
it to a plain `<img>` since there is only one format available:

```jsx
<img
  src="/hero-bg.jpeg"
  fetchPriority="high"
  decoding="sync"
  alt=""
  className="neera-hero__bg-img"
  onLoad={() => setHeroLoaded(true)}
/>
```

The `alt=""` is intentional — the hero is a decorative background image.
Screen readers skip empty alt text correctly.

---

**Verification:** Run `npm run dev`, open the homepage. The hero image should
appear immediately on load with no grey flash. In DevTools → Network → filter Img
— `hero-bg.jpeg` should appear at the very top of the image waterfall with
Priority: Highest.

---

## Fix V2 — `fetchPriority` casing error in FabricPage

**Problem:** React warns `does not recognize the 'fetchPriority' prop`.
React in this project version treats camelCase `fetchPriority` as an unknown prop
on a DOM element. The HTML attribute must be all-lowercase when used on native
`<img>` tags in JSX.

**File: `src/FabricPage.jsx`**

Find every `<img>` tag that has `fetchPriority` as a prop. The error trace points
to `FabricPage.jsx:24` — the product grid image inside the `.map()`.

Change every instance of camelCase to lowercase:

```jsx
// Wrong — React warning
fetchPriority="high"
fetchPriority="auto"

// Correct — lowercase HTML attribute
fetchpriority="high"
fetchpriority="auto"
```

**Also check `src/UseCasePage.jsx`** — it was created following the same pattern
as FabricPage and likely has the same casing. Apply the same lowercase fix to any
`fetchPriority` props on `<img>` tags in that file.

**Do not change `index.html`** — the `<link rel="preload" fetchpriority="high">`
in HTML files is already correct lowercase. This fix is only for JSX files.

---

**Verification:** Run `npm run dev`, open `/fabric/linen`. DevTools Console should
show zero `fetchPriority` warnings. The 2 errors count in the Console tab header
should drop by at least 1.

---

## Fix V3 — Nav dropdown still routing to fabric pages (D5 not executed)

**Problem:** SHOP dropdown links to `/fabric/linen` and `/fabric/Mul%20Mul%20Cotton`
instead of the new use-case URLs. D5 was not applied during the main execution.

**File: `src/App.jsx`**

There are two places to update — the desktop dropdown inside `Header` and the
mobile menu inside `MobileMenu`. Both are in `App.jsx`.

---

**Desktop dropdown — find these two `<Link>` elements:**

```jsx
// Current (wrong)
<Link to="/fabric/linen" ...>Presentation Days</Link>
<Link to="/fabric/Mul Mul Cotton" ...>Everyday at Work</Link>
```

**Change only the `to` prop on each. Do not change the label text, className,
or onClick:**

```jsx
// Correct
<Link to="/for/office-meetings" ...>Presentation Days</Link>
<Link to="/for/everyday-work" ...>Everyday at Work</Link>
```

**Add the third entry** for Heritage Days. Place it between the "Everyday at Work"
link and the `<div className="neera-nav__dropdown-divider" />` line. Copy the
exact JSX structure of one of the existing entries and change only `to` and the
label text:

```jsx
<Link
  to="/for/heritage-occasions"
  onClick={() => setActiveDropdown(null)}
  className="neera-nav__dropdown-item"
>
  Heritage Days
</Link>
```

---

**Mobile menu — find the `MobileMenu` component** in `App.jsx`.

It uses `handleNavigate()` calls instead of `<Link>` components. Find the buttons
for "Presentation Days" and "Everyday at Work". Change the string argument passed
to `handleNavigate`:

```jsx
// Current (wrong)
onClick={() => handleNavigate('/fabric/linen')}
onClick={() => handleNavigate('/fabric/Mul Mul Cotton')}

// Correct
onClick={() => handleNavigate('/for/office-meetings')}
onClick={() => handleNavigate('/for/everyday-work')}
```

Add a third button for Heritage Days following the exact same JSX structure as the
existing two entries:

```jsx
<button
  onClick={() => handleNavigate('/for/heritage-occasions')}
  className="text-left font-serif text-neera-accent text-2xl py-3
    border-b border-neera-border w-full flex items-center justify-between"
>
  Heritage Days
  <ArrowRightIcon className="w-4 h-4 opacity-40" />
</button>
```

---

**Verification:** Run `npm run dev`. Hover over SHOP in the desktop header — all
three items should be visible ("Presentation Days", "Everyday at Work",
"Heritage Days"). Click each one and confirm the URL changes to `/for/*`.
On mobile viewport, open the hamburger menu and confirm the same three entries
navigate to `/for/*` URLs.

---

## Fix V4 — product_reviews table creation

**Problem:** Two sequential type mismatch errors prevented table creation.
Both `products.id` and `orders.id` in this database use `bigint`, not `uuid`.
The original migration used `uuid` for both foreign key columns — incorrect.

**Where:** Supabase dashboard → SQL Editor.

If the table was partially created during previous attempts, drop it first:

```sql
DROP TABLE IF EXISTS product_reviews;
```

Then run the corrected full statement:

```sql
CREATE TABLE product_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    bigint NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id      bigint REFERENCES orders(id) ON DELETE SET NULL,
  reviewer_name text NOT NULL,
  rating        smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text   text,
  is_approved   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved);
```

**Key differences from previous attempts:**
- `product_id` is `bigint` — matches `products.id`
- `order_id` is `bigint` — matches `orders.id`
- `id` (the review's own primary key) remains `uuid` — this column references
  nothing, so type is a free choice and `uuid` is correct here

---

**After the table is created, add RLS policies.**

In Supabase dashboard → Authentication → Policies → select `product_reviews` table.

**Policy 1 — Public read of approved reviews:**
- Policy name: `Allow public read of approved reviews`
- Target roles: Leave blank (applies to all including anon)
- Operation: SELECT
- USING expression: `is_approved = true`

**Policy 2 — Authenticated insert:**
- Policy name: `Allow authenticated users to insert reviews`
- Target roles: `authenticated`
- Operation: INSERT
- WITH CHECK expression: `true`

Do not add UPDATE or DELETE policies at this stage — review approval is managed
directly in the Supabase table editor by the admin.

---

**Verification:** In Supabase → Table Editor — `product_reviews` table should
appear in the list with 9 columns. Click it and confirm the column types:
`product_id` shows `int8` (bigint), `order_id` shows `int8`, `id` shows `uuid`.
In Authentication → Policies — two policies should be listed under
`product_reviews`.

---

## Verification summary

| Fix | Command / URL | Pass condition |
|-----|--------------|----------------|
| V1 hero image | `npm run dev` → homepage | Hero image visible, no grey screen |
| V1 network | DevTools → Network → Img | `hero-bg.jpeg` at top of waterfall, Priority: Highest |
| V2 fetchPriority | DevTools → Console on `/fabric/linen` | Zero `fetchPriority` warnings |
| V3 desktop nav | Hover SHOP dropdown | Three items, each links to `/for/*` |
| V3 mobile nav | Open hamburger menu | Three use-case items navigate to `/for/*` |
| V4 table | Supabase Table Editor | `product_reviews` visible with correct column types |
| V4 RLS | Supabase → Policies | Two policies on `product_reviews` |
