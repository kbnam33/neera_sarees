import { supabase } from '../../../../lib/supabase';
import { notFound } from 'next/navigation';
import Image from 'next/image';

// Generate static params for all products (SSG)
export async function generateStaticParams() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('fabric_type, name');

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

  // Generate Product Schema (JSON-LD) for SEO
  const productSchema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": mainImage.startsWith('http') ? mainImage : undefined,
    "description": product.short_description || product.description || `${product.name} - Beautiful ${product.fabric_type || 'handloom'} saree`,
    "brand": {
      "@type": "Brand",
      "name": "Neera Sarees"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://www.neerasarees.com/products/${fabric}/${slug}`,
      "priceCurrency": "INR",
      "price": product.price || 0,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Neera Sarees"
      }
    }
  };

  // Remove undefined fields
  if (!productSchema.image) {
    delete productSchema.image;
  }

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      
      <div className="container mx-auto px-4 py-12">
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
                      <Image src={img} alt={altText} fill className="object-cover" />
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

  // Format meta title: "[Product Name] - [Fabric Type] Saree | Neera Sarees"
  // Ensure ≤60 characters
  const fabricType = product.fabric_type || 'Handloom';
  let metaTitle = `${product.name} - ${fabricType} Saree | Neera Sarees`;
  if (metaTitle.length > 60) {
    // Truncate product name if needed
    const maxNameLength = 60 - ` - ${fabricType} Saree | Neera`.length;
    const truncatedName = product.name.substring(0, maxNameLength);
    metaTitle = `${truncatedName} - ${fabricType} Saree | Neera`;
  }

  // Format meta description: "Shop [Product Name], a beautiful [fabric_type] saree. [Short description]. Free shipping, authentic quality. View details and buy online."
  // Ensure ≤155 characters
  const shortDesc = product.short_description || product.description || `Beautiful ${fabricType.toLowerCase()} saree with elegant design`;
  const baseDescription = `Shop ${product.name}, a beautiful ${fabricType.toLowerCase()} saree. ${shortDesc}. Free shipping, authentic quality.`;
  
  let metaDescription = baseDescription;
  if (metaDescription.length > 155) {
    // Truncate short description to fit
    const maxDescLength = 155 - `Shop ${product.name}, a beautiful ${fabricType.toLowerCase()} saree. . Free shipping, authentic quality.`.length;
    const truncatedDesc = shortDesc.substring(0, maxDescLength);
    metaDescription = `Shop ${product.name}, a beautiful ${fabricType.toLowerCase()} saree. ${truncatedDesc}. Free shipping, authentic quality.`;
  }

  return {
    title: metaTitle,
    description: metaDescription,
  };
}
