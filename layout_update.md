### File: `src/pages/Home.jsx` — Replace `.neera-collection` section entirely

```jsx
<section className="neera-fabrics" aria-label="Shop by Fabric — Cotton and Linen Sarees">

  {/* Panel 1 — Pure Linen */}
  <a href="/fabric/linen" className="neera-fabrics__panel neera-fabrics__panel--linen">

    <div className="neera-fabrics__img-wrap" aria-hidden="true">
      <img
        src="/images/collection-linen.jpg"
        alt="Pure linen saree draped — Neera Presentation Days"
        className="neera-fabrics__img"
        loading="lazy"
      />
    </div>

    <div className="neera-fabrics__divider" aria-hidden="true" />

    <div className="neera-fabrics__content">
      <span className="neera-fabrics__tag">Pure Linen</span>
      <p className="neera-fabrics__headline">Presentation<br />Days.</p>
      <p className="neera-fabrics__desc">
        Crisp structure that holds the drape.<br />
        Looks senior-level from the first<br />
        meeting to the last.
      </p>
      <span className="neera-fabrics__cta">
        Shop Linen
        <span className="neera-fabrics__cta-line" aria-hidden="true" />
      </span>
    </div>

  </a>

  {/* Panel 2 — Mulmul Cotton */}
  <a href="/fabric/mulmul" className="neera-fabrics__panel neera-fabrics__panel--mulmul">

    <div className="neera-fabrics__content neera-fabrics__content--right">
      <span className="neera-fabrics__tag">Mulmul Cotton</span>
      <p className="neera-fabrics__headline">Everyday<br />at Work.</p>
      <p className="neera-fabrics__desc">
        Feather-light. Doesn't cling.<br />
        Stays soft after 8 hours<br />
        in the office.
      </p>
      <span className="neera-fabrics__cta">
        Shop Mulmul
        <span className="neera-fabrics__cta-line" aria-hidden="true" />
      </span>
    </div>

    <div className="neera-fabrics__divider" aria-hidden="true" />

    <div className="neera-fabrics__img-wrap" aria-hidden="true">
      <img
        src="/images/collection-mulmul.jpg"
        alt="Mulmul cotton saree — Neera Everyday at Work"
        className="neera-fabrics__img"
        loading="lazy"
      />
    </div>

  </a>

</section>
```


***

### File: `src/styles/hero.css` — Append

```css
/* ============================================================
   FABRIC PANELS
   ============================================================ */

.neera-fabrics {
  display: flex;
  flex-direction: column;
  margin-top: 6vh;
}

/* Each panel: full width, fixed viewport height */
.neera-fabrics__panel {
  display: grid;
  grid-template-columns: 60fr 1px 40fr;
  height: 88vh;
  min-height: 520px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  position: relative;
}

/* Mulmul: reversed — image on right, content on left */
.neera-fabrics__panel--mulmul {
  grid-template-columns: 40fr 1px 60fr;
}

/* Image fills its cell completely */
.neera-fabrics__img-wrap {
  overflow: hidden;
  height: 100%;
  position: relative;
}

.neera-fabrics__img {
  width: 100%;
  height: 110%;           /* extra 10% for parallax travel */
  object-fit: cover;
  object-position: center top;
  transition: transform 0.8s ease;
  will-change: transform;
}

/* Parallax on hover — depth cue */
.neera-fabrics__panel:hover .neera-fabrics__img {
  transform: scale(1.04) translateY(-2%);
}

/* The border divider — saree motif as structural element */
.neera-fabrics__divider {
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent    0%,
    var(--color-border, #c8b89a) 12%,
    var(--color-border, #c8b89a) 88%,
    transparent  100%
  );
  align-self: stretch;
}

/* Content area */
.neera-fabrics__content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5vw;
  gap: 1.2rem;
  background: var(--color-bg, #f5f0eb);
}

/* Fabric tag */
.neera-fabrics__tag {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
}

/* Headline — large, owns the space */
.neera-fabrics__headline {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(2.2rem, 4.5vw, 4rem);
  font-weight: 300;
  line-height: 1.05;
  letter-spacing: -0.02em;
  color: var(--color-text-dark, #2a1f1a);
  margin: 0;
}

/* Description */
.neera-fabrics__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.82rem, 1.3vw, 0.95rem);
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  line-height: 1.7;
  margin: 0;
}

/* CTA */
.neera-fabrics__cta {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.75rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--color-text-dark, #2a1f1a);
  margin-top: 0.8rem;
  width: fit-content;
}

.neera-fabrics__cta-line {
  display: block;
  height: 1px;
  background: var(--color-border, #c8b89a);
  transition: background 0.3s ease;
}

.neera-fabrics__panel:hover .neera-fabrics__cta-line {
  background: var(--color-text-dark, #2a1f1a);
}

/* Horizontal border between panel 1 and panel 2 — motif continues */
.neera-fabrics__panel + .neera-fabrics__panel {
  border-top: 1px solid;
  border-image: linear-gradient(
    to right,
    transparent 0%,
    var(--color-border, #c8b89a) 8%,
    var(--color-border, #c8b89a) 92%,
    transparent 100%
  ) 1;
}

/* Mobile: stack image above content, full width */
@media (max-width: 768px) {
  .neera-fabrics__panel,
  .neera-fabrics__panel--mulmul {
    grid-template-columns: 1fr;
    grid-template-rows: 52vw 1px auto;
    height: auto;
  }

  .neera-fabrics__divider {
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

  .neera-fabrics__content,
  .neera-fabrics__content--right {
    padding: 2.4rem 6vw;
  }

  /* Mulmul: on mobile image goes back to top */
  .neera-fabrics__panel--mulmul .neera-fabrics__img-wrap {
    order: -1;
  }
  .neera-fabrics__panel--mulmul .neera-fabrics__divider {
    order: 0;
  }
  .neera-fabrics__panel--mulmul .neera-fabrics__content--right {
    order: 1;
  }
}