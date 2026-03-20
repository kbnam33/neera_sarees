### File: `src/styles/hero.css` — Update footer links + add banner + redesign trust bar

```css
/* ============================================================
   FOOTER — Font size increase only
   ============================================================ */

.neera-footer__nav a {
  font-size: 0.82rem;        /* up from 0.88rem — slightly larger, same design */
}

.neera-footer__tagline {
  font-size: 0.82rem;        /* match nav link size */
}


/* ============================================================
   ANNOUNCEMENT BANNER — immediately after hero
   ============================================================ */

.neera-banner {
  width: 100%;
  background: #6b4f3a;       /* deep warm mahogany — branded, distinct from beige */
  overflow: hidden;
  padding: 0;
  height: 40px;
  display: flex;
  align-items: center;
}

.neera-banner__track {
  display: flex;
  gap: 0;
  white-space: nowrap;
  animation: banner-scroll 28s linear infinite;
  will-change: transform;
}

/* Duplicate content node for seamless loop */
.neera-banner__content {
  display: flex;
  align-items: center;
  gap: 3.5rem;
  padding-right: 3.5rem;
  flex-shrink: 0;
}

.neera-banner__text {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f5f0eb;
}

.neera-banner__code {
  font-weight: 600;
  letter-spacing: 0.22em;
  color: #ffffff;
  background: rgba(255,255,255,0.12);
  padding: 2px 8px;
  border-radius: 2px;
}

.neera-banner__dot {
  display: inline-block;
  width: 3px;
  height: 3px;
  background: rgba(245,240,235,0.4);
  border-radius: 50%;
  flex-shrink: 0;
}

@keyframes banner-scroll {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* Pause on hover */
.neera-banner:hover .neera-banner__track {
  animation-play-state: paused;
}


/* ============================================================
   TRUST BAR — Full typographic redesign
   No motif. Editorial newspaper subheader style.
   ============================================================ */

.neera-trust {
  padding: 1.6rem 5vw;
  background: var(--color-bg, #f5f0eb);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

/* Remove old border lines */
.neera-trust__border-top,
.neera-trust__border-bottom {
  display: none;
}

/* Remove old grid */
.neera-trust__grid {
  display: contents;         /* flatten grid — children become direct flex children */
}

/* Remove old vertical dividers */
.neera-trust__item + .neera-trust__item {
  border-left: none;
}

.neera-trust__item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0;
  text-align: left;
  flex-direction: row;       /* icon inline with text — horizontal */
}

/* Diamond separator between items — injected via CSS not DOM */
.neera-trust__item + .neera-trust__item::before {
  content: '◆';
  font-size: 0.35rem;
  color: var(--color-border, #c8b89a);
  margin-right: 0.6rem;
  flex-shrink: 0;
}

/* Hide the em dash icon — replaced by inline layout */
.neera-trust__icon {
  display: none;
}

.neera-trust__title {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.78rem;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-dark, #2a1f1a);
}

/* Desc: inline after title, separated by em dash */
.neera-trust__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.78rem;
  font-weight: 300;
  letter-spacing: 0.02em;
  color: var(--color-text-muted, #7a6a5e);
}

.neera-trust__desc::before {
  content: ' — ';
  color: var(--color-border, #c8b89a);
}

@media (max-width: 640px) {
  .neera-trust {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.8rem;
    padding: 1.4rem 6vw;
  }
  .neera-trust__item + .neera-trust__item::before {
    display: none;
  }
}
```


***

### File: `src/pages/Home.jsx` — Add banner JSX between hero and trust bar

```jsx
{/* ANNOUNCEMENT BANNER — place immediately after </section> hero closing tag */}
<div className="neera-banner" role="marquee" aria-label="Discount offer">
  <div className="neera-banner__track">

    {/* Node 1 — original */}
    <div className="neera-banner__content">
      <span className="neera-banner__text">
        Use code <span className="neera-banner__code">NEERA10</span> for 10% off your first order
      </span>
      <span className="neera-banner__dot" aria-hidden="true" />
      <span className="neera-banner__text">Free shipping across India. No minimum.</span>
      <span className="neera-banner__dot" aria-hidden="true" />
      <span className="neera-banner__text">
        Use code <span className="neera-banner__code">NEERA10</span> for 10% off your first order
      </span>
      <span className="neera-banner__dot" aria-hidden="true" />
      <span className="neera-banner__text">Cotton &amp; Linen sarees for working women.</span>
      <span className="neera-banner__dot" aria-hidden="true" />
    </div>

    {/* Node 2 — exact duplicate for seamless loop */}
    <div className="neera-banner__content" aria-hidden="true">
      <span className="neera-banner__text">
        Use code <span className="neera-banner__code">NEERA10</span> for 10% off your first order
      </span>
      <span className="neera-banner__dot" aria-hidden="true" />
      <span className="neera-banner__text">Free shipping across India. No minimum.</span>
      <span className="neera-banner__dot" aria-hidden="true" />
      <span className="neera-banner__text">
        Use code <span className="neera-banner__code">NEERA10</span> for 10% off your first order
      </span>
      <span className="neera-banner__dot" aria-hidden="true" />
      <span className="neera-banner__text">Cotton &amp; Linen sarees for working women.</span>
      <span className="neera-banner__dot" aria-hidden="true" />
    </div>

  </div>
</div>
```


***

### File: `src/components/Navbar.jsx` — Logo size fix

```jsx
{/* Find the existing logo img/svg and add className */}
<img
  src="/images/neera-logo.png"
  alt="Neera"
  className="neera-nav__logo"
/>
```

```css
/* Add to hero.css */
.neera-nav__logo {
  height: 36px;    /* match footer logo rendered height exactly */
  width: auto;
}
```
