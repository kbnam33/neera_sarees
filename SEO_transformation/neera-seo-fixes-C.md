# Neera SEO — Technical Instructions: Fix C (Schema)

---

## Fix C1 — Correct WebSite schema description

**File: `src/utils/schemaMarkup.js`**

**The problem:** `getWebSiteSchema()` contains a description that mentions
"Chanderi" and "Maheshwari" — neither of which is in Neera's actual product catalog.
Google reads this description to understand what the brand sells. A mismatch between
your schema description and your actual products is a brand consistency signal that
works against you.

**Find `getWebSiteSchema()`** in `schemaMarkup.js`. Inside the returned object,
locate the `"description"` field:

```js
// Current (wrong)
"description": "Premium handwoven sarees collection featuring Chanderi, Mul Mul,
Maheshwari and traditional Indian textiles."
```

**Replace it with:**

```js
// Correct
"description": "Neera offers Mulmul cotton, pure linen, and Chettinad sarees
crafted for working women. Breathable, office-ready, and minimal.
Free shipping across India."
```

**Why this specific wording:** It matches the description already used in
`getOrganizationSchema()`, creating consistency across both schema types on the same
page. Google uses both; having them say the same thing reinforces the signal.
It also targets the exact keyword cluster the brand is positioning on:
"working women", "office-ready", "Mulmul/linen/Chettinad".

**Verification:** After deploying, paste `https://neera.store` into
`https://validator.schema.org`. Expand the WebSite entity. Confirm the description
field reads the corrected text with no mentions of Chanderi or Maheshwari.

---

## Fix C2 — Add contactPoint to Organization schema

**File: `src/utils/schemaMarkup.js`**

**The problem:** `getOrganizationSchema()` currently returns an object with `name`,
`url`, `logo`, `description`, and `address`. It is missing a `contactPoint`. Google
uses `contactPoint` to understand how customers can reach the business — it is a
trust signal that affects how Google displays your brand in Knowledge Panel results
and brand searches.

**Find `getOrganizationSchema()`**. The contact email is confirmed as
`support@neera.store` from `ContactUs.jsx`. The physical address is Chennai,
Tamil Nadu (currently commented out in ContactUs but confirmed as the location).

**Add a `contactPoint` key and a `sameAs` key to the returned object:**

```js
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Neera Sarees",
    "url": BASE_URL,
    "logo": `${BASE_URL}/Neera%20logo.png`,
    "description": "Neera crafts Mulmul cotton, pure linen, and Chettinad sarees
      for working women. Breathable, office-ready, and minimal.
      Free shipping across India.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    // ADD THIS BLOCK:
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@neera.store",
      "contactType": "customer service",
      "availableLanguage": ["English", "Tamil"],
      "areaServed": "IN"
    },
    // ADD THIS BLOCK (only if Instagram is active):
    "sameAs": [
      "https://www.instagram.com/neeradrapes/"
    ]
  };
}
```

**Notes on each added field:**

- `contactType` must be one of schema.org's accepted values. "customer service" is
  correct for a support email. Do not use a custom value here.
- `availableLanguage` is an array. English and Tamil are correct for a Chennai-based
  brand selling across India.
- `areaServed: "IN"` scopes the contact to India, which matches your free shipping
  coverage.
- `sameAs` with the Instagram URL links your schema identity to a verifiable social
  presence. This is already present in ContactUs.jsx's inline schema — it should also
  be in the sitewide Organization schema so every page carries it.

**If Neera's phone number becomes publicly listed for support**, add it as a second
`contactPoint` entry by changing the single object to an array:

```js
"contactPoint": [
  {
    "@type": "ContactPoint",
    "email": "support@neera.store",
    "contactType": "customer service",
    "availableLanguage": ["English", "Tamil"],
    "areaServed": "IN"
  },
  {
    "@type": "ContactPoint",
    "telephone": "+91XXXXXXXXXX",
    "contactType": "customer service",
    "availableLanguage": ["English", "Tamil"],
    "areaServed": "IN"
  }
]
```

**Verification:** After deploying, paste any page URL into
`https://validator.schema.org`. Expand the Organization entity. Confirm
`contactPoint` appears with the email and `contactType`. Confirm `sameAs` shows
the Instagram URL.

---

## Fix C3 — Build review collection and add aggregateRating to Product schema

This fix has two distinct parts: a database change (done once) and a schema change
(done after you have real review data). Do not add `aggregateRating` to the schema
until you have at least 5 real reviews — Google will not show stars for a product
with 0 or 1 review, and fake review data is a manual penalty risk.

---

### Part 1 — Supabase: create the reviews table

**Where:** Supabase dashboard → SQL Editor. Run the following migration once.

**Intent:** Create a `product_reviews` table. Each row is one customer review tied
to one product. The table tracks the rating (1–5), the review text, the reviewer's
name, the order it came from (to verify genuine purchase), and an approval flag so
you control which reviews are public.

```sql
CREATE TABLE product_reviews (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id    uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  order_id      uuid REFERENCES orders(id) ON DELETE SET NULL,
  reviewer_name text NOT NULL,
  rating        smallint NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text   text,
  is_approved   boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- Index for fast lookup by product
CREATE INDEX idx_reviews_product_id ON product_reviews(product_id);

-- Index for the approval filter used in queries
CREATE INDEX idx_reviews_approved ON product_reviews(is_approved);
```

**Row Level Security:** Enable RLS on this table in the Supabase dashboard. Add two
policies:

- **Select policy (public read):** Allow SELECT where `is_approved = true`.
  This means only approved reviews are readable by the frontend.
- **Insert policy:** Allow INSERT for authenticated users only (logged-in customers).
  Condition: the `order_id` must belong to the inserting user. This prevents fake
  reviews from accounts that never purchased.

---

### Part 2 — Frontend: fetch review aggregates per product

**File: `src/ProductPage.jsx`**

After the review table exists and has approved rows, the product page needs to fetch
the aggregate (average rating + count) for the current product. This is a single
Supabase query, not a full row fetch.

**Add a new `useEffect` in `ProductPage`** that runs when `product` is set.
Its intent: query `product_reviews` filtered by `product_id = product.id` AND
`is_approved = true`, select `rating`, then compute the average and count client-side.
Store the result in a state variable: `const [reviewStats, setReviewStats] = useState(null)`.

The query shape from Supabase client:
```js
const { data } = await supabase
  .from('product_reviews')
  .select('rating')
  .eq('product_id', product.id)
  .eq('is_approved', true);

if (data && data.length >= 5) {
  const avg = data.reduce((sum, r) => sum + r.rating, 0) / data.length;
  setReviewStats({
    ratingValue: avg.toFixed(1),
    reviewCount: data.length
  });
}
```

**The `>= 5` guard is intentional.** Only populate `reviewStats` when there are at
least 5 approved reviews. Below 5, the schema field stays absent — Google won't show
stars for too few reviews and showing a 5.0 from 1 review looks untrustworthy to
users.

---

### Part 3 — Schema: add aggregateRating to getProductSchema

**File: `src/utils/schemaMarkup.js`**

**Modify `getProductSchema()`** to accept an optional second parameter
`reviewStats` (default `null`):

```js
export function getProductSchema(product, reviewStats = null) {
  const price = product.selling_price || product.mrp;
  const inStock = product.in_stock !== false;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    // ... all existing fields unchanged ...
  };

  // Only attach aggregateRating when real data exists
  if (reviewStats && reviewStats.reviewCount >= 5) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": reviewStats.ratingValue,
      "reviewCount": reviewStats.reviewCount,
      "bestRating": "5",
      "worstRating": "1"
    };
  }

  return schema;
}
```

**File: `src/ProductPage.jsx`**

Update the call to `getProductSchema` to pass `reviewStats`:

```js
// Current
const productSchema = getProductSchema(product);

// Updated
const productSchema = getProductSchema(product, reviewStats);
```

This means the schema will be emitted without `aggregateRating` until the product
has 5+ approved reviews, at which point it automatically appears in the JSON-LD on
the next page render.

---

### Part 4 — Admin: review approval workflow

**Where:** Supabase dashboard → Table Editor → `product_reviews`.

No code change is needed for the initial approval workflow. The admin opens the
table, filters `is_approved = false`, reads the review, and flips the toggle to
`true` for legitimate reviews. This is sufficient for low review volume early on.

When review volume grows, build a simple admin UI panel that lists pending reviews
with approve/reject buttons. This is a future task, not required now.

---

## Verification summary

| Fix | Where to verify | Pass condition |
|-----|----------------|----------------|
| C1 WebSite description | `validator.schema.org` → paste homepage URL | No mention of Chanderi or Maheshwari in WebSite entity |
| C2 contactPoint | `validator.schema.org` → any page | Organization entity shows contactPoint with email |
| C2 sameAs | `validator.schema.org` → any page | Organization entity shows Instagram URL |
| C3 table | Supabase dashboard → Table Editor | `product_reviews` table visible with correct columns |
| C3 RLS | Supabase dashboard → Authentication → Policies | Two policies on `product_reviews` table |
| C3 schema | `search.google.com/test/rich-results` → product URL | After 5+ reviews: "Product" rich result eligible with rating |
