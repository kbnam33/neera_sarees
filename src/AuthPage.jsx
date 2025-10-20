import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Form states
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    
    const navigate = useNavigate();
    const location = useLocation();
    const { mergeLocalCartWithSupabase } = useCart();

    const resetState = () => {
        setError(null);
        setMessage('');
        setFullName('');
        setPassword('');
    };

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        resetState();

        if (!/^\d{10}$/.test(phone)) {
            setError("Please enter a valid 10-digit phone number.");
            setLoading(false);
            return;
        }

        const formattedPhone = `+91${phone}`;

        try {
            if (isLogin) {
                // Handle Sign In
                const { data, error: authError } = await supabase.auth.signInWithPassword({
                    phone: formattedPhone,
                    password: password,
                });

                if (authError) throw authError;

                if (data.user) {
                    await mergeLocalCartWithSupabase(data.user);
                    const from = location.state?.from?.pathname || '/profile';
                    navigate(from, { replace: true });
                }
            } else {
                // Handle Sign Up
                if (!fullName.trim()) throw new Error("Full name is required.");
                
                const { data, error: authError } = await supabase.auth.signUp({
                    phone: formattedPhone,
                    password: password,
                    options: {
                        data: {
                            full_name: fullName,
                        }
                    }
                });

                if (authError) throw authError;

                // After successful sign-up, also sign the user in
                if (data.user) {
                     const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
                        phone: formattedPhone,
                        password: password,
                    });

                    if (signInError) throw signInError;
                    
                    if (signInData.user) {
                        await mergeLocalCartWithSupabase(signInData.user);
                        const from = location.state?.from?.pathname || '/profile';
                        navigate(from, { replace: true });
                    }
                } else {
                     setMessage('Registration successful! Please sign in.');
                     setIsLogin(true);
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft-beige font-sans flex flex-col items-center justify-center p-4">
            <div className="absolute top-8 left-8">
                 <Link to="/" className="text-xs tracking-widest uppercase text-gray-500 hover:text-deep-maroon">
                    &larr; Home
                </Link>
            </div>
            <div className="w-full max-w-sm text-center">
                <h1 className="text-4xl font-serif text-deep-maroon mb-4">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-charcoal-gray mb-10">
                    {isLogin ? 'Sign in to continue your journey.' : 'Join the world of Neera.'}
                </p>

                <form onSubmit={handleAuth} className="space-y-6">
                    {!isLogin && (
                        <input 
                            id="fullName" 
                            type="text" 
                            placeholder="Full Name" 
                            value={fullName} 
                            onChange={(e) => setFullName(e.target.value)} 
                            required 
                            className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" 
                        />
                    )}
                    <div className="flex">
                        <span className="inline-flex items-center px-3 border-b border-gray-300 bg-transparent text-gray-500 text-sm">+91</span>
                        <input 
                            id="phone" 
                            type="tel" 
                            placeholder="10-Digit Phone Number" 
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)} 
                            required 
                            className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" 
                        />
                    </div>
                    <input 
                        id="password" 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" 
                    />
                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-deep-maroon text-white py-3 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark disabled:bg-gray-400">
                            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </div>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}

                <div className="text-center pt-6">
                    <button onClick={() => { setIsLogin(!isLogin); resetState(); }} className="text-sm text-gray-600 hover:text-deep-maroon hover:underline">
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;