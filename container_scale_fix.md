Found the bug. Let me check the exact return JSX of `ProductImageCarousel` to confirm:Got it. Two bugs, one is the root cause.

**Root cause:** In `ProductImageCarousel`, `containerRef` is declared and used in the IntersectionObserver, but it's never attached to any DOM element in the return JSX. `containerRef.current` is always `null` → the observer never fires → `shouldLoad` stays `false` forever → `{shouldLoad && <img />}` never renders. The buttons always show because they're outside that condition.

This only breaks on mobile/tablet because the carousel (`lg:hidden`) is only mounted below 1024px. Desktop uses the separate static image view.

**Secondary bug:** Each slide div has `w-full flex-shrink-0` but no height, so the image has nothing to fill vertically.

**Two-line fix in `src/ProductPage.jsx`:**

**Fix 1 — attach `containerRef` to the outer wrapper:**
```jsx
// BEFORE
<div className="neera-product-detail__img-wrap relative">

// AFTER
<div ref={containerRef} className="neera-product-detail__img-wrap relative">
```

**Fix 2 — give each slide div explicit height:**
```jsx
// BEFORE
<div key={index} className="w-full flex-shrink-0">

// AFTER
<div key={index} className="w-full h-full flex-shrink-0">
```

That's it. Fix 1 unblocks the images from loading at all. Fix 2 ensures once loaded, each image fills the full 9:16 container vertically instead of collapsing to `height: auto`.

The `products.css` side is fine as-is — `.neera-product-detail__img-wrap > div { height: 100% }` already sets the slider track to full height of the wrapper. Flex's default `align-items: stretch` then handles the individual slide divs, but the explicit `h-full` on them makes it unambiguous.