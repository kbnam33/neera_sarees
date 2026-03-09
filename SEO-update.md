## SEO Optimization Instructions for neera_sarees React Version


### 1. `public/index.html`

Replace the existing `<title>` tag content with:
`Neera Sarees – Cotton & Linen Sarees for Working Women | Shop Online India`

Replace the existing `<meta name="description">` content with:
`Shop Neera's handpicked collection of Mulmul cotton, linen, and Chettinad sarees designed for working women. Breathable, office-ready, and elegant. Free shipping across India.`

Add the following meta tags inside `<head>` if not already present:

```
<meta name="keywords" content="cotton sarees for working women, linen sarees for office, mulmul cotton sarees, chettinad cotton sarees, office wear sarees, neera sarees, handloom sarees India" />
<meta name="robots" content="index, follow" />
<meta property="og:type" content="website" />
<meta property="og:title" content="Neera Sarees – Cotton & Linen Sarees for Working Women" />
<meta property="og:description" content="Mulmul, Linen, and Chettinad sarees designed for the working woman. Breathable, elegant, office-ready. Free shipping across India." />
<meta property="og:url" content="https://neera.store" />
<meta property="og:image" content="https://neera.store/og-image.jpg" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Neera Sarees – Cotton & Linen Sarees for Working Women" />
<meta name="twitter:description" content="Shop Mulmul, Linen, Chettinad sarees for working women. Office-ready, breathable, free shipping." />
//neera.store" />
```

Add the following Organisation JSON-LD schema inside `<head>`:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Neera Sarees",
  "url": "https://neera.store",
  "logo": "https://neera.store/logo.png",
  "description": "Neera Sarees specialises in cotton and linen sarees for working women – Mulmul, Chettinad, and Linen office wear sarees with free shipping across India.",
  "sameAs": ["https://www.instagram.com/neeradrapes/"]
}
</script>
```

Add the following WebSite JSON-LD with Sitelinks Searchbox inside `<head>`:

```json
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Neera Sarees",
  "url": "https://neera.store",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://neera.store/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```


***

### 2. `src/App.jsx` – Home route Helmet

Inside the home route (`/`) render block, add a `<Helmet>` block using `react-helmet-async` with:

- `<title>`: `Neera Sarees – Cotton & Linen Sarees for Working Women | neera.store`
- `<meta name="description">`: `Neera crafts Mulmul cotton, pure linen, and Chettinad sarees built for working women. Breathable, office-ready, and elegantly minimal. Free shipping across India.`
- `//neera.store/" />`
- `<meta property="og:title">`: `Neera Sarees – Cotton & Linen Sarees for Working Women`
- `<meta property="og:description">`: `Office-ready Mulmul, Linen, and Chettinad sarees for the modern working woman. Shop neera.store.`
- `<meta property="og:url">`: `https://neera.store/`

***

### 3. `src/App.jsx` – Home page visible content (hero section)

In the hero/banner section of the home page JSX, ensure the following text elements exist:

Change or add the primary `<h1>` tag to:
`Cotton & Linen Sarees for Working Women`

```
Below the `<h1>`, add a `<p>` tag with:
```

`Neera crafts Mulmul cotton, pure linen, and Chettinad sarees designed for the working woman – breathable, minimal, and office-ready. Free shipping across India.`

Add a section below the hero that lists the three fabric collections with these headings:

- `<h2>` : `Mulmul Cotton Sarees for Office Wear`
- `<h2>` : `Linen Sarees for Working Women`
- `<h2>` : `Chettinad Cotton Sarees for Office`

```
Each `<h2>` must be followed by a single `<p>` describing that fabric in terms of workday benefits (soft and feather-light for full-day office wear; crisp and structured for meetings and presentations; heritage weave with bold borders that stay neat all day respectively).
```


***

### 4. `src/FabricPage.jsx`

Replace the existing `<h1>` content from `{fabricName}` to:
```${fabricName} Sarees for Working Women – Neera```

Replace the existing `<p>` subtitle text from `Explore our collection of {fabricName.toLowerCase()} sarees` to a fabric-aware string using a lookup object. Add this lookup constant before the return statement:

```js
const fabricDescriptions = {
  mulmul: "Feather-light Mulmul cotton sarees built for long office days. Breathable, soft, and non-clingy even in Chennai heat.",
  linen: "Crisp pure linen sarees that look structured from the first meeting to the last. Perfect office wear for working women.",
  chettinad: "Bold Chettinad cotton sarees with neat pleats and striking borders. Heritage weave that works beautifully in offices, schools, and corporate spaces.",
  default: `Explore Neera's ${fabricName.toLowerCase()} sarees – handpicked for working women who want comfort, elegance, and everyday wearability.`
};
const fabricDesc = fabricDescriptions[fabricName.toLowerCase()] || fabricDescriptions.default;
```

Use `{fabricDesc}` in the subtitle `<p>` tag.

Add a `<Helmet>` block inside `FabricPage` (import `Helmet` from `react-helmet-async`) with:

- `<title>`: ```${fabricName} Sarees for Working Women | Neera Sarees```
- `<meta name="description">`: ```${fabricDesc} Shop online at neera.store. Free shipping across India.```
- `>`: ```https://neera.store/fabric/${fabricName.toLowerCase()}```
- `<meta property="og:title">`: ```${fabricName} Sarees for Working Women – Neera```
- `<meta property="og:url">`: ```https://neera.store/fabric/${fabricName.toLowerCase()}```

Add a CollectionPage JSON-LD schema inside the `<Helmet>` block:

```json
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "${fabricName} Sarees for Working Women – Neera Sarees",
  "description": "${fabricDesc}",
  "url": "https://neera.store/fabric/${fabricName.toLowerCase()}",
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://neera.store" },
      { "@type": "ListItem", "position": 2, "name": "${fabricName} Sarees", "item": "https://neera.store/fabric/${fabricName.toLowerCase()}" }
    ]
  }
}
```

```
Add a visible `<nav aria-label="breadcrumb">` above the `<h1>` in the return JSX with two links: Home → `/` and `{fabricName} Sarees` (current, no link).
```


***

### 5. `src/ProductPage.jsx`

Replace the existing `<Helmet>` title from ```${product.name} - Neera``` to:
```${product.name} – ${product.fabric_type} Saree for Working Women | Neera Sarees```

Replace the existing `metaDescription` fallback from `'Discover beautiful, handwoven sarees from Neera.'` to:
```Shop ${product.name}, a ${product.fabric_type?.toLowerCase()} saree for working women by Neera. Breathable, office-ready, and elegantly crafted. Free shipping across India.```

Add the following meta tags inside the existing `<Helmet>` block:

- `>`: ```https://neera.store/products/${product.slug}```
- `<meta property="og:title">`: ```${product.name} – ${product.fabric_type} Saree | Neera Sarees```
- `<meta property="og:description">`: the `metaDescription` variable
- `<meta property="og:url">`: ```https://neera.store/products/${product.slug}```
- `<meta property="og:image">`: `{product.images?.[0] || ''}`

```
Add a Product JSON-LD schema inside the `<Helmet>` block as a `<script type="application/ld+json">`:
```

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "${product.name}",
  "image": "${product.images?.[0]}",
  "description": "${product.short_description || product.description}",
  "brand": { "@type": "Brand", "name": "Neera Sarees" },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "INR",
    "price": "${product.price}",
    "availability": "https://schema.org/InStock",
    "url": "https://neera.store/products/${product.slug}",
    "seller": { "@type": "Organization", "name": "Neera Sarees" }
  }
}
```

Add a BreadcrumbList JSON-LD schema inside the `<Helmet>` block:

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://neera.store" },
    { "@type": "ListItem", "position": 2, "name": "${product.fabric_type} Sarees", "item": "https://neera.store/fabric/${product.fabric_type?.toLowerCase()}" },
    { "@type": "ListItem", "position": 3, "name": "${product.name}", "item": "https://neera.store/products/${product.slug}" }
  ]
}
```

Replace the existing breadcrumb text in the JSX from `All Sarees  /  {product.fabric_type}` with a proper semantic `<nav aria-label="breadcrumb">` with three levels: Home → `{product.fabric_type} Sarees` → `{product.name}` (current).

```
In the product details section, change the `<h1>` wrapping `{product.name}` to also include the fabric type in an SEO-visible `<span className="sr-only">` after the product name, reading `` – {product.fabric_type} Saree for Working Women ``.
```

In the "You May Also Like" section heading, change `You May Also Like` to ``More {product.fabric_type} Sarees for Working Women``.

***

### 6. `src/StoryPage.jsx`

Add a `<Helmet>` block (import `Helmet` from `react-helmet-async`) with:

- `<title>`: `Our Story – Neera Sarees | Cotton & Linen Sarees for Working Women`
- `<meta name="description">`: `Learn about Neera – a saree brand built for working women. We design breathable Mulmul cotton, linen, and Chettinad sarees for everyday professional life. Based in Chennai, shipping across India.`
- `//neera.store/story" />`

In the page's main visible `<h1>`, ensure it reads: `The Story Behind Neera – Sarees for Working Women`

In the body copy of the StoryPage, ensure the following keyword phrases appear naturally at least once each in the visible text content:

- "cotton sarees for working women"
- "linen sarees for office wear"
- "Mulmul cotton sarees"
- "Chettinad cotton sarees"
- "office-ready sarees"
- "neera sarees"

***

### 7. `src/SearchPage.jsx`

Add a `<Helmet>` block with:

- `<title>`: `Search Sarees – Neera | Cotton & Linen Office Wear Sarees`
- `<meta name="description">`: `Search Neera's collection of Mulmul cotton, linen, and Chettinad sarees for working women. Find your perfect office wear saree at neera.store.`
- `<meta name="robots" content="noindex, follow" />` (search result pages should not be indexed to avoid duplicate content)

***

### 8. `src/ContactUs.jsx`

Add a `<Helmet>` block with:

- `<title>`: `Contact Neera Sarees – Cotton & Linen Sarees for Working Women`
- `<meta name="description">`: `Get in touch with Neera Sarees. We make Mulmul cotton, linen, and Chettinad office wear sarees for working women. Free shipping across India.`
- `//neera.store/contact-us" />`

Add a LocalBusiness JSON-LD schema inside the `<Helmet>` block:

```json
{
  "@context": "https://schema.org",
  "@type": "OnlineStore",
  "name": "Neera Sarees",
  "url": "https://neera.store",
  "description": "Neera Sarees – Mulmul cotton, linen, and Chettinad sarees for working women. Office-ready, breathable, free shipping across India.",
  "address": { "@type": "PostalAddress", "addressLocality": "Chennai", "addressRegion": "Tamil Nadu", "addressCountry": "IN" },
  "sameAs": ["https://www.instagram.com/neeradrapes/"]
}
```


***

### 9. `public/` – New files to create

```
Create `public/sitemap.xml` with the following URL entries, each with `hangefreq>weekly</changefreq>` and `<priority>` as noted:
```

- `https://neera.store/` — priority `1.0`
- `https://neera.store/products` — priority `0.9`
- `https://neera.store/fabric/mulmul` — priority `0.9`
- `https://neera.store/fabric/linen` — priority `0.9`
- `https://neera.store/fabric/chettinad` — priority `0.8`
- `https://neera.store/fabric/cotton` — priority `0.8`

### 9. `public/` – New files to create (completed)

Create `public/sitemap.xml` with the following content:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    oc>https://neera.store/</loc>
    hangefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>

  <url>
    oc>https://neera.store/products</loc>
    hangefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    oc>https://neera.store/office-wear-sarees</loc>
    hangefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    oc>https://neera.store/fabric/mulmul</loc>
    hangefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    oc>https://neera.store/fabric/linen</loc>
    hangefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

  <url>
    oc>https://neera.store/fabric/chettinad</loc>
    hangefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    oc>https://neera.store/fabric/cotton</loc>
    hangefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    oc>https://neera.store/fabric/mulmul-cotton</loc>
    hangefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <url>
    oc>https://neera.store/story</loc>
    hangefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <url>
    oc>https://neera.store/contact-us</loc>
    hangefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>

  <url>
    oc>https://neera.store/shipping-policy</loc>
    hangefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    oc>https://neera.store/refund-and-exchange-policy</loc>
    hangefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    oc>https://neera.store/privacy-policy</loc>
    hangefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

  <url>
    oc>https://neera.store/terms-and-conditions</loc>
    hangefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>

</urlset>
```

Note: After the cursor agent runs all 16 steps and deploys, submit this sitemap URL to Google Search Console at `https://search.google.com/search-console` under Sitemaps → Add new sitemap → enter `https://neera.store/sitemap.xml` and hit Submit. This is the single most important manual step after all code changes are deployed, as it tells Google to immediately crawl all your new keyword-optimized pages including `/office-wear-sarees`, `/fabric/mulmul`, `/fabric/linen`, and `/fabric/chettinad`.

Create `public/robots.txt` with the following content:

```
User-agent: *
Allow: /
Disallow: /auth
Disallow: /checkout
Disallow: /cart
Disallow: /profile
Disallow: /order-confirmation
Disallow: /search

Sitemap: https://neera.store/sitemap.xml
```