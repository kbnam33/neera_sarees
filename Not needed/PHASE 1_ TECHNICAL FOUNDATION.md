# PHASE 1: TECHNICAL FOUNDATION

## Objective

Migrate the existing React SPA to Next.js 14+ with App Router, implementing Server-Side Generation for product pages and Server-Side Rendering for category pages to enable search engine visibility.

**Success looks like:**

- Next.js 14+ project initialized with App Router
- All React components successfully migrated
- 130+ product pages pre-render via Static Site Generation (SSG)
- 15+ category pages render via Server-Side Rendering (SSR)
- Existing functionality fully preserved (cart, auth, navigation)
- Development server runs without errors
- Sample pages render correctly with full HTML content

***

## Execute These Steps

### Step 1: Initialize Next.js 14+ Project

Create a new Next.js project with the required configuration.

**Execute Next.js initialization:**

Run the create-next-app command with these selections:

- Project name: neera-nextjs
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- src/ directory: No
- App Router: Yes
- Customize import alias: No

**After initialization:**

- Navigate into the neera-nextjs directory
- Verify the project structure contains: app/, components/ (will be created), public/, package.json
- Verify package.json shows Next.js version 14 or higher

***

### Step 2: Install Required Dependencies

Install all packages needed for the transformation.

**Install these packages:**

- @supabase/supabase-js (database client)
- sharp (image optimization)
- next-sitemap (sitemap generation)
- schema-dts (TypeScript types for Schema.org)

**After installation:**

- Verify all packages appear in package.json dependencies
- Verify node_modules directory contains the installed packages
- Check for any installation errors or warnings

***

### Step 3: Copy Environment Variables

Transfer Supabase credentials from the original project.

**Copy .env.local file:**

- From original neera_sarees project root
- To new neera-nextjs project root
- Verify the file contains NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

**Note:** The original project may have VITE_ prefixed variables. These work with Next.js when using NEXT_PUBLIC_ prefix, so both should be present.

**After copying:**

- Verify .env.local exists in neera-nextjs directory
- Confirm Supabase variables are present

***

### Step 4: Configure next.config.mjs

Update the Next.js configuration file with required settings.

**Reference @technical-migration.mdc Section 1 for configuration details.**

**Configure these settings:**

- Image optimization: Add Supabase storage domain to allowed domains
- Image formats: Enable WebP and AVIF
- Responsive sizes: Configure device sizes and image sizes arrays
- Compression: Enable compress option
- Build optimization: Enable swcMinify
- Output: Set to standalone for Vercel deployment

**After configuration:**

- Verify next.config.mjs exists in project root
- Confirm all required settings are present

***

### Step 5: Set Up Supabase Client

Create the Supabase client and data fetching utilities.

**Create lib/supabase.ts file.**

**Reference @technical-migration.mdc Section 2 for implementation.**

**Implement these functions:**

- createClient with environment variables
- getProducts() - fetch all products
- getProductBySlug(fabric, slug) - fetch single product
- getProductsByCategory(fabric) - fetch products by fabric category
- getCategoryList() - get all unique fabric categories

**After creating:**

- Verify lib/supabase.ts exists
- Confirm all required functions are implemented
- Test that file has no TypeScript errors

***

### Step 6: Migrate Core Components

Copy existing React components from the original project to Next.js.

**Copy components:**

- From: original_project/src/components/
- To: neera-nextjs/components/

**Components to migrate:**

- ProductCard
- CategoryCard
- Header/Navigation
- Footer
- Cart components
- Auth components
- Any other UI components

**After copying:**

- Verify components directory contains all original components
- Check for any import path errors (update relative paths if needed)

***

### Step 7: Identify and Mark Client Components

Determine which components need 'use client' directive.

**Interactive components requiring 'use client':**

- Cart functionality (add to cart, update quantity, remove items)
- Authentication forms (login, signup)
- Search functionality (if exists)
- Filter components (if exists)
- Any component using useState, useEffect, onClick handlers

**Add 'use client' directive:**

- At the very top of each interactive component file
- Before any imports

**Server components (no directive needed):**

- Product display components (read-only)
- Category display components
- Static content components
- Layout components without interactivity

**After marking:**

- Verify interactive components have 'use client' at top
- Confirm non-interactive components have no directive (Server Components by default)

***

### Step 8: Copy Tailwind Configuration

Transfer Tailwind customizations from original project.

**If original project has customized Tailwind:**

- Copy tailwind.config.js to neera-nextjs/tailwind.config.ts
- Update file extension to .ts if needed
- Verify custom colors, fonts, or theme extensions are preserved

**If using default Tailwind:**

- Keep the generated tailwind.config.ts as is

**After copying:**

- Verify Tailwind configuration exists
- Confirm styles will match original design

***

### Step 9: Implement Product Pages with SSG

Create dynamic product pages that pre-render at build time.

**Create file: app/products/[fabric]/[slug]/page.tsx**

**Reference @technical-migration.mdc Section 3 for implementation.**

**Implement these functions:**

**generateStaticParams():**

- Fetch all products from Supabase
- Return array of params with fabric and slug for each product
- This pre-renders all 137 product pages at build time

**generateMetadata():**

- Fetch product data for the current params
- Return metadata object with title, description
- Format: "[Color] [Fabric] Saree | Neera Handloom Sarees"
- This is placeholder metadata, will be enhanced in Phase 2

**Product Page Component:**

- Fetch product data using getProductBySlug
- Display product information (name, price, images, description)
- Use Next.js Image component for product images
- Include Add to Cart functionality (client component)

**After creating:**

- Verify file exists at correct path
- Confirm generateStaticParams is implemented
- Confirm generateMetadata is implemented
- Check for TypeScript errors

***

### Step 10: Implement Category Pages with SSR

Create dynamic category pages that render on server on each request.

**Create file: app/products/[fabric]/page.tsx**

**Reference @technical-migration.mdc Section 4 for implementation.**

**Implement these elements:**

**generateMetadata():**

- Fetch category name from params
- Return metadata with category-specific title and description
- Format: "[Fabric] Sarees | Neera Handloom Sarees"
- Placeholder metadata, will be enhanced in Phase 2

**Category Page Component:**

- Fetch products for this fabric category using getProductsByCategory
- Display product grid
- Show category name as heading
- Include breadcrumb navigation (Home > Category)
- Display product cards for all products in category

**After creating:**

- Verify file exists at correct path
- Confirm it's a Server Component (no 'use client')
- Confirm generateMetadata is implemented
- Check for TypeScript errors

***

### Step 11: Migrate Other Pages

Create remaining pages from the original React application.

**Create these pages:**

**app/page.tsx (Homepage):**

- Copy content from original homepage component
- Use Server Component (no 'use client')
- Include hero section, featured products, navigation

**app/story/page.tsx (Our Story):**

- Copy brand story content
- Static page, Server Component

**app/contact-us/page.tsx (Contact):**

- Copy contact information and form
- If form is interactive, mark as client component

**app/cart/page.tsx (Shopping Cart):**

- Copy cart functionality
- Mark as 'use client' (highly interactive)
- Preserve all cart operations

**app/auth/page.tsx (Authentication):**

- Copy login/signup functionality
- Mark as 'use client' (form interactions)
- Preserve authentication flow

**After creating:**

- Verify all 5 pages exist in correct locations
- Confirm appropriate 'use client' directives
- Check that routing matches original app structure

***

### Step 12: Create Root Layout

Set up the root layout with global styles and metadata.

**Update or create app/layout.tsx:**

**Reference @technical-migration.mdc Section 5 for implementation.**

**Include these elements:**

- Import global Tailwind styles
- Set up HTML and body structure
- Include navigation component (if global)
- Configure default fonts (system fonts or Google Fonts with optimization)
- Add metadata object with default site title and description

**After creating:**

- Verify app/layout.tsx exists
- Confirm Tailwind styles import
- Check that layout wraps {children} properly

***

### Step 13: Test Development Server

Start the Next.js development server and verify basic functionality.

**Start the server:**

- Run npm run dev in the neera-nextjs directory
- Server should start on localhost:3000 (or next available port)
- Watch for any startup errors

**If server fails to start:**

- Check error messages for missing dependencies
- Verify .env.local is in correct location
- Check for port conflicts
- Review console output for specific errors

**If server starts successfully:**

- Proceed to Step 14

***

### Step 14: Test Sample Pages

Verify that pages render correctly in the browser.

**Test homepage:**

- Navigate to localhost:3000
- Verify page loads without errors
- Check that content displays
- Check browser console for errors

**Test 5 sample product pages:**

- Navigate to product URLs (e.g., /products/Chanderi/light-green-chanderi-silk-saree)
- Verify each page loads
- Confirm product information displays (name, price, image)
- Check that images render
- Verify no console errors

**Test 3 sample category pages:**

- Navigate to category URLs (e.g., /products/Chanderi, /products/Chettinad%20Cotton, /products/Mul%20Mul%20Cotton)
- Verify category pages load
- Confirm product grid displays
- Check that products for that category show correctly
- Verify no console errors

**Test other pages:**

- Visit /story - verify loads
- Visit /contact-us - verify loads
- Visit /cart - verify loads and cart functionality works
- Visit /auth - verify loads

**After testing:**

- Note any pages that don't work correctly
- Document any console errors
- If critical errors, fix before proceeding to verification

***

### Step 15: Verify Images Display Correctly

Check that product images are loading and rendering.

**Test image rendering:**

- On product pages, verify product images display
- On category pages, verify product card images display
- On homepage, verify any featured product images display
- Check browser Network tab to see if images load successfully

**Check for image errors:**

- 404 errors for images (wrong URLs)
- CORS errors (domain not allowed in next.config.mjs)
- Images not optimizing to WebP (Next.js Image not used)

**If images don't load:**

- Verify Supabase storage domain in next.config.mjs image domains
- Check image URLs in database are correct and accessible
- Confirm Next.js Image component is being used

**If images load correctly:**

- Proceed to verification checklist

***

## Verify These Results

**Go through this checklist carefully. Every item must be checked before Phase 1 is complete.**

- [ ] Next.js 14+ project initialized in neera-nextjs directory
- [ ] All required dependencies installed (Supabase, sharp, next-sitemap, schema-dts)
- [ ] .env.local copied with Supabase credentials
- [ ] next.config.mjs configured with image optimization settings
- [ ] lib/supabase.ts created with data fetching functions
- [ ] Components copied from original project to components/ directory
- [ ] Interactive components marked with 'use client' directive
- [ ] Tailwind configuration transferred
- [ ] Product page created: app/products/[fabric]/[slug]/page.tsx
- [ ] Product page has generateStaticParams implemented
- [ ] Product page has generateMetadata implemented
- [ ] Category page created: app/products/[fabric]/page.tsx
- [ ] Category page has generateMetadata implemented
- [ ] Homepage created: app/page.tsx
- [ ] Other pages created: story, contact-us, cart, auth
- [ ] Root layout configured: app/layout.tsx
- [ ] Development server starts without errors
- [ ] Homepage loads at localhost:3000
- [ ] 5 sample product pages load correctly
- [ ] 3 sample category pages load correctly
- [ ] Product information displays (name, price, images)
- [ ] Product images render correctly
- [ ] Navigation between pages works
- [ ] No critical console errors
- [ ] Cart functionality preserved (basic test)
- [ ] Tailwind styles applied correctly

***

## Decision

### ✅ If ALL 26 Checkboxes Are Checked

**Phase 1 Self-Check: PASS**

**Update PROGRESS.md:**

Add Phase 1 completion section:

- Status: ✅ COMPLETED
- Completed: Current timestamp
- Duration: Calculate from Phase 1 start to completion
- Key Actions:
    - Next.js 14+ initialized in neera-nextjs directory
    - Dependencies installed: Supabase, sharp, next-sitemap, schema-dts
    - Components migrated: [count] components
    - Product pages: SSG implemented with generateStaticParams
    - Category pages: SSR implemented
    - All pages: Homepage, story, contact, cart, auth created
    - Development server: Running successfully
    - Sample testing: 5 products + 3 categories verified
- Issues: None
- Next: Phase 2 - Metadata \& Schema Implementation

**Phase 1 execution is COMPLETE.**

The workflow orchestrator (generate.mdc) will now run external verification before proceeding to Phase 2.

***

### ⚠️ If 1-5 Checkboxes Are NOT Checked

**Phase 1 Self-Check: PARTIAL**

**Identify which items failed.**

Common partial failures:

- Some components not migrated → Continue migrating
- Some pages have errors → Fix specific pages
- Images not loading → Fix image configuration
- TypeScript errors → Resolve type issues

**Retry failed items:**

1. Identify which step each failed checkbox corresponds to
2. Re-execute only those specific steps
3. Maximum 2 retry attempts per item
4. After retries, re-check the verification checklist

**After retries:**

- Re-check all 26 boxes in "Verify These Results" section
- If now all checked → Follow "All Checkboxes Checked" path
- If still 1-5 unchecked after retries → Attempt targeted fixes one more time
- If still failing after 3 total attempts → Escalate to critical failure

***

### ❌ If 6+ Checkboxes Are NOT Checked OR Critical Failure

**Phase 1 Self-Check: FAILED**

This indicates serious migration issues that require investigation.

**Update PROGRESS.md:**

Add Phase 1 failure section:

- Status: ❌ FAILED
- Failed At: Current timestamp
- Failed Checks: List each unchecked checkbox
- Issues: Describe what went wrong for major failures
- Blockers: Cannot proceed to Phase 2 without functional Next.js foundation

Update BLOCKERS section in PROGRESS.md:

- Add: "Phase 1 migration failed with [X] unresolved issues"
- Add: "Technical foundation not established"

Update USER ACTIONS REQUIRED section:

- Add: "Review Phase 1 migration failures"
- Add: "Resolve critical issues listed above"
- Add: "Update user.md when resolved"

**⛔ STOP WORKFLOW EXECUTION**

Display detailed message to user:

═══════════════════════════════════════════════════════════════════
⛔ PHASE 1 BLOCKED - Critical Migration Failures
═══════════════════════════════════════════════════════════════════

Phase 1 Next.js migration has encountered critical failures.

❌ FAILED CHECKS:
[List each unchecked checkbox from verification]

📋 CRITICAL ISSUES IDENTIFIED:

[List specific problems based on failed checks]

💡 RESOLUTION STEPS:

For Next.js initialization issues:

- Verify Node.js version 18+ installed
- Check npm or yarn is working correctly
- Try deleting neera-nextjs directory and re-initializing
- Ensure no conflicting Next.js installations

For dependency installation issues:

- Clear npm cache: npm cache clean --force
- Delete node_modules and package-lock.json
- Re-run npm install
- Check for network connectivity issues

For Supabase connection issues:

- Verify credentials are correct in .env.local
- Ensure both NEXT_PUBLIC_ and VITE_ prefixed variables exist
- Test Supabase connection directly in dashboard
- Check if Supabase project is active

For component migration issues:

- Check for missing dependencies from original project
- Verify import paths are correct for Next.js structure
- Fix any TypeScript errors in migrated components
- Ensure 'use client' directives are on interactive components only

For page rendering issues:

- Check browser console for specific error messages
- Verify data fetching functions work correctly
- Ensure product/category data structure matches code expectations
- Check for missing environment variables

After resolving critical issues:

1. Re-run verification checklist manually
2. Confirm major issues are fixed
3. Update user.md with: "Phase 1 critical issues resolved - ready to retry"

The workflow will re-execute Phase 1 verification after your confirmation.

═══════════════════════════════════════════════════════════════════

**⏳ Wait for user.md confirmation**

Monitor user.md for resolution signal.

**Accepted signals:**

- "Phase 1 issues resolved - ready to retry"
- "critical issues fixed"
- "ready to retry Phase 1"
- "migration issues resolved"
- Or similar confirmation language

**After user confirms resolution:**

1. Re-run the entire "Verify These Results" checklist (all 26 checks)
2. If all boxes now checked → Follow "All Checkboxes Checked" path
3. If still multiple failures → Consult with user on whether to continue or abort transformation

***

## Expected Duration

**Estimated Time:** 45-90 minutes

**Breakdown:**

- Step 1 (Initialize Next.js): 5 minutes
- Step 2 (Install dependencies): 3-5 minutes
- Step 3 (Copy .env.local): 1 minute
- Step 4 (Configure next.config.mjs): 5 minutes
- Step 5 (Set up Supabase): 10 minutes
- Step 6 (Migrate components): 15-20 minutes
- Step 7 (Mark client components): 10 minutes
- Step 8 (Copy Tailwind): 2 minutes
- Step 9 (Implement product pages): 15-20 minutes
- Step 10 (Implement category pages): 10-15 minutes
- Step 11 (Migrate other pages): 10 minutes
- Step 12 (Root layout): 5 minutes
- Step 13 (Start dev server): 2 minutes
- Step 14 (Test pages): 10 minutes
- Step 15 (Verify images): 5 minutes
- Verification checklist: 5 minutes

**Note:** Time varies based on number of components and complexity of original codebase.

***

## Common Issues \& Solutions

### Issue 1: TypeScript errors after migrating components

**Solution:** Update import paths from original React structure to Next.js structure. Change relative imports if directory structure changed. Add type definitions for props if missing.

***

### Issue 2: Images not loading (404 errors)

**Solution:** Verify Supabase storage domain is added to next.config.mjs image domains array. Check that image URLs in database are complete and accessible. Ensure Next.js Image component is being used, not regular img tags.

***

### Issue 3: "use client" errors - hooks can only be called in client components

**Solution:** Component using useState, useEffect, or event handlers needs 'use client' directive at the top. Add the directive and error will resolve.

***

### Issue 4: Dev server won't start - port 3000 in use

**Solution:** Either stop the process using port 3000, or Next.js will automatically use port 3001. Check console output for which port Next.js selected.

***

### Issue 5: Product pages return 404 during development

**Solution:** In development mode, dynamic routes work differently than production. Ensure you're navigating to valid product URLs that exist in database. Check that fabric_category and slug match database values exactly (case-sensitive, URL-encoded).

***

### Issue 6: Supabase data not loading - client is undefined

**Solution:** Verify .env.local is in the neera-nextjs directory (not the original project directory). Restart dev server after adding .env.local (environment variables loaded at startup).

***

### Issue 7: Tailwind styles not applying

**Solution:** Verify tailwind.config.ts has correct content paths pointing to app/**/*.tsx and components/**/*.tsx. Check that globals.css is imported in app/layout.tsx. Restart dev server after Tailwind config changes.

***

### Issue 8: Build errors with generateStaticParams

**Solution:** Ensure generateStaticParams is async function. Verify it returns array of objects with fabric and slug keys. Check that Supabase query succeeds and returns data. Add error handling for failed queries.