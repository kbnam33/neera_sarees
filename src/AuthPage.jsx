import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

const AuthPage = () => {
    // This now defaults to 'phone' and the toggle is hidden, effectively making it phone-only for the user.
    const [authMethod, setAuthMethod] = useState('phone'); 
    const [isLogin, setIsLogin] = useState(true);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    
    // UI states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    // OTP Resend Timer
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();
    const { mergeLocalCartWithSupabase } = useCart();

    useEffect(() => {
        let timer;
        if (otpSent && countdown > 0) {
            timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        } else if (countdown === 0 && otpSent) {
            setCanResend(true);
        }
        return () => clearTimeout(timer);
    }, [otpSent, countdown]);

    const resetState = (clearForms = false) => {
        setError(null);
        setMessage('');
        setOtpSent(false);
        setCountdown(60);
        setCanResend(false);
        if (clearForms) {
            setEmail('');
            setPassword('');
            setFullName('');
            setPhone('');
            setOtp('');
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        resetState();
        try {
            if (isLogin) {
                const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });
                if (authError) throw authError;
                if (data.user) {
                    await mergeLocalCartWithSupabase(data.user);
                    const from = location.state?.from?.pathname || '/profile';
                    navigate(from, { replace: true });
                }
            } else {
                if (!fullName.trim()) throw new Error("Full name is required.");
                const { data, error: authError } = await supabase.auth.signUp({ 
                    email, 
                    password,
                    options: { data: { full_name: fullName } }
                });
                if (authError) throw authError;
                setMessage('Registration successful! Please check your email to verify your account.');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePhoneAuth = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        resetState();
        try {
            if (!otpSent) {
                if (!/^\d{10}$/.test(phone)) throw new Error("Please enter a valid 10-digit phone number.");
                if (!isLogin && !fullName.trim()) throw new Error("Full name is required.");

                const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
                if (error) throw error;
                setOtpSent(true);
                setMessage('OTP has been sent to your phone.');
            } else {
                const { data, error: authError } = await supabase.auth.verifyOtp({ phone: `+91${phone}`, token: otp, type: 'sms'});
                if (authError) throw authError;

                if (data.user) {
                    const { data: { user } } = await supabase.auth.getUser();
                    if ((!user.user_metadata?.full_name || user.user_metadata.full_name === "") && fullName.trim() !== "") {
                        await supabase.auth.updateUser({ data: { full_name: fullName } });
                    }
                    await mergeLocalCartWithSupabase(data.user);
                    const from = location.state?.from?.pathname || '/profile';
                    navigate(from, { replace: true });
                }
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        setOtpSent(false); 
        handlePhoneAuth();
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

                {/* --- Auth Method Toggle (Hidden for now) --- */}
                {/* <div className="flex justify-center border border-gray-300 rounded-md p-1 mb-8">
                    <button onClick={() => { setAuthMethod('email'); resetState(true); }} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${authMethod === 'email' ? 'bg-deep-maroon text-white' : 'text-charcoal-gray'}`}>
                        Email
                    </button>
                    <button onClick={() => { setAuthMethod('phone'); resetState(true); }} className={`w-1/2 py-2 text-sm rounded-md transition-colors ${authMethod === 'phone' ? 'bg-deep-maroon text-white' : 'text-charcoal-gray'}`}>
                        Phone
                    </button>
                </div>
                */}
                
                {authMethod === 'email' ? (
                    <form onSubmit={handleEmailAuth} className="space-y-6">
                        {!isLogin && (
                            <input id="fullName" type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" />
                        )}
                        <input id="email" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" />
                        <input id="password" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" />
                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full bg-deep-maroon text-white py-3 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark disabled:bg-gray-400">
                                {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handlePhoneAuth} className="space-y-6">
                        {!otpSent ? (
                            <>
                                {!isLogin && (
                                     <input id="fullName" type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" />
                                )}
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 border-b border-gray-300 bg-transparent text-gray-500 text-sm">+91</span>
                                    <input id="phone" type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" />
                                </div>
                            </>
                        ) : (
                             <input id="otp" type="text" placeholder="One-Time Password" value={otp} onChange={(e) => setOtp(e.target.value)} required className="w-full p-3 text-sm bg-transparent border-b border-gray-300 focus:outline-none focus:border-deep-maroon" />
                        )}
                        <div className="pt-4">
                            <button type="submit" disabled={loading} className="w-full bg-deep-maroon text-white py-3 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark disabled:bg-gray-400">
                                {loading ? 'Processing...' : (otpSent ? 'Verify OTP' : 'Send OTP')}
                            </button>
                        </div>
                    </form>
                )}

                {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
                {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}

                <div className="text-center pt-6 space-y-3">
                    {!(authMethod === 'phone' && otpSent) && (
                        <button onClick={() => { setIsLogin(!isLogin); resetState(); }} className="text-sm text-gray-600 hover:text-deep-maroon hover:underline">
                            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        </button>
                    )}

                    {authMethod === 'phone' && otpSent && (
                        <div>
                            {canResend ? (
                                <button onClick={handleResendOtp} disabled={loading} className="text-sm text-deep-maroon hover:underline">
                                    Resend OTP
                                </button>
                            ) : (
                                <p className="text-sm text-gray-500">Resend OTP in {countdown}s</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;