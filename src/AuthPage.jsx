import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { mergeLocalCartWithSupabase } = useCart();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            if (isLogin) {
                // --- Handle Sign In ---
                const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
                if (authError) throw authError;

                if (data.user) {
                    // Merge guest cart with Supabase cart after successful login
                    await mergeLocalCartWithSupabase(data.user);
                    
                    // Redirect to the previous page or profile
                    const from = location.state?.from?.pathname || '/profile';
                    navigate(from, { replace: true });
                }

            } else {
                // --- Handle Sign Up ---
                const { error: authError } = await supabase.auth.signUp({ email, password });
                if (authError) throw authError;
                setMessage('Registration successful! Please check your email to verify your account.');
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
                    <div>
                        <input
                            id="email"
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-3 text-sm bg-transparent border-b border-gray-300 text-charcoal-gray placeholder-gray-400 focus:outline-none focus:border-deep-maroon transition-colors"
                        />
                    </div>
                    <div>
                        <input
                            id="password"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-3 text-sm bg-transparent border-b border-gray-300 text-charcoal-gray placeholder-gray-400 focus:outline-none focus:border-deep-maroon transition-colors"
                        />
                    </div>
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-deep-maroon text-white py-3 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300 disabled:bg-gray-400"
                        >
                            {loading ? 'Processing...' : 'Continue'}
                        </button>
                    </div>
                </form>

                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}

                <div className="text-center pt-6">
                    <button onClick={() => {setIsLogin(!isLogin); setError(null); setMessage('');}} className="text-sm text-gray-600 hover:text-deep-maroon hover:underline">
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;
