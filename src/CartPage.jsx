import React from 'react';
import { useCart } from './CartContext';

const CartPage = ({ onNavigate, session }) => {
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        if (session) {
            onNavigate('checkout');
        } else {
            onNavigate('auth');
        }
    };

    return (
        <div className="bg-soft-beige min-h-screen pt-32 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-8">
                <h1 className="text-3xl font-serif text-center text-deep-maroon mb-12">Your Shopping Cart</h1>

                {cartItems.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-charcoal-gray mb-6">Your cart is currently empty.</p>
                        <button 
                            onClick={() => onNavigate('allSarees')}
                            className="bg-deep-maroon text-white py-3 px-8 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300"
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="border-b border-gray-300 pb-4 mb-4 hidden md:grid grid-cols-6 gap-4 items-center font-sans text-xs uppercase tracking-widest text-gray-500">
                            <div className="col-span-3">Product</div>
                            <div className="text-center">Price</div>
                            <div className="text-center">Quantity</div>
                            <div className="text-right">Total</div>
                        </div>

                        <div className="space-y-6">
                            {cartItems.map(item => (
                                <div key={item.id} className="grid grid-cols-6 gap-4 items-center border-b border-gray-200 pb-6">
                                    <div className="col-span-3 flex items-center gap-x-4">
                                        <div className="w-24 h-32 bg-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-serif text-charcoal-gray">{item.name}</p>
                                            <button onClick={() => removeFromCart(item.id)} className="text-xs text-gray-500 hover:text-red-600 hover:underline">Remove</button>
                                        </div>
                                    </div>
                                    <div className="text-center text-charcoal-gray font-sans">₹ {item.price}</div>
                                    <div className="text-center">
                                        <input 
                                            type="number" 
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                            min="1"
                                            className="w-16 p-1 text-center border border-gray-300"
                                        />
                                    </div>
                                    <div className="text-right text-deep-maroon font-sans font-semibold">₹ {item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-end">
                            <div className="w-full md:w-1/3">
                                <div className="flex justify-between items-center font-sans text-lg">
                                    <span className="text-charcoal-gray">Subtotal</span>
                                    <span className="text-deep-maroon font-semibold">₹ {subtotal.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">Taxes and shipping calculated at checkout.</p>
                                <button onClick={handleCheckout} className="w-full mt-6 bg-deep-maroon text-white py-3 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300">
                                    PROCEED TO CHECKOUT
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CartPage;