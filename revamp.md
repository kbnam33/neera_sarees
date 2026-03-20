### File: `src/pages/Home.jsx` — Replace `.neera-fabrics` section entirely

```jsx
<section className="neera-chapters" aria-label="Shop by Fabric">

  <a href="/fabric/linen" className="neera-chapters__card">
    <div className="neera-chapters__spine" aria-hidden="true">
      <span className="neera-chapters__spine-text">01 / Linen</span>
    </div>
    <div className="neera-chapters__img-wrap">
      <img
        src="/images/collection-linen-model.jpg"
        alt="Pure linen saree for office — Neera"
        className="neera-chapters__img"
        loading="lazy"
      />
    </div>
    <div className="neera-chapters__content">
      <div className="neera-chapters__content-inner">
        <span className="neera-chapters__tag">Pure Linen</span>
        <p className="neera-chapters__headline">Presentation<br />Days.</p>
        <p className="neera-chapters__desc">Crisp structure that holds the drape. Looks senior-level from the first meeting to the last.</p>
        <span className="neera-chapters__cta">
          Shop Linen
          <span className="neera-chapters__cta-line" aria-hidden="true" />
        </span>
      </div>
    </div>
  </a>

  <div className="neera-chapters__rule" aria-hidden="true">
    <span className="neera-chapters__rule-line" />
    <span className="neera-chapters__rule-text">Pure in Every Thread</span>
    <span className="neera-chapters__rule-line" />
  </div>

  <a href="/fabric/mulmul" className="neera-chapters__card">
    <div className="neera-chapters__spine" aria-hidden="true">
      <span className="neera-chapters__spine-text">02 / Mulmul</span>
    </div>
    <div className="neera-chapters__img-wrap">
      <img
        src="/images/collection-mulmul.jpg"
        alt="Mulmul cotton saree for everyday office — Neera"
        className="neera-chapters__img"
        loading="lazy"
      />
    </div>
    <div className="neera-chapters__content neera-chapters__content--warm">
      <div className="neera-chapters__content-inner">
        <span className="neera-chapters__tag">Mulmul Cotton</span>
        <p className="neera-chapters__headline">Everyday<br />at Work.</p>
        <p className="neera-chapters__desc">Feather-light. Doesn't cling. Stays soft after 8 hours in the office.</p>
        <span className="neera-chapters__cta">
          Shop Mulmul
          <span className="neera-chapters__cta-line" aria-hidden="true" />
        </span>
      </div>
    </div>
  </a>

</section>
```


***

### File: `src/styles/hero.css` — Delete all existing `.neera-fabrics` blocks, append this

```css
.neera-chapters {
  display: flex;
  flex-direction: column;
  margin-top: 6vh;
}

.neera-chapters__card {
  display: grid;
  grid-template-columns: 48px 1fr 38%;
  height: 82vh;
  min-height: 500px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
}

.neera-chapters__spine {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg, #f5f0eb);
  border-right: 1px solid #c8b89a;
}

.neera-chapters__spine-text {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  writing-mode: vertical-rl;
  text-orientation: mixed;
  transform: rotate(180deg);
}

.neera-chapters__img-wrap {
  overflow: hidden;
  height: 100%;
}

.neera-chapters__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  transition: transform 0.9s ease;
}

.neera-chapters__card:hover .neera-chapters__img {
  transform: scale(1.04);
}

.neera-chapters__content {
  background: #1e1a17;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
}

.neera-chapters__content--warm {
  background: #231d19;
}

.neera-chapters__content-inner {
  padding: 0 3.5vw 5vh;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  width: 100%;
}

.neera-chapters__tag {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.62rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: rgba(245, 240, 235, 0.45);
}

.neera-chapters__headline {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(2.4rem, 4.5vw, 4.4rem);
  font-weight: 300;
  line-height: 1.0;
  letter-spacing: -0.025em;
  color: #f5f0eb;
  margin: 0;
}

.neera-chapters__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.78rem, 1.1vw, 0.88rem);
  font-weight: 300;
  color: rgba(245, 240, 235, 0.6);
  line-height: 1.7;
  margin: 0;
  max-width: 280px;
}

.neera-chapters__cta {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #f5f0eb;
  margin-top: 0.6rem;
  width: fit-content;
  text-decoration: none;
}

.neera-chapters__cta-line {
  display: block;
  height: 1px;
  background: rgba(245, 240, 235, 0.35);
  transition: background 0.3s ease;
}

.neera-chapters__card:hover .neera-chapters__cta-line {
  background: #f5f0eb;
}

.neera-chapters__rule {
  display: flex;
  align-items: center;
  gap: 1.6rem;
  padding: 2.2vh 0 2.2vh 48px;
  background: var(--color-bg, #f5f0eb);
}

.neera-chapters__rule-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, #c8b89a, transparent);
}

.neera-chapters__rule-line:last-child {
  background: linear-gradient(to left, #c8b89a, transparent);
}

.neera-chapters__rule-text {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.62rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  white-space: nowrap;
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .neera-chapters__card {
    grid-template-columns: 1fr;
    grid-template-rows: auto 52vw auto;
    height: auto;
  }
  .neera-chapters__spine {
    writing-mode: horizontal-tb;
    border-right: none;
    border-bottom: 1px solid #c8b89a;
    padding: 1rem 6vw;
    justify-content: flex-start;
  }
  .neera-chapters__spine-text {
    writing-mode: horizontal-tb;
    transform: none;
    font-size: 0.65rem;
  }
  .neera-chapters__img-wrap {
    height: 52vw;
  }
  .neera-chapters__content {
    align-items: flex-start;
  }
  .neera-chapters__content-inner {
    padding: 2.4rem 6vw 3rem;
  }
  .neera-chapters__rule {
    padding-left: 6vw;
  }
}
```

