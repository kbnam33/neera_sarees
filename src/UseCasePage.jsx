import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { USE_CASES } from './config/useCaseMap';
import { getUseCaseMetaTags } from './utils/metaTags';
import { getCollectionSchema, getOrganizationSchema } from './utils/schemaMarkup';

const UseCasePage = ({ allProducts }) => {
    const { useCaseSlug } = useParams();
    const useCase = USE_CASES[useCaseSlug];
    const navigate = useNavigate();

    if (!useCase) {
        navigate('/products', { replace: true });
        return null;
    }

    const filteredProducts = allProducts.filter(p =>
        useCase.fabrics.some(f => f.toLowerCase() === p.fabric_type.toLowerCase())
    );

    const meta = getUseCaseMetaTags(useCase);
    const collectionSchema = getCollectionSchema(
        useCase.metaTitle,
        useCase.metaDescription,
        useCase.canonicalPath,
        filteredProducts.length
    );
    const orgSchema = getOrganizationSchema();

    return (
        <div className="neera-product-page">
            <Helmet>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <link rel="canonical" href={meta.canonical} />
                <meta property="og:title" content={meta.openGraph.title} />
                <meta property="og:description" content={meta.openGraph.description} />
                <meta property="og:url" content={meta.openGraph.url} />
                <meta property="og:type" content={meta.openGraph.type} />
                <meta property="og:image" content={meta.openGraph.image} />
                <meta property="og:site_name" content={meta.openGraph.siteName} />
                <meta name="twitter:card" content={meta.twitter.card} />
                <meta name="twitter:title" content={meta.twitter.title} />
                <meta name="twitter:description" content={meta.twitter.description} />
                <meta name="twitter:image" content={meta.twitter.image} />

                <script type="application/ld+json">
                    {JSON.stringify(collectionSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
            </Helmet>
            <div className="neera-product-page__header">
                <span className="neera-product-page__label">{useCase.label}</span>
                <h1 className="neera-product-page__heading">{useCase.headline}</h1>
                <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <p className="neera-product-page__desc">{useCase.subheading}</p>
                {useCase.bodyCopy && (
                    <p className="neera-product-page__desc" style={{ lineHeight: '1.8' }}>
                        {useCase.bodyCopy}
                    </p>
                )}
            </div>
            </div>
            <div>
                {filteredProducts.length > 0 ? (
                    <ul className="neera-product-grid">
                        {filteredProducts.map((product, index) => (
                            <li key={product.id}>
                                <Link to={`/products/${product.fabric_type}/${product.slug}`} className="neera-product-card">
                                    <div className="neera-product-card__img-wrap">
                                        <img
                                            src={product.images?.[0] || '/New%20images/linen_close_shot2.jpeg'}
                                            alt={`${product.name} — ${product.fabric_type} saree for working women`}
                                            loading={index < 3 ? "eager" : "lazy"}
                                            fetchpriority={index === 0 ? "high" : index < 3 ? "auto" : undefined}
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
            {filteredProducts.length > 0 && (
                <p className="neera-product-page__desc" style={{ marginTop: '1rem', marginBottom: '2rem' }}>
                    <Link
                        to={`/fabric/${useCase.fabrics[0]}`}
                        style={{ textDecoration: 'underline', textUnderlineOffset: '3px' }}
                    >
                        Browse all {useCase.label} sarees by fabric &rarr;
                    </Link>
                </p>
            )}
        </div>
    );
};

export default UseCasePage;