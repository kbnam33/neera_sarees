import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';
import { Helmet } from 'react-helmet-async';

const BackArrowIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const LoadingOverlay = ({ message }) => (
    <div className="fixed inset-0 bg-neera-bg bg-opacity-90 z-[200] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neera-accent"></div>
        <p className="mt-4 text-lg font-serif text-neera-accent">{message}</p>
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
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    
    const [discountCode, setDiscountCode] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [discountError, setDiscountError] = useState(null);
    const [applyingDiscount, setApplyingDiscount] = useState(false);
    
    useEffect(() => {
        // If session exists, pre-fill form with user data if available
        if (session) {
            const meta = session.user.user_metadata;
            const userPhone = session.user.phone ? session.user.phone.replace('+91', '') : '';
            
            setShippingInfo(prev => ({
                ...prev,
                name: meta.full_name || '',
                email: session.user.email || '',
                phone: userPhone,
                ...meta.shipping_address
            }));
        }
    }, [session]);

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    
    const calculateDiscountAmount = () => {
        if (!appliedDiscount) return 0;
        
        if (appliedDiscount.discount_type === 'percentage') {
            const discountAmount = (subtotal * appliedDiscount.discount_value) / 100;
            if (appliedDiscount.max_discount_amount) {
                return Math.min(discountAmount, appliedDiscount.max_discount_amount);
            }
            return discountAmount;
        } else if (appliedDiscount.discount_type === 'fixed') {
            return Math.min(appliedDiscount.discount_value, subtotal);
        }
        return 0;
    };
    
    const discountAmount = Number(calculateDiscountAmount().toFixed(2));
    const finalTotal = Number(Math.max(subtotal - discountAmount, 0).toFixed(2));

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [id]: value }));
    };
    
    const handleApplyDiscount = async () => {
        if (!discountCode.trim()) {
            setDiscountError('Please enter a discount code');
            return;
        }
        
        setApplyingDiscount(true);
        setDiscountError(null);
        
        try {
            const { data, error } = await supabase
                .from('discount_codes')
                .select('*')
                .eq('code', discountCode.toUpperCase())
                .eq('is_active', true)
                .single();
            
            if (error) {
                console.error('Discount code query error:', error);
                // Check if the table doesn't exist
                if (error.code === 'PGRST116' || error.message.includes('relation') || error.message.includes('does not exist')) {
                    setDiscountError('Discount feature not available. Please run database migrations.');
                } else {
                    setDiscountError('Invalid or expired discount code');
                }
                setAppliedDiscount(null);
                return;
            }
            
            if (!data) {
                setDiscountError('Invalid or expired discount code');
                setAppliedDiscount(null);
                return;
            }
            
            const now = new Date();
            const validFrom = new Date(data.valid_from);
            const validUntil = data.valid_until ? new Date(data.valid_until) : null;
            
            if (now < validFrom) {
                setDiscountError('This discount code is not yet active');
                setAppliedDiscount(null);
                return;
            }
            
            if (validUntil && now > validUntil) {
                setDiscountError('This discount code has expired');
                setAppliedDiscount(null);
                return;
            }
            
            if (data.min_order_amount && subtotal < data.min_order_amount) {
                setDiscountError(`Minimum order amount of ₹${data.min_order_amount} required`);
                setAppliedDiscount(null);
                return;
            }
            
            if (data.usage_limit && data.times_used >= data.usage_limit) {
                setDiscountError('This discount code has reached its usage limit');
                setAppliedDiscount(null);
                return;
            }
            
            setAppliedDiscount(data);
            setDiscountError(null);
        } catch (err) {
            console.error('Discount validation error:', err);
            setDiscountError('Failed to validate discount code. Database setup may be required.');
            setAppliedDiscount(null);
        } finally {
            setApplyingDiscount(false);
        }
    };
    
    const handleRemoveDiscount = () => {
        setAppliedDiscount(null);
        setDiscountCode('');
        setDiscountError(null);
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();
        
        // Validate phone - required for all orders (becomes login for next time)
        if (!shippingInfo.phone || shippingInfo.phone.trim() === '') {
            setError("Phone number is required for order confirmation.");
            return;
        }
        
        setLoading(true);
        setError(null);

        try {
            let userId = session?.user?.id;

            // If not logged in, create/update user account using phone
            if (!userId) {
                const formattedPhone = `+91${shippingInfo.phone}`;
                
                // Check if user exists with this phone
                const { data: existingUsers } = await supabase
                    .from('users')
                    .select('id')
                    .eq('phone', formattedPhone)
                    .limit(1);

                if (existingUsers && existingUsers.length > 0) {
                    // User exists - we need them to login, but for now we can proceed as guest
                    // Just don't link this order to a user
                    userId = null;
                }
            }

            // Save shipping info to user metadata if logged in
            if (userId) {
                await supabase.auth.updateUser({ data: { shipping_address: shippingInfo } });
            }

            const orderPayload = {
                total_price: finalTotal,
                shipping_address: shippingInfo,
                products: cartItems,
                payment_status: 'pending',
            };
            
            // Only add user_id if user is logged in
            if (userId) {
                orderPayload.user_id = userId;
            }
            
            // Add discount fields only if discount is applied
            if (appliedDiscount) {
                orderPayload.original_price = subtotal;
                orderPayload.discount_code = appliedDiscount.code;
                orderPayload.discount_amount = discountAmount;
            }

            const { data: pendingOrderData, error: pendingOrderError } = await supabase
                .from('orders')
                .insert([orderPayload])
                .select()
                .single();

            if (pendingOrderError) {
                console.error('Order insertion error:', pendingOrderError);
                throw new Error(`Failed to create order: ${pendingOrderError.message}`);
            }
            
            // Update discount usage count (ignore errors if table doesn't exist)
            if (appliedDiscount) {
                try {
                    await supabase
                        .from('discount_codes')
                        .update({ times_used: appliedDiscount.times_used + 1 })
                        .eq('id', appliedDiscount.id);
                } catch (discountUpdateError) {
                    console.warn('Failed to update discount usage:', discountUpdateError);
                    // Continue anyway - don't fail the order
                }
            }

            const { data: orderData, error: orderError } = await supabase.functions.invoke('create-razorpay-order', {
                body: { amount: finalTotal },
            });
            
            if (orderError) {
                console.error('Razorpay order creation error:', orderError);
                let detailedMessage = orderError.message;
                // Supabase FunctionsHttpError includes a Response object in `context`
                // that often contains the real backend error payload.
                if (orderError.context) {
                    try {
                        const errorPayload = await orderError.context.json();
                        if (errorPayload?.error) {
                            detailedMessage = errorPayload.error;
                        } else {
                            detailedMessage = JSON.stringify(errorPayload);
                        }
                    } catch (contextParseError) {
                        console.warn('Could not parse function error context:', contextParseError);
                    }
                }
                throw new Error(`Payment initialization failed: ${detailedMessage}`);
            }
            
            if (!orderData) {
                throw new Error("No response from payment gateway. Please try again.");
            }
            
            if (orderData.error) {
                console.error('Razorpay API error:', orderData.error);
                throw new Error(`Payment gateway error: ${orderData.error}`);
            }
            
            if (!orderData.id) {
                throw new Error("Failed to create payment order. Please try again.");
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.amount,
                currency: 'INR',
                name: 'Neera Sarees',
                description: `Order #${pendingOrderData.id}`,
                image: '/Neera logo.png',
                order_id: orderData.id,
                handler: async (response) => {
                    setIsPlacingOrder(true);
                    try {
                        await supabase.functions.invoke('verify-razorpay-payment', {
                            body: {
                                order_id: orderData.id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            },
                        });
                        
                        const { data: updatedDbData, error: updateDbError } = await supabase
                            .from('orders')
                            .update({
                                payment_status: 'paid',
                                razorpay_order_id: orderData.id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            })
                            .eq('id', pendingOrderData.id)
                            .select()
                            .single();

                        if (updateDbError) throw updateDbError;
                        
                        clearCart();
                        onOrderSuccess(updatedDbData);

                    } catch (handlerError) {
                        setError(`An error occurred after payment: ${handlerError.message}`);
                        setIsPlacingOrder(false);
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
                theme: { color: '#5B1A32' },
                config: {
                    display: {
                      blocks: { banks: { name: 'Pay using Card or UPI', instruments: [{ method: 'card' }, { method: 'upi' }] } },
                      sequence: ['block.banks'],
                      preferences: { show_default_blocks: false },
                    },
                },
            };
            const paymentObject = new window.Razorpay(options);
            paymentObject.open();
        } catch (error) {
            console.error('Checkout error:', error);
            setError(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="bg-neera-bg min-h-screen py-16 font-sans" style={{ backgroundColor: '#F2EDE6' }}>
            {isPlacingOrder && <LoadingOverlay message="Placing Your Order..." />}
            {loading && !isPlacingOrder && <LoadingOverlay message="Processing..." />}

            <div className="max-w-6xl mx-auto px-4 sm:px-8">
                <button onClick={() => navigate('/cart')} className="text-sm text-neera-text hover:text-neera-accent mb-8 flex items-center gap-x-2 transition-colors">
                    <BackArrowIcon />
                    <span>Back to Cart</span>
                </button>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-12">
                    <div className="lg:order-1">
                        <form onSubmit={handleSubmitOrder} className="space-y-5">
                             <h2 className="text-2xl font-serif text-neera-accent mb-6">Shipping Address</h2>
                             <div>
                                <label htmlFor="name" className="block text-xs font-medium text-neera-text tracking-wider mb-1">FULL NAME</label>
                                <input type="text" id="name" value={shippingInfo.name} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block text-xs font-medium text-neera-text tracking-wider mb-1">PHONE</label>
                                <input type="tel" id="phone" value={shippingInfo.phone} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-xs font-medium text-neera-text tracking-wider mb-1">EMAIL (OPTIONAL)</label>
                                <input type="email" id="email" value={shippingInfo.email} onChange={handleInputChange} className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                            </div>
                            <div>
                                <label htmlFor="address" className="block text-xs font-medium text-neera-text tracking-wider mb-1">ADDRESS</label>
                                <input type="text" id="address" placeholder="Street address, apartment, etc." value={shippingInfo.address} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label htmlFor="city" className="block text-xs font-medium text-neera-text tracking-wider mb-1">CITY</label>
                                    <input type="text" id="city" value={shippingInfo.city} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                                </div>
                                <div>
                                    <label htmlFor="state" className="block text-xs font-medium text-neera-text tracking-wider mb-1">STATE</label>
                                    <input type="text" id="state" value={shippingInfo.state} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                                </div>
                            </div>
                             <div>
                                <label htmlFor="postalCode" className="block text-xs font-medium text-neera-text tracking-wider mb-1">POSTAL CODE</label>
                                <input type="text" id="postalCode" value={shippingInfo.postalCode} onChange={handleInputChange} required className="w-full p-3 bg-white border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-neera-accent transition-shadow" />
                            </div>
                            <div className="pt-4">
                                 <button type="submit" disabled={loading || cartItems.length === 0} className="w-full py-3.5 tracking-widest transition-colors duration-300 disabled:bg-gray-400 rounded-sm text-sm font-semibold" style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}>
                                    {loading ? 'INITIALIZING...' : `PROCEED TO PAYMENT`}
                                </button>
                            </div>
                        </form>
                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                    </div>

                    <div className="lg:order-2 bg-white/60 p-8 rounded-lg border border-gray-200 h-fit">
                        <h2 className="text-2xl font-serif text-neera-accent border-b border-gray-300 pb-4 mb-6">Your Order</h2>
                        <div className="space-y-4">
                            {cartItems.map(item => {
                                const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/64x80/F8F5EF/5B1A32?text=Neera';
                                return (
                                <div key={item.id} className="flex justify-between items-center text-sm">
                                    <div className="flex items-center gap-x-4">
                                        <div className="w-16 h-20 bg-gray-100 rounded-md overflow-hidden relative">
                                            <img src={imageUrl} alt={item.name} loading="lazy" decoding="async" width={64} height={80} className="w-full h-full object-cover" />
                                            <span className="absolute -top-2 -right-2 bg-neera-text text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">{item.quantity}</span>
                                        </div>
                                        <p className="text-neera-text flex-1">{item.name}</p>
                                    </div>
                                    <p className="font-semibold text-neera-text whitespace-nowrap">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                </div>
                            )})}
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-300 space-y-2">
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-600">Subtotal</p>
                                <p className="text-neera-text">₹ {subtotal.toFixed(2)}</p>
                            </div>
                            
                            {/* Discount Code Section */}
                            <div className="py-4 space-y-3">
                                {!appliedDiscount ? (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            placeholder="Discount code"
                                            value={discountCode}
                                            onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-1 focus:ring-neera-accent uppercase"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleApplyDiscount}
                                            disabled={applyingDiscount || !discountCode.trim()}
                                            className="px-4 py-2 bg-neera-text text-white text-xs font-semibold tracking-wider hover:bg-neera-text/90 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-sm transition-colors"
                                        >
                                            {applyingDiscount ? 'APPLYING...' : 'APPLY'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-sm px-3 py-2">
                                        <div className="flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-sm font-semibold text-green-800">{appliedDiscount.code}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemoveDiscount}
                                            className="text-xs text-red-600 hover:text-red-800 font-medium"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                )}
                                {discountError && (
                                    <p className="text-xs text-red-600">{discountError}</p>
                                )}
                            </div>
                            
                            {appliedDiscount && (
                                <div className="flex justify-between text-sm text-green-600">
                                    <p className="font-medium">Discount ({appliedDiscount.discount_type === 'percentage' ? `${appliedDiscount.discount_value}%` : 'Flat'})</p>
                                    <p className="font-semibold">- ₹ {discountAmount.toFixed(2)}</p>
                                </div>
                            )}
                            
                            <div className="flex justify-between text-sm">
                                <p className="text-gray-600">Shipping</p>
                                <p className="text-neera-text font-semibold">Based on location</p>
                            </div>
                            <div className="flex justify-between text-lg font-bold pt-2 mt-2 border-t border-gray-300">
                                <p className="text-neera-accent">Total</p>
                                <p className="text-neera-accent">₹ {finalTotal.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;