import React from 'react';

const ContactUs = () => {
    return (
        <div className="bg-soft-beige min-h-screen pt-32 pb-16 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">Contact Us</h1>
                <div className="space-y-8 text-charcoal-gray text-center">
                    <p>For any inquiries, please contact us at:</p>
                    <a href="mailto:support@neera.com" className="text-deep-maroon hover:underline text-xl">support@neera.com</a>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
