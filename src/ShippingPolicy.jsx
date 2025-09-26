import React from 'react';

const ShippingPolicy = () => {
    return (
        <div className="bg-soft-beige min-h-screen pt-32 pb-16 font-sans">
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
