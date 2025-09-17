import React, { useState } from 'react';
import { supabase } from './supabaseClient';

// A simple back arrow icon
const ArrowLeftIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
);


const AuthPage = ({ onNavigate }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage('');

        try {
            let response;
            if (isLogin) {
                response = await supabase.auth.signInWithPassword({ email, password });
            } else {
                response = await supabase.auth.signUp({ email, password });
                if (!response.error) {
                    setMessage('Registration successful! Please check your email to verify your account.');
                }
            }
            
            if (response.error) throw response.error;

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-soft-beige font-sans">
            <button 
                onClick={() => onNavigate('home')} 
                className="absolute top-8 left-8 text-charcoal-gray hover:text-deep-maroon transition-colors flex items-center gap-x-2 z-10"
            >
                <ArrowLeftIcon className="w-5 h-5" />
                <span className="text-sm tracking-widest">HOME</span>
            </button>

            <div className="min-h-screen flex items-center justify-center">
                 <div className="max-w-md w-full bg-white/50 backdrop-blur-sm p-12 border border-white/30 shadow-lg rounded-lg">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-serif text-deep-maroon mb-2">
                            {isLogin ? 'Sign In' : 'Create Account'}
                        </h1>
                        <p className="text-charcoal-gray">
                            {isLogin ? 'Welcome back to Neera.' : 'Begin your journey with us.'}
                        </p>
                    </div>
                    
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div>
                            <input
                                id="email"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 bg-transparent border-b border-gray-400 text-charcoal-gray placeholder-gray-500 focus:outline-none focus:border-deep-maroon transition-colors"
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
                                className="w-full p-3 bg-transparent border-b border-gray-400 text-charcoal-gray placeholder-gray-500 focus:outline-none focus:border-deep-maroon transition-colors"
                            />
                        </div>
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-deep-maroon text-white py-3 tracking-widest hover:bg-deep-maroon-dark transition-colors duration-300 rounded-sm"
                            >
                                {loading ? 'PROCESSING...' : 'CONTINUE'}
                            </button>
                        </div>
                    </form>

                    {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                    {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}

                    <div className="text-center pt-4">
                        <button onClick={() => {setIsLogin(!isLogin); setError(null); setMessage('');}} className="text-sm text-gray-600 hover:text-deep-maroon hover:underline">
                            {isLogin ? "Don't have an account? Create one" : "Already have an account? Sign In"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;