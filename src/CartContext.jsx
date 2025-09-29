import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { supabase } from './supabaseClient';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

const GUEST_CART_KEY = 'neera_guest_cart';

export const CartProvider = ({ children, session }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);

    // --- Save cart to Supabase for logged-in users ---
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
    
    // --- Save cart to localStorage for guests ---
    const saveCartToLocalStorage = (currentCart) => {
        try {
            localStorage.setItem(GUEST_CART_KEY, JSON.stringify(currentCart));
        } catch (error) {
            console.error("Error saving cart to localStorage:", error);
        }
    };

    // --- Effect to load cart data when session changes ---
    useEffect(() => {
        const loadCartData = async () => {
            setLoadingCart(true);
            if (session) {
                // User is logged in, load from Supabase
                const { data: { user } } = await supabase.auth.getUser();
                const remoteCart = user?.user_metadata?.cart || [];
                setCartItems(remoteCart);
            } else {
                // User is a guest, load from localStorage
                const localCartJson = localStorage.getItem(GUEST_CART_KEY);
                const localCart = localCartJson ? JSON.parse(localCartJson) : [];
                setCartItems(localCart);
            }
            setLoadingCart(false);
        };

        loadCartData();
    }, [session]);

    // --- Merge local guest cart with Supabase cart on login ---
    const mergeLocalCartWithSupabase = useCallback(async (user) => {
        const localCartJson = localStorage.getItem(GUEST_CART_KEY);
        if (!localCartJson) return; // No local cart to merge

        const localCart = JSON.parse(localCartJson);
        const remoteCart = user?.user_metadata?.cart || [];

        const mergedCartMap = new Map();

        // Add remote items to map
        remoteCart.forEach(item => mergedCartMap.set(item.id, { ...item }));

        // Merge local items
        localCart.forEach(localItem => {
            if (mergedCartMap.has(localItem.id)) {
                // Item exists, update quantity
                const existingItem = mergedCartMap.get(localItem.id);
                existingItem.quantity += localItem.quantity;
            } else {
                // New item, add to cart
                mergedCartMap.set(localItem.id, localItem);
            }
        });

        const mergedCart = Array.from(mergedCartMap.values());
        
        setCartItems(mergedCart); // Update state immediately
        await saveCartToSupabase(mergedCart); // Save merged cart to Supabase
        localStorage.removeItem(GUEST_CART_KEY); // Clear local cart
    }, [saveCartToSupabase]);


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
            } else {
                saveCartToLocalStorage(updatedCart);
            }
            return updatedCart;
        });
    };
    
    const removeFromCart = (productId) => {
        setCartItems(prevItems => {
            const updatedCart = prevItems.filter(item => item.id !== productId);
            if (session) {
                saveCartToSupabase(updatedCart);
            } else {
                saveCartToLocalStorage(updatedCart);
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
            } else {
                saveCartToLocalStorage(updatedCart);
            }
            return updatedCart;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        if (session) {
            saveCartToSupabase([]);
        } else {
            localStorage.removeItem(GUEST_CART_KEY);
        }
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loadingCart,
        mergeLocalCartWithSupabase, // Expose the merge function
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
