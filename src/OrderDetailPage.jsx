import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

const MailIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const OrderDetailPage = ({ session }) => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchOrder = async () => {
            if (!session || !orderId) {
                setLoading(false);
                setError("Authentication session or Order ID is missing.");
                return;
            }

            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('orders')
                    .select('*') 
                    .eq('id', orderId)
                    .eq('user_id', session.user.id)
                    .single();

                if (error) throw error;
                setOrder(data);
            } catch (error) {
                setError("We couldn't find the order you're looking for. It might belong to another account or the ID is incorrect.");
            } finally {
                setLoading(false);
            }
        };

        if(session) {
            fetchOrder();
        }
    }, [orderId, session]);

    if (loading) {
        return <div className="bg-soft-beige min-h-screen flex items-center justify-center font-serif text-deep-maroon text-lg">Loading Order Details...</div>;
    }

    if (error || !order) {
        return (
            <div className="bg-soft-beige min-h-screen flex flex-col items-center justify-center text-center p-4">
                <p className="text-red-600 max-w-md">{error}</p>
                <Link to="/profile" className="inline-block mt-8 bg-deep-maroon text-white py-3 px-8 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300">
                    &larr; Back to My Orders
                </Link>
            </div>
        );
    }

    const { shipping_address: address, products, total_price, created_at } = order;
    
    return (
        // FIX: Changed py-24 to pt-12 pb-24 for consistent spacing
        <div className="bg-soft-beige min-h-screen pt-12 pb-24 px-4 sm:px-8 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="md:flex justify-between items-center mb-16">
                    <div>
                        <Link to="/profile" className="text-sm text-charcoal-gray hover:text-deep-maroon mb-4 inline-block">
                            &larr; All Orders
                        </Link>
                        <h1 className="text-4xl lg:text-5xl font-serif text-deep-maroon leading-tight">Order #{order.id}</h1>
                        <p className="text-charcoal-gray/70 mt-2">Placed on {new Date(created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="mt-8 md:mt-0">
                        <button 
                            onClick={() => navigate('/products')}
                            className="bg-deep-maroon text-white py-3 px-8 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300 shadow-lg"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white/50 p-8 sm:p-12 border border-gray-200 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-serif text-charcoal-gray mb-8">Items Ordered</h2>
                    
                    <div className="space-y-8">
                        {products.map(item => {
                             const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/96x128/F8F5EF/5B1A32?text=Neera';
                             return (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                                    <Link to={`/products/${item.fabric_type}/${item.slug}`} className="group">
                                        <div className="w-full md:w-32 h-48 bg-gray-100 rounded-md overflow-hidden">
                                            <img src={imageUrl} alt={item.name} loading="lazy" decoding="async" width={128} height={192} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        </div>
                                    </Link>
                                    <div className="md:col-span-2">
                                         <Link to={`/products/${item.fabric_type}/${item.slug}`} className="group">
                                            <p className="font-serif text-xl text-charcoal-gray group-hover:text-deep-maroon transition-colors">{item.name}</p>
                                        </Link>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Quantity: {item.quantity}
                                        </p>
                                    </div>
                                    <p className="text-lg font-semibold text-charcoal-gray text-left md:text-right">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12 pt-8 border-t border-gray-200">
                        <div className="md:col-span-1">
                             <h3 className="text-xl font-serif text-deep-maroon mb-4">Shipping To</h3>
                             <div className="text-sm text-gray-700 space-y-1">
                                <p className="font-bold">{address.name}</p>
                                <p>{address.address}</p>
                                <p>{address.city}, {address.state} {address.postalCode}</p>
                            </div>
                        </div>

                        <div className="md:col-span-1">
                            <h3 className="text-xl font-serif text-deep-maroon mb-4">Payment Summary</h3>
                            <div className="text-sm text-gray-700 space-y-2">
                                <div className="flex justify-between"><span>Subtotal:</span> <span>₹{total_price.toFixed(2)}</span></div>
                                <div className="flex justify-between"><span>Shipping:</span> <span>FREE</span></div>
                                <div className="flex justify-between font-bold text-base text-deep-maroon pt-2 border-t border-gray-300 mt-2"><span>Total Paid:</span> <span>₹{total_price.toFixed(2)}</span></div>
                            </div>
                        </div>

                        <div className="md:col-span-1 bg-white/70 p-6 border border-gray-200/80 rounded-lg">
                            <div className="flex items-center gap-x-3">
                                <MailIcon className="w-8 h-8 text-deep-maroon flex-shrink-0" />
                                <h3 className="text-xl font-serif text-deep-maroon">Need Assistance?</h3>
                            </div>
                            <p className="text-sm text-charcoal-gray/90 mt-4 mb-5">
                                For returns, exchanges, or any questions about your order, our team is here to help.
                            </p>
                            <a 
                                href="mailto:support@neera.store" 
                                className="inline-block w-full text-center border border-deep-maroon text-deep-maroon py-3 px-6 text-sm tracking-wider font-semibold hover:bg-deep-maroon hover:text-white transition-colors duration-300"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;