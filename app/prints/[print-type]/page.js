import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

// Fetch products for a print category (SSR - server-side on each request)
async function getProductsByPrint(printType) {
  try {
    const printQuery = printType.replace(/-/g, ' ');
    
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .ilike('print_type', `%${printQuery}%`)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching products by print:', error);
      return [];
    }

    return products || [];
  } catch (err) {
    console.error('Exception fetching products by print:', err);
    return [];
  }
}

export default async function PrintCategoryPage({ params }) {
  const { 'print-type': printType } = params;
  const products = await getProductsByPrint(printType);

  const printName = printType.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-deep-maroon mb-4">
          {printName} Print Sarees
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our collection of {printName.toLowerCase()} print sarees
        </p>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found in this print category.</p>
          <p className="text-gray-400 text-sm mt-2">
            Print categories are being populated. Please check back soon.
          </p>
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
                        alt={`${product.name} - ${printName} Print - ${product.fabric_type || 'Handloom'} Saree`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
                      {product.fabric_type || 'Handloom'} • {printName} Print
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
  const { 'print-type': printType } = params;
  const printName = printType.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  // Meta Title: "[Print Type] Print Sarees - Shop Collection | Neera Sarees"
  // Ensure ≤60 characters
  let metaTitle = `${printName} Print Sarees - Shop Collection | Neera Sarees`;
  if (metaTitle.length > 60) {
    metaTitle = `${printName} Print Sarees | Neera Sarees`;
  }

  // Meta Description: "Explore our [print_type] print sarees collection. Beautiful designs, authentic quality, free shipping."
  // Ensure ≤155 characters
  const metaDescription = `Explore our ${printName.toLowerCase()} print sarees collection. Beautiful designs, authentic quality. Free shipping, handwoven with care. Shop now.`;

  return {
    title: metaTitle,
    description: metaDescription.substring(0, 155),
  };
}

// Generate static params for all print types (optional - for SSG)
export async function generateStaticParams() {
  try {
    // Query unique print types from database
    const { data: products, error } = await supabase
      .from('products')
      .select('print_type');

    if (error || !products) {
      console.error('Error fetching print types for static generation:', error);
      return [];
    }

    // Get unique print types
    const uniquePrintTypes = [...new Set(
      products
        .map(p => p.print_type)
        .filter(pt => pt && pt !== '')
    )];

    // Convert to URL-friendly slugs
    return uniquePrintTypes.map((printType) => ({
      'print-type': printType.toLowerCase().replace(/\s+/g, '-'),
    }));
  } catch (err) {
    console.error('Exception in generateStaticParams for prints:', err);
    return [];
  }
}
