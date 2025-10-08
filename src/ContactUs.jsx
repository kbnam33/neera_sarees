import React, { useState } from 'react';

const ContactUs = () => {
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // This is where you would handle the form submission,
        // for example, sending the data to a serverless function or an email service.
        // For this example, we'll just show a success message on the front end.
        setSubmitted(true);
    };

    return (
        <div className="bg-soft-beige min-h-screen pt-16 pb-24 font-sans">
            <div className="max-w-5xl mx-auto px-4 sm:px-8">
                {/* --- Header Section --- */}
                <div className="text-center mb-16 md:mb-20">
                    <h1 className="text-4xl md:text-5xl font-serif text-deep-maroon mb-4">
                        Get in Touch
                    </h1>
                    <p className="text-charcoal-gray max-w-3xl mx-auto leading-relaxed">
                        We would love to hear from you. Whether you have a question about our sarees, an order, or just want to share your thoughts, please don't hesitate to reach out.
                    </p>
                </div>

                {/* --- Main Content: Two-Column Layout --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12 items-start">
                    
                    {/* --- Left Column: Contact Form --- */}
                    <div className="bg-white/50 p-8 md:p-10 border border-gray-200">
                        <h2 className="text-2xl font-serif text-deep-maroon mb-8">
                            Send Us a Message
                        </h2>
                        
                        {submitted ? (
                            <div className="text-center py-10 animate-fadeIn">
                                <p className="font-semibold text-charcoal-gray">Thank you for your message!</p>
                                <p className="text-sm text-gray-600 mt-2">We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div>
                                    <label htmlFor="fullName" className="block text-xs text-gray-600 tracking-widest uppercase mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        placeholder="Your Name"
                                        required
                                        className="w-full p-3 text-sm bg-transparent border-b border-gray-300 text-charcoal-gray placeholder-gray-400 focus:outline-none focus:border-deep-maroon transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-xs text-gray-600 tracking-widest uppercase mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        required
                                        className="w-full p-3 text-sm bg-transparent border-b border-gray-300 text-charcoal-gray placeholder-gray-400 focus:outline-none focus:border-deep-maroon transition-colors"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-xs text-gray-600 tracking-widest uppercase mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        rows="5"
                                        placeholder="Your message..."
                                        required
                                        className="w-full p-3 text-sm bg-transparent border-b border-gray-300 text-charcoal-gray placeholder-gray-400 focus:outline-none focus:border-deep-maroon transition-colors resize-none"
                                    ></textarea>
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-deep-maroon text-white py-3 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300 disabled:bg-gray-400"
                                    >
                                        Send Message
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* --- Right Column: Email and Address Information --- */}
                    <div className="pt-10 text-center md:text-left">
                        {/* Email Section */}
                        <div>
                            <h2 className="text-2xl font-serif text-deep-maroon mb-4">
                                Email Us
                            </h2>
                            <p className="text-charcoal-gray leading-relaxed mb-6">
                                For any inquiries, support, or feedback, please email us. We aim to respond within 24 hours.
                            </p>
                            <a href="mailto:support@neera.store" className="text-lg font-semibold text-deep-maroon hover:underline">
                                support@neera.store
                            </a>
                        </div>

                        {/* Address Section
                        <div className="mt-12 pt-12 border-t border-gray-200">
                            <h2 className="text-2xl font-serif text-deep-maroon mb-4">
                                Our Studio
                            </h2>
                            <p className="text-charcoal-gray leading-relaxed">
                                Neera Sarees<br/>
                                123 Lotus Lane, Alwarpet<br/>
                                Chennai, Tamil Nadu 600018<br/>
                                India
                            </p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;