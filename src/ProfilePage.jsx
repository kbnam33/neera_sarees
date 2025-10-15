import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Link } from 'react-router-dom';

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);

const ProfilePage = ({ session }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session) {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // --- MODIFICATION: Only select orders where payment_status is 'paid' ---
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .eq('payment_status', 'paid') // This is the new filter
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setOrders(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [session]);

    if (loading) {
        return <div className="bg-soft-beige min-h-screen pt-40 text-center font-serif">Loading your orders...</div>;
    }

    if (error) {
        return <div className="bg-soft-beige min-h-screen pt-40 text-center text-red-600 font-serif">Error: {error}</div>;
    }

    return (
        <div className="bg-soft-beige min-h-screen pt-32 pb-24 font-sans">
            <div className="max-w-screen-lg mx-auto px-4 sm:px-8">
                <div className="text-center border-b border-gray-200 pb-10 mb-16">
                    <h1 className="text-5xl font-serif text-deep-maroon">Order History</h1>
                    <p className="text-charcoal-gray/80 mt-3 max-w-xl mx-auto">Review your past orders and their details. Thank you for being a valued part of the Neera family.</p>
                </div>

                {orders.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-lg text-charcoal-gray mb-8">You have not placed any orders yet.</p>
                        <Link
                            to="/products"
                            className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-white uppercase bg-deep-maroon px-10 py-4 transition-all duration-300 hover:bg-deep-maroon-dark shadow-lg"
                        >
                            Explore the Collection <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white/50 p-6 sm:p-8 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left mb-6 pb-6 border-b border-gray-200">
                                    <div>
                                        <p className="text-xs text-gray-500 tracking-wider uppercase">Order Placed</p>
                                        <p className="font-semibold text-charcoal-gray mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 tracking-wider uppercase">Total</p>
                                        <p className="font-semibold text-charcoal-gray mt-1">₹{order.total_price.toFixed(2)}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1">
                                        <p className="text-xs text-gray-500 tracking-wider uppercase">Order ID</p>
                                        <p className="font-mono text-charcoal-gray mt-1 text-sm truncate">{order.id}</p>
                                    </div>
                                    <div className="col-span-2 md:col-span-1 text-center md:text-right">
                                         <Link to={`/order/${order.id}`} className="inline-block border border-deep-maroon text-deep-maroon py-2 px-5 text-xs tracking-wider font-semibold hover:bg-deep-maroon hover:text-white transition-colors duration-300">
                                            VIEW ORDER
                                        </Link>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col md:flex-row items-center gap-6">
                                    <div className="flex items-center flex-shrink-0">
                                        <div className="flex -space-x-8">
                                            {order.products.slice(0, 4).map((product, index) => {
                                                const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/80x107/F8F5EF/5B1A32?text=Neera';
                                                return (
                                                    <div key={`${order.id}-${product.id}-${index}`} className="w-16 h-24 bg-gray-100 rounded-md overflow-hidden shadow-sm border-2 border-white">
                                                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        {order.products.length > 4 && (
                                            <div className="w-16 h-24 flex items-center justify-center bg-gray-200 rounded-md shadow-inner border-2 border-white -ml-8 z-10">
                                                <span className="text-sm font-bold text-charcoal-gray">+{order.products.length - 4}</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow text-center md:text-left mt-4 md:mt-0">
                                        <p className="font-serif text-lg text-charcoal-gray leading-tight">
                                            {order.products.length > 0 ? order.products[0].name : 'Order Item'}
                                            {order.products.length > 1 && `, & ${order.products.length - 1} other item(s)`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;