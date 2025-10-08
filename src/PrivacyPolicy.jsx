import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className="bg-soft-beige min-h-screen pt-16 pb-16 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">Privacy Policy</h1>
                <div className="space-y-8 text-charcoal-gray">
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Information We Collect</h2>
                        <p>We collect information from you when you register on our site, place an order, or subscribe to our newsletter. The information we collect may include your name, email address, mailing address, phone number, and credit card information.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">How We Use Your Information</h2>
                        <p>We use the information we collect to process transactions, send periodic emails, and improve our website and customer service. We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Security of Your Information</h2>
                        <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;