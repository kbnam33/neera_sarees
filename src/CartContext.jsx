import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children, session }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);

    // --- Save cart to Supabase ---
    const saveCartToSupabase = useCallback(async (currentCart) => {
        if (!session) return;
        try {
            await supabase.auth.updateUser({
                data: { cart: currentCart }
            });
        } catch (error) {
            console.error("Error saving cart to Supabase:", error);
        }
    }, [session]);

    // --- Effect to load cart data based on session ---
    useEffect(() => {
        const loadCartData = async () => {
            setLoadingCart(true);
            if (session) {
                const { data: { user } } = await supabase.auth.getUser();
                const remoteCart = user?.user_metadata?.cart || [];
                setCartItems(remoteCart);
            } else {
                // When logged out, clear the cart
                setCartItems([]);
            }
            setLoadingCart(false);
        };

        loadCartData();
    }, [session]);


    const addToCart = (product) => {
        setCartItems(prevItems => {
            let updatedCart;
            const itemExists = prevItems.find(item => item.id === product.id);
            if (itemExists) {
                updatedCart = prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            } else {
                updatedCart = [...prevItems, { ...product, quantity: 1 }];
            }
            if (session) {
                saveCartToSupabase(updatedCart);
            }
            return updatedCart;
        });
    };
    
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems.filter(item => item.id !== productId);
            if (session) {
                saveCartToSupabase(updatedCart);
            }
            return updatedCart;
        });
    };

    const updateQuantity = (productId, quantity) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems
                .map(item => (item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item))
                .filter(item => item.quantity > 0);
            if (session) {
                saveCartToSupabase(updatedCart);
            }
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        if (session) {
            saveCartToSupabase([]);
        }
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadingCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
