import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

const ProfilePage = ({ session }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('orders')
                    .select('*')
                    .eq('user_id', session.user.id)
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
        return <div className="bg-soft-beige min-h-screen pt-32 text-center">Loading orders...</div>;
    }
    
    if (error) {
        return <div className="bg-soft-beige min-h-screen pt-32 text-center text-red-600">Error: {error}</div>;
    }

    return (
        <div className="bg-soft-beige min-h-screen pt-32 pb-16 font-sans">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">My Orders</h1>

                {orders.length === 0 ? (
                    <p className="text-center text-charcoal-gray">You have not placed any orders yet.</p>
                ) : (
                    <div className="space-y-8">
                        {orders.map(order => (
                            <div key={order.id} className="bg-white/70 p-6 shadow-md rounded-lg border border-gray-200">
                                <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-500">ORDER PLACED</p>
                                        <p className="font-semibold text-charcoal-gray">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">TOTAL</p>
                                        <p className="font-semibold text-charcoal-gray">₹{order.total_price.toFixed(2)}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">ORDER #</p>
                                        <p className="font-semibold text-charcoal-gray">{order.id}</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    {order.products.map(product => {
                                        const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/64x80/F8F5EF/5B1A32?text=Neera';
                                        return (
                                        <div key={product.id} className="flex items-center gap-x-4">
                                            <div className="w-16 h-20 bg-gray-100">
                                                <img src={imageUrl} alt={product.name} className="w-full h-full object-cover"/>
                                            </div>
                                            <div>
                                                <p className="font-serif text-charcoal-gray">{product.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                                            </div>
                                        </div>
                                    )})}
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
