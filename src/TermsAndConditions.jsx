import React from 'react';
import { Helmet } from 'react-helmet-async';
import { getTermsMetaTags } from './utils/metaTags.js';

const TermsAndConditions = () => {
    const termsMeta = getTermsMetaTags();
    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-soft-beige min-h-screen pt-12 pb-16 font-sans">
            <Helmet>
                <title>{termsMeta.title}</title>
                <meta name="description" content={termsMeta.description} />
                <link rel="canonical" href={termsMeta.canonical} />
                <meta property="og:title" content={termsMeta.openGraph.title} />
                <meta property="og:description" content={termsMeta.openGraph.description} />
                <meta property="og:url" content={termsMeta.openGraph.url} />
                <meta property="og:type" content={termsMeta.openGraph.type} />
                <meta property="og:image" content={termsMeta.openGraph.image} />
                <meta property="og:site_name" content={termsMeta.openGraph.siteName} />
                <meta name="twitter:card" content={termsMeta.twitter.card} />
                <meta name="twitter:title" content={termsMeta.twitter.title} />
                <meta name="twitter:description" content={termsMeta.twitter.description} />
                <meta name="twitter:image" content={termsMeta.twitter.image} />
            </Helmet>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">Terms and Conditions</h1>
                <div className="space-y-8 text-charcoal-gray">
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Agreement to Terms</h2>
                        <p>By accessing or using our website, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the website.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Intellectual Property</h2>
                        <p>The content, design, and graphics on this website are owned by or licensed to us. Reproduction is prohibited other than in accordance with the copyright notice, which forms part of these terms and conditions.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Limitation of Liability</h2>
                        <p>We shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if we have been advised of the possibility of such damages.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;