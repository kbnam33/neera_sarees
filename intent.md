## Technical Plan


***

### File: `src/styles/hero.css` — Replace/update these specific rules

```css
/* ============================================================
   SECTION SPACING SYSTEM — Intentional scroll rhythm
   ============================================================ */

/* Large inhale before Collection — builds gravity */
.neera-trust + .neera-collection {
  margin-top: 6vh;
}

/* Tight exhale after Collection into New In */
.neera-collection + .neera-new-in {
  margin-top: 2vh;
}


/* ============================================================
   COLLECTION — Center of gravity fixes
   ============================================================ */

/* Header: tighter, label inline with heading — less preamble */
.neera-collection__header {
  padding: 2rem 0 1.6rem;
}

/* Grid: asymmetric height — linen (left) taller = more gravity */
.neera-collection__grid {
  grid-template-rows: 1fr;
  align-items: start;
}

/* Linen column: taller image */
.neera-collection__item:first-child .neera-collection__img-wrap {
  height: clamp(260px, 52vh, 500px);
}

/* Mulmul column: slightly shorter — subconscious reads linen as "more" */
.neera-collection__item:last-child .neera-collection__img-wrap {
  height: clamp(220px, 44vh, 420px);
}

/* Both images: same width constraint, no overflow */
.neera-collection__img-wrap {
  width: 100%;
  overflow: hidden;
}

.neera-collection__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.7s ease;
}

.neera-collection__item:hover .neera-collection__img {
  transform: scale(1.03);
}

/* CTA underline: full column width — Linen CTA line visually wider */
.neera-collection__item:first-child .neera-collection__cta-line {
  width: 100%;
}

.neera-collection__item:last-child .neera-collection__cta-line {
  width: 100%;
}


/* ============================================================
   NEW IN — Typography, hierarchy, color
   ============================================================ */

/* Section wrapper — add class neera-new-in to existing section */
.neera-new-in {
  padding: 0 5vw 5vh;
  background: var(--color-bg, #f5f0eb);
}

/* Section label */
.neera-new-in__label {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  display: block;
  margin-bottom: 0.4rem;
}

/* Section heading */
.neera-new-in__heading {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(1.4rem, 2.5vw, 2rem);
  font-weight: 300;
  color: var(--color-text-dark, #2a1f1a);
  margin: 0 0 2rem;
  letter-spacing: -0.01em;
}

/* Product grid — 4 columns, controlled height */
.neera-new-in__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  list-style: none;
  padding: 0;
  margin: 0 0 2rem;
}

/* Product card */
.neera-new-in__card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-decoration: none;
  color: inherit;
}

/* Image: fixed height — all 4 fully visible */
.neera-new-in__img-wrap {
  width: 100%;
  height: clamp(220px, 38vh, 380px);
  overflow: hidden;
  background: #e8e0d8;
}

.neera-new-in__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.6s ease;
}

.neera-new-in__card:hover .neera-new-in__img {
  transform: scale(1.03);
}

/* Product name — Serif, legible, intentional */
.neera-new-in__name {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(0.9rem, 1.4vw, 1.05rem);
  font-weight: 400;
  color: var(--color-text-dark, #2a1f1a);
  line-height: 1.3;
  letter-spacing: -0.005em;
  margin: 0;
}

/* Price — Sans, smaller, muted — reads as footnote not feature */
.neera-new-in__price {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  letter-spacing: 0.03em;
  margin: 0;
}

/* View all CTA — same underline motif */
.neera-new-in__view-all {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dark, #2a1f1a);
  text-decoration: none;
}

.neera-new-in__view-all-line {
  display: block;
  height: 1px;
  background: var(--color-border, #c8b89a);
  transition: background 0.3s ease;
}

.neera-new-in__view-all:hover .neera-new-in__view-all-line {
  background: var(--color-text-dark, #2a1f1a);
}

/* Mobile */
@media (max-width: 640px) {
  .neera-new-in__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  .neera-new-in__img-wrap {
    height: clamp(180px, 42vw, 280px);
  }
}
```


***

### File: `src/pages/Home.jsx` — Update New In section JSX

```jsx
{/* Add className="neera-new-in" to existing section */}
<section className="neera-new-in" aria-label="New Arrivals">

  <span className="neera-new-in__label">Just Arrived</span>
  <h2 className="neera-new-in__heading">New In</h2>

  <ul className="neera-new-in__grid">
    {newArrivals.map(product => (
      >
        <a href={`/products/${product.slug}`} className="neera-new-in__card">
          <div className="neera-new-in__img-wrap">
            <img
              src={product.image}
              alt={`${product.name} — Neera`}
              className="neera-new-in__img"
              loading="lazy"
            />
          </div>
          <p className="neera-new-in__name">{product.name}</p>
          <p className="neera-new-in__price">₹ {product.price}</p>
        </a>
      </li>
    ))}
  </ul>

  <a href="/products" className="neera-new-in__view-all">
    View All Sarees
    <span className="neera-new-in__view-all-line" aria-hidden="true" />
  </a>

</section>
```