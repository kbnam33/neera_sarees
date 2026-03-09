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


***

That completes the full instruction set. All 16 steps are now complete and ready to copy-paste into Cursor.

