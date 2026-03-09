# Neera Website – Changes Made Today

> **Date:** Tuesday, 9 March 2026  
> All changes apply exclusively to the **React/Vite website** (`src/`). The Next.js version was removed entirely (see section 4).

---

## 1. Product Visibility – Filter by `is_public` Flag

### What changed
Added `.eq('is_public', true)` to the products query in `src/App.jsx` so only products explicitly marked as public in the database are fetched and loaded into the app.

### Why
The admin tool had already introduced an `is_public` column on the `products` table, allowing the team to mark individual products as private (e.g., discontinued lines, work-in-progress listings, or seasonal items being held back). Without filtering this in the website's data fetch, every product — including private ones — was being shown to customers.

**File changed:** `src/App.jsx`

---

## 2. Fabric Visibility – Filter Products by Public Fabrics

### What changed
- Added `.eq('is_public', true)` to the `fabrics` fetch in `src/App.jsx`.
- After fetching both products and fabrics, products are now cross-filtered so that any product whose `fabric_type` belongs to a private fabric is also excluded from the site — even if the product itself is marked public.

### Why
A new `is_public` column was added to the `fabrics` table in the database (SQL executed manually in Supabase). This lets the admin hide an entire fabric category at once — useful when a fabric line is being retired, restocked, or not yet ready for launch. Any product belonging to a hidden fabric should automatically disappear from all pages (homepage, all-sarees listing, fabric category pages, print pages, and product detail pages) without needing to individually mark every product as private.

**File changed:** `src/App.jsx`

---

## 3. SEO Optimisation – Working Women Keyword Strategy

All SEO changes implement a focused keyword strategy around **"cotton sarees for working women"**, **"linen sarees for office"**, **"Mulmul cotton sarees"**, and **"Chettinad sarees"** — reflecting Neera's core customer (professional Indian women who want breathable, office-appropriate sarees).

### 3a. Homepage – Hero Copy
**File:** `src/App.jsx` (`BrandHero` component)

| Element | Before | After |
|---|---|---|
| `<h1>` | "Composed in Silence." | "Cotton & Linen Sarees for Working Women" |
| `<p>` | "Clothing shaped by patience, restraint, and clarity." | "Neera crafts Mulmul cotton, pure linen, and Chettinad sarees designed for the working woman – breathable, minimal, and office-ready. Free shipping across India." |

**Why:** The old hero copy was brand-poetic but invisible to search engines. The new copy targets the exact phrases working women search when looking for office sarees, while still feeling premium.

---

### 3b. Homepage – Meta Tags
**File:** `src/utils/metaTags.js` (`getHomeMetaTags`)

| Element | After |
|---|---|
| `<title>` | Neera Sarees – Cotton & Linen Sarees for Working Women \| neera.store |
| `meta description` | Neera crafts Mulmul cotton, pure linen, and Chettinad sarees built for working women. Breathable, office-ready, and elegantly minimal. Free shipping across India. |

**Why:** Title and description are the first things a user sees in Google results. These are now written to match search intent ("sarees for working women") and include the domain for brand recognition.

---

### 3c. Fabric Category Pages – Meta Tags, h1, and Descriptions
**Files:** `src/FabricPage.jsx`, `src/utils/metaTags.js` (`getFabricCategoryMetaTags`)

- **h1** updated from `{fabricName}` → `{fabricName} Sarees for Working Women – Neera`
- **Subtitle `<p>`** added below the h1 using a fabric-specific description lookup:
  - **Mulmul:** "Feather-light Mulmul cotton sarees built for long office days. Breathable, soft, and non-clingy even in Chennai heat."
  - **Linen:** "Crisp pure linen sarees that look structured from the first meeting to the last. Perfect office wear for working women."
  - **Chettinad:** "Bold Chettinad cotton sarees with neat pleats and striking borders. Heritage weave that works beautifully in offices, schools, and corporate spaces."
  - **All other fabrics:** Generic working-women description.
- **Meta title** updated to `{fabricName} Sarees for Working Women | Neera Sarees`
- **Meta description** now uses the fabric-specific description

**Why:** Each fabric page was previously thin on content. Search engines need unique, keyword-rich content on every category page to rank it independently. The fabric-specific descriptions also communicate Neera's positioning clearly to first-time visitors.

---

### 3d. Product Detail Pages – Meta Tags and h1
**Files:** `src/ProductPage.jsx`, `src/utils/metaTags.js` (`getProductMetaTags`)

- **`<title>`** updated to: `{product.name} – {fabric_type} Saree for Working Women | Neera Sarees`
- **Meta description** updated to: `Shop {product.name}, a {fabric_type} saree for working women by Neera. Breathable, office-ready, and elegantly crafted. Free shipping across India.`
- **`<h1>`** now includes a screen-reader-only `<span>` appended: `– {fabric_type} Saree for Working Women` (visible only to search engines and assistive tech, not to users)
- **"You May Also Like"** heading renamed to `More {fabric_type} Sarees for Working Women`

**Why:** Product pages are the most important pages for conversions and long-tail SEO. Each page now targets the specific fabric+intent keyword combination (e.g., "Mulmul Saree for Working Women") which is what a buyer types when they know what they want.

---

### 3e. Our Story Page – h1 and Body Copy
**File:** `src/StoryPage.jsx`

- h1 updated to: "The Story Behind Neera – Sarees for Working Women"
- Body copy updated to naturally include: "cotton sarees for working women", "Mulmul cotton sarees", "linen sarees for office wear", "Chettinad cotton sarees", "office-ready sarees"

**Why:** The story page, while not a primary landing page, builds topical authority. Google rewards sites where keyword themes appear consistently across multiple pages.

---

### 3f. Contact Page – LocalBusiness Schema
**File:** `src/ContactUs.jsx`

- Added `OnlineStore` JSON-LD structured data schema inside the existing `<Helmet>` block, including Neera's business name, URL, description, Chennai address, and Instagram profile link.

**Why:** `LocalBusiness` schema helps Google display rich information (address, contact details) directly in search results and in Google Business Profile.

---

### 3g. Search Page – noindex Directive
**File:** `src/SearchPage.jsx`

- Added `<meta name="robots" content="noindex, follow" />` via a `<Helmet>` block.

**Why:** Search result pages (e.g., `/search?q=blue+saree`) should never be indexed by Google — they have no stable URL, no unique content, and waste crawl budget. The `noindex` tag tells Google to skip them entirely.

---

### 3h. sitemap.xml and robots.txt
**Files:** `public/sitemap.xml`, `public/robots.txt`

- `sitemap.xml` updated with high-priority URLs and correct `<loc>` formatting.
- `robots.txt` updated to disallow crawling of `/auth`, `/checkout`, `/cart`, `/profile`, `/order-confirmation`, `/search` and to explicitly point to the sitemap.

**Why:** The sitemap tells Google which pages exist and how important they are. The robots.txt prevents Google from wasting crawl budget on session-specific or private pages that should never appear in search results.

---

## 4. Next.js Version Removed

### What changed
The entire Next.js codebase was deleted:

| Deleted | Contents |
|---|---|
| `app/` | All Next.js App Router pages (home, products, categories, prints, story, contact, privacy policy, etc.) |
| `components/` | Root-level `Header.js` and `Footer.js` used only by Next.js |
| `lib/` | Next.js-specific Supabase client (`supabase.js`) |
| `next.config.mjs` | Next.js build configuration |
| `.next/` | Build cache and static generation artifacts |
| `next`, `eslint-config-next` | npm packages, uninstalled and removed from `package.json` |
| `dev:next`, `build:next`, `start:next` | npm scripts removed from `package.json` |

### Why
The project had two parallel implementations of the same website — a React/Vite SPA (`src/`) and a Next.js app (`app/`). All features, SEO improvements, and visibility controls were confirmed to be fully implemented in the React version. Maintaining two codebases for the same website adds confusion, risk of divergence, and unnecessary complexity. With the React version being the active production site, the Next.js version was surplus and safely removed.

---

## Summary of Files Changed

| File | Change Type |
|---|---|
| `src/App.jsx` | Product + fabric `is_public` filtering; BrandHero h1/p SEO copy |
| `src/FabricPage.jsx` | h1, subtitle, fabric descriptions |
| `src/ProductPage.jsx` | h1 sr-only span, "You May Also Like" heading |
| `src/utils/metaTags.js` | `getHomeMetaTags`, `getFabricCategoryMetaTags`, `getProductMetaTags` |
| `src/StoryPage.jsx` | h1 and body copy keyword integration |
| `src/ContactUs.jsx` | LocalBusiness JSON-LD schema |
| `src/SearchPage.jsx` | noindex Helmet block |
| `public/sitemap.xml` | Updated URLs and priorities |
| `public/robots.txt` | Disallow rules and sitemap pointer |
| `package.json` | Removed Next.js dependency and scripts |
| `app/` *(deleted)* | Entire Next.js app |
| `components/` *(deleted)* | Next.js-only Header/Footer |
| `lib/` *(deleted)* | Next.js-only Supabase client |
| `next.config.mjs` *(deleted)* | Next.js config |
| `.next/` *(deleted)* | Next.js build artifacts |
