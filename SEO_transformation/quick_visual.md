The issue is structural. The subheading and body copy are two separate `<p>` tags with no visual grouping — so they float independently under the h1 instead of reading as one block. The fix is to wrap them together so they behave as a unit.

---

**File:** `src/UseCasePage.jsx`
**Location:** Inside `<div className="neera-product-page__header">`, starting at the `<p className="neera-product-page__desc">{useCase.subheading}</p>` line

**Replace** this:
```jsx
<p className="neera-product-page__desc">{useCase.subheading}</p>
{useCase.bodyCopy && (
    <p className="neera-product-page__desc" style={{ lineHeight: '1.8', marginTop: '1.5rem' }}>
        {useCase.bodyCopy}
    </p>
)}
```

**With** this:
```jsx
<div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
    <p className="neera-product-page__desc">{useCase.subheading}</p>
    {useCase.bodyCopy && (
        <p className="neera-product-page__desc" style={{ lineHeight: '1.8' }}>
            {useCase.bodyCopy}
        </p>
    )}
</div>
```

The `div` wraps both paragraphs into a single visual block. The `gap: '0.6rem'` keeps them close enough to read as connected — subheading introduces, body expands — while the `marginTop: '1rem'` on the wrapper creates the separation from the h1 above. The 1.5rem between them was what was breaking the relationship.