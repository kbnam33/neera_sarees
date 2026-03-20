### File: `src/styles/hero.css` — Append

```css
/* ============================================================
   GLOBAL TYPOGRAPHY STANDARD
   Add to :root — applies site-wide
   ============================================================ */

:root {
  --text-label:    0.68rem;   /* section labels, tags — JUST ARRIVED */
  --text-body-sm:  0.88rem;   /* descriptions, footer links */
  --text-body:     1rem;      /* standard body */
  --text-sub:      1.1rem;    /* subtitles */
  --text-heading:  clamp(1.4rem, 2.5vw, 2rem);
  --text-display:  clamp(2.6rem, 5vw, 4.8rem);

  --letter-label:  0.2em;
  --letter-body:   0.01em;
  --letter-cta:    0.16em;
}


/* ============================================================
   NEW IN — Spacing fix
   ============================================================ */

.neera-new-in {
  padding: 8vh 5vw 6vh;     /* 8vh top creates deliberate inhale after fabric panels */
}

.neera-new-in__label {
  font-size: var(--text-label);
  letter-spacing: var(--letter-label);
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  display: block;
  margin-bottom: 0.6rem;
}

.neera-new-in__heading {
  font-family: var(--font-serif, Georgia, serif);
  font-size: var(--text-heading);
  font-weight: 300;
  color: var(--color-text-dark, #2a1f1a);
  letter-spacing: -0.01em;
  margin: 0 0 3rem;          /* clear space between heading and product grid */
}


/* ============================================================
   FOOTER — Readable, hierarchical
   ============================================================ */

.neera-footer {
  padding: 6vh 5vw 4vh;
  background: var(--color-bg, #f5f0eb);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

/* Border top — motif closes the page */
.neera-footer::before {
  content: '';
  display: block;
  width: 100%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent  0%,
    #c8b89a     8%,
    #c8b89a    92%,
    transparent 100%
  );
  margin-bottom: 4vh;
}

/* Logo area */
.neera-footer__logo {
  margin-bottom: 1rem;
}

/* Tagline — should read as brand voice, not fine print */
.neera-footer__tagline {
  font-family: var(--font-sans, sans-serif);
  font-size: var(--text-body-sm);      /* was too small — now 0.88rem */
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  margin-bottom: 3rem;
}

/* Nav links — readable, not microscopic */
.neera-footer__nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.4rem 2.4rem;
  list-style: none;
  padding: 0;
  margin: 0 0 3.5rem;
}

.neera-footer__nav a {
  font-family: var(--font-sans, sans-serif);
  font-size: var(--text-body-sm);      /* 0.88rem — was unreadably small */
  letter-spacing: 0.1em;              /* reduced from excessive tracking */
  text-transform: uppercase;
  color: var(--color-text-dark, #2a1f1a);
  text-decoration: none;
  transition: color 0.25s ease;
}

.neera-footer__nav a:hover {
  color: var(--color-text-muted, #7a6a5e);
}

/* Copyright — clearly the smallest element */
.neera-footer__copy {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
  opacity: 0.6;                        /* visually recedes — it's legalese */
}
```


***

### File: `src/components/Footer.jsx` — Add classNames to existing elements

```jsx
<footer className="neera-footer">
  <div className="neera-footer__logo">
    {/* existing logo component unchanged */}
  </div>

  <p className="neera-footer__tagline">Pure in Every Thread</p>

  <ul className="neera-footer__nav">
    ><a href="/products">All Sarees</a></li>
    ><a href="/our-story">Our Story</a></li>
    ><a href="/contact">Contact Us</a></li>
    ><a href="/shipping">Shipping</a></li>
    ><a href="/exchanges">Exchanges</a></li>
    ><a href="/privacy-policy">Privacy Policy</a></li>
    ><a href="/terms">Terms</a></li>
  </ul>

  <p className="neera-footer__copy">© 2026 Neera. All rights reserved.</p>
</footer>
```


#Next: Execute file `@product_wrappers_details.md`