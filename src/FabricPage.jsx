import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getFabricCategoryMetaTags } from './utils/metaTags.js';
import { getCollectionSchema, getOrganizationSchema } from './utils/schemaMarkup.js';

const FabricPage = ({ allProducts }) => {
    const { fabricName } = useParams();
    const normalizedFabricName = fabricName.toLowerCase();

    const filteredProducts = allProducts.filter(p => p.fabric_type.toLowerCase() === normalizedFabricName);

    const fabricDescriptions = {
        linen: "Crisp. Structured. Holds its drape all day.",
        mulmul: "Feather-light. Breathable. Built for 8-hour days.",
        "mul mul cotton": "Feather-light. Breathable. Built for 8-hour days.",
        chettinad: "Bold weaves. Heritage structure. Office-ready.",
        default: `${fabricName} sarees - made for working women.`
    };
    const fabricDesc = fabricDescriptions[normalizedFabricName] || fabricDescriptions.default;

    // Generate meta tags
    const fabricMeta = getFabricCategoryMetaTags(fabricName, fabricDesc);
    const collectionSchema = getCollectionSchema(
        `${fabricName} Sarees Collection`,
        `Explore ${filteredProducts.length} premium ${fabricName} sarees with authentic handwoven craftsmanship.`,
        `/fabric/${fabricName}`,
        filteredProducts.length
    );
    const orgSchema = getOrganizationSchema();
    
    return (
        <div className="neera-product-page">
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
                {/* Organization Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
            </Helmet>
            <div className="neera-product-page__header">
                <span className="neera-product-page__label">The Collection</span>
                <h1 className="neera-product-page__heading">{fabricName} Sarees.</h1>
                <p className="neera-product-page__desc">{fabricDesc}</p>
            </div>
            <div>
                {filteredProducts.length > 0 ? (
                    <ul className="neera-product-grid">
                        {filteredProducts.map((product) => (
                            <li key={product.id}>
                                <Link to={`/products/${product.fabric_type}/${product.slug}`} className="neera-product-card">
                                    <div className="neera-product-card__img-wrap">
                                        <img
                                            src={product.images?.[0] || '/New%20images/linen_close_shot2.jpeg'}
                                            alt={`${product.name} — Neera`}
                                            loading="lazy"
                                            decoding="async"
                                            className="neera-product-card__img"
                                        />
                                    </div>
                                    <div className="neera-product-card__meta">
                                        <p className="neera-product-card__name">{product.name}</p>
                                        <p className="neera-product-card__price">
                                            ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                </Link>
                            </li>
                        ))}
                    </ul>
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