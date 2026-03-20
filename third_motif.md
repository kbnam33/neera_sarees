### File: `src/styles/hero.css` — Replace existing `.neera-fabrics` content rules only

Note: However, one thing to verify: the `.neera-fabrics__content--right` block in the latest plan **is a repeat** — it has identical properties to `.neera-fabrics__content`.

```css
/* ============================================================
   FABRIC PANELS — Gravity refinement
   ============================================================ */

/* Content column: faint warm tint — reads as interior depth */
.neera-fabrics__content {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;        /* anchor to bottom third */
  padding: 0 5vw 8vh;               /* generous bottom padding = low anchor */
  gap: 1.1rem;
  background: #ede8e1;              /* 4% darker than site bg — subtle depth */
  position: relative;
}

Cursor should consolidate those into one rule:

/* Same for right-side content (Mulmul) */
.neera-fabrics__content--right {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 0 5vw 8vh;
  gap: 1.1rem;
  background: #ede8e1;
  position: relative;
}

/* Fabric tag: saree border motif line before text */
.neera-fabrics__tag {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.68rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--color-text-muted, #7a6a5e);
}

/* The border-line before tag — motif as punctuation */
.neera-fabrics__tag::before {
  content: '';
  display: block;
  width: 28px;
  height: 1px;
  background: var(--color-border, #c8b89a);
  flex-shrink: 0;
}

/* Headline: larger, owns the content column */
.neera-fabrics__headline {
  font-family: var(--font-serif, Georgia, serif);
  font-size: clamp(2.6rem, 5vw, 4.8rem);
  font-weight: 300;
  line-height: 1.0;
  letter-spacing: -0.025em;
  color: var(--color-text-dark, #2a1f1a);
  margin: 0;
}

/* Description: max width — prevents line stretching across full 40% */
.neera-fabrics__desc {
  font-family: var(--font-sans, sans-serif);
  font-size: clamp(0.82rem, 1.2vw, 0.92rem);
  font-weight: 300;
  color: var(--color-text-muted, #7a6a5e);
  line-height: 1.75;
  margin: 0;
  max-width: 300px;
}

/* CTA: margin-top creates deliberate pause before the ask */
.neera-fabrics__cta {
  display: inline-flex;
  flex-direction: column;
  gap: 6px;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-dark, #2a1f1a);
  margin-top: 1.2rem;
  width: fit-content;
  text-decoration: none;
}

.neera-fabrics__cta-line {
  display: block;
  height: 1px;
  width: 100%;
  background: var(--color-border, #c8b89a);
  transition: background 0.35s ease, width 0.35s ease;
  transform-origin: left;
}

.neera-fabrics__panel:hover .neera-fabrics__cta-line {
  background: var(--color-text-dark, #2a1f1a);
}

/* Divider: slightly more visible — earns its structural role */
.neera-fabrics__divider {
  width: 1px;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent     0%,
    #c8b89a        10%,
    #c8b89a        90%,
    transparent   100%
  );
  align-self: stretch;
  flex-shrink: 0;
}

/* Image: darken very slightly on panel hover — focus effect */
.neera-fabrics__panel:hover .neera-fabrics__img {
  transform: scale(1.03) translateY(-1.5%);
  filter: brightness(0.97);
}

/* Panel border between Linen and Mulmul */
.neera-fabrics__panel + .neera-fabrics__panel {
  border-top: 1px solid;
  border-image: linear-gradient(
    to right,
    transparent  0%,
    #c8b89a      8%,
    #c8b89a     92%,
    transparent 100%
  ) 1;
}

/* Mobile */
@media (max-width: 768px) {
  .neera-fabrics__content,
  .neera-fabrics__content--right {
    justify-content: flex-start;
    padding: 2.4rem 6vw 3rem;
  }
  .neera-fabrics__headline {
    font-size: clamp(2.2rem, 10vw, 3.2rem);
  }
}
```


***

### File: `src/pages/Home.jsx` — One change only

**Replace the Linen image** — flag for the developer:

```jsx
{/* 
  ACTION REQUIRED: 
  Replace src="/images/collection-linen.jpg" with a MODEL image
  wearing a linen saree — NOT the fabric closeup texture.
  The hero already uses the fabric closeup as bg.
  Using it again here kills novelty and breaks the scroll narrative.
  Suggested: a woman standing, formal posture, office context, cool/neutral light.
*/}
<img
  src="/images/collection-linen-model.jpg"   {/* changed filename */}
  alt="Pure linen saree for office — Neera Presentation Days"
  className="neera-fabrics__img"
  loading="lazy"
/>
```


***

## What This Achieves

| Problem | Fix | Gravity Effect |
| :-- | :-- | :-- |
| Content floats at center | `justify-content: flex-end` + `padding-bottom: 8vh` | Text anchors low — weight pulls the eye down into it |
| Content column is flat beige | `background: #ede8e1` | Interior depth — image = world outside, content = space you enter |
| Tag is plain label | `::before` line — 28px border motif | Tag reads as a woven marker, not a category label |
| Headline undersized for 40% column | `clamp(2.6rem, 5vw, 4.8rem)` | Headline owns the space — no orphaned whitespace above |
| Linen image = same as hero | Flag to replace with model image | Each section tells a new chapter — not a repeat |
| Divider fades into bg | Sharper gradient stops at 10%/90% | Divider holds — saree border is visible and structural |

