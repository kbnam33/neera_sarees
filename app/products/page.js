import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

async function getAllProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching all products:', error);
      return [];
    }

    return products || [];
  } catch (err) {
    console.error('Exception fetching products:', err);
    return [];
  }
}

export const metadata = {
  title: 'All Sarees - Neera Sarees',
  description: 'Browse our complete collection of handwoven sarees',
};

export default async function AllProductsPage() {
  const products = await getAllProducts();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-deep-maroon mb-4">
          All Sarees
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our complete collection of handwoven sarees ({products.length} products)
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => {
          let images = [];
          try {
            images = typeof product.images === 'string' 
              ? JSON.parse(product.images) 
              : (Array.isArray(product.images) ? product.images : []);
          } catch (e) {
            console.error('Error parsing images:', e);
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
    </div>
  );
}
