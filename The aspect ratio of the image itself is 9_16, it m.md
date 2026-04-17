## Technical Plan

### File: `src/styles/products.css` — Replace all image wrap + img rules

```css
/* ============================================================
   PRODUCT IMAGE CONTAINERS
   Natural image ratio: 4284 × 5712 = 3:4 (width:height)
   Containers use aspect-ratio: 3/4 — image fits fully, no crop
   ============================================================ */

/* LISTING GRID — card image */
.neera-product-card__img-wrap {
  width: 100%;
  aspect-ratio: 3 / 4;        /* matches actual image dimensions — no crop ever */
  height: auto;
  overflow: hidden;
  background: #e8e0d8;
}

.neera-product-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;        /* contain — shows full image, no crop, no cut */
  object-position: center;
  transition: transform 0.6s ease;
  background: #e8e0d8;        /* bg fills any letterbox if image doesn't fill exactly */
}

.neera-product-card:hover .neera-product-card__img {
  transform: scale(1.03);
}


/* PRODUCT DETAIL PAGE — large display */
.neera-product-detail__img-wrap {
  width: 100%;
  aspect-ratio: 3 / 4;        /* same natural ratio */
  height: auto;
  overflow: visible;          /* never clips */
  background: #e8e0d8;
}

.neera-product-detail__img {
  width: 100%;
  height: 100%;
  object-fit: contain;        /* full image always visible */
  object-position: center top;
  background: #e8e0d8;
}

/* Desktop: detail image constrained to left column width */
@media (min-width: 1025px) {
  .neera-product-detail__img-wrap {
    max-width: 100%;           /* fills its grid column — aspect-ratio drives height */
  }
}

/* Tablet */
@media (min-width: 768px) and (max-width: 1024px) {
  .neera-product-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.2rem;
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

## What This Does Differently

| Before | Now |
| :-- | :-- |
| `object-fit: cover` — crops to fill frame | `object-fit: contain` — full image always visible |
| Fixed `clamp` heights — forced dimensions | `aspect-ratio: 3/4` — container shape matches actual image shape |
| 9:16 assumed — wrong | 3:4 derived from actual pixel dimensions `4284 × 5712` |
| Detail image clipped | `overflow: visible` + `contain` — nothing hidden |
| Grid image cropped at feet | Container is exactly the same proportion as the image — perfect fit |

The key instruction: **`object-fit: contain` not `cover`** — this is the single most important change. The container shape (`aspect-ratio: 3/4`) matches the image, so contain fills the frame completely with zero letterboxing.

