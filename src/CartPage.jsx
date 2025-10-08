import React from 'react';
import { useCart } from './CartContext';
import { useNavigate } from 'react-router-dom';

const CartPage = ({ session }) => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (session) {
            navigate('/checkout');
        } else {
            navigate('/auth', { state: { from: { pathname: '/checkout' } } });
        }
    };

    return (
        <div className="bg-white min-h-screen pt-16 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <div className="text-center border-b border-gray-200 pb-8 mb-8">
                    <h1 className="text-4xl font-serif text-deep-maroon">Your Bag</h1>
                </div>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16 animate-fadeIn">
                        <p className="text-charcoal-gray mb-6">Your shopping bag is currently empty.</p>
                        <button 
                            onClick={() => navigate('/products')}
                            className="bg-deep-maroon text-white py-3 px-8 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300"
                        >
                            Continue Shopping
                        </button>
                    </div>
                ) : (
                    <div className="animate-fadeIn">
                        <div className="space-y-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex gap-x-6 items-center border-b border-gray-200 pb-6">
                                    <div className="w-24 h-36 bg-gray-100 flex-shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-serif text-lg text-charcoal-gray">{item.name}</p>
                                        <p className="font-sans text-deep-maroon mb-2">₹ {item.price.toFixed(2)}</p>
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
                                        <p className="text-deep-maroon font-sans font-semibold text-lg">₹ {(item.price * item.quantity).toFixed(2)}</p>
                                        <button 
                                            onClick={() => removeFromCart(item.id)} 
                                            className="text-xs text-gray-500 hover:text-red-600 hover:underline mt-2"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-end">
                            <div className="w-full md:w-1/2 lg:w-1/3 bg-soft-beige p-6">
                                <div className="flex justify-between items-center font-sans text-lg">
                                    <span className="text-charcoal-gray">Subtotal</span>
                                    <span className="text-deep-maroon font-semibold">₹ {subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2 text-right">Taxes and shipping calculated at checkout.</p>
                                <button onClick={handleCheckout} className="w-full mt-6 bg-deep-maroon text-white py-3 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300">
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