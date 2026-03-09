# Product Visibility Feature Report

## Status

Completed in admin codebase, and database migration executed successfully:

- `database/migrations/add_product_visibility_column.sql` (already run)

## Objective

Enable product visibility control so products can be marked:

- **Public**: available on the website
- **Private**: available in admin but hidden from website

Visibility should be manageable:

- Individually (per product)
- Fabric-wise (bulk)
- Print-wise (bulk)

## What Was Implemented

### 1) Database Layer

Migration added:

- `products.is_public BOOLEAN NOT NULL DEFAULT true`
- Backfill for null values to `true`
- Index on `is_public` for faster filtering

File:

- `database/migrations/add_product_visibility_column.sql`

### 2) Individual Product Controls

Added `Website Visibility` toggle (`Public` / `Private`) in:

- `src/pages/products/create.jsx`
- `src/pages/products/edit.jsx`

Behavior:

- Default for new products is `is_public = true`
- Edit form reads and updates existing `is_public`

### 3) Product List Enhancements

Updated:

- `src/pages/products/list.jsx`

Changes:

- Added a `Visibility` column (`Public` / `Private` chip)
- Added row action menu items:
  - `Set Public`
  - `Set Private`

### 4) Fabric-wise Bulk Visibility

Updated:

- `src/pages/fabrics/edit.jsx`

Changes:

- Added visibility quick action menu to:
  - Make this fabric's products public/private
  - Make all products public/private

### 5) Print-wise Bulk Visibility

Updated:

- `src/pages/prints/edit.jsx`

Changes:

- Added visibility quick action menu to:
  - Make all products for this print type public/private

### 6) Bulk Product Create Support

Updated:

- `src/pages/products/bulk-create.jsx`

Changes:

- Added shared switch:
  - `All new products: Public/Private`
- Applies `is_public` to all products created in that batch

## Files Updated

- `database/migrations/add_product_visibility_column.sql`
- `src/pages/products/create.jsx`
- `src/pages/products/edit.jsx`
- `src/pages/products/list.jsx`
- `src/pages/products/bulk-create.jsx`
- `src/pages/fabrics/edit.jsx`
- `src/pages/prints/edit.jsx`

## Website Codebase Verification Checklist

To ensure private products never appear on website, verify the following in website/backend-for-website code:

### 1) Product Listing Queries

All public-facing product queries must filter:

- `is_public = true`

Verify in:

- Home sections (featured/new arrivals)
- Collection/category/fabric/print pages
- Search APIs and search UI data loaders
- Related products widgets

### 2) Product Detail (PDP) Route Protection

For direct product URL access:

- Private product should return `404` (or equivalent not-found behavior)
- Server/API must enforce `is_public = true` even if a product ID/slug is known

### 3) Facets, Counts, and Aggregations

Any counts shown to users must be based on public products only:

- products per fabric
- products per print
- products per category

### 4) Caching, SSG/ISR, Revalidation

If website uses caching or static generation:

- visibility changes should invalidate relevant pages/data caches
- private products should disappear promptly after being set private

### 5) SEO and External Feeds

Ensure private products are excluded from:

- sitemap product URLs
- structured data output
- merchant/product feeds (if any)

### 6) Cart and Checkout Safety

If a product becomes private after being added to cart:

- line item should be blocked/removed gracefully
- user-facing error should be clear

### 7) Search Indexing Pipelines

If using Algolia/Elastic/Meilisearch:

- include `is_public` in indexing/filtering logic
- private products should be de-indexed (or filtered out) quickly

### 8) Test Coverage Expectations

Add or confirm tests for:

- list API excludes private products
- PDP endpoint denies private products
- bulk visibility changes reflect on website responses
- regression test: public products remain unaffected

## Optional SQL Sanity Checks

```sql
-- Visibility split
select is_public, count(*) from products group by is_public;

-- Public products by fabric
select fabric_type, count(*) from products where is_public = true group by fabric_type order by 2 desc;

-- Public products by print
select print_id, count(*) from products where is_public = true group by print_id order by 2 desc;
```

## Notes

- Admin feature implementation is complete.
- Website visibility behavior now depends on website query enforcement and route-level checks using `is_public = true`.
