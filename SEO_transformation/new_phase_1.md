Here are the complete instructions. Two files, four total changes.

---

**CHANGE 1 of 4**
File: `src/config/useCaseMap.js`
Object: `USE_CASES['office-meetings']`
Action: Add a new field `bodyCopy` immediately after the existing `subheading` field on the `'office-meetings'` entry. Do not touch any other field or any other entry.

Value to set:
```
bodyCopy: 'The moment you walk into a room, the drape reads before you speak. Pure linen holds its structure across a full day — no sagging by 11am, no adjusting between back-to-back meetings. Woven for the working week. Breathable enough for the heat, composed enough for the boardroom.',
```

---

**CHANGE 2 of 4**
File: `src/config/useCaseMap.js`
Object: `USE_CASES['everyday-work']`
Action: Add a new field `bodyCopy` immediately after the existing `subheading` field on the `'everyday-work'` entry. Do not touch any other field or any other entry.

Value to set:
```
bodyCopy: 'Most sarees ask you to adjust to them. Mulmul adjusts to you. Feather-light cotton that moves the way you do — floor to chair, office to commute, without thinking about it. Worn every day by women who have better things to manage.',
```

---

**CHANGE 3 of 4**
File: `src/UseCasePage.jsx`
Component: `UseCasePage`
Location: Inside the `<div className="neera-product-page__header">` block, immediately after the line `<p className="neera-product-page__desc">{useCase.subheading}</p>`
Action: Insert the following JSX on the next line after that `<p>` tag:

```jsx
{useCase.bodyCopy && (
    <p className="neera-product-page__desc" style={{ lineHeight: '1.8', marginTop: '0.75rem' }}>
        {useCase.bodyCopy}
    </p>
)}
```

No imports needed. No new CSS class needed. `neera-product-page__desc` is already defined in `src/styles/products.css` and handles font, color, and weight. Only the `lineHeight` and `marginTop` are overridden inline to give the body paragraph a slightly more readable line height than the subheading above it.

---

**CHANGE 4 of 4**
File: `src/UseCasePage.jsx`
Component: `UseCasePage`
Location: Inside the `<ul className="neera-product-grid">` map, on each product card's `<img>` tag
Current value of `alt`: `\`${product.name} — Neera\``
Action: Replace it with: `\`${product.name} — ${product.fabric_type} saree for working women\``

This is a single-line change inside the `.map()` on `filteredProducts`. The `<img>` tag already has `loading`, `fetchpriority`, `decoding`, and `className` attributes — only the `alt` attribute value changes.

---
