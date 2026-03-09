import { supabase } from '../../../../lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Generate static params for all products (SSG)
export async function generateStaticParams() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('fabric_type, name')
      .eq('is_public', true);

    if (error || !products) {
      console.error('Error fetching products for static generation:', error);
      return [];
    }

    return products.map((product) => ({
      fabric: (product.fabric_type || 'handloom').toLowerCase().replace(/\s+/g, '-'),
      slug: product.name.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (err) {
    console.error('Exception in generateStaticParams:', err);
    return [];
  }
}

// Fetch product data
async function getProduct(fabric, slug) {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_public', true)
      .ilike('name', `%${slug.replace(/-/g, ' ')}%`)
      .limit(1);

    if (error || !products || products.length === 0) {
      return null;
    }

    return products[0];
  } catch (err) {
    console.error('Error fetching product:', err);
    return null;
  }
}

export default async function ProductPage({ params }) {
  const { fabric, slug } = params;
  const product = await getProduct(fabric, slug);

  if (!product) {
    notFound();
  }

  // Parse images if stored as JSON string
  let images = [];
  try {
    images = typeof product.images === 'string' 
      ? JSON.parse(product.images) 
      : (Array.isArray(product.images) ? product.images : []);
  } catch (e) {
    console.error('Error parsing images:', e);
  }

  const mainImage = images[0] || '/placeholder-saree.jpg';

  const productSchema = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.name,
    ...(mainImage.startsWith('http') && { image: mainImage }),
    description: product.short_description || product.description || `${product.name} – ${product.fabric_type || 'handloom'} saree for working women`,
    brand: { '@type': 'Brand', name: 'Neera Sarees' },
    offers: {
      '@type': 'Offer',
      url: `https://neera.store/products/${fabric}/${slug}`,
      priceCurrency: 'INR',
      price: product.price || 0,
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: 'Neera Sarees' },
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://neera.store' },
      { '@type': 'ListItem', position: 2, name: `${product.fabric_type || 'Handloom'} Sarees`, item: `https://neera.store/categories/${(product.fabric_type || 'handloom').toLowerCase().replace(/\s+/g, '-')}` },
      { '@type': 'ListItem', position: 3, name: product.name, item: `https://neera.store/products/${fabric}/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-8 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-deep-maroon transition-colors">Home</a></li>
          <li aria-hidden="true">/</li>
          <li>
            <a href={`/categories/${(product.fabric_type || 'handloom').toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-deep-maroon transition-colors">
              {product.fabric_type || 'Handloom'} Sarees
            </a>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-charcoal-gray font-medium">{product.name}</li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
            {mainImage.startsWith('http') ? (
              <Image
                src={mainImage}
                alt={`${product.name} - ${product.fabric_type || 'Handloom'} Saree`}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <span>No image available</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery if multiple images */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(0, 4).map((img, idx) => {
                // Generate descriptive alt text for thumbnails
                const thumbnailDescriptors = ['detail view', 'drape view', 'close-up', 'alternate view'];
                const descriptor = thumbnailDescriptors[idx] || `view ${idx + 1}`;
                const altText = `${product.name} - ${product.fabric_type || 'Handloom'} Saree - ${descriptor}`;
                
                return (
                  <div key={idx} className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                    {img.startsWith('http') && (
                      <Image 
                        src={img} 
                        alt={altText} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 25vw, 12vw"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
              {product.fabric_type || 'Handloom'}
            </p>
            <h1 className="text-4xl font-serif text-deep-maroon mb-4">
              {product.name}
              <span className="sr-only"> – {product.fabric_type || 'Handloom'} Saree for Working Women</span>
            </h1>
            <p className="text-3xl text-charcoal-gray font-semibold">
              ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
            </p>
          </div>

          {product.short_description && (
            <p className="text-gray-700 leading-relaxed">
              {product.short_description}
            </p>
          )}

          {product.description && (
            <div className="prose prose-sm">
              <h2 className="text-lg font-semibold text-charcoal-gray">Description</h2>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {product.care_instructions && (
            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold text-charcoal-gray mb-2">Care Instructions</h2>
              <p className="text-sm text-gray-600">{product.care_instructions}</p>
            </div>
          )}

          <button className="w-full bg-deep-maroon text-white py-4 px-8 rounded-lg hover:bg-deep-maroon-dark transition-colors text-sm uppercase tracking-wider">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
    </>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { fabric, slug } = params;
  const product = await getProduct(fabric, slug);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  const fabricType = product.fabric_type || 'Handloom';
  const metaTitle = `${product.name} – ${fabricType} Saree for Working Women | Neera Sarees`.substring(0, 60);
  const metaDescription = `Shop ${product.name}, a ${fabricType.toLowerCase()} saree for working women by Neera. Breathable, office-ready, and elegantly crafted. Free shipping across India.`.substring(0, 155);

  return {
    title: metaTitle,
    description: metaDescription,
    alternates: { canonical: `https://neera.store/products/${fabric}/${slug}` },
    openGraph: {
      title: `${product.name} – ${fabricType} Saree | Neera Sarees`,
      description: metaDescription,
      url: `https://neera.store/products/${fabric}/${slug}`,
      images: [{ url: product.images?.[0] || 'https://neera.store/og-image.jpg' }],
    },
  };
}
