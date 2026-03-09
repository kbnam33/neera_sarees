import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getShippingPolicyMetaTags } from './utils/metaTags.js';

const ShippingPolicy = () => {
    const shippingMeta = getShippingPolicyMetaTags();
    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-soft-beige min-h-screen pt-12 pb-16 font-sans">
            <Helmet>
                <title>{shippingMeta.title}</title>
                <meta name="description" content={shippingMeta.description} />
                <link rel="canonical" href={shippingMeta.canonical} />
                <meta property="og:title" content={shippingMeta.openGraph.title} />
                <meta property="og:description" content={shippingMeta.openGraph.description} />
                <meta property="og:url" content={shippingMeta.openGraph.url} />
                <meta property="og:type" content={shippingMeta.openGraph.type} />
                <meta property="og:image" content={shippingMeta.openGraph.image} />
                <meta property="og:site_name" content={shippingMeta.openGraph.siteName} />
                <meta name="twitter:card" content={shippingMeta.twitter.card} />
                <meta name="twitter:title" content={shippingMeta.twitter.title} />
                <meta name="twitter:description" content={shippingMeta.twitter.description} />
                <meta name="twitter:image" content={shippingMeta.twitter.image} />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">Shipping Policy</h1>
                <div className="space-y-8 text-charcoal-gray">
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Shipping within India</h2>
                        <p>We offer free shipping on all orders within India. Orders are typically processed within 2-3 business days and delivered within 7-10 business days.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">International Shipping</h2>
                        <p>We ship to most countries worldwide. International shipping charges and delivery times vary by destination. Please note that you may be subject to import duties and taxes, which are not included in the item price or shipping cost.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Order Tracking</h2>
                        <p>Once your order has shipped, you will receive an email with a tracking number and a link to track your package.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;