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

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
            {mainImage.startsWith('http') ? (
              <Image
                src={mainImage}
                alt={product.name}
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
              {images.slice(0, 4).map((img, idx) => (
                <div key={idx} className="aspect-square relative bg-gray-100 rounded overflow-hidden">
                  {img.startsWith('http') && (
                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                  )}
                </div>
              ))}
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
              <h3 className="text-lg font-semibold text-charcoal-gray">Description</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>
          )}

          {product.care_instructions && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-charcoal-gray mb-2">Care Instructions</h3>
              <p className="text-sm text-gray-600">{product.care_instructions}</p>
            </div>
          )}

          <button className="w-full bg-deep-maroon text-white py-4 px-8 rounded-lg hover:bg-deep-maroon-dark transition-colors text-sm uppercase tracking-wider">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
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

  return {
    title: `${product.name} - Neera Sarees`,
    description: product.short_description || product.description || `${product.name} handwoven saree`,
  };
}
