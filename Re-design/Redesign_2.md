# <q>Mobile header — Add a second <div> with className="md:hidden flex items-center justify-between px-5 h-14 border-b border-[#EDE8E2]":
```

```
Left: hamburger button <button onClick={() => setIsMobileMenuOpen(true)} className="text-charcoal-gray"> with <MenuIcon className="w-5 h-5" />
```

```
Center: `<Link to="/" className="flex flex-col items-center"></q> Continue the instructions from here.
```

Continuing exactly from where it cut off:

***

Center of mobile header: `<Link to="/" className="flex flex-col items-center">` containing:

- `<span>` with `className="font-serif text-deep-maroon text-lg"` and text `Neera`
- `<span>` with `className="text-[7px] tracking-[0.25em] text-deep-maroon/40 uppercase font-sans"` and text `SAREES FOR WORKING WOMEN`

Right of mobile header: `<div>` with `className="flex items-center gap-4"`:

```
- Search button: `<button onClick={() => setIsSearchOpen(true)} className="text-charcoal-gray">` with `<SearchIcon className="w-4 h-4" />`
```

```
- Cart link: `<Link to="/cart" className="relative text-charcoal-gray">` with `<ShoppingBagIcon className="w-4 h-4" />` and a conditional badge `{cartItemCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-deep-maroon text-white text-[8px] flex items-center justify-center rounded-full">{cartItemCount}</span>}`
```


***

## Mobile Menu redesign (`src/App.jsx` → `MobileMenu` component)

Replace the entire `MobileMenu` component with the following:

Outer overlay `<div>` with `className="fixed inset-0 z-50 bg-white flex flex-col"` — only rendered when `isOpen` is true.

Top bar inside: `<div>` with `className="flex items-center justify-between px-5 h-14 border-b border-[#EDE8E2]"`:

- `<span>` with `className="font-serif text-deep-maroon text-lg"` and text `Neera`

```
- Close button `<button onClick={onClose} className="text-charcoal-gray">` with `<CloseIcon className="w-5 h-5" />`
```

Menu body: `<nav>` with `className="flex flex-col px-6 pt-8 gap-1 overflow-y-auto"`:

Add `<p>` with `className="text-[9px] tracking-[0.35em] text-charcoal-gray/35 uppercase font-sans mb-3"` and text `COLLECTION`.

```
Add `<button onClick={() => handleNavigate('/fabric/linen')}` with `className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"` containing text `Presentation Days` and `<ArrowRightIcon className="w-4 h-4 opacity-40" />`.
```

```
Add `<button onClick={() => handleNavigate('/fabric/Mul Mul Cotton')}` with `className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"` containing text `Everyday at Work` and `<ArrowRightIcon className="w-4 h-4 opacity-40" />`.
```

```
Add `<div>` with `className="mt-6 mb-2"` containing `<p>` with `className="text-[9px] tracking-[0.35em] text-charcoal-gray/35 uppercase font-sans"` and text `EXPLORE`.
```

```
Add `<button onClick={() => handleNavigate('/products')}` with `className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"` containing text `All Sarees` and `<ArrowRightIcon className="w-4 h-4 opacity-40" />`.
```

```
Add `<button onClick={() => handleNavigate('/story')}` with `className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"` containing text `Our Story` and `<ArrowRightIcon className="w-4 h-4 opacity-40" />`.
```

```
Add `<button onClick={() => handleNavigate('/contact-us')}` with `className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"` containing text `Contact` and `<ArrowRightIcon className="w-4 h-4 opacity-40" />`.
```

Bottom of mobile menu: `<div>` with `className="mt-auto px-6 pb-10 pt-6 flex items-center gap-6 border-t border-[#EDE8E2]"`:

- `<button onClick={() => handleNavigate(session ? '/profile' : '/auth')}` with `className="text-xs tracking-[0.2em] uppercase text-charcoal-gray/60 font-sans hover:text-deep-maroon transition-colors duration-200"` and text `{session ? 'My Account' : 'Sign In'}`
- `<button onClick={() => setIsSearchOpen(true)}` with `className="text-xs tracking-[0.2em] uppercase text-charcoal-gray/60 font-sans hover:text-deep-maroon transition-colors duration-200"` and text `Search`

***

## `src/App.jsx` — Header state cleanup

Remove `isNavSticky`, `navBarHeight`, `logoBarHeight`, `logoBarRef`, `navBarRef` state variables and refs from the Header component entirely.

Remove the `useEffect` that sets `--header-visible-height` CSS variable and the `window.addEventListener('resize', onResize)` inside it.

Remove `hoveredFabric`, `setHoveredFabric`, `hoveredPrint`, `setHoveredPrint` state variables from the Header component.

Remove `displayFabricProducts` and `displayPrintProducts` useMemo hooks from the Header component.

Remove `latestProduct` useMemo from the Header component.

Change `activeDropdown` state — it now only accepts `'shop'` or `null`. Remove all checks for `activeDropdown === 'fabric'` and `activeDropdown === 'print'` throughout the Header JSX.

***

## `src/App.jsx` — Remove dead components

Delete the entire `ClassicHero` component definition.

Delete the entire `WeaversStory` component definition.

Delete the entire `StoryHighlight` component definition.

***

## `src/App.jsx` — Home route render order

In the home route `<Route path="/">` element, replace whatever is currently rendering with exactly this order:

`<BrandHero products={products} />`

`<TrustStrip />`

`<CollectionEntry products={products} />`

`<HomeProductSection title="New In" products={homeNewArrivals} />`

***

## `src/App.jsx` — `navLinkClasses` constant update

Replace the existing `navLinkClasses` string with:

`"relative text-charcoal-gray hover:text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-deep-maroon after:transition-all after:duration-300 hover:after:w-full"`

***

## `tailwind.config.js` — Verify custom colors are defined

Confirm the following keys exist under `theme.extend.colors`. If any are missing, add them:

- `deep-maroon`: `'#6B1E2E'`
- `charcoal-gray`: `'#3B3B3B'`
- `soft-beige`: `'#F5EFE8'`

If `tailwind.config.js` does not exist and the project uses a `tailwind.config.ts`, apply the same additions there.
-----------