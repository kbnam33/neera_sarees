import React from 'react';

const OrderConfirmationPage = ({ onNavigate }) => {
    return (
        <div className="bg-soft-beige min-h-screen flex items-center justify-center text-center">
            <div>
                <h1 className="text-3xl font-serif text-deep-maroon mb-4">Thank you for your order!</h1>
                <p className="text-charcoal-gray mb-8">A confirmation email has been sent to you.</p>
                <button 
                    onClick={() => onNavigate('home')}
                    className="bg-deep-maroon text-white py-3 px-8 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300"
                >
                    CONTINUE SHOPPING
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;