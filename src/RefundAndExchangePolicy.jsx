import React from 'react';

const RefundAndExchangePolicy = () => {
    return (
        // FIX: Changed pt-16 to pt-12 for consistent spacing
        <div className="bg-soft-beige min-h-screen pt-12 pb-16 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">Refund and Exchange Policy</h1>
                <div className="space-y-8 text-charcoal-gray">
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">No Refund Policy</h2>
                        <p>We do not offer refunds on any purchases. All sales are final.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Exchange Policy</h2>
                        <p>We only offer exchanges for products that are defective or damaged upon receipt. To be eligible for an exchange, you must notify us within 24 hours of receiving the product. Please provide a detailed description of the defect or damage, along with photographic evidence.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">Conditions for Exchange</h2>
                        <ul className="list-disc list-inside space-y-2">
                            <li>The product must be unused and in the same condition that you received it.</li>
                            <li>It must be in the original packaging.</li>
                            <li>You must provide proof of purchase.</li>
                        </ul>
                    </div>
                    <div>
                        <h2 className="text-xl font-serif text-deep-maroon mb-4">How to Initiate an Exchange</h2>
                        <p>To initiate an exchange, please contact our customer support team at <a href="mailto:support@neera.com" className="text-deep-maroon hover:underline">support@neera.com</a> with your order number and details of the issue. Our team will guide you through the exchange process.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundAndExchangePolicy;