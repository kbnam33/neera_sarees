import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getPrivacyPolicyMetaTags } from './utils/metaTags.js';

const PrivacyPolicy = () => {
    const privacyMeta = getPrivacyPolicyMetaTags();
    
    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-neera-bg min-h-screen pt-12 pb-16 font-sans">
            <Helmet>
                <title>{privacyMeta.title}</title>
                <meta name="description" content={privacyMeta.description} />
                <link rel="canonical" href={privacyMeta.canonical} />
                <meta property="og:title" content={privacyMeta.openGraph.title} />
                <meta property="og:description" content={privacyMeta.openGraph.description} />
                <meta property="og:url" content={privacyMeta.openGraph.url} />
                <meta property="og:type" content={privacyMeta.openGraph.type} />
                <meta property="og:image" content={privacyMeta.openGraph.image} />
                <meta property="og:site_name" content={privacyMeta.openGraph.siteName} />
                <meta name="twitter:card" content={privacyMeta.twitter.card} />
                <meta name="twitter:title" content={privacyMeta.twitter.title} />
                <meta name="twitter:description" content={privacyMeta.twitter.description} />
                <meta name="twitter:image" content={privacyMeta.twitter.image} />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-neera-accent mb-12">Privacy Policy</h1>
                <div className="space-y-8 text-neera-text">
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">Information We Collect</h2>
                        <p>We collect information from you when you register on our site, place an order, or subscribe to our newsletter. The information we collect may include your name, email address, mailing address, phone number, and credit card information.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">How We Use Your Information</h2>
                        <p>We use the information we collect to process transactions, send periodic emails, and improve our website and customer service. We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-neera-accent mb-4">Security of Your Information</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;