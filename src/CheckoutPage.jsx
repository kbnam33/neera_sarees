import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

const BackArrowIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-soft-beige bg-opacity-90 z-[200] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-deep-maroon"></div>
        <p className="mt-4 text-lg font-serif text-deep-maroon">Placing Your Order...</p>
    </div>
);


const CheckoutPage = ({ session, onOrderSuccess }) => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        postalCode: '',
        email: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false); // New state for post-payment loading

    useEffect(() => {
        if (session) {
            setShippingInfo(prev => ({ ...prev, email: session.user.email }));
        }
    }, [session]);

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

        if (typeof subtotal !== 'number' || subtotal <= 0) {
            setError("Cannot process an order with an invalid or zero total. Please check your cart.");
            setLoading(false);
            return;
        }

        try {
            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
                body: { amount: subtotal },
            });
            
            if (orderError) throw new Error(orderError.message);
            if (!orderData.id) throw new Error("Failed to create Razorpay order.");

            const razorpayOrderId = orderData.id;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: 'INR',
                name: 'Neera Sarees',
                description: 'Saree Purchase',
                image: '/Neera logo.png',
                order_id: razorpayOrderId,
                handler: async (response) => {
                    setIsPlacingOrder(true); // Show loading overlay
                    try {
                        const { data: verificationData, error: verificationError } = await supabase.functions.invoke('verify-razorpay-payment', {
                            body: {
                                order_id: razorpayOrderId,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                        });

                        if (verificationError || verificationData.status !== 'ok') {
                            throw new Error(verificationError?.message || "Payment verification failed.");
                        }
                        
                        const orderPayload = {
                            user_id: session.user.id,
                            total_price: subtotal,
                            shipping_address: shippingInfo,
                            products: cartItems,
                            payment_status: 'paid',
                            razorpay_order_id: razorpayOrderId,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        };

                        const { data: dbData, error: dbError } = await supabase
                            .from('orders')
                            .insert([orderPayload])
                            .select();

                        if (dbError) throw dbError;
                        
                        clearCart();
                        onOrderSuccess({ ...orderPayload, id: dbData[0].id, created_at: dbData[0].created_at });

                    } catch (handlerError) {
                        setError(`An error occurred after payment: ${handlerError.message}`);
                        setIsPlacingOrder(false); // Hide loading overlay on error
                    }
                },
                prefill: {
                    name: shippingInfo.name,
                    email: shippingInfo.email,
                    contact: shippingInfo.phone,
                },
                notes: {
                    address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state} - ${shippingInfo.postalCode}`,
                },
                theme: {
                    color: '#5B1A32',
                },
                config: {
                    display: {
                      blocks: {
                        banks: {
                          name: 'Pay using Card or UPI',
                          instruments: [
                            { method: 'card' },
                            { method: 'upi' }
                          ],
                        },
                      },
                      sequence: ['block.banks'],
                      preferences: {
                        show_default_blocks: false,
                      },
                    },
                },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-soft-beige min-h-screen pt-16 pb-16 font-sans">
            {isPlacingOrder && <LoadingOverlay />}
            <div className="max-w-6xl mx-auto px-4 sm:px-8">
                <button onClick={() => navigate('/cart')} className="text-sm text-charcoal-gray hover:text-deep-maroon mb-8 flex items-center gap-x-2 transition-colors">
                    <BackArrowIcon />
                    <span>Back to Cart</span>
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                    {/* Shipping Form */}
                    <div className="lg:order-1">
                        <h2 className="text-2xl font-serif text-deep-maroon mb-6">Contact & Shipping</h2>
                        <form onSubmit={handleSubmitOrder} className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">EMAIL</label>
                                <input type="email" id="email" value={shippingInfo.email} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">FULL NAME</label>
                                <input type="text" id="name" value={shippingInfo.name} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                            </div>
                             <div>
                                <label htmlFor="phone" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">PHONE</label>
                                <input type="tel" id="phone" value={shippingInfo.phone} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">ADDRESS</label>
                                <input type="text" id="address" placeholder="Street address, apartment, etc." value={shippingInfo.address} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="city" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">CITY</label>
                                    <input type="text" id="city" value={shippingInfo.city} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">STATE</label>
                                    <input type="text" id="state" value={shippingInfo.state} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="postalCode" className="block text-xs font-medium text-charcoal-gray tracking-wider mb-1">POSTAL CODE</label>
                                <input type="text" id="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-deep-maroon transition-shadow" />
                            </div>

                            <div className="pt-4">
                                 <button
                                    type="submit"
                                    disabled={loading || cartItems.length === 0}
                                    className="w-full bg-deep-maroon text-white py-3.5 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300 disabled:bg-gray-400 rounded-sm text-sm font-semibold"
                                >
                                    {loading ? 'INITIALIZING...' : `PAY ₹${subtotal.toFixed(2)}`}
                                </button>
                            </div>
                            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:order-2 bg-white/60 p-8 rounded-lg border border-gray-200 h-fit">
                        <h2 className="text-2xl font-serif text-deep-maroon border-b border-gray-300 pb-4 mb-6">Your Order</h2>
                        <div className="space-y-4">
                            {cartItems.map(item => {
                                const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/64x80/F8F5EF/5B1A32?text=Neera';
                                return (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-x-4">
                                        <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden relative">
                                            <img src={imageUrl} alt={item.name} className="w-full h-full object-cover" />
                                            <span className="absolute -top-2 -right-2 bg-charcoal-gray text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">{item.quantity}</span>
                                        </div>
                                        <p className="text-charcoal-gray flex-1">{item.name}</p>
                                    </div>
                                    <p className="font-semibold text-charcoal-gray whitespace-nowrap">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            )})}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-300 space-y-2">
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-600">Subtotal</p>
                                <p className="text-charcoal-gray">₹ {subtotal.toFixed(2)}</p>
                            </div>
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-600">Shipping</p>
                                <p className="text-charcoal-gray font-semibold">FREE</p>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 mt-2 border-t border-gray-300">
                                <p className="text-deep-maroon">Total</p>
                                <p className="text-deep-maroon">₹ {subtotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;