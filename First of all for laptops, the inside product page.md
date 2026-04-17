## Technical Plan

### File: `src/styles/products.css` — Replace all image height rules

```css
/* ============================================================
   UNIVERSAL ASPECT RATIO — 9:16 everywhere
   ============================================================ */

/* Grid cards — 9:16 via aspect-ratio */
.neera-product-card__img-wrap {
  width: 100%;
  aspect-ratio: 9 / 16;      /* true 9:16 — no clamp height needed */
  height: auto;              /* let aspect-ratio drive height */
  overflow: hidden;
  background: #e8e0d8;
}

.neera-product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
  transition: transform 0.6s ease;
}

.neera-product-card:hover .neera-product-card__img {
  transform: scale(1.03);
}

/* Product detail — large 9:16 frame */
.neera-product-detail__img-wrap {
  width: 100%;
  aspect-ratio: 9 / 16;
  height: auto;
  overflow: hidden;
  background: #e8e0d8;
}

.neera-product-detail__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

/* Desktop: constrain detail image width so 9:16 doesn't become too tall */
@media (min-width: 1025px) {
  .neera-product-detail__img-wrap {
    width: 100%;
    max-width: 520px;          /* at 520px wide, height = 924px — full portrait */
    aspect-ratio: 9 / 16;
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  .neera-product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
  }
  .neera-product-detail__img-wrap {
    max-width: 420px;
  }
}

/* Mobile L */
@media (min-width: 415px) and (max-width: 767px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.9rem;
  }
}

/* Mobile M */
@media (min-width: 360px) and (max-width: 414px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}

/* Mobile S */
@media (max-width: 359px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
}
```


***

### File: wherever product detail page renders price — fix formatting

```jsx
{/* Replace existing price display */}
<p className="neera-product-detail__price">
  ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
</p>
```


***

### File: `src/pages/ProductPage.jsx` — Remove breadcrumb

```jsx
{/* DELETE this line — remove breadcrumb entirely */}
{/* <Breadcrumb /> or whatever the breadcrumb component is called */}
```