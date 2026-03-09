import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductImage from './components/ProductImage.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import { getFabricCategoryMetaTags } from './utils/metaTags.js';
import { getCollectionSchema, getOrganizationSchema, getBreadcrumbSchema } from './utils/schemaMarkup.js';

const FabricPage = ({ allProducts }) => {
    const { fabricName } = useParams();

    const filteredProducts = allProducts.filter(p => p.fabric_type.toLowerCase() === fabricName.toLowerCase());

    const fabricDescriptions = {
        mulmul: "Feather-light Mulmul cotton sarees built for long office days. Breathable, soft, and non-clingy even in Chennai heat.",
        linen: "Crisp pure linen sarees that look structured from the first meeting to the last. Perfect office wear for working women.",
        chettinad: "Bold Chettinad cotton sarees with neat pleats and striking borders. Heritage weave that works beautifully in offices, schools, and corporate spaces.",
        default: `Explore Neera's ${fabricName.toLowerCase()} sarees – handpicked for working women who want comfort, elegance, and everyday wearability.`
    };
    const fabricDesc = fabricDescriptions[fabricName.toLowerCase()] || fabricDescriptions.default;

    // Generate meta tags
    const fabricMeta = getFabricCategoryMetaTags(fabricName, fabricDesc);
    const collectionSchema = getCollectionSchema(
        `${fabricName} Sarees Collection`,
        `Explore ${filteredProducts.length} premium ${fabricName} sarees with authentic handwoven craftsmanship.`,
        `/fabric/${fabricName}`,
        filteredProducts.length
    );
    const orgSchema = getOrganizationSchema();
    
    // Breadcrumb data
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'All Sarees', path: '/products' },
        { name: `${fabricName} Sarees`, path: `/fabric/${fabricName}` }
    ];
    const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-soft-beige pt-12 pb-20">
            <Helmet>
                <title>{fabricMeta.title}</title>
                <meta name="description" content={fabricMeta.description} />
                <link rel="canonical" href={fabricMeta.canonical} />
                <meta property="og:title" content={fabricMeta.openGraph.title} />
                <meta property="og:description" content={fabricMeta.openGraph.description} />
                <meta property="og:url" content={fabricMeta.openGraph.url} />
                <meta property="og:type" content={fabricMeta.openGraph.type} />
                <meta property="og:image" content={fabricMeta.openGraph.image} />
                <meta property="og:site_name" content={fabricMeta.openGraph.siteName} />
                <meta name="twitter:card" content={fabricMeta.twitter.card} />
                <meta name="twitter:title" content={fabricMeta.twitter.title} />
                <meta name="twitter:description" content={fabricMeta.twitter.description} />
                <meta name="twitter:image" content={fabricMeta.twitter.image} />
                
                {/* Collection Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
                
                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                
                {/* Organization Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
            </Helmet>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <Breadcrumb items={breadcrumbs} />
                <div className="text-center border-b border-gray-200 pb-8 mb-12">
                    <h1 className="text-4xl font-serif text-deep-maroon capitalize">{fabricName} Sarees for Working Women – Neera</h1>
                    <p className="mt-4 text-charcoal-gray/80 max-w-2xl mx-auto">{fabricDesc}</p>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-12">
                        {filteredProducts.map((product) => (
                             <div key={product.id}>
                                <ProductImage 
                                    images={product.images}
                                    altText={`${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree`}
                                    productUrl={`/products/${product.fabric_type}/${product.slug}`}
                                />
                                <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{product.name}</h3>
                                <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-charcoal-gray">No products found in this collection yet.</p>
                        <Link to="/products" className="text-sm text-deep-maroon hover:underline mt-4 inline-block">
                            &larr; Back to All Sarees
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FabricPage;