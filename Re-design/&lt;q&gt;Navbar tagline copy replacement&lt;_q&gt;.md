## Navbar tagline copy replacement (continued)

Replace `SAREES FOR WORKING WOMEN` everywhere it appears — in the desktop header center, the mobile header center, and the mobile menu top bar — with `PURE IN EVERY THREAD`.

This communicates the brand meaning ("Neera" = flow of purity) without using functional language like "sarees for working women" which belongs in the hero and product pages, not the logo mark. The tagline under the logo should feel like a brand seal, not a category label.

***

## `src/FabricPage.jsx` — 4-column product grid

Find the products grid `<div>` that currently renders filtered products. Replace its `className` with `"grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"`.

Each product card inner `<div>` — remove any card border, box-shadow, or rounded corners. Cards should be flat, no enclosure.

Each product image container — set `className="aspect-[3/4] overflow-hidden mb-3"` with the `<img>` inside having `className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"`.

Product name `<h3>` — set `className="font-serif text-neera-text text-sm mb-1"`.

Product price `<p>` — set `className="text-neera-text-muted text-xs font-sans tracking-wide"`.

```
The fabric description block that appears above the grid — update its container `<div>` to `className="mb-10 pb-8 border-b border-neera-border"` and the description `<p>` to `className="text-neera-text-soft text-sm font-sans leading-relaxed max-w-xl"`.
```


***

## `src/App.jsx` — `HomeProductSection` component redesign

Replace the `HomeProductSection` component's grid `<div>` className with `"grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10"`.

Replace the section title `<h2>` or `<h3>` rendering `{title}` with:

- `<p>` with `className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-2"` and text `JUST ARRIVED`
- `<h2>` with `className="font-serif text-neera-text text-3xl mb-10"` and text `New In`

Replace the `View All Sarees` link at the bottom with `<Link to="/products"` with `className="inline-flex items-center gap-2 text-neera-accent text-[9px] tracking-[0.3em] uppercase font-sans mt-10 hover:gap-4 transition-all duration-300"` containing text `View All Sarees` and `<ArrowRightIcon className="w-3 h-3" />`.

***

## `src/App.jsx` — `Footer` component redesign

Replace the entire `Footer` component with:

Outer `<footer>` with `style={{ backgroundColor: '#EBE4DC', borderTop: '1px solid #DDD6CE' }}`.

Inner `<div>` with `className="max-w-screen-xl mx-auto px-8 py-16 flex flex-col items-center gap-10"`.

Logo block `<div>` with `className="flex flex-col items-center gap-2"`:

- `<img src="/images/neera-logo.png" alt="Neera" className="h-10 w-auto" />`
- `<span>` with `className="text-[7px] tracking-[0.35em] uppercase font-sans"` and `style={{ color: '#A89E98' }}` and text `PURE IN EVERY THREAD`

Nav links `<nav>` with `className="flex flex-wrap justify-center gap-x-8 gap-y-3"`:

- Each link is a `<Link>` with `className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300"`
- Links: All Sarees → `/products`, Our Story → `/story`, Contact Us → `/contact-us`, Shipping → `/shipping-policy`, Exchanges → `/refund-and-exchange-policy`, Privacy Policy → `/privacy-policy`, Terms → `/terms-and-conditions`

Divider `<div>` with `className="w-12 border-t border-neera-border"`.

Copyright `<p>` with `className="text-neera-text-muted text-[8px] tracking-[0.3em] uppercase font-sans"` and text `© {new Date().getFullYear()} Neera. All rights reserved.`

***

## `src/App.jsx` — `SearchOverlay` background color

In the `SearchOverlay` component, replace any white or black overlay background with `style={{ backgroundColor: 'rgba(242,237,230,0.97)', backdropFilter: 'blur(12px)' }}`.

Replace the input text color class with `className` containing `text-neera-text` and `placeholder-neera-text-muted`.

Replace the border color with `border-neera-border` and on-focus `focus:border-neera-accent`.

***

## `public/images/` — Logo reference

Add a comment in the Header and Footer where the logo `<img>` is referenced: `{/* Place the Neera logo PNG (transparent background, deep maroon version) at public/images/neera-logo.png */}`. The same file used in the current footer must be copied to `public/images/neera-logo.png` for both header and footer to reference consistently.

***

## `src/App.jsx` — Suppress `scale-103` Tailwind warning

In `tailwind.config.js` under `theme.extend`, add:

```
scale: { '103': '1.03' }
```

This prevents the `scale-103` utility from being purged or throwing a warning since Tailwind's default scale steps do not include 103.

***

## Summary of visual decisions made

`PURE IN EVERY THREAD` replaces `SAREES FOR WORKING WOMEN` in the logo mark because the tagline under the Neera logo is a brand seal — it should carry the meaning of the name (purity, flow) not the functional category. The functional positioning ("for working women", "office wear") lives in the hero H1, collection names, and product descriptions where it drives SEO and conversion. The logo seal communicates identity, not function.

The marquee ticker for Section 2 replaces the 3-column grid because it adds movement and rhythm to an otherwise static page — it communicates the three trust pillars without taking up vertical space or requiring a background contrast block, which preserves the single consistent `#F2EDE6` background across all sections with only the `#EBE4DC` ticker band as a subtle tonal shift rather than a competing color.

The Collection Entry cards shift from portrait-image-only to a horizontal split (image left, text right) so that both the image and the text are visible within a single viewport height without scrolling — the image takes 42% of the card width and the text sits beside it at reading height, solving the scroll problem directly.

