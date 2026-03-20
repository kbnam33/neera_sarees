## Technical Plan

### File: `src/pages/Home.jsx` — Replace hero content block

```jsx
<div className="neera-hero__upper" aria-hidden="true">
  <span className="neera-hero__watermark">Cotton &amp; Linen · Neera</span>
</div>

<div className="neera-hero__lower">
  <p className="neera-hero__headline">
    Wear what<br />the day demands.
  </p>
  <p className="neera-hero__sub">
    From the first meeting to the last.
  </p>
  <a href="/products" className="neera-hero__cta"
     aria-label="Shop Neera sarees">
    Explore the Collection
    <span className="neera-hero__cta-line" aria-hidden="true" />
  </a>
</div>
```


***

### File: `src/styles/hero.css` — Replace all hero content rules

```css
/* Remove old .neera-hero__content entirely */

/* Upper register — brand watermark in the sage emptiness */
.neera-hero__upper {
  position: absolute;
  top: 22%;
  right: 5vw;
  z-index: 2;
}

.neera-hero__watermark {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.62rem;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);   /* barely there — found, not announced */
  display: block;
  writing-mode: horizontal-tb;
}

/* Lower register — anchored to bottom-right corner */
.neera-hero__lower {
  position: absolute;
  bottom: 7vh;
  right: 5vw;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;       /* everything flush right */
  gap: 1.1rem;
  max-width: 520px;
  animation: hero-rise 1s ease-out both;
}

/* Headline: large, right-aligned, two lines of equal visual weight */
.neera-hero__headline {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(2.6rem, 4.2vw, 3.8rem);
  font-weight: 300;
  line-height: 1.08;
  letter-spacing: -0.025em;
  color: #ffffff;
  margin: 0;
  text-align: right;
  text-shadow: 0 2px 32px rgba(0, 0, 0, 0.12);
}

/* Subtitle: short, right-aligned, one line */
.neera-hero__sub {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.78rem, 1vw, 0.88rem);
  font-weight: 300;
  color: rgba(255, 255, 255, 0.65);
  letter-spacing: 0.02em;
  line-height: 1.6;
  margin: 0;
  text-align: right;
  white-space: nowrap;         /* one clean line — no wrap */
}

/* CTA: flush right, underline motif */
.neera-hero__cta {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 5px;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #ffffff;
  text-decoration: none;
}

.neera-hero__cta-line {
  display: block;
  height: 1px;
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  transition: background 0.35s ease;
}

.neera-hero__cta:hover .neera-hero__cta-line {
  background: #ffffff;
}

/* Overlay: protect lower-right only — sage stays raw everywhere else */
.neera-hero__overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      ellipse 60% 55% at 85% 80%,
      rgba(0, 0, 0, 0.42) 0%,
      rgba(0, 0, 0, 0.0) 100%
    );
}

/* Mobile */
@media (max-width: 640px) {
  .neera-hero__upper {
    top: 18%;
    right: 6vw;
  }
  .neera-hero__lower {
    right: 6vw;
    bottom: 10vh;
    max-width: 88vw;
  }
  .neera-hero__headline {
    font-size: clamp(2rem, 8vw, 2.8rem);
  }
  .neera-hero__sub {
    white-space: normal;
  }
}
```
