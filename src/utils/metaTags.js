/**
 * Meta Tags Utility for Neera Sarees
 * Generates optimized meta tags for SEO
 */

const BASE_URL = 'https://neera.store';
const DEFAULT_IMAGE = `${BASE_URL}/theme-image.png`;
const SITE_NAME = 'Neera Sarees';

/**
 * Generate comprehensive meta tags for a page
 * @param {Object} options - Meta tag options
 * @param {string} options.title - Page title (max 60 chars)
 * @param {string} options.description - Page description (max 155 chars)
 * @param {string} options.canonical - Canonical URL path
 * @param {string} [options.image] - Open Graph image URL
 * @param {string} [options.type='website'] - Open Graph type
 * @returns {Object} Meta tag data object
 */
export function generateMetaTags({
  title,
  description,
  canonical,
  image = DEFAULT_IMAGE,
  type = 'website'
}) {
  // Enforce character limits for SEO best practices
  const truncatedTitle = title.substring(0, 60);
  const truncatedDescription = description.substring(0, 155);
  const fullUrl = canonical.startsWith('http') ? canonical : `${BASE_URL}${canonical}`;

  return {
    title: truncatedTitle,
    description: truncatedDescription,
    canonical: fullUrl,
    openGraph: {
      title: truncatedTitle,
      description: truncatedDescription,
      url: fullUrl,
      image: image,
      type: type,
      siteName: SITE_NAME
    },
    twitter: {
      card: 'summary_large_image',
      title: truncatedTitle,
      description: truncatedDescription,
      image: image
    }
  };
}

/**
 * Generate meta tags for homepage
 */
export function getHomeMetaTags() {
  return generateMetaTags({
    title: 'Neera - Handwoven Sarees of Timeless Elegance',
    description: 'Discover Neera, a world of pure, handwoven sarees that blend traditional craftsmanship with modern style. Shop our exclusive collection of silk, cotton, and mangalagiri sarees.',
    canonical: '/',
    type: 'website'
  });
}

/**
 * Generate meta tags for All Sarees page (PRIMARY TARGET)
 * @param {number} productCount - Number of products
 */
export function getAllSareesMetaTags(productCount = 137) {
  return generateMetaTags({
    title: 'Premium Handwoven Sarees | Neera Sarees Collection',
    description: `Discover ${productCount}+ authentic handwoven sarees in Chanderi, Mul Mul, Maheshwari & more. Traditional craftsmanship, modern elegance.`,
    canonical: '/products',
    type: 'website'
  });
}

/**
 * Generate meta tags for product page
 * @param {Object} product - Product data
 */
export function getProductMetaTags(product) {
  const title = `${product.name} - ${product.fabric_type} | Neera Sarees`;
  const price = product.selling_price || product.mrp;
  const description = `${product.name}. ${product.fabric_type} saree, ${product.print_type}. Premium handwoven. ₹${price}.`;
  
  return generateMetaTags({
    title: title,
    description: description,
    canonical: `/products/${product.fabric_type}/${product.slug}`,
    image: product.images && product.images[0] ? product.images[0] : DEFAULT_IMAGE,
    type: 'product'
  });
}

/**
 * Generate meta tags for fabric category page
 * @param {string} fabricType - Fabric type name
 * @param {number} productCount - Number of products in category
 */
export function getFabricCategoryMetaTags(fabricType, productCount) {
  return generateMetaTags({
    title: `${fabricType} Sarees Collection | Neera Sarees`,
    description: `Explore our collection of ${productCount} premium ${fabricType} sarees. Authentic handwoven craftsmanship with modern elegance.`,
    canonical: `/fabric/${fabricType}`,
    type: 'website'
  });
}

/**
 * Generate meta tags for print category page
 * @param {string} printType - Print type name
 * @param {number} productCount - Number of products in category
 */
export function getPrintCategoryMetaTags(printType, productCount) {
  return generateMetaTags({
    title: `${printType} Sarees Collection | Neera Sarees`,
    description: `Discover ${productCount} stunning ${printType} sarees. Traditional prints meet modern elegance in handwoven perfection.`,
    canonical: `/prints/${printType}`,
    type: 'website'
  });
}

/**
 * Generate meta tags for Contact Us page
 */
export function getContactMetaTags() {
  return generateMetaTags({
    title: 'Contact Neera Sarees – Cotton & Linen Sarees for Working Women',
    description: 'Get in touch with Neera Sarees. We make Mulmul cotton, linen, and Chettinad office wear sarees for working women. Free shipping across India.',
    canonical: '/contact-us',
    type: 'website'
  });
}

/**
 * Generate meta tags for Privacy Policy page
 */
export function getPrivacyPolicyMetaTags() {
  return generateMetaTags({
    title: 'Privacy Policy | Neera Sarees',
    description: 'Learn how Neera Sarees protects your privacy and handles your personal information with care and security.',
    canonical: '/privacy-policy',
    type: 'website'
  });
}

/**
 * Generate meta tags for Terms & Conditions page
 */
export function getTermsMetaTags() {
  return generateMetaTags({
    title: 'Terms & Conditions | Neera Sarees',
    description: 'Read the terms and conditions for shopping at Neera Sarees. Learn about our policies and customer agreements.',
    canonical: '/terms',
    type: 'website'
  });
}

/**
 * Generate meta tags for Story/About page
 */
export function getStoryMetaTags() {
  return generateMetaTags({
    title: 'Our Story – Neera Sarees | Cotton & Linen Sarees for Working Women',
    description: 'Learn about Neera – a saree brand built for working women. We design breathable Mulmul cotton, linen, and Chettinad sarees for everyday professional life. Based in Chennai, shipping across India.',
    canonical: '/story',
    type: 'website'
  });
}

/**
 * Generate meta tags for Refund & Exchange Policy page
 */
export function getRefundPolicyMetaTags() {
  return generateMetaTags({
    title: 'Refund & Exchange Policy | Neera Sarees',
    description: 'Learn about Neera Sarees\' refund and exchange policy. We ensure customer satisfaction with hassle-free returns.',
    canonical: '/refund-policy',
    type: 'website'
  });
}

/**
 * Generate meta tags for Shipping Policy page
 */
export function getShippingPolicyMetaTags() {
  return generateMetaTags({
    title: 'Shipping Policy | Neera Sarees',
    description: 'Learn about Neera Sarees\' shipping policy. Fast, secure delivery of your handwoven sarees across India.',
    canonical: '/shipping-policy',
    type: 'website'
  });
}
