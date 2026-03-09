## Section 1 – Full Screen Video Hero (`src/App.jsx` → `BrandHero` component)

Replace the entire `BrandHero` component with the following:

Remove the existing background image div and replace with a `<video>` element using `autoPlay`, `muted`, `loop`, `playsInline` attributes, `className="absolute inset-0 w-full h-full object-cover"`, and `src="/videos/neera-hero.mp4"` with a `poster="/images/hero-poster.jpg"` fallback attribute.

Wrap the video in a `<section>` with `className="relative w-screen h-screen overflow-hidden"`.

Add a gradient overlay div immediately after the video element with `className="absolute inset-0"` and `style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.0) 100%)' }}`.

Add a content container div after the gradient overlay with `className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-14 md:pb-20"`.

Inside that content container, add the following elements in order:

Add a `<p>` with `className="text-white/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans"` and text content `FOR THE WOMAN WHO WORKS`.

Add an `<h1>` with `className="text-white font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-5 max-w-2xl"` and text content `Sarees built for your 9 to 5.`.

Add a `<p>` with `className="text-white/75 text-base md:text-lg font-sans font-light mb-9 max-w-md leading-relaxed"` and text content `Cotton. Linen. All day.`.

```
Add a `<Link>` to `/products` with `className="inline-flex items-center gap-3 bg-white text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans px-8 py-4 hover:bg-deep-maroon hover:text-white transition-all duration-300"` and text `Shop Office Wear Sarees` followed by `<ArrowRightIcon className="w-4 h-4" />`.
```

Create a `public/videos/` directory. Add a code comment above the video element: `{/* Place neera-hero.mp4 in public/videos/ — recommended: 1920x1080, H.264, under 8MB, shows linen saree in office/workday context */}`.

***

## Section 2 – Trust Strip (`src/App.jsx` → new `TrustStrip` component)

Create a new component called `TrustStrip` directly below the `BrandHero` component definition in `src/App.jsx`.

The component returns a `<section>` with `className="w-full bg-[#F5EFE8] border-y border-[#E0D5C8]"`.

Inside, add a `<div>` with `className="max-w-screen-xl mx-auto px-6 py-7 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E0D5C8]"`.

Add 3 child divs, each with `className="flex flex-col items-center md:items-start justify-center px-8 py-5 md:py-0 gap-1"`.

First child div contents:

- `<p>` with `className="text-deep-maroon text-xs tracking-[0.25em] uppercase font-sans font-semibold"` and text `Cotton & Linen Only`
- `<p>` with `className="text-charcoal-gray/70 text-sm font-sans leading-snug"` and text `Breathable. Minimal. Office-appropriate.`

Second child div contents:

- `<p>` with `className="text-deep-maroon text-xs tracking-[0.25em] uppercase font-sans font-semibold"` and text `Built for 8-Hour Days`
- `<p>` with `className="text-charcoal-gray/70 text-sm font-sans leading-snug"` and text `Pleats that stay. Fabric that doesn't cling.`

Third child div contents:

- `<p>` with `className="text-deep-maroon text-xs tracking-[0.25em] uppercase font-sans font-semibold"` and text `Free Shipping Across India`
- `<p>` with `className="text-charcoal-gray/70 text-sm font-sans leading-snug"` and text `Every order. No minimum.`

***

## Section 3 – Collection Entry Cards (`src/App.jsx` → new `CollectionEntry` component)

Create a new component called `CollectionEntry` directly below `TrustStrip` in `src/App.jsx`.

The component accepts a `products` prop.

Add the following two `useMemo` hooks inside the component:

First: `const presentationProduct` — finds the first product where `fabric_type` is `'linen'` or `'Linen'` and has at least one image. Falls back to first product with an image.

Second: `const everydayProduct` — finds the first product where `fabric_type` is `'Mul Mul Cotton'` or `'mulmul'` (case-insensitive match using `.toLowerCase().includes('mul')`) and has at least one image. Falls back to second product with an image.

The component returns a `<section>` with `className="w-full bg-white"`.

Inside add a `<div>` with `className="max-w-screen-xl mx-auto px-6 md:px-16 pt-20 pb-24"`.

Add a header block first:

- `<p>` with `className="text-deep-maroon/50 text-xs tracking-[0.35em] uppercase font-sans mb-3"` and text `SHOP THE COLLECTION`
- `<h2>` with `className="font-serif text-deep-maroon text-3xl md:text-4xl mb-14"` and text `Start here.`

Add a cards grid `<div>` with `className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10"`.

Inside the grid, add two card `<Link>` components:

**Card 1** — links to `/fabric/linen`, `className="group relative block overflow-hidden"`:

Inside add an image container `<div>` with `className="relative aspect-[3/4] overflow-hidden bg-[#F0EAE2]"`.

```
Inside the image container, render conditionally: if `presentationProduct?.images?.[0]` exists, render `<img src={presentationProduct.images[0]} alt="Presentation Days – Linen Sarees for Office" className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105" />`. If not, render a `<div>` with `className="w-full h-full bg-[#E8DFD6]"`.
```

Add a text block below the image container `<div>` with `className="pt-5"`:

- `<p>` with `className="text-deep-maroon/50 text-xs tracking-[0.3em] uppercase font-sans mb-1"` and text `Pure Linen`
- `<h3>` with `className="font-serif text-deep-maroon text-xl md:text-2xl mb-2"` and text `Presentation Days`
- `<p>` with `className="text-charcoal-gray/65 text-sm font-sans leading-relaxed mb-4"` and text `Crisp structure that holds the drape. Looks senior-level from the first meeting to the last.`

```
- `<span>` with `className="inline-flex items-center gap-2 text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans group-hover:gap-4 transition-all duration-300"` containing text `Shop Now` and `<ArrowRightIcon className="w-3.5 h-3.5" />`
```

**Card 2** — links to `/fabric/Mul Mul Cotton`, `className="group relative block overflow-hidden"`:

Inside add an image container `<div>` with `className="relative aspect-[3/4] overflow-hidden bg-[#EDE8E2]"`.

```
Inside the image container, render conditionally: if `everydayProduct?.images?.[0]` exists, render `<img src={everydayProduct.images[0]} alt="Everyday at Work – Mulmul Cotton Sarees" className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105" />`. If not, render a `<div>` with `className="w-full h-full bg-[#E5DDD5]"`.
```

Add a text block below the image container `<div>` with `className="pt-5"`:

- `<p>` with `className="text-deep-maroon/50 text-xs tracking-[0.3em] uppercase font-sans mb-1"` and text `Mulmul Cotton`
- `<h3>` with `className="font-serif text-deep-maroon text-xl md:text-2xl mb-2"` and text `Everyday at Work`
- `<p>` with `className="text-charcoal-gray/65 text-sm font-sans leading-relaxed mb-4"` and text `Feather-light. Doesn't cling. Stays soft after 8 hours in the office.`

```
- `<span>` with `className="inline-flex items-center gap-2 text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans group-hover:gap-4 transition-all duration-300"` containing text `Shop Now` and `<ArrowRightIcon className="w-3.5 h-3.5" />`
```


***

## Wiring all 3 sections into the home route (`src/App.jsx` → home route `<Route path="/">`)

In the home route element, replace the current hero rendering with the following order, passing correct props:

`<BrandHero products={products} />`

`<TrustStrip />`

`<CollectionEntry products={products} />`

`<HomeProductSection title="New In" products={homeNewArrivals} />`

Remove `<ClassicHero>` and `<WeaversStory>` from the home route entirely — they are replaced by the above three sections.

***

## Header redesign (`src/App.jsx` → `Header` component)

Replace the entire `Header` component with the following structure:

The outer wrapper `<header>` gets `className="w-full bg-white border-b border-[#EDE8E2] z-50"`.

Inside, add a single unified row `<div>` with `className="max-w-screen-xl mx-auto px-6 h-16 flex items-center justify-between"`.

**Left section** — `<nav>` with `className="hidden md:flex items-center gap-8"`:

Add `<Link to="/">` with `className={navLinkClasses}` and text `Home`.

Add a dropdown wrapper `<div>` with `className="relative"` and `onMouseEnter={() => handleDropdownEnter('shop')}` and `onMouseLeave={handleDropdownLeave}`:

```
- Trigger `<button>` with `className={\`${navLinkClasses} flex items-center gap-1.5 bg-transparent border-none cursor-pointer\`}` containing text `Shop` and `<ChevronDownIcon className="w-3 h-3" />`
```

- Dropdown panel `<div>` with `className={\`absolute top-full left-0 mt-3 w-64 bg-white border border-[\#EDE8E2] shadow-sm transition-all duration-200 \${activeDropdown === 'shop' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}\`}`
- Inside dropdown panel add `<div>` with `className="p-5 flex flex-col gap-1"`:
    - `<p>` with `className="text-[10px] tracking-[0.3em] text-charcoal-gray/40 uppercase mb-2 font-sans"` and text `COLLECTION`
    - `<Link to="/fabric/linen" onClick={() => setActiveDropdown(null)}` with `className="text-deep-maroon font-serif text-base py-1.5 hover:translate-x-1 transition-transform duration-200 block"` and text `Presentation Days`
    - `<Link to="/fabric/Mul Mul Cotton" onClick={() => setActiveDropdown(null)}` with `className="text-deep-maroon font-serif text-base py-1.5 hover:translate-x-1 transition-transform duration-200 block"` and text `Everyday at Work`
    - A `<div>` with `className="border-t border-[#EDE8E2] mt-3 pt-3"`

```
- `<Link to="/products" onClick={() => setActiveDropdown(null)}` with `className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-deep-maroon/60 hover:text-deep-maroon transition-colors duration-200 font-sans"` containing text `View All Sarees` and `<ArrowRightIcon className="w-3 h-3" />`
```


Add `<Link to="/contact-us">` with `className={navLinkClasses}` and text `Contact`.

**Center section** — `<div>` with `className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"`:

- `<Link to="/">` with `className="font-serif text-deep-maroon text-xl tracking-wide"` and text `Neera`
- `<span>` with `className="text-[8px] tracking-[0.3em] text-deep-maroon/40 uppercase font-sans mt-0.5"` and text `SAREES FOR WORKING WOMEN`

**Right section** — `<div>` with `className="flex items-center gap-5"`:

```
- Search icon button: `<button onClick={() => setIsSearchOpen(true)} className="text-charcoal-gray hover:text-deep-maroon transition-colors duration-200">` with `<SearchIcon className="w-4 h-4" />`
```

```
- Account link: `<Link to={session ? '/profile' : '/auth'} className="text-charcoal-gray hover:text-deep-maroon transition-colors duration-200">` with `<UserIcon className="w-4 h-4" />`
```

```
- Cart link: `<Link to="/cart" className="relative text-charcoal-gray hover:text-deep-maroon transition-colors duration-200">` with `<ShoppingBagIcon className="w-4 h-4" />` and a conditional badge `{cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-deep-maroon text-white text-[8px] flex items-center justify-center rounded-full">{cartItemCount}</span>}`
```

**Mobile header** — Add a second `<div>` with `className="md:hidden flex items-center justify-between px-5 h-14 border-b border-[#EDE8E2]"`:

```
- Left: hamburger button `<button onClick={() => setIsMobileMenuOpen(true)} className="text-charcoal-gray">` with `<MenuIcon className="w-5 h-5" />`
```

- Center: `<Link to="/" className="flex flex-col items-center">

#Next: Execute file `Redesign_2.md`.