## Global Design System — `tailwind.config.js`

Replace all existing custom colors under `theme.extend.colors` with:

```
'neera-bg': '#F2EDE6',
'neera-bg-deep': '#EBE4DC',
'neera-text': '#2C2420',
'neera-text-soft': '#7A6E68',
'neera-text-muted': '#A89E98',
'neera-accent': '#5C1F2E',
'neera-accent-soft': '#8B3A4A',
'neera-border': '#DDD6CE',
'neera-white': '#FAF7F4',
```

Remove `deep-maroon`, `charcoal-gray`, `soft-beige` entirely — replace every occurrence across all src files with the new tokens above using the mapping: `deep-maroon` → `neera-accent`, `charcoal-gray` → `neera-text`, `soft-beige` → `neera-bg`.

***

## `src/index.css` or `src/globals.css` — Base styles

Set `body` background to `#F2EDE6` and `color` to `#2C2420`. Remove any white background from the root `#root` or `body` element.

Add:

```css
* { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
::selection { background: #5C1F2E22; color: #2C2420; }
```


***

## Section 1 – Hero (`src/App.jsx` → `BrandHero`)

Replace the entire `BrandHero` component with:

Outer `<section>` with `className="relative w-screen overflow-hidden"` and `style={{ height: 'calc(100vh - 64px)' }}`.

Inside, add the `<video>` element with `autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover"` and `src="/videos/neera-hero.mp4"` with `poster="/images/hero-poster.jpg"`.

Add a vignette overlay div immediately after the video with `className="absolute inset-0"` and `style={{ background: 'radial-gradient(ellipse at center, transparent 25%, rgba(30,18,14,0.55) 75%, rgba(20,12,8,0.82) 100%)' }}`.

Add a second gradient overlay div with `className="absolute inset-0"` and `style={{ background: 'linear-gradient(to top, rgba(20,12,8,0.78) 0%, rgba(20,12,8,0.28) 45%, rgba(20,12,8,0.08) 100%)' }}`.

Add the content container div with `className="absolute bottom-0 left-0 w-full px-10 md:px-20 pb-16 md:pb-24"`.

Inside the content container in order:

Add `<p>` with `className="text-[#F2EDE6]/45 text-[10px] tracking-[0.45em] uppercase mb-5 font-sans"` and text `FOR THE WOMAN WHO WORKS`.

Add `<h1>` with `className="font-serif text-[#F2EDE6]/88 text-4xl md:text-5xl lg:text-6xl leading-[1.15] mb-6 max-w-xl"` and `style={{ textShadow: '0 2px 40px rgba(20,12,8,0.35)' }}` and text content `Sarees that make them ask — "Where did you get this?"`.

Add `<p>` with `className="text-[#F2EDE6]/50 text-sm md:text-base font-sans font-light mb-10 max-w-sm leading-relaxed tracking-wide"` and text `Cotton. Linen. All day.`.

Add `<Link to="/products"` with `className="inline-flex items-center gap-3 border border-[#F2EDE6]/30 text-[#F2EDE6]/70 text-[10px] tracking-[0.3em] uppercase font-sans px-8 py-4 hover:border-[#F2EDE6]/60 hover:text-[#F2EDE6]/90 transition-all duration-500 backdrop-blur-sm"` with text `Shop Office Wear Sarees` and `<ArrowRightIcon className="w-3.5 h-3.5" />`.

***

## Section 2 – Trust Strip (`src/App.jsx` → `TrustStrip`)

Replace the entire `TrustStrip` component with a horizontal marquee-style scrolling ticker instead of a 3-column grid. This communicates the same three messages but with more visual elegance and zero layout weight:

The component returns a `<div>` with `className="w-full overflow-hidden border-y border-neera-border"` and `style={{ backgroundColor: '#EBE4DC' }}`.

Inside add a `<div>` with `className="flex animate-marquee whitespace-nowrap"` and `style={{ animation: 'marquee 28s linear infinite' }}`.

Inside that div, render this content twice (for seamless loop) — wrap each repetition in a `<div>` with `className="flex items-center shrink-0"`:

Each repetition contains 3 items separated by a dot separator. Each item is a `<span>` with `className="inline-flex items-center gap-3 px-10 py-4"`:

```
Item 1: `<span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Cotton & Linen Only</span>` followed by `<span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Breathable. Minimal. Office-appropriate.</span>`
```

```
Item 2: `<span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Built for 8-Hour Days</span>` followed by `<span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Pleats that stay. Fabric that doesn't cling.</span>`
```

```
Item 3: `<span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Free Shipping Across India</span>` followed by `<span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Every order. No minimum.</span>`
```

```
Between each item add a separator `<span className="text-neera-border text-xs px-6">—</span>`.
```

In `src/index.css` add:

```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
```


***

## Section 3 – Collection Entry (`src/App.jsx` → `CollectionEntry`)

Replace the entire `CollectionEntry` component with:

Outer `<section>` with `className="w-full"` and `style={{ backgroundColor: '#F2EDE6' }}`.

Inside add `<div>` with `className="max-w-screen-xl mx-auto px-8 md:px-16 pt-16 pb-20"`.

Header block:

- `<p>` with `className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-3"` and text `THE COLLECTION`
- `<h2>` with `className="font-serif text-neera-text text-3xl md:text-4xl mb-12"` and text `Start here.`

Cards grid `<div>` with `className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8"`.

Each card is a `<Link>` with `className="group flex flex-col md:flex-row gap-0 overflow-hidden border border-neera-border hover:border-neera-accent/30 transition-all duration-500"`.

**Card 1** — links to `/fabric/linen`:

```
Image side `<div>` with `className="w-full md:w-[42%] aspect-[4/3] md:aspect-auto md:h-72 overflow-hidden flex-shrink-0"`. Inside: `<img>` with the linen product image, `className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-103"` and `alt="Presentation Days – Linen Sarees"`. If no image, a `<div>` with `className="w-full h-full"` and `style={{ backgroundColor: '#DDD6CE' }}`.
```

Text side `<div>` with `className="flex flex-col justify-center px-8 py-8 md:py-6"`:

- `<p>` with `className="text-neera-text-muted text-[8px] tracking-[0.4em] uppercase font-sans mb-2"` and text `PURE LINEN`
- `<h3>` with `className="font-serif text-neera-text text-2xl mb-3"` and text `Presentation Days`
- `<p>` with `className="text-neera-text-soft text-sm font-sans leading-relaxed mb-5 max-w-xs"` and text `Crisp structure that holds the drape. Looks senior-level from the first meeting to the last.`

```
- `<span>` with `className="inline-flex items-center gap-2 text-neera-accent text-[9px] tracking-[0.25em] uppercase font-sans group-hover:gap-4 transition-all duration-300"` containing text `Shop Now` and `<ArrowRightIcon className="w-3 h-3" />`
```

**Card 2** — links to `/fabric/Mul Mul Cotton` — identical structure as Card 1 but:

- Image from `everydayProduct`
- Label: `MULMUL COTTON`
- Title: `Everyday at Work`
- Description: `Feather-light. Doesn't cling. Stays soft after 8 hours in the office.`

***

## Header redesign (`src/App.jsx` → `Header`)

Replace entire `Header` outer wrapper with `<header>` with `className="w-full z-[100] relative"` and `style={{ backgroundColor: '#F2EDE6', borderBottom: '1px solid #DDD6CE' }}`.

Note the `z-[100]` — this is the critical fix for the dropdown appearing behind the video. Also add `position: relative` and ensure the dropdown panel inside has `className` including `z-[200]` so it always renders above the video.

Single nav row `<div>` with `className="max-w-screen-xl mx-auto px-8 h-16 flex items-center justify-between"`.

**Left nav** — `<nav>` with `className="hidden md:flex items-center gap-10"`:

`<Link to="/"` with `className="text-neera-text-soft text-[10px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300"` and text `Home`.

Dropdown wrapper `<div>` with `className="relative"` and `onMouseEnter={() => setActiveDropdown('shop')}` and `onMouseLeave={() => setActiveDropdown(null)}`:

```
- Trigger `<button>` with `className="flex items-center gap-1.5 text-neera-text-soft text-[10px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300 bg-transparent border-none cursor-pointer"` containing text `Shop` and `<ChevronDownIcon className="w-3 h-3" />`
```

- Dropdown panel `<div>` with `className={\`absolute top-full left-0 mt-0 w-60 z- transition-all duration-250 \${activeDropdown === 'shop' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}\`}` and `style={{ backgroundColor: '#F2EDE6', border: '1px solid #DDD6CE', borderTop: '2px solid #5C1F2E' }}`
- Inside panel `<div>` with `className="py-5 px-6 flex flex-col gap-0.5"`:
    - `<Link to="/fabric/linen" onClick={() => setActiveDropdown(null)}` with `className="font-serif text-neera-text text-base py-2.5 hover:text-neera-accent hover:pl-1 transition-all duration-200 block border-b border-neera-border/50"` and text `Presentation Days`
    - `<Link to="/fabric/Mul Mul Cotton" onClick={() => setActiveDropdown(null)}` with `className="font-serif text-neera-text text-base py-2.5 hover:text-neera-accent hover:pl-1 transition-all duration-200 block border-b border-neera-border/50"` and text `Everyday at Work`

```
- `<div>` with `className="pt-4"` containing `<Link to="/products" onClick={() => setActiveDropdown(null)}` with `className="inline-flex items-center gap-2 text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-accent transition-colors duration-200"` and text `All Sarees` plus `<ArrowRightIcon className="w-3 h-3" />`
```


`<Link to="/contact-us"` with `className="text-neera-text-soft text-[10px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300"` and text `Contact`.

**Center logo** — `<div>` with `className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5"`:

```
- `<Link to="/">` containing `<img src="/images/neera-logo.png" alt="Neera" className="h-8 w-auto" />` — this replaces the text logo with the footer logo image
```

- `<span>` with `className="text-[7px] tracking-[0.32em] uppercase font-sans"` and `style={{ color: '#A89E98' }}` and text `PURE IN EVERY THREAD`

**Right icons** — `<div>` with `className="flex items-center gap-5"`:

```
- Search: `<button onClick={() => setIsSearchOpen(true)} className="text-neera-text-soft hover:text-neera-text transition-colors duration-300">` with `<SearchIcon className="w-4 h-4" />`
```

```
- Account: `<Link to={session ? '/profile' : '/auth'} className="text-neera-text-soft hover:text-neera-text transition-colors duration-300">` with `<UserIcon className="w-4 h-4" />`
```

```
- Cart: `<Link to="/cart" className="relative text-neera-text-soft hover:text-neera-text transition-colors duration-300">` with `<ShoppingBagIcon className="w-4 h-4" />` and the badge `{cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-[8px] flex items-center justify-center rounded-full" style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}>{cartItemCount}</span>}`
```

#Next: `Redesign_1.md`