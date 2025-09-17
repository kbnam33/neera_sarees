import React, { useState } from 'react';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

const CheckoutPage = ({ onNavigate, session }) => {
    const { cartItems, clearCart } = useCart();
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        country: 'India',
        postalCode: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        if (!session) {
            setError("You must be logged in to place an order.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([
                    { 
                        user_id: session.user.id,
                        total_price: subtotal,
                        shipping_address: shippingInfo,
                        products: cartItems 
                    }
                ]);

            if (error) throw error;
            
            clearCart();
            onNavigate('orderConfirmation');

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-soft-beige min-h-screen pt-32 pb-16 font-sans">
            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-4 sm:px-8">
                {/* Order Summary */}
                <div className="md:order-2">
                    <h2 className="text-xl font-serif text-deep-maroon border-b border-gray-300 pb-4 mb-6">Your Order</h2>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-x-4">
                                    <div className="w-16 h-20 bg-gray-100 relative">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        <span className="absolute -top-2 -right-2 bg-gray-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center">{item.quantity}</span>
                                    </div>
                                    <p className="text-charcoal-gray">{item.name}</p>
                                </div>
                                <p className="font-semibold text-charcoal-gray">₹ {(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-300 space-y-2">
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Subtotal</p>
                            <p className="text-charcoal-gray">₹ {subtotal.toFixed(2)}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                            <p className="text-gray-600">Shipping</p>
                            <p className="text-charcoal-gray">FREE</p>
                        </div>
                        <div className="flex justify-between text-lg font-semibold">
                            <p className="text-deep-maroon">Total</p>
                            <p className="text-deep-maroon">₹ {subtotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Shipping Information */}
                <div className="md:order-1">
                    <h2 className="text-xl font-serif text-deep-maroon border-b border-gray-300 pb-4 mb-6">Shipping Information</h2>
                    <form onSubmit={handleSubmitOrder} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="text-xs tracking-widest text-gray-600">FULL NAME</label>
                            <input type="text" id="name" value={shippingInfo.name} onChange={handleInputChange} required className="w-full mt-1 p-2 border border-gray-300 focus:outline-none focus:border-deep-maroon" />
                        </div>
                        <div>
                            <label htmlFor="address" className="text-xs tracking-widest text-gray-600">ADDRESS</label>
                            <input type="text" id="address" value={shippingInfo.address} onChange={handleInputChange} required className="w-full mt-1 p-2 border border-gray-300 focus:outline-none focus:border-deep-maroon" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="city" className="text-xs tracking-widest text-gray-600">CITY</label>
                                <input type="text" id="city" value={shippingInfo.city} onChange={handleInputChange} required className="w-full mt-1 p-2 border border-gray-300 focus:outline-none focus:border-deep-maroon" />
                            </div>
                            <div>
                                <label htmlFor="postalCode" className="text-xs tracking-widest text-gray-600">POSTAL CODE</label>
                                <input type="text" id="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} required className="w-full mt-1 p-2 border border-gray-300 focus:outline-none focus:border-deep-maroon" />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="country" className="text-xs tracking-widest text-gray-600">COUNTRY</label>
                            <input type="text" id="country" value={shippingInfo.country} onChange={handleInputChange} required disabled className="w-full mt-1 p-2 border bg-gray-100 border-gray-300" />
                        </div>
                        <div className="pt-6">
                             <button
                                type="submit"
                                disabled={loading || cartItems.length === 0}
                                className="w-full bg-deep-maroon text-white py-3 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300 disabled:bg-gray-400"
                            >
                                {loading ? 'PLACING ORDER...' : 'PLACE ORDER'}
                            </button>
                        </div>
                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;