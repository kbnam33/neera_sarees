### File: `src/styles/products.css` — New file (or wherever product grid styles live)

```css
/* ============================================================
   GLOBAL PRODUCT CARD STANDARD
   Applies to: Home New In, All Sarees, Fabric pages (Linen, Mulmul, Chettinad)
   ============================================================ */

/* Shared product grid container — same width system everywhere */
.neera-product-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.2rem;
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Shared page section wrapper — All Sarees, Linen, Mulmul pages */
.neera-product-page {
  padding: 4vh 5vw 8vh;
  background: var(--color-bg, #f5f0eb);
}

/* Shared card */
.neera-product-card {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

/* IMAGE — single standard height sitewide */
.neera-product-card__img-wrap {
  width: 100%;
  height: clamp(320px, 55vh, 520px);
  overflow: hidden;
  background: #e8e0d8;
}

.neera-product-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 15%;
  transition: transform 0.6s ease;
}

.neera-product-card:hover .neera-product-card__img {
  transform: scale(1.03);
}

/* META — single standard hierarchy sitewide */
.neera-product-card__meta {
  padding-top: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.neera-product-card__name {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(0.92rem, 1.3vw, 1rem);
  font-weight: 400;
  color: var(--color-text-dark, #2a1f1a);
  line-height: 1.35;
  letter-spacing: 0.005em;
  margin: 0 0 0.5rem;
}

.neera-product-card__price {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.78rem;
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  letter-spacing: 0.06em;
  margin: 0;
}

/* Mobile */
@media (max-width: 768px) {
  .neera-product-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.8rem;
  }
  .neera-product-card__img-wrap {
    height: clamp(200px, 48vw, 320px);
  }
}
```


***

### File: `src/App.jsx` or `src/index.css`

```js
import './styles/products.css';
```


***

### File: `src/pages/Home.jsx` — Update New In card JSX

Replace existing card markup with shared class names:

```jsx
<ul className="neera-product-grid">
  {newArrivals.map(product => (
    >
      <a href={`/products/${product.slug}`} className="neera-product-card">
        <div className="neera-product-card__img-wrap">
          <img
            src={product.image}
            alt={`${product.name} — Neera`}
            className="neera-product-card__img"
            loading="lazy"
          />
        </div>
        <div className="neera-product-card__meta">
          <p className="neera-product-card__name">{product.name}</p>
          <p className="neera-product-card__price">
            ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </p>
        </div>
      </a>
    </li>
  ))}
</ul>
```


***

### File: `src/pages/AllSarees.jsx` — Update existing grid

```jsx
{/* 1. Wrap page in shared container */}
<div className="neera-product-page">
  <h1 className="neera-new-in__heading">All Sarees</h1>
  {/* sort dropdown unchanged */}

  {/* 2. Replace existing grid className with shared standard */}
  <ul className="neera-product-grid">
    {products.map(product => (
      >
        <a href={`/products/${product.slug}`} className="neera-product-card">
          <div className="neera-product-card__img-wrap">
            <img
              src={product.image}
              alt={`${product.name} — Neera`}
              className="neera-product-card__img"
              loading="lazy"
            />
          </div>
          <div className="neera-product-card__meta">
            <p className="neera-product-card__name">{product.name}</p>
            <p className="neera-product-card__price">
              ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </a>
      </li>
    ))}
  </ul>
</div>
```


***

### File: `src/pages/FabricPage.jsx` — Update existing grid

```jsx
{/* Same pattern — wrap in shared container, use shared card classes */}
<div className="neera-product-page">
  {/* existing breadcrumb, heading, description unchanged */}

  <ul className="neera-product-grid">
    {filteredProducts.map(product => (
      >
        <a href={`/products/${product.slug}`} className="neera-product-card">
          <div className="neera-product-card__img-wrap">
            <img
              src={product.image}
              alt={`${product.name} — Neera`}
              className="neera-product-card__img"
              loading="lazy"
            />
          </div>
          <div className="neera-product-card__meta">
            <p className="neera-product-card__name">{product.name}</p>
            <p className="neera-product-card__price">
              ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </p>
          </div>
        </a>
      </li>
    ))}
  </ul>
</div>
```


***

### File: `src/styles/hero.css` — Remove these now-redundant rules

```css
/* DELETE these blocks — replaced by neera-product-card standard in products.css */
.neera-new-in__img-wrap { ... }
.neera-new-in__img { ... }
.neera-new-in__name { ... }
.neera-new-in__price { ... }
.neera-new-in__meta { ... }
.neera-new-in__grid { ... }
```

