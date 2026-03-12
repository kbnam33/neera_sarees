### File: `src/pages/Home.jsx` — Replace "The Collection" section entirely

```jsx
<section className="neera-collection" aria-label="Shop by Fabric">

  <div className="neera-collection__border-top" aria-hidden="true" />

  <header className="neera-collection__header">
    <span className="neera-collection__label">The Collection</span>
    <h2 className="neera-collection__heading">Choose your fabric.</h2>
  </header>

  <div className="neera-collection__grid">

    <a href="/fabric/linen" className="neera-collection__item">
      <div className="neera-collection__img-wrap">
        <img
          src="/images/collection-linen.jpg"
          alt="Pure linen sarees for office — Neera"
          className="neera-collection__img"
          loading="lazy"
        />
      </div>
      <div className="neera-collection__meta">
        <span className="neera-collection__fabric-tag">Pure Linen</span>
        <p className="neera-collection__title">Presentation Days</p>
        <p className="neera-collection__desc">Crisp structure. Holds the drape. Looks senior-level from the first meeting to the last.</p>
        <span className="neera-collection__cta">
          Shop Linen
          <span className="neera-collection__cta-line" aria-hidden="true" />
        </span>
      </div>
    </a>

    <div className="neera-collection__divider" aria-hidden="true" />

    <a href="/fabric/mulmul" className="neera-collection__item">
      <div className="neera-collection__img-wrap">
        <img
          src="/images/collection-mulmul.jpg"
          alt="Mulmul cotton sarees for everyday office wear — Neera"
          className="neera-collection__img"
          loading="lazy"
        />
      </div>
      <div className="neera-collection__meta">
        <span className="neera-collection__fabric-tag">Mulmul Cotton</span>
        <p className="neera-collection__title">Everyday at Work</p>
        <p className="neera-collection__desc">Feather-light. Doesn't cling. Stays soft after 8 hours in the office.</p>
        <span className="neera-collection__cta">
          Shop Mulmul
          <span className="neera-collection__cta-line" aria-hidden="true" />
        </span>
      </div>
    </a>

  </div>

  <div className="neera-collection__border-bottom" aria-hidden="true" />

</section>
```


***

### File: `src/styles/hero.css` — Append

```css
/* ============================================================
   THE COLLECTION
   ============================================================ */

.neera-collection {
  padding: 0 5vw;
  background: var(--color-bg, #f5f0eb);
}

.neera-collection__border-top,
.neera-collection__border-bottom {
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

/* Section header */
.neera-collection__header {
  display: flex;
  align-items: baseline;
  gap: 1.6rem;
  padding: 2.4rem 0 2rem;
}

.neera-collection__label {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
}

.neera-collection__heading {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(1.6rem, 3vw, 2.4rem);
  font-weight: 300;
  color: var(--color-text-dark, #2a1f1a);
  margin: 0;
  letter-spacing: -0.01em;
}

/* Two-column grid */
.neera-collection__grid {
  display: grid;
  grid-template-columns: 1fr 1px 1fr;  /* divider is a column */
  gap: 0;
  min-height: 0;
}

/* The center vertical divider — saree border motif */
.neera-collection__divider {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-border, #c8b89a) 8%,
    var(--color-border, #c8b89a) 92%,
    transparent 100%
  );
  margin: 0 2vw;
}

/* Each fabric item */
.neera-collection__item {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding: 0 2vw 2.4rem;
  text-decoration: none;
  color: inherit;
}

/* Image constrained to viewport — fully visible without scroll */
.neera-collection__img-wrap {
  width: 100%;
  height: clamp(240px, 48vh, 480px);  /* key constraint */
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

/* Meta below image */
.neera-collection__meta {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.neera-collection__fabric-tag {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.68rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
}

.neera-collection__title {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(1.2rem, 2vw, 1.6rem);
  font-weight: 400;
  color: var(--color-text-dark, #2a1f1a);
  margin: 0;
  letter-spacing: -0.01em;
}

.neera-collection__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.78rem, 1.2vw, 0.88rem);
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  line-height: 1.6;
  margin: 0;
  max-width: 380px;
}

/* CTA — same underline motif as hero */
.neera-collection__cta {
  display: inline-flex;
  flex-direction: column;
  gap: 5px;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dark, #2a1f1a);
  margin-top: 0.4rem;
}

.neera-collection__cta-line {
  display: block;
  height: 1px;
  background: var(--color-border, #c8b89a);
  transition: background 0.3s ease;
}

.neera-collection__item:hover .neera-collection__cta-line {
  background: var(--color-text-dark, #2a1f1a);
}

/* Mobile */
@media (max-width: 640px) {
  .neera-collection__grid {
    grid-template-columns: 1fr;
  }
  .neera-collection__divider {
    height: 1px;
    width: 100%;
    margin: 0;
    background: linear-gradient(
      to right,
      transparent 0%,
      var(--color-border, #c8b89a) 8%,
      var(--color-border, #c8b89a) 92%,
      transparent 100%
    );
  }
  .neera-collection__item {
    padding: 2rem 0;
  }
  .neera-collection__img-wrap {
    height: clamp(220px, 45vw, 320px);
  }
}
```