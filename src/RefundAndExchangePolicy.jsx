import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getRefundPolicyMetaTags } from './utils/metaTags.js';

const RefundAndExchangePolicy = () => {
    const refundMeta = getRefundPolicyMetaTags();
    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-neera-bg min-h-screen pt-12 pb-16 font-sans">
            <Helmet>
                <title>{refundMeta.title}</title>
                <meta name="description" content={refundMeta.description} />
                <link rel="canonical" href={refundMeta.canonical} />
                <meta property="og:title" content={refundMeta.openGraph.title} />
                <meta property="og:description" content={refundMeta.openGraph.description} />
                <meta property="og:url" content={refundMeta.openGraph.url} />
                <meta property="og:type" content={refundMeta.openGraph.type} />
                <meta property="og:image" content={refundMeta.openGraph.image} />
                <meta property="og:site_name" content={refundMeta.openGraph.siteName} />
                <meta name="twitter:card" content={refundMeta.twitter.card} />
                <meta name="twitter:title" content={refundMeta.twitter.title} />
                <meta name="twitter:description" content={refundMeta.twitter.description} />
                <meta name="twitter:image" content={refundMeta.twitter.image} />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-neera-accent mb-12">Refund and Exchange Policy</h1>
                <div className="space-y-8 text-neera-text">
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">No Refund Policy</h2>
                        <p>We do not offer refunds on any purchases. All sales are final.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">Exchange Policy</h2>
                        <p>We only offer exchanges for products that are defective or damaged upon receipt. To be eligible for an exchange, you must notify us within 24 hours of receiving the product. Please provide a detailed description of the defect or damage, along with photographic evidence.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">Conditions for Exchange</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>The product must be unused and in the same condition that you received it.</li>
                            <li>It must be in the original packaging.</li>
                            <li>You must provide proof of purchase.</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">How to Initiate an Exchange</h2>
                        <p>To initiate an exchange, please contact our customer support team at <a href="mailto:support@neera.com" className="text-neera-accent hover:underline">support@neera.com</a> with your order number and details of the issue. Our team will guide you through the exchange process.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundAndExchangePolicy;