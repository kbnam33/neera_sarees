/**
 * Schema Markup Utility for Neera Sarees
 * Generates JSON-LD structured data for rich search results
 */

const BASE_URL = 'https://neera.store';

/**
 * Get Organization schema (site-wide)
 * Use on all pages for consistent brand identity
 */
export function getOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Neera Sarees",
    "url": BASE_URL,
    "logo": `${BASE_URL}/Neera%20logo.png`,
    "description": "Neera crafts Mulmul cotton, pure linen, and Chettinad sarees for working women. Breathable, office-ready, and minimal. Free shipping across India.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@neera.store",
      "contactType": "customer service",
      "availableLanguage": ["English", "Tamil"],
      "areaServed": "IN"
    },
    "sameAs": [
      "https://www.instagram.com/neeradrapes/"
    ]
  };
}

/**
 * Get Product schema for product pages
 * @param {Object} product - Product data from database
 * @param {Object} reviewStats - Optional {ratingValue, reviewCount} from product_reviews
 */
export function getProductSchema(product, reviewStats = null) {
  const price = product.selling_price || product.mrp;
  const inStock = product.in_stock !== false; // Default to true if undefined
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images || [],
    "description": product.description || `${product.fabric_type} saree, ${product.print_type}. Premium handwoven craftsmanship.`,
    "sku": product.id?.toString() || product.slug,
    "brand": {
      "@type": "Brand",
      "name": "Neera Sarees"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/products/${product.fabric_type}/${product.slug}`,
      "priceCurrency": "INR",
      "price": price,
      "availability": inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "priceValidUntil": new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0], // 1 year from now
      "seller": {
        "@type": "Organization",
        "name": "Neera Sarees"
      }
    },
    "category": `${product.fabric_type} Sarees`,
    "material": product.fabric_type
  };

  // Only attach aggregateRating when real data exists (5+ reviews)
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

/**
 * Get BreadcrumbList schema
 * @param {Array} breadcrumbs - Array of breadcrumb items: [{ name, path }]
 */
export function getBreadcrumbSchema(breadcrumbs) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.path.startsWith('http') ? crumb.path : `${BASE_URL}${crumb.path}`
    }))
  };
}

/**
 * Get CollectionPage schema for category pages
 * @param {string} name - Collection name
 * @param {string} description - Collection description
 * @param {string} url - Collection URL path
 * @param {number} numItems - Number of items in collection
 */
export function getCollectionSchema(name, description, url, numItems) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": name,
    "description": description,
    "url": url.startsWith('http') ? url : `${BASE_URL}${url}`,
    "numberOfItems": numItems,
    "about": {
      "@type": "Thing",
      "name": "Handwoven Sarees"
    }
  };
}

/**
 * Get WebSite schema for homepage
 * Includes search functionality
 */
export function getWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Neera Sarees",
    "url": BASE_URL,
    "description": "Neera offers Mulmul cotton, pure linen, and Chettinad sarees crafted for working women. Breathable, office-ready, and minimal. Free shipping across India.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${BASE_URL}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}

/**
 * Get ItemList schema for product listings
 * @param {Array} products - Array of products to list
 * @param {string} listName - Name of the list
 */
export function getItemListSchema(products, listName = "All Sarees") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": listName,
    "numberOfItems": products.length,
    "itemListElement": products.slice(0, 20).map((product, index) => ({ // Limit to first 20 for performance
      "@type": "ListItem",
      "position": index + 1,
      "url": `${BASE_URL}/products/${product.fabric_type}/${product.slug}`,
      "name": product.name
    }))
  };
}

/**
 * Get FAQ schema (can be used on story/about pages if we have FAQs)
 * @param {Array} faqList - Array of {question, answer} objects
 */
export function getFAQSchema(faqList) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqList.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Get ContactPage schema
 */
export function getContactPageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Us | Neera Sarees",
    "url": `${BASE_URL}/contact-us`,
    "description": "Get in touch with Neera Sarees for inquiries about our handwoven saree collection."
  };
}
