import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
        <div className="bg-neera-bg pt-12 pb-20">
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
                <div className="mb-10 pb-8 border-b border-neera-border">
                    <p className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-2">THE COLLECTION</p>
                    <h1 className="font-serif text-neera-text text-3xl md:text-4xl mb-4 capitalize">{fabricName} Sarees for Working Women</h1>
                    <p className="text-neera-text-soft text-sm font-sans leading-relaxed max-w-xl">{fabricDesc}</p>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                        {filteredProducts.map((product) => (
                             <div key={product.id} className="group">
                                <Link to={`/products/${product.fabric_type}/${product.slug}`} className="block">
                                    <div className="aspect-[3/4] overflow-hidden mb-3">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={`${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree`}
                                                loading="lazy"
                                                decoding="async"
                                                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                                            />
                                        ) : (
                                            <div className="w-full h-full" style={{ backgroundColor: '#DDD6CE' }} />
                                        )}
                                    </div>
                                </Link>
                                <h3 className="font-serif text-neera-text text-sm mb-1">{product.name}</h3>
                                <p className="text-neera-text-muted text-xs font-sans tracking-wide">₹ {product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-neera-text">No products found in this collection yet.</p>
                        <Link to="/products" className="text-sm text-neera-accent hover:underline mt-4 inline-block">
                            &larr; Back to All Sarees
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FabricPage;