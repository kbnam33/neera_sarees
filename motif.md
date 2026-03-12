### File: `src/pages/Home.jsx` — Replace existing trust bar section

```jsx
<section className="neera-trust" aria-label="Why Neera">

  <div className="neera-trust__border-top" aria-hidden="true" />

  <ul className="neera-trust__grid">

    >
      <span className="neera-trust__icon" aria-hidden="true">—</span>
      <strong className="neera-trust__title">Free Shipping Across India</strong>
      <span className="neera-trust__desc">Every order. No minimum.</span>
    </li>

    >
      <span className="neera-trust__icon" aria-hidden="true">—</span>
      <strong className="neera-trust__title">Built for 8-Hour Days</strong>
      <span className="neera-trust__desc">Pleats that stay. Fabric that doesn't cling.</span>
    </li>

    >
      <span className="neera-trust__icon" aria-hidden="true">—</span>
      <strong className="neera-trust__title">Cotton &amp; Linen Only</strong>
      <span className="neera-trust__desc">Breathable. Minimal. Office-appropriate.</span>
    </li>

  </ul>

  <div className="neera-trust__border-bottom" aria-hidden="true" />

</section>
```


***

### File: `src/styles/hero.css` — Append to existing file

```css
/* ============================================================
   TRUST BAR — Saree border motif
   ============================================================ */

.neera-trust {
  position: relative;
  background-color: var(--color-bg, #f5f0eb);   /* same as site bg */
  padding: 0 5vw;
}

/* The saree border lines — top and bottom of the strip */
.neera-trust__border-top,
.neera-trust__border-bottom {
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent 0%,
    var(--color-border, #c8b89a) 8%,
    var(--color-border, #c8b89a) 92%,
    transparent 100%
  );
}

/* Grid: 3 equal columns, center-aligned */
.neera-trust__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  list-style: none;
  margin: 0;
  padding: 0;
}

/* Vertical divider between items — using saree border color */
.neera-trust__item + .neera-trust__item {
  border-left: 1px solid var(--color-border, #c8b89a);
}

.neera-trust__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.4rem 2rem;
  gap: 0.4rem;
}

/* Em dash — acts as the woven motif mark */
.neera-trust__icon {
  display: block;
  font-size: 1rem;
  color: var(--color-border, #c8b89a);
  letter-spacing: 0.1em;
  margin-bottom: 0.6rem;
  font-weight: 300;
}

.neera-trust__title {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(0.85rem, 1.5vw, 1rem);
  font-weight: 500;
  color: var(--color-text-dark, #2a1f1a);
  letter-spacing: 0.01em;
  line-height: 1.3;
}

.neera-trust__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.75rem, 1.2vw, 0.85rem);
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  letter-spacing: 0.02em;
  line-height: 1.5;
}

/* Mobile: stack vertically, horizontal dividers replace vertical */
@media (max-width: 640px) {
  .neera-trust__grid {
    grid-template-columns: 1fr;
  }

  .neera-trust__item + .neera-trust__item {
    border-left: none;
    border-top: 1px solid var(--color-border, #c8b89a);
  }

  .neera-trust__item {
    padding: 1.8rem 6vw;
  }
}
```


***

## What Each Decision Does

| Decision | Why |
| :-- | :-- |
| Top + bottom border lines with fade-out gradient ends | Saree border motif — the line doesn't hard-stop, it **fades like a woven edge** |
| Em dash `—` as the icon | Replaces generic icons with a typographic mark — restrained, editorial, on-brand |
| Vertical divider same color as border lines | Motif repeats — the whole section feels **woven** |
| Serif for title, light sans for desc | Same type hierarchy as hero — system feels continuous |
| Background matches site bg | Section doesn't interrupt the scroll flow — it's a **breath**, not a break |
| `<ul>` + `>` semantic markup | Google reads these as distinct trust signals — structured data friendly |

