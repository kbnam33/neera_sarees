import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductImage from './components/ProductImage.jsx';
import Breadcrumb from './components/Breadcrumb.jsx';
import { getPrintCategoryMetaTags } from './utils/metaTags.js';
import { getCollectionSchema, getOrganizationSchema, getBreadcrumbSchema } from './utils/schemaMarkup.js';

const PrintPage = ({ allProducts }) => {
    const { printName } = useParams();

    // Assumes a 'print_type' column on your products table
    const filteredProducts = allProducts.filter(p => p.print_type && p.print_type.toLowerCase() === printName.toLowerCase());
    
    // Generate meta tags
    const printMeta = getPrintCategoryMetaTags(printName, filteredProducts.length);
    const collectionSchema = getCollectionSchema(
        `${printName} Sarees Collection`,
        `Discover ${filteredProducts.length} stunning ${printName} sarees with traditional prints and modern elegance.`,
        `/prints/${printName}`,
        filteredProducts.length
    );
    const orgSchema = getOrganizationSchema();
    
    // Breadcrumb data
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'All Sarees', path: '/products' },
        { name: `${printName} Sarees`, path: `/prints/${printName}` }
    ];
    const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-neera-bg pt-12 pb-20">
            <Helmet>
                <title>{printMeta.title}</title>
                <meta name="description" content={printMeta.description} />
                <link rel="canonical" href={printMeta.canonical} />
                <meta property="og:title" content={printMeta.openGraph.title} />
                <meta property="og:description" content={printMeta.openGraph.description} />
                <meta property="og:url" content={printMeta.openGraph.url} />
                <meta property="og:type" content={printMeta.openGraph.type} />
                <meta property="og:image" content={printMeta.openGraph.image} />
                <meta property="og:site_name" content={printMeta.openGraph.siteName} />
                <meta name="twitter:card" content={printMeta.twitter.card} />
                <meta name="twitter:title" content={printMeta.twitter.title} />
                <meta name="twitter:description" content={printMeta.twitter.description} />
                <meta name="twitter:image" content={printMeta.twitter.image} />
                
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
                    <h1 className="text-4xl font-serif text-neera-accent capitalize">{printName}</h1>
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
                                <h3 className="text-lg font-serif text-neera-text group-hover:text-neera-accent transition-colors">{product.name}</h3>
                                <p className="text-md text-neera-accent/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
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

export default PrintPage;