import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ session }) => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        // FIX: Changed pt-16 to py-16 for consistent spacing
        <div className="min-h-screen py-16" style={{ backgroundColor: '#F2EDE6' }}>
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <div className="text-center border-b border-gray-200 pb-8 mb-8">
                    <h1 className="text-4xl font-serif text-neera-accent">Your Bag</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 animate-fadeIn">
                        <p className="text-neera-text mb-6">Your shopping bag is currently empty.</p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="bg-neera-accent text-white py-3 px-8 tracking-widest uppercase text-sm hover:bg-neera-accent transition-colors duration-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <div className="space-y-6">
                            {cartItems.map(item => {
                                const imageUrl = item.images && item.images.length > 0 ? item.images[0] : 'https://placehold.co/96x144/F8F5EF/5B1A32?text=Neera';
                                return (
                                <div key={item.id} className="flex gap-x-6 items-center border-b border-gray-200 pb-6">
                                    <div className="w-24 h-36 bg-gray-100 flex-shrink-0">
                                        <img src={imageUrl} alt={item.name} loading="lazy" decoding="async" width={96} height={144} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-serif text-lg text-neera-text">{item.name}</p>
                                        <p className="font-sans text-neera-accent mb-2">₹ {item.price.toFixed(2)}</p>
                                        <div className="flex items-center mt-2">
                                            <label htmlFor={`quantity-${item.id}`} className="text-xs mr-2">Qty:</label>
                                            <input 
                                                id={`quantity-${item.id}`}
                                                type="number" 
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value, 10) || 0)}
                                                min="1"
                                                className="w-16 p-1 text-center border border-gray-300 rounded-sm text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-neera-accent font-sans font-semibold text-lg">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.id)} 
                                            className="text-xs text-gray-500 hover:text-red-600 hover:underline mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            )})}
                        </div>

                        <div className="mt-12 flex justify-end">
                            <div className="w-full md:w-1/2 lg:w-1/3 bg-neera-bg p-6">
                                <div className="flex justify-between items-center font-sans text-lg">
                                    <span className="text-neera-text">Subtotal</span>
                                    <span className="text-neera-accent font-semibold">₹ {subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-right">Taxes and shipping calculated at checkout.</p>
                                <button onClick={handleCheckout} className="w-full mt-6 py-3 tracking-widest uppercase text-sm transition-colors duration-300" style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}>
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;