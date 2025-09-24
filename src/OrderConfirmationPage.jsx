import React from 'react';
import { useNavigate } from 'react-router-dom';

// Green checkmark icon
const CheckCircleIcon = ({ className = "w-16 h-16" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const OrderConfirmationPage = ({ order }) => {
    const navigate = useNavigate();

    if (!order) {
        // Fallback for when the page is refreshed or accessed directly
        return (
            <div className="bg-soft-beige min-h-screen flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-serif text-deep-maroon mb-4">Looking for an order?</h1>
                    <p className="text-charcoal-gray mb-8">Your order details couldn't be found. Please check your email for the confirmation.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="bg-deep-maroon text-white py-3 px-8 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300"
                    >
                        CONTINUE SHOPPING
                    </button>
                </div>
            </div>
        );
    }
    
    const { shipping_address: address, products, total_price } = order;
    
    return (
        <div className="bg-soft-beige min-h-screen py-16 px-4 sm:px-8 font-sans">
            <div className="max-w-2xl mx-auto text-center">
                <div className="flex justify-center text-green-600 mb-4">
                    <CheckCircleIcon />
                </div>
                <h1 className="text-4xl font-serif text-deep-maroon mb-2">Order Placed!</h1>
                <p className="text-charcoal-gray mb-4">Thank you, {address.name}. Your order has been confirmed.</p>
                <p className="text-sm text-gray-500 mb-8">You'll receive a confirmation email with your order details shortly.</p>
            </div>

            <div className="max-w-4xl mx-auto bg-white/70 p-8 shadow-lg rounded-lg border border-gray-200 mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Order Summary */}
                    <div>
                        <h2 className="text-lg font-semibold text-charcoal-gray mb-4 border-b pb-2">Order Summary</h2>
                        <div className="space-y-4">
                            {products.map(item => (
                                <div key={item.id} className="flex items-center gap-x-4">
                                    <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-md" />
                                    <div className="flex-grow">
                                        <p className="font-semibold text-charcoal-gray text-sm">{item.name}</p>
                                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="text-sm font-semibold text-charcoal-gray">₹{(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t text-sm">
                             <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₹{total_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span>FREE</span>
                            </div>
                            <div className="flex justify-between font-bold mt-2 text-base text-deep-maroon">
                                <span>Total</span>
                                <span>₹{total_price.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Details */}
                    <div>
                        <h2 className="text-lg font-semibold text-charcoal-gray mb-4 border-b pb-2">Shipping To</h2>
                        <div className="text-sm text-gray-700 space-y-1">
                            <p className="font-bold">{address.name}</p>
                            <p>{address.address}</p>
                            <p>{address.city}, {address.state} {address.postalCode}</p>
                        </div>
                        <div className="mt-6 pt-4 border-t">
                            <h3 className="font-semibold text-charcoal-gray mb-2">Estimated Delivery</h3>
                            <p className="text-sm text-gray-700">7-8 Weeks (Made to Order)</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center mt-12">
                <button 
                    onClick={() => navigate('/')}
                    className="bg-deep-maroon text-white py-3 px-10 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300 text-sm"
                >
                    CONTINUE SHOPPING
                </button>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;