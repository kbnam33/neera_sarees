<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# Are the instructions complete?

No, the following are missing or incomplete:

***

## What was covered

- Global color system (`tailwind.config.js`)
- Base CSS (`index.css`)
- Section 1 – Hero (`BrandHero`)
- Section 2 – Trust Strip (`TrustStrip`) marquee
- Section 3 – Collection Entry (`CollectionEntry`) horizontal cards
- Header full redesign including dropdown z-index fix
- Tagline replacement (`PURE IN EVERY THREAD`)
- `FabricPage` 4-column grid
- `HomeProductSection` redesign
- `Footer` redesign
- `SearchOverlay` color update
- Logo image reference
- `scale-103` Tailwind fix

***

## What is still missing

### 1. Mobile header background color

The mobile header `<div>` still references old color classes. Replace `className` background on the mobile header wrapper with `style={{ backgroundColor: '#F2EDE6', borderBottom: '1px solid #DDD6CE' }}`.

### 2. Mobile Menu background color

The `MobileMenu` outer overlay `<div>` still uses `bg-white`. Replace with `style={{ backgroundColor: '#F2EDE6' }}`. The top bar border and internal `border-b` colors must also be updated to `border-neera-border` throughout.

### 3. `MobileMenu` bottom account/search section

The bottom `<div>` border-top must use `style={{ borderTop: '1px solid #DDD6CE' }}` instead of any Tailwind border color class referencing old tokens.

### 4. `AllProductsGrid` — `/products` page grid

The all-products grid `<div>` className needs updating to `"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"` to match the FabricPage grid — currently it has a different column count. Apply the same flat card style (no border, no shadow, no rounded corners) as specified for FabricPage cards.

### 5. `ProductPage` background and text colors

The product detail page still uses old color tokens (`deep-maroon`, `charcoal-gray`). Replace:

- All `text-deep-maroon` with `text-neera-accent`
- All `text-charcoal-gray` with `text-neera-text`
- All `bg-soft-beige` with `bg-neera-bg`
- All `border-gray-200` with `border-neera-border`
- The `Add to Bag` button: `style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}` with hover `style={{ backgroundColor: '#8B3A4A' }}`


### 6. `ProductPage` related products section heading

Replace `More {product.fabric_type} Sarees for Working Women` heading with:

- `<p>` with `className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-2"` and text `YOU MAY ALSO LIKE`
- `<h3>` with `className="font-serif text-neera-text text-2xl mb-8"` and text `From the same collection`


### 7. `FabricPage` heading block

The fabric page `<h1>` currently renders `{fabricName}` only. Replace with:

- `<p>` with `className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-2"` and text `THE COLLECTION`
- `<h1>` with `className="font-serif text-neera-text text-3xl md:text-4xl mb-4"` and text `{fabricName} Sarees for Working Women`


### 8. `ContactUs.jsx` — background and text tokens

Replace all old color tokens with new neera tokens throughout the ContactUs component. Form input borders: `style={{ borderColor: '#DDD6CE', backgroundColor: '#FAF7F4' }}`. Submit button: `style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}`.

### 9. `StoryPage.jsx` — background consistency

Add `style={{ backgroundColor: '#F2EDE6' }}` to the outermost container `<div>` of the StoryPage to maintain the single background color across all pages.

### 10. `CartPage.jsx` — background and button colors

Replace cart page background with `style={{ backgroundColor: '#F2EDE6' }}`. Checkout button: `style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}`.

### 11. `CheckoutPage.jsx` — background and button colors

Replace checkout page background with `style={{ backgroundColor: '#F2EDE6' }}`. Place order button: `style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}`.

### 12. `src/App.css` or any inline `bg-white` overrides

Search across all `src/` files for `bg-white` and `background: white` or `background: #fff` or `background-color: white`. Replace every instance that belongs to a page-level container with `style={{ backgroundColor: '#F2EDE6' }}`. Exclude `bg-white` inside the hero text CTA button and the search overlay — those are intentional contrast elements.

### 13. `utils/metaTags.js` — `getHomeMetaTags` still not targeting working women

Replace the title in `getHomeMetaTags()` with `'Neera – Cotton & Linen Sarees for Working Women'` and the description with `'Shop Neera's Mulmul cotton, pure linen, and Chettinad sarees designed for the working woman. Breathable, office-ready, and elegantly minimal. Free shipping across India.'`

### 14. `utils/metaTags.js` — `getAllSareesMetaTags` still generic

Replace the title with `'All Sarees – Cotton & Linen Office Wear Sarees | Neera'` and the description with `'Browse Neera's full collection of office wear sarees – Mulmul cotton, pure linen, and Chettinad sarees for working women. Free shipping across India.'`

### 15. `utils/schemaMarkup.js` — `getOrganizationSchema` description outdated

Replace the `description` field value from `"Premium handwoven sarees with authentic craftsmanship..."` with `"Neera crafts Mulmul cotton, pure linen, and Chettinad sarees for working women. Breathable, office-ready, and minimal. Free shipping across India."`.

***

These 15 items complete the full rebrand. Once all of the above are applied along with the previously given instructions, the entire site — every page, every component — will be consistent with the new `#F2EDE6` base, `#5C1F2E` accent, and `PURE IN EVERY THREAD` brand identity.

