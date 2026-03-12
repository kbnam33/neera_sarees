# Visual Design Logic

**Scroll experience arc:** Fabric texture (material truth/purity) → headline rises into view (flow) → CTA whispers upward → next section continues

**PRSPCT translation for Neera:** Same editorial restraint — full-bleed, typographically dominant, zero decorative clutter — but warm/organic instead of cold/industrial.

***

## File 1: `src/pages/Home.jsx` — Replace existing hero block

```jsx
<section
  aria-label="Neera — Cotton and Linen Sarees for Working Women"
  className="neera-hero"
>
  {/* SEO H1 — visually hidden, fully crawlable */}
  <h1 className="neera-hero__seo-heading">
    Cotton and Linen Sarees for Working Women — Neera
  </h1>

  {/* Background fabric image */}
  <div className="neera-hero__bg" aria-hidden="true">
    <img
      src="/images/hero-fabric-texture.jpg"
      alt="Close-up of handwoven cotton linen fabric — Neera sarees"
      className="neera-hero__bg-img"
      fetchpriority="high"
      decoding="async"
    />
    <div className="neera-hero__overlay" />
  </div>

  {/* Content */}
  <div className="neera-hero__content">
    <span className="neera-hero__label">
      Cotton &amp; Linen · Made for the Office
    </span>

    <p className="neera-hero__headline">
      Wear what<br />
      the day<br />
      demands.
    </p>

    <p className="neera-hero__sub">
      Sarees that breathe with you — from the first meeting to the last.
    </p>

    <a
      href="/products"
      className="neera-hero__cta"
      aria-label="Shop all Neera sarees — cotton and linen for working women"
    >
      Explore the Collection
      <span className="neera-hero__cta-line" aria-hidden="true" />
    </a>
  </div>

  <div className="neera-hero__scroll-hint" aria-hidden="true">
    <span />
  </div>
</section>
```


***

## File 2: `src/styles/hero.css` — New file (import in App.jsx or index.css)

```css
.neera-hero {
  position: relative;
  width: 100%;
  height: 100svh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}

.neera-hero__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.neera-hero__bg-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 40%;
  animation: hero-breathe 18s ease-in-out infinite alternate;
  transform-origin: center;
}

@keyframes hero-breathe {
  from { transform: scale(1.00); }
  to   { transform: scale(1.04); }
}

.neera-hero__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05)  0%,
    rgba(0, 0, 0, 0.15) 40%,
    rgba(0, 0, 0, 0.60) 75%,
    rgba(0, 0, 0, 0.78) 100%
  );
}

.neera-hero__seo-heading {
  position: absolute;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.neera-hero__content {
  position: relative;
  z-index: 1;
  padding: 0 5vw 6vh;
  max-width: 720px;
  animation: hero-rise 1s ease-out both;
}

@keyframes hero-rise {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

.neera-hero__label {
  display: block;
  font-size: clamp(0.65rem, 1.2vw, 0.75rem);
  font-weight: 400;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 1.2rem;
  font-family: var(--font-sans, sans-serif);
}

.neera-hero__headline {
  font-size: clamp(3rem, 9vw, 7.5rem);
  font-weight: 300;
  line-height: 1.0;
  letter-spacing: -0.02em;
  color: #ffffff;
  margin: 0 0 1.6rem;
  font-family: var(--font-serif, Georgia, serif);
}

.neera-hero__sub {
  font-size: clamp(0.9rem, 1.8vw, 1.1rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.75);
  letter-spacing: 0.01em;
  line-height: 1.6;
  margin: 0 0 2.4rem;
  max-width: 480px;
  font-family: var(--font-sans, sans-serif);
}

.neera-hero__cta {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  font-size: clamp(0.8rem, 1.4vw, 0.9rem);
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #ffffff;
  text-decoration: none;
  font-family: var(--font-sans, sans-serif);
  font-weight: 500;
}

.neera-hero__cta-line {
  display: block;
  height: 1px;
  width: 100%;
  background: rgba(255, 255, 255, 0.5);
  transition: background 0.35s ease;
}

.neera-hero__cta:hover .neera-hero__cta-line {
  background: #ffffff;
}

.neera-hero__scroll-hint {
  position: absolute;
  bottom: 32px;
  right: 5vw;
  z-index: 1;
  opacity: 0.4;
  animation: scroll-bounce 2.4s ease-in-out infinite;
}

.neera-hero__scroll-hint span {
  display: block;
  width: 20px;
  height: 20px;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  transform: rotate(45deg);
}

@keyframes scroll-bounce {
  0%, 100% { transform: translateY(0); opacity: 0.4; }
  50%       { transform: translateY(8px); opacity: 0.8; }
}

@media (max-width: 640px) {
  .neera-hero__content { padding: 0 6vw 10vh; }
  .neera-hero__headline { font-size: clamp(2.8rem, 13vw, 4rem); }
  .neera-hero__scroll-hint { right: 6vw; bottom: 24px; }
}
```


***

## File 3: `public/index.html` — Add inside `<head>` for LCP

```html
/images/hero-fabric-texture.jpg" fetchpriority="high" />
```


***

## File 4: Image placement

```
Save the fabric texture image as:
public/images/hero-fabric-texture.jpg

Target: WebP format preferred, max 280KB, min 2400×1600px
```


***

## What each decision does

| Decision | Brand impact | SEO impact |
| :-- | :-- | :-- |
| Fabric fills top half with near-zero overlay | "Purity" — material speaks first | LCP image is above fold, `fetchpriority="high"` |
| Slow Ken Burns zoom (18s) | "Flow" — breathing, never static | No performance cost vs video |
| Content anchored to bottom | Cinematic, PRSPCT grammar | Semantic reading order: label → H1 → sub → CTA |
| Visually hidden `<h1>` with exact keyword | Invisible to eye, brand voice intact | Crawler reads: "Cotton and Linen Sarees for Working Women — Neera" |
| Label: "Cotton \& Linen · Made for the Office" | Instantly signals who this is for | Keyword-rich visible text above the fold |
| Sub: "breathe with you — first meeting to last" | Intrinsic benefit, not feature | Natural long-tail keyword territory |

## File 5: `src/App.jsx` or `src/index.css` — Import the new CSS file

```js
import './styles/hero.css';
```


***

## File 6: `src/pages/Home.jsx` — Remove the old hero block

Find and **delete** the existing section that contains:

- `"Composed in Silence."` headline
- `"Clothing shaped by patience, restraint, and clarity."` subtitle
- `"SHOP NEW ARRIVALS"` button
- The split two-column image layout (`grid` or `flex` with two image panels)

Replace that entire block with the new `<section className="neera-hero">` from File 1.