import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Fetch products for a category (SSR - server-side on each request)
async function getProductsByFabric(fabric) {
  try {
    const fabricQuery = fabric.replace(/-/g, ' ');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .ilike('fabric_type', `%${fabricQuery}%`)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching products by fabric:', error);
      return [];
    }

    return products || [];
  } catch (err) {
    console.error('Exception fetching products:', err);
    return [];
  }
}

export default async function CategoryPage({ params }) {
  const { fabric } = params;
  const products = await getProductsByFabric(fabric);

  const fabricName = fabric.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-deep-maroon mb-4">
          {fabricName} Sarees
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our collection of {fabricName.toLowerCase()} sarees
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => {
            // Parse images
            let images = [];
            try {
              images = typeof product.images === 'string' 
                ? JSON.parse(product.images) 
                : (Array.isArray(product.images) ? product.images : []);
            } catch (e) {
              console.error('Error parsing images for product:', product.name, e);
            }

            const mainImage = images[0] || '/placeholder-saree.jpg';
            const productSlug = product.name.toLowerCase().replace(/\s+/g, '-');
            const productFabric = (product.fabric_type || 'handloom').toLowerCase().replace(/\s+/g, '-');

            return (
              <Link 
                key={product.id} 
                href={`/products/${productFabric}/${productSlug}`}
                className="group"
              >
                <div className="space-y-4">
                  {/* Product Image */}
                  <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden">
                    {mainImage.startsWith('http') ? (
                      <Image
                        src={mainImage}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-sm">No image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div>
                    <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {product.fabric_type || 'Handloom'}
                    </p>
                    <p className="text-lg font-semibold text-deep-maroon mt-2">
                      ₹{product.price?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const { fabric } = params;
  const fabricName = fabric.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${fabricName} Sarees - Neera Sarees`,
    description: `Browse our exquisite collection of ${fabricName.toLowerCase()} sarees, handwoven with care and tradition.`,
  };
}
