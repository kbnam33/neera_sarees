### File: `src/pages/FabricPage.jsx` — Replace page header block

```jsx
{/* REMOVE: breadcrumb component entirely */}
{/* REMOVE: <Breadcrumb /> */}

{/* REMOVE: existing label + h1 + description block */}

{/* REPLACE WITH: */}
<div className="neera-product-page__header">
  <span className="neera-product-page__label">The Collection</span>
  <h1 className="neera-product-page__heading">{fabricName} Sarees.</h1>
  <p className="neera-product-page__desc">{fabricDesc}</p>
</div>
```

**Update `fabricDescriptions` object — crisp, benefit-only:**

```jsx
const fabricDescriptions = {
  linen: "Crisp. Structured. Holds its drape all day.",
  "mul mul cotton": "Feather-light. Breathable. Built for 8-hour days.",
  chettinad: "Bold weaves. Heritage structure. Office-ready.",
  default: `${fabricName} sarees — made for working women.`
};
```


***

### File: `src/pages/AllSarees.jsx` — Replace page header block

```jsx
{/* REMOVE: existing standalone <h1>All Sarees</h1> */}

{/* REPLACE WITH: */}
<div className="neera-product-page__header">
  <span className="neera-product-page__label">The Collection</span>
  <h1 className="neera-product-page__heading">All Sarees.</h1>
</div>
```


***

### File: `src/styles/products.css` — Append

```css
/* ============================================================
   PRODUCT PAGE HEADER — shared across All Sarees + Fabric pages
   ============================================================ */

.neera-product-page {
  padding: 4vh 5vw 8vh;   /* standard width — matches All Sarees */
}

.neera-product-page__header {
  padding-bottom: 2.4rem;
  border-bottom: 1px solid;
  border-image: linear-gradient(
    to right,
    #c8b89a 0%,
    #c8b89a 100%
  ) 1;
  margin-bottom: 2.4rem;
}

.neera-product-page__label {
  display: block;
  font-family: var(--font-sans, sans-serif);
  font-size: var(--text-label, 0.68rem);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  margin-bottom: 0.5rem;
}

.neera-product-page__heading {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 300;
  color: var(--color-text-dark, #2a1f1a);
  letter-spacing: -0.02em;
  margin: 0 0 0.6rem;
}

/* Description: only shown on fabric pages, not All Sarees */
.neera-product-page__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: var(--text-body-sm, 0.88rem);
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  letter-spacing: 0.01em;
  line-height: 1.6;
  margin: 0;
}
```
