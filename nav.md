/* ============================================================
   RESPONSIVE PRODUCT GRID — all screen sizes
   ============================================================ */

/* Mobile S — 320px */
@media (max-width: 359px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.6rem;
  }
  .neera-product-card__img-wrap {
    height: clamp(180px, 68vw, 220px);
  }
  .neera-product-card__name {
    font-size: 0.78rem;
  }
  .neera-product-card__price {
    font-size: 0.7rem;
  }
}

/* Mobile M — 360px to 414px */
@media (min-width: 360px) and (max-width: 414px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
  .neera-product-card__img-wrap {
    height: clamp(220px, 74vw, 300px);
  }
  .neera-product-card__name {
    font-size: 0.82rem;
    line-height: 1.3;
  }
  .neera-product-card__price {
    font-size: 0.72rem;
  }
}

/* Mobile L — 415px to 767px */
@media (min-width: 415px) and (max-width: 767px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.9rem;
  }
  .neera-product-card__img-wrap {
    height: clamp(260px, 72vw, 360px);
  }
  .neera-product-card__name {
    font-size: 0.85rem;
    line-height: 1.3;
  }
  .neera-product-card__price {
    font-size: 0.75rem;
  }
}

/* Tablet — 768px to 1024px */
@media (min-width: 768px) and (max-width: 1024px) {
  .neera-product-grid {
    grid-template-columns: repeat(3, 1fr);   /* 3 columns — not 4, not 2 */
    gap: 1.2rem;
  }
  .neera-product-card__img-wrap {
    height: clamp(300px, 44vw, 420px);       /* portrait ratio at 3-col */
  }
  .neera-product-card__name {
    font-size: 0.9rem;
    line-height: 1.35;
  }
  .neera-product-card__price {
    font-size: 0.78rem;
  }
  /* Product page padding tighter on tablet */
  .neera-product-page {
    padding: 3vh 4vw 6vh;
  }
  /* New In section padding */
  .neera-new-in {
    padding: 6vh 4vw 5vh;
  }
}