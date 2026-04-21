# Neera SEO — Technical Instructions: Fix D (Use-Case Collection Pages)

Approach A: use-case pages are a config-driven frontend layer.
No database changes. Admin workflow is unchanged.

Seven steps in dependency order. Each step must be completed before the next.

---

## D1 — Create `src/config/useCaseMap.js`

**File to create: `src/config/useCaseMap.js`**

This is a new file. It is the single source of truth for every use-case page on the
site. When a new use-case needs to be added in future, only this file changes —
no new components, no new routes.

**Structure intent:** An exported constant `USE_CASES` that is an object keyed by
URL slug. Each entry carries everything the page needs to render itself and everything
the SEO layer needs to describe it.

```js
export const USE_CASES = {
  'office-meetings': {
    slug: 'office-meetings',
    navLabel: 'Presentation Days',
    headline: 'Presentation Days.',
    label: 'Office & Meetings',
    subheading: 'Crisp structure that holds the drape. Looks senior-level from the
      first meeting to the last.',
    fabrics: ['Linen', 'linen'],
    metaTitle: 'Sarees for Office & Meetings | Neera',
    metaDescription: 'Shop Neera\'s linen sarees built for the office. Crisp drape,
      breathable fabric, office-ready from the first meeting to the last.
      Free shipping across India.',
    canonicalPath: '/for/office-meetings',
  },
  'everyday-work': {
    slug: 'everyday-work',
    navLabel: 'Everyday at Work',
    headline: 'Everyday at Work.',
    label: 'Everyday Wear',
    subheading: 'Feather-light. Breathable. Built for 8-hour days.',
    fabrics: ['Mulmul', 'mulmul', 'Mul Mul Cotton', 'mul mul cotton'],
    metaTitle: 'Everyday Work Sarees | Neera',
    metaDescription: 'Shop Neera\'s Mulmul cotton sarees for working women.
      Feather-light, breathable, and comfortable across an 8-hour workday.
      Free shipping across India.',
    canonicalPath: '/for/everyday-work',
  },
  'heritage-occasions': {
    slug: 'heritage-occasions',
    navLabel: 'Heritage Days',
    headline: 'Heritage Days.',
    label: 'Heritage & Occasions',
    subheading: 'Bold weaves. Deep heritage. Dressed for the room.',
    fabrics: ['Chettinad', 'chettinad'],
    metaTitle: 'Chettinad Sarees for Occasions | Neera',
    metaDescription: 'Discover Neera\'s Chettinad sarees. Bold traditional weaves
      with heritage structure — made for occasions that deserve it.
      Free shipping across India.',
    canonicalPath: '/for/heritage-occasions',
  },
};
```

**Notes:**

- `fabrics` is an array to handle case variations that exist in the database
  (e.g. `'Linen'` and `'linen'`). The filter in UseCasePage will use
  case-insensitive comparison against this array.
- Add or remove entries in this object as the brand's use-case positioning evolves.
  No other file needs to change for additions.
- The three entries above map to the three fabric types currently in the catalog.
  If a new fabric type is added to the database in future, add a new entry here.

---

## D2 — Create `src/UseCasePage.jsx`

**File to create: `src/UseCasePage.jsx`**

This is a new page component. Its structure is a direct parallel to
`src/FabricPage.jsx` — read that file first before writing this one, as the product
grid, Helmet pattern, and schema calls follow the same shape.

**Props:** `{ allProducts }` — same as FabricPage.

**Step 1 — Imports.** Import the following at the top:
- `useParams`, `Link` from `react-router-dom`
- `Helmet` from `react-helmet-async`
- `USE_CASES` from `./config/useCaseMap`
- `getUseCaseMetaTags` from `./utils/metaTags` (created in D3)
- `getCollectionSchema`, `getOrganizationSchema` from `./utils/schemaMarkup`
- `ProductImage` from `./components/ProductImage`

**Step 2 — Read the URL param and look up the use-case config.**

```js
const { useCaseSlug } = useParams();
const useCase = USE_CASES[useCaseSlug];
```

If `useCase` is undefined (someone visits an unknown slug), render a redirect to
`/products` using `useNavigate`. Pattern this exactly as `ProductPage.jsx` does
when a product slug is not found — navigate with `replace: true`.

**Step 3 — Filter products.**

```js
const filteredProducts = allProducts.filter(p =>
  useCase.fabrics.some(f => f.toLowerCase() === p.fabric_type.toLowerCase())
);
```

The `.some()` with case-insensitive comparison handles all the fabric name variants
in `useCaseMap` without needing a normalisation function.

**Step 4 — Generate meta tags and schema.**

```js
const meta = getUseCaseMetaTags(useCase);
const collectionSchema = getCollectionSchema(
  useCase.metaTitle,
  useCase.metaDescription,
  useCase.canonicalPath,
  filteredProducts.length
);
const orgSchema = getOrganizationSchema();
```

**Step 5 — Helmet block.** Follow the exact same Helmet structure as `FabricPage.jsx`:
title, description, canonical, OG tags, Twitter tags, then two
`<script type="application/ld+json">` blocks for `collectionSchema` and `orgSchema`.

**Step 6 — Page header.** Render the use-case label, headline, and subheading from
the config object. Use the same CSS classes as `FabricPage.jsx`:
`neera-product-page__label`, `neera-product-page__heading`,
`neera-product-page__desc`. This ensures visual consistency with zero new CSS.

**Step 7 — Product grid.** Render `filteredProducts` using the same grid and card
structure as `FabricPage.jsx`. In the map, pass `isPriority={index === 0}` to
`ProductImage` for the first card (this is the lazy-loading fix from the red fixes
document). Pass `index` to apply `loading="eager"` on the first three cards.

**Step 8 — Internal link back to the fabric page.** Below the grid, add a small
text link: `"Browse all {useCase.label} sarees by fabric →"` pointing to the
corresponding `/fabric/{fabricName}` page. This cross-links the two page types,
which builds topical relevance. For example, the office-meetings page links to
`/fabric/Linen`. Use the first entry in `useCase.fabrics` to construct this URL.

**Step 9 — Empty state.** If `filteredProducts.length === 0`, render the same empty
state as `FabricPage.jsx` with a link back to `/products`.

---

## D3 — Add `getUseCaseMetaTags` to `src/utils/metaTags.js`

**File: `src/utils/metaTags.js`**

Add one new exported function at the bottom of the file. Its signature accepts a
single `useCase` object (one entry from `USE_CASES` in useCaseMap.js).

**Intent:** Call the existing `generateMetaTags` utility internally, passing the
fields from the useCase config. No new logic — the function is a thin adapter so
`UseCasePage.jsx` doesn't need to call `generateMetaTags` directly.

```js
export function getUseCaseMetaTags(useCase) {
  return generateMetaTags({
    title: useCase.metaTitle,
    description: useCase.metaDescription,
    canonical: useCase.canonicalPath,
    type: 'website',
  });
}
```

That is the entire function. `generateMetaTags` handles title truncation, OG tags,
Twitter tags, and the full canonical URL construction automatically.

---

## D4 — Register the route in `src/App.jsx`

**File: `src/App.jsx`**

**Step 1 — Add the import.** At the top of the file with the other page imports:

```js
import UseCasePage from './UseCasePage.jsx';
```

**Step 2 — Add the route.** Inside the `<Routes>` block, add the new route
**before** the `/fabric/:fabricName` route. Order matters in React Router — more
specific paths should come before param-based ones:

```jsx
<Route
  path="/for/:useCaseSlug"
  element={<UseCasePage allProducts={products} />}
/>
```

Place it between the `/products` route and the `/fabric/:fabricName` route.

**Step 3 — No other changes to App.jsx are needed.** The outer Helmet in AppContent
does not need a use-case branch — UseCasePage handles its own Helmet internally,
exactly as FabricPage and ProductPage do.

---

## D5 — Update navigation in `src/App.jsx`

**File: `src/App.jsx`**

The desktop SHOP dropdown currently links to `/fabric/linen` and
`/fabric/Mul Mul Cotton`. These must change to point to the new use-case URLs.
The nav labels ("Presentation Days", "Everyday at Work") are already correct and
should stay exactly as they are.

**Find the desktop dropdown** inside the `Header` component. It currently reads:

```jsx
<Link to="/fabric/linen" ...>Presentation Days</Link>
<Link to="/fabric/Mul Mul Cotton" ...>Everyday at Work</Link>
```

**Change the `to` props only:**

```jsx
<Link to="/for/office-meetings" ...>Presentation Days</Link>
<Link to="/for/everyday-work" ...>Everyday at Work</Link>
```

Add a third entry for the Chettinad use-case, following the same JSX pattern as the
existing two items. Place it between "Everyday at Work" and the divider:

```jsx
<Link to="/for/heritage-occasions" ...>Heritage Days</Link>
```

**Find the mobile menu** (`MobileMenu` component, also in `App.jsx`). It currently
has a button for "Everyday at Work" that navigates to a fabric URL. Apply the same
URL changes as above to all use-case entries in the mobile menu. The mobile menu
uses `handleNavigate()` calls, not `<Link>` components — change the string argument
passed to `handleNavigate`, not the JSX element type.

---

## D6 — Add use-case pages to `scripts/generate-sitemap.js`

**File: `scripts/generate-sitemap.js`**

The sitemap generator currently handles homepage, `/products`, product pages, fabric
pages, print pages, and key pages. Use-case pages are not included.

**Step 1 — Import USE_CASES at the top of the file.** The sitemap script uses
ES module imports (it has `import ... from ...` at the top). Add:

```js
import { USE_CASES } from '../src/config/useCaseMap.js';
```

**Step 2 — Add a use-case URL block** in the sitemap generation loop, after the
fabric category block and before the print category block:

```js
// Use-case pages
Object.values(USE_CASES).forEach(useCase => {
  sitemap += '  <url>\n';
  sitemap += `    <loc>${BASE_URL}${useCase.canonicalPath}</loc>\n`;
  sitemap += '    <changefreq>weekly</changefreq>\n';
  sitemap += '    <priority>0.85</priority>\n';
  sitemap += '  </url>\n';
});
```

**Priority is set to 0.85**, above fabric pages (0.7) and below `/products` (1.0).
The reasoning: use-case pages are the primary SEO targets for high-value queries
("saree for office"), so they deserve higher crawl priority than fabric pages.

**Step 3 — Update the console.log summary** at the bottom to include use-case pages
in the total count:

```js
console.log(`   - Use-case pages: ${Object.keys(USE_CASES).length} (priority 0.85)`);
```

---

## D7 — Add internal links from FabricPage to use-case pages

**File: `src/FabricPage.jsx`**

**The purpose:** When a user (or Googlebot) lands on `/fabric/Linen`, they should
see a contextual link to `/for/office-meetings`. This cross-link tells Google that
these two pages are topically related, which strengthens the use-case page's
authority on "office saree" queries. This is the internal linking signal mentioned
in the SEO report.

**Step 1 — Import USE_CASES.**

```js
import { USE_CASES } from './config/useCaseMap.js';
```

**Step 2 — Compute the related use-case** for the current fabric page. After
`filteredProducts` is computed, add:

```js
const relatedUseCase = Object.values(USE_CASES).find(uc =>
  uc.fabrics.some(f => f.toLowerCase() === normalizedFabricName)
);
```

**Step 3 — Render the contextual link** in the page header section, below the
`fabricDesc` paragraph and above the product grid. Only render it when
`relatedUseCase` is not null:

```jsx
{relatedUseCase && (
  <p className="neera-product-page__desc" style={{ marginTop: '0.5rem' }}>
    <Link
      to={relatedUseCase.canonicalPath}
      style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
    >
      Shop {relatedUseCase.headline.replace('.', '')} →
    </Link>
  </p>
)}
```

The inline style matches the existing understated link style used elsewhere in the
codebase. Do not add a new CSS class — the existing `neera-product-page__desc` class
handles font size and colour.

---

## Verification

| Step | How to verify | Pass condition |
|------|--------------|----------------|
| D1 | Open `useCaseMap.js` in editor | Three entries, each with all required keys |
| D2 | `npm run dev` → navigate to `/for/office-meetings` | Page renders with Linen products and "Presentation Days." headline |
| D2 | Navigate to `/for/unknown-slug` | Redirects to `/products` |
| D3 | Inspect page source on `/for/office-meetings` | `<title>` reads "Sarees for Office & Meetings \| Neera" |
| D3 | Inspect page source canonical | `<link rel="canonical" href="https://neera.store/for/office-meetings">` |
| D4 | DevTools → Elements → head on use-case page | Two `<script type="application/ld+json">` blocks present |
| D5 | Desktop nav → hover SHOP dropdown | Three use-case items visible, clicking each navigates correctly |
| D5 | Mobile: open menu | Use-case items navigate to `/for/*` URLs |
| D6 | `npm run build` → open `dist/sitemap.xml` | Three `/for/*` URLs present with priority 0.85 |
| D7 | Navigate to `/fabric/Linen` | "Shop Presentation Days →" link visible, clicking goes to `/for/office-meetings` |

---

## What this achieves

After D1–D7 are complete, the following pages exist and are crawlable:

```
https://neera.store/for/office-meetings     ← targets "saree for office"
https://neera.store/for/everyday-work       ← targets "everyday work saree"
https://neera.store/for/heritage-occasions  ← targets "chettinad saree occasion"
```

Each has its own title, meta description, canonical URL, CollectionPage schema,
and sitemap entry. The navigation links to them. FabricPage cross-links to them.
Google has a clear path to discover, crawl, and rank all three for use-case queries
that the brand currently has zero presence on.
