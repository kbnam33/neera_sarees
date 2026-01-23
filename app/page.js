import { supabase } from '../lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

async function getFeaturedProducts() {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_home_featured', true)
      .order('home_featured_rank', { ascending: true })
      .limit(4);

    if (error) {
      console.error('Error fetching featured products:', error);
      return [];
    }

    return products || [];
  } catch (err) {
    console.error('Exception fetching featured products:', err);
    return [];
  }
}

export default async function Home() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-soft-beige py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-serif text-deep-maroon mb-6 animate-fadeInUp">
            Handwoven Elegance
          </h1>
          <p className="text-xl md:text-2xl text-charcoal-gray mb-8 max-w-2xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Discover timeless sarees crafted with tradition and care
          </p>
          <Link 
            href="/products" 
            className="inline-block bg-deep-maroon text-white px-8 py-4 rounded-lg hover:bg-deep-maroon-dark transition-colors text-sm uppercase tracking-wider animate-fadeInUp"
            style={{ animationDelay: '0.4s' }}
          >
            Shop Collection
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-serif text-deep-maroon text-center mb-12">
              Featured Sarees
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => {
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
                    <div className="aspect-[3/4] relative bg-gray-100 rounded-lg overflow-hidden mb-4">
                      {mainImage.startsWith('http') && (
                        <Image
                          src={mainImage}
                          alt={`${product.name} - ${product.fabric_type || 'Handloom'} Saree`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-lg font-semibold text-deep-maroon mt-2">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-20 bg-soft-beige">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-serif text-deep-maroon text-center mb-12">
            Shop by Fabric
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link 
              href="/categories/kota" 
              className="group relative h-80 rounded-lg overflow-hidden bg-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-3xl font-serif text-white">Kota</h3>
              </div>
            </Link>
            <Link 
              href="/categories/mangalgiri" 
              className="group relative h-80 rounded-lg overflow-hidden bg-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-3xl font-serif text-white">Mangalgiri</h3>
              </div>
            </Link>
            <Link 
              href="/categories/chanderi" 
              className="group relative h-80 rounded-lg overflow-hidden bg-gray-200"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <h3 className="text-3xl font-serif text-white">Chanderi</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

