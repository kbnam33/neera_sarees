### File: `src/styles/hero.css` — Update `.neera-fabrics` rules only

```css
/* Panel: remove overflow hidden — images are now inset, not full-bleed */
.neera-fabrics__panel {
  height: auto;              /* remove fixed 88vh — height is now driven by content */
  min-height: 80vh;
  overflow: visible;
  align-items: stretch;
}

/* Image wrap: inset with padding — the frame */
.neera-fabrics__img-wrap {
  padding: 2.4vh 0 2.4vh 0; /* top and bottom air — image floats */
  overflow: hidden;
  height: auto;
  display: flex;
  align-items: stretch;
}

/* Linen panel: padding on left edge only (image is on left) */
.neera-fabrics__panel--linen .neera-fabrics__img-wrap {
  padding: 3vh 1.5vw 3vh 2vw;
}

/* Mulmul panel: padding on right edge only (image is on right) */
.neera-fabrics__panel--mulmul .neera-fabrics__img-wrap {
  padding: 3vh 2vw 3vh 1.5vw;
}

/* Image itself: fills the padded wrap fully */
.neera-fabrics__img {
  width: 100%;
  height: 100%;
  min-height: 70vh;          /* ensures image still has presence */
  object-fit: cover;
  object-position: center center;
  transition: transform 0.8s ease;
  display: block;
}

/* Mulmul: fix model centering — remove third-column bleed */
.neera-fabrics__panel--mulmul .neera-fabrics__img {
  object-position: 35% center; /* pulls model into center of image frame */
}

/* Panel divider: breathing gap — not a hairline */
.neera-fabrics__panel + .neera-fabrics__panel {
  border-top: none;          /* remove old 1px border */
  position: relative;
  margin-top: 0;
}

/* Replace border with a full-width gap element */
.neera-fabrics__panel + .neera-fabrics__panel::before {
  content: '';
  position: absolute;
  top: 0;
  left: 5vw;
  right: 5vw;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent  0%,
    #c8b89a     10%,
    #c8b89a     90%,
    transparent 100%
  );
}

/* Add top padding to second panel — creates the breathing gap */
.neera-fabrics__panel--mulmul {
  padding-top: 4vh;
}

/* Content: vertical centering adjusted — text breathes with image */
.neera-fabrics__content,
.neera-fabrics__content--right {
  justify-content: center;   /* center vertically — image has its own padding now */
  padding: 4vh 4vw;
}
```
