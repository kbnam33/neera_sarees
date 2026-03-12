## File 5: `src/App.jsx` or `src/index.css` — Import the new CSS file

```js
import './styles/hero.css';
```


***

## File 6: `src/pages/Home.jsx` — Remove the old hero block

Find and **delete** the existing section that contains:

- `"Composed in Silence."` headline
- `"Clothing shaped by patience, restraint, and clarity."` subtitle
- `"SHOP NEW ARRIVALS"` button
- The split two-column image layout (`grid` or `flex` with two image panels)

Replace that entire block with the new `<section className="neera-hero">` from File 1.