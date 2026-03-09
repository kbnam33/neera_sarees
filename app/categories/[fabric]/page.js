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
      .eq('is_public', true)
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

const fabricDescriptions = {
  mulmul: 'Feather-light Mulmul cotton sarees built for long office days. Breathable, soft, and non-clingy even in Chennai heat.',
  linen: 'Crisp pure linen sarees that look structured from the first meeting to the last. Perfect office wear for working women.',
  chettinad: 'Bold Chettinad cotton sarees with neat pleats and striking borders. Heritage weave that works beautifully in offices, schools, and corporate spaces.',
};

export default async function CategoryPage({ params }) {
  const { fabric } = params;
  const products = await getProductsByFabric(fabric);

  const fabricName = fabric.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const fabricDesc = fabricDescriptions[fabric.toLowerCase()] ||
    `Explore Neera's ${fabricName.toLowerCase()} sarees – handpicked for working women who want comfort, elegance, and everyday wearability.`;

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${fabricName} Sarees for Working Women – Neera Sarees`,
    description: fabricDesc,
    url: `https://neera.store/categories/${fabric.toLowerCase()}`,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://neera.store' },
        { '@type': 'ListItem', position: 2, name: `${fabricName} Sarees`, item: `https://neera.store/categories/${fabric.toLowerCase()}` },
      ],
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-8 text-sm text-gray-500">
        <ol className="flex items-center gap-2">
          <li><a href="/" className="hover:text-deep-maroon transition-colors">Home</a></li>
          <li aria-hidden="true">/</li>
          <li className="text-charcoal-gray font-medium">{fabricName} Sarees</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif text-deep-maroon mb-4">
          {fabricName} Sarees for Working Women – Neera
        </h1>
        <p className="text-gray-600 text-lg">
          {fabricDesc}
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
                        alt={`${product.name} - ${product.fabric_type || 'Handloom'} Saree`}
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

  const fabricDesc = fabricDescriptions[fabric.toLowerCase()] ||
    `Explore Neera's ${fabricName.toLowerCase()} sarees – handpicked for working women who want comfort, elegance, and everyday wearability.`;

  return {
    title: `${fabricName} Sarees for Working Women | Neera Sarees`,
    description: `${fabricDesc} Shop online at neera.store. Free shipping across India.`.substring(0, 155),
    alternates: { canonical: `https://neera.store/categories/${fabric.toLowerCase()}` },
    openGraph: {
      title: `${fabricName} Sarees for Working Women – Neera`,
      url: `https://neera.store/categories/${fabric.toLowerCase()}`,
    },
  };
}
