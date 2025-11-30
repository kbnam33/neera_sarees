# Introducing Next.js for the Neera E‑commerce Website

This document proposes and details an incremental, cancelable migration from the current React + Vite SPA to Next.js (App Router). The plan prioritizes zero functional regressions, measurable performance and SEO gains, and an easy rollback at every step.

---

## Goals
- Faster first paint and interaction via SSR/SSG/ISR and edge caching
- Native image optimization with `next/image`
- Better SEO through server-rendered HTML, rich metadata, sitemap, and robots
- Maintain developer velocity with minimal disruption and a clean rollback path

## Non‑Goals
- Rewriting business logic or redesigning UI/UX
- Changing the backend contracts

## Success Criteria (KPIs)
- TTFB and LCP improved by ≥20% on core pages
- Lighthouse SEO score ≥95 for key landing/product pages
- Zero critical regressions (cart, checkout, account) in production
- Error rate and Core Web Vitals remain at or better than baseline

---

## Migration Strategy
- Approach: Incremental, in-place within this repo; App Router, latest stable Next.js
- Branching: Dedicated long‑lived `next-migration` branch; small PRs merged into it
- Cutover: Switch production to Next.js after a green checklist and a week of shadow traffic
- Rollback: Every step has a one‑command or single‑commit revert path

---

## High‑Level Work Breakdown (Cancelable TODO)

Legend:
- [ ] Task to do
- [x] Done
- [ ] Cancel: how to revert the step safely

### Phase 0 — Preparation
1) [ ] Create migration branch and baseline
   - Run
     ```bash
     git checkout -b next-migration
     git tag -a vite-baseline -m "Baseline before Next migration"
     ```
   - [ ] Cancel: `git checkout main && git branch -D next-migration` (if no PRs yet)

2) [ ] Inventory current app routes and critical flows
   - Source: `src/App.jsx`, router config, deep links from analytics
   - Deliverable: a route inventory table (see template below)
   - [ ] Cancel: No changes to revert (doc-only)

3) [ ] Verify Node version and tooling
   - Target: Active LTS Node; add `eslint-config-next`
   - [ ] Cancel: Revert `package.json` and lockfile to `vite-baseline`

### Phase 1 — Bootstrap Next.js (no user-visible changes)
1) [ ] Add core dependencies and scripts
   - Run
     ```bash
     npm i -E next react react-dom
     npm i -D -E eslint-config-next
     ```
   - Update `package.json` scripts (keep existing Vite scripts during migration):
     ```json
     {
       "scripts": {
         "dev:next": "next dev",
         "build:next": "next build",
         "start:next": "next start"
       }
     }
     ```
   - [ ] Cancel: `git restore package.json && npm ci` (or `git revert <commit>`)

2) [ ] Create Next.js structure
   - Add `app/` with minimal shell:
     ```tsx
     // app/layout.tsx
     import type { ReactNode } from 'react';
     import './globals.css';

     export default function RootLayout({ children }: { children: ReactNode }) {
       return (
         <html lang="en">
           <body>{children}</body>
         </html>
       );
     }
     ```
     ```tsx
     // app/page.tsx
     export default function Home() {
       return <main>Next shell is live</main>;
     }
     ```
   - Move static assets to `public/` (leave Vite assets untouched for now; copy, don’t delete)
   - [ ] Cancel: `git clean -fd app public && git restore -SW app public`

3) [ ] Add `next.config.mjs`
   ```js
   // next.config.mjs
   /** @type {import('next').NextConfig} */
   const nextConfig = {
     reactStrictMode: true,
     images: {
       // Add your image domains here
       // domains: ['images.example.com']
     },
     // If you need backend proxies during dev
     // async rewrites() {
     //   return [
     //     { source: '/api/:path*', destination: 'http://localhost:PORT/api/:path*' },
     //   ];
     // },
   };
   export default nextConfig;
   ```
   - [ ] Cancel: `git restore next.config.mjs`

4) [ ] Optional: Enable TypeScript gradually
   - Run `npm i -D -E typescript @types/react @types/node`
   - Add `tsconfig.json` with `"allowJs": true` and path aliases (match existing Vite aliases)
   - Convert files opportunistically; keep JS working
   - [ ] Cancel: `git restore tsconfig.json && npm un typescript @types/react @types/node`

### Phase 2 — Routing Migration
1) [ ] Build route inventory (template)
   | SPA route | Source file | Next route | Rendering | Status | Owner |
   |---|---|---|---|---|---|
   | `/` | `src/App.jsx` | `/` | SSG/ISR | [ ] | |
   | `/products` | `...` | `/products` | SSG/ISR | [ ] | |
   | `/products/:slug` | `...` | `/products/[slug]` | SSR/ISR | [ ] | |
   | `/cart` | `...` | `/cart` | Client | [ ] | |
   | `/checkout` | `...` | `/checkout` | SSR | [ ] | |
   | `/account` | `...` | `/account` | SSR/Client | [ ] | |
   - [ ] Cancel: No code changes yet

2) [ ] Migrate shell routes one-by-one
   - For each page, create `app/<segment>/page.tsx`
   - Prefer Server Components; mark client components with `'use client'`
   - Add page‑level metadata
     ```ts
     // app/products/[slug]/page.tsx
     export const dynamic = 'force-static'; // or 'force-dynamic' per needs
     export const revalidate = 60; // ISR example

     export async function generateMetadata({ params }) {
       return { title: `Product ${params.slug} | Neera` };
     }
     ```
   - [ ] Cancel: `git revert <commit>` for the route; remove the page file(s)

3) [ ] Preserve SPA during migration
   - Keep Vite app for all yet‑to‑migrate routes
   - Create a temporary route in Next to host the existing SPA at `/legacy` (optional)
   - [ ] Cancel: Remove `/legacy` and related rewrites

### Phase 3 — Data Fetching & Caching
1) [ ] Move data fetching to Server Components where possible
   - Use `fetch()` in server components with caching/`revalidate`
   - Use `Route Handlers` in `app/api/*` if needed for edge-side aggregation
   - [ ] Cancel: Move data fetching back to client; delete route handlers

2) [ ] Caching strategy per page
   - Home, category: SSG+ISR
   - Product detail: ISR with short revalidate, or SSR if personalization
   - Cart/checkout/account: client or SSR with `no-store`
   - [ ] Cancel: Set `dynamic = 'force-dynamic'` and remove `revalidate`

### Phase 4 — Images, Assets, Fonts
1) [ ] Replace `<img>` with `next/image`
   - Use `fill` + `sizes` or explicit `width`/`height`
   - Run codemod where safe:
     ```bash
     npx @next/codemod replace-react-dom-unstable-to-next-image .
     ```
   - [ ] Cancel: Revert commit; keep `<img>` for affected components

2) [ ] Move static assets to `public/` and update references
   - [ ] Cancel: Revert commit and restore old asset paths

3) [ ] Add fonts via `next/font` and preload critical CSS
   - [ ] Cancel: Revert font changes and CSS imports

### Phase 5 — State, Client Components, and Effects
1) [ ] Keep existing state library (Redux/Zustand/etc.)
   - Wrap providers in `app/providers.tsx` and include in `layout.tsx`
   - [ ] Cancel: Revert provider wiring, keep legacy provider in SPA

2) [ ] Minimize client components
   - Only mark interactive leaves with `'use client'`
   - [ ] Cancel: Revert `'use client'` on regressing components

### Phase 6 — SEO & Metadata
1) [ ] Page metadata with App Router `metadata` and `generateMetadata`
   - Titles, descriptions, canonical, OG/Twitter tags, structured data
   - [ ] Cancel: Remove `metadata` exports (falls back to minimal defaults)

2) [ ] Add `robots.txt` and `sitemap.xml`
   - Use `next-sitemap` or route handlers
   - [ ] Cancel: Remove files/config; restore original robots/sitemap

### Phase 7 — API Integration & Rewrites
1) [ ] Configure `rewrites` for backend during dev and prod as needed
   - Example in `next.config.mjs`
   - [ ] Cancel: Remove rewrites and test direct calls from client

2) [ ] Edge/runtime choices per route
   - Choose Node or Edge runtime per page/route handler
   - [ ] Cancel: Remove `runtime` export to default back to Node

### Phase 8 — Auth & Protected Routes
1) [ ] Keep current auth flow initially
   - Protect server components via server checks or middleware
   - [ ] Cancel: Remove middleware and guards; fall back to SPA auth

2) [ ] Optionally adopt NextAuth later (separate ADR)
   - [ ] Cancel: Revert NextAuth packages and callbacks

### Phase 9 — Observability & Performance
1) [ ] Add Web Vitals reporting and RUM
   - `reportWebVitals` or analytics SDK
   - [ ] Cancel: Revert analytics init

2) [ ] Bundle analysis and route performance budgets
   - Use `@next/bundle-analyzer`
   - [ ] Cancel: Remove analyzer config

### Phase 10 — Testing & QA
1) [ ] Update component tests to work with App Router
   - Migrate to `@testing-library/react` compatible setup
   - [ ] Cancel: Keep tests running against SPA until ready

2) [ ] E2E smoke tests for cart/checkout/account with Playwright/Cypress
   - [ ] Cancel: Temporarily run E2E against SPA in CI

### Phase 11 — Deployment & Cutover
1) [ ] Build & preview deploy
   - `npm run build:next && npm run start:next`
   - Deploy to preview env; enable password/secret if needed
   - [ ] Cancel: Keep SPA as main preview; stop Next preview

2) [ ] Shadow traffic for one week (optional)
   - Mirror traffic read‑only to Next to spot errors
   - [ ] Cancel: Stop mirroring

3) [ ] Production cutover
   - Switch primary domain or route to Next
   - Keep SPA deploy as warm fallback for 1–2 weeks
   - [ ] Cancel: Revert DNS/routing to SPA immediately

4) [ ] Decommission SPA (post‑stabilization)
   - Remove Vite tooling and dead code
   - [ ] Cancel: Postpone; keep SPA as emergency fallback

---

## Detailed Implementation Notes

### Aligning Aliases and Imports
- Mirror Vite `alias` to Next `compiler.paths` (via `tsconfig.json`/`jsconfig.json`)
- Ensure absolute imports resolve uniformly

### CSS & Tailwind
- If using Tailwind, keep `tailwind.config.js` and `postcss.config.js`
- Import `globals.css` in `app/layout.tsx`

### Forms and Mutations
- Prefer Server Actions where suitable; fall back to client mutations
- For cart/checkout, ensure idempotent server handlers and CSRF protection (if applicable)

### Internationalization (if applicable)
- Use built‑in Next i18n routing or `next-intl`

### Accessibility
- Preserve semantic structure; re‑audit with Lighthouse/axe

---

## Rollback Playbook (General)
- Revert the last step’s commit: `git revert <sha>`
- If multiple files were added: `git clean -fd` to remove untracked directories like `app/`
- Restore config files: `git restore next.config.mjs tsconfig.json package.json`
- Restore dependencies: `git checkout vite-baseline -- package.json && npm ci`
- Production rollback: switch routing/DNS back to SPA deploy

---

## Definition of Done (Go‑Live Checklist)
- [ ] All routes in the inventory are migrated or intentionally left in SPA with a plan
- [ ] Core flows (browse, PDP, cart, checkout, account) pass E2E
- [ ] SEO validation: meta, structured data, robots, sitemap
- [ ] Performance budgets met on WebPageTest and Lighthouse
- [ ] Observability installed and error budgets green
- [ ] On‑call and rollback steps documented

---

## Appendix

### Example `package.json` additive scripts (keep Vite during migration)
```json
{
  "scripts": {
    "dev": "vite",            
    "dev:next": "next dev",
    "build": "vite build",
    "build:next": "next build",
    "preview": "vite preview",
    "start:next": "next start"
  }
}
```

### Minimal `app` structure to start
```
app/
  layout.tsx
  page.tsx
  (routes migrated incrementally)
public/
  (copied assets)
next.config.mjs
```

### Route File Examples
```tsx
// app/products/page.tsx
export const revalidate = 300; // ISR every 5 minutes
export default async function Products() {
  const res = await fetch("https://api.example.com/products", { next: { revalidate } });
  const products = await res.json();
  return <main>{products.map(p => <div key={p.id}>{p.name}</div>)}</main>;
}
```

```tsx
// app/products/[slug]/page.tsx
export const dynamic = 'force-static';
export default async function Product({ params }: { params: { slug: string } }) {
  const res = await fetch(`https://api.example.com/products/${params.slug}`, { cache: 'no-store' });
  const product = await res.json();
  return <main>{product.name}</main>;
}
```

### Metadata Example
```ts
// app/products/[slug]/page.tsx
export async function generateMetadata({ params }) {
  return {
    title: `Buy ${params.slug} | Neera`,
    description: `Great price on ${params.slug} with fast shipping.`
  };
}
```

### `next-sitemap` example (optional)
```bash
npm i -D next-sitemap
```
```js
// next-sitemap.config.js
module.exports = {
  siteUrl: 'https://www.neera.example',
  generateRobotsTxt: true,
};
```
```json
// package.json
{
  "scripts": {
    "postbuild:next": "next-sitemap"
  }
}
```

---

## Action Items This Week
- [ ] Create `next-migration` branch and set baseline tag
- [ ] Add Next dependencies and minimal `app/` shell
- [ ] Inventory routes from `src/App.jsx` and map to Next
- [ ] Decide per‑page rendering mode (SSG/ISR/SSR/Client)
- [ ] Stand up preview deployment for the Next shell
