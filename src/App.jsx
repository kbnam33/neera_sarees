import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from './supabaseClient';
import { useCart, CartProvider } from './CartContext';
import AuthPage from './AuthPage.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import OrderConfirmationPage from './OrderConfirmationPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import OrderDetailPage from './OrderDetailPage.jsx';
import ProductPage from './ProductPage.jsx';
import FabricPage from './FabricPage.jsx';
import PrintPage from './PrintPage.jsx'; // Import the new PrintPage component
import SearchPage from './SearchPage.jsx';
import StoryPage from './StoryPage.jsx';
import RefundAndExchangePolicy from './RefundAndExchangePolicy.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import ShippingPolicy from './ShippingPolicy.jsx';
import ContactUs from './ContactUs.jsx';
import ProductImage from './components/ProductImage.jsx';
import { getHomeMetaTags, getAllSareesMetaTags } from './utils/metaTags.js';
import { getOrganizationSchema, getWebSiteSchema, getCollectionSchema, getItemListSchema } from './utils/schemaMarkup.js';

// --- ICONS ---
const SearchIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> );
const UserIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const ShoppingBagIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> );
const ChevronDownIcon = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg> );
const ArrowRightIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);
const CloseIcon = ({ className = "w-8 h-8"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);
const MenuIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>);

// A custom hook to handle scroll animations
const useIntersect = (options) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isIntersecting];
};

const AnimatedUncrop = ({ children, className, delay = 0 }) => {
    const [ref, isIntersecting] = useIntersect({ threshold: 0.2, triggerOnce: true });
    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <div
                className="transition-transform duration-1000 ease-out"
                style={{
                    transform: isIntersecting ? 'translateY(0)' : 'translateY(100%)',
                    transitionDelay: `${delay}ms`
                }}
            >
                {children}
            </div>
        </div>
    );
};


// --- SEARCH OVERLAY ---
const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            onClose();
            navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center animate-fadeIn" style={{ backgroundColor: 'rgba(242,237,230,0.97)', backdropFilter: 'blur(12px)' }} onClick={onClose}>
            <button className="absolute top-8 right-8 text-neera-text hover:text-neera-accent" onClick={onClose}>
                <CloseIcon />
            </button>
            <div className="w-full max-w-2xl px-4" onClick={(e) => e.stopPropagation()}>
                <input
                    type="text"
                    autoFocus
                    placeholder="Search for sarees, fabrics..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearch}
                    className="w-full bg-transparent border-b border-neera-border text-3xl md:text-5xl text-center font-serif text-neera-text placeholder-neera-text-muted focus:outline-none focus:border-neera-accent"
                />
            </div>
        </div>
    );
};

// --- MOBILE MENU ---
const MobileMenu = ({ isOpen, onClose, session, onOpenSearch }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNavigate = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: '#F2EDE6' }}>
            <div className="flex items-center justify-between px-5 h-14 border-b border-neera-border">
                <div className="flex flex-col items-start">
                    <span className="font-serif text-neera-accent text-lg">Neera</span>
                    <span className="text-[7px] tracking-[0.32em] uppercase font-sans" style={{ color: '#A89E98' }}>PURE IN EVERY THREAD</span>
                </div>
                <button onClick={onClose} className="text-neera-text">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <nav className="flex flex-col px-6 pt-8 gap-1 overflow-y-auto">
                <p className="text-[9px] tracking-[0.35em] text-neera-text/35 uppercase font-sans mb-3">COLLECTION</p>
                <button
                    onClick={() => handleNavigate('/fabric/linen')}
                    className="text-left font-serif text-neera-accent text-2xl py-3 border-b border-neera-border w-full flex items-center justify-between"
                >
                    Presentation Days
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>
                <button
                    onClick={() => handleNavigate('/fabric/Mul Mul Cotton')}
                    className="text-left font-serif text-neera-accent text-2xl py-3 border-b border-neera-border w-full flex items-center justify-between"
                >
                    Everyday at Work
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>

                <div className="mt-6 mb-2">
                    <p className="text-[9px] tracking-[0.35em] text-neera-text/35 uppercase font-sans">EXPLORE</p>
                </div>
                <button
                    onClick={() => handleNavigate('/products')}
                    className="text-left font-serif text-neera-accent text-2xl py-3 border-b border-neera-border w-full flex items-center justify-between"
                >
                    All Sarees
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>
                <button
                    onClick={() => handleNavigate('/story')}
                    className="text-left font-serif text-neera-accent text-2xl py-3 border-b border-neera-border w-full flex items-center justify-between"
                >
                    Our Story
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>
                <button
                    onClick={() => handleNavigate('/contact-us')}
                    className="text-left font-serif text-neera-accent text-2xl py-3 border-b border-neera-border w-full flex items-center justify-between"
                >
                    Contact
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>

                <div className="mt-auto px-6 pb-10 pt-6 flex items-center gap-6" style={{ borderTop: '1px solid #DDD6CE' }}>
                    <button
                        onClick={() => handleNavigate(session ? '/profile' : '/auth')}
                        className="text-xs tracking-[0.2em] uppercase text-neera-text/60 font-sans hover:text-neera-accent transition-colors duration-200"
                    >
                        {session ? 'My Account' : 'Sign In'}
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onOpenSearch();
                        }}
                        className="text-xs tracking-[0.2em] uppercase text-neera-text/60 font-sans hover:text-neera-accent transition-colors duration-200"
                    >
                        Search
                    </button>
                </div>
            </nav>
        </div>
    );
};


// --- HEADER ---
const Header = ({ session }) => {
    const { cartItems } = useCart();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);
    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                session={session}
                onOpenSearch={() => setIsSearchOpen(true)}
            />

            <header className="w-full z-[100] relative" style={{ backgroundColor: '#F2EDE6', borderBottom: '1px solid #DDD6CE' }}>
                <div className="hidden md:flex max-w-screen-xl mx-auto px-8 h-16 items-center justify-between">
                    <nav className="hidden md:flex items-center gap-10">
                        <Link to="/" className="text-neera-text-soft text-[10px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Home</Link>
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('shop')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button className="flex items-center gap-1.5 text-neera-text-soft text-[10px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300 bg-transparent border-none cursor-pointer">
                                Shop
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>
                            <div
                                className={`absolute top-full left-0 mt-0 w-60 z-[200] transition-all duration-250 shadow-[0_18px_50px_rgba(20,12,8,0.18)] ${activeDropdown === 'shop' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}
                                style={{ backgroundColor: '#F2EDE6', border: '1px solid #DDD6CE', borderTop: '2px solid #5C1F2E' }}
                            >
                                <div className="py-5 px-6 flex flex-col gap-0.5">
                                    <Link
                                        to="/fabric/linen"
                                        onClick={() => setActiveDropdown(null)}
                                        className="font-serif text-neera-text text-base py-2.5 hover:text-neera-accent hover:pl-1 transition-all duration-200 block border-b border-neera-border/50"
                                    >
                                        Presentation Days
                                    </Link>
                                    <Link
                                        to="/fabric/Mul Mul Cotton"
                                        onClick={() => setActiveDropdown(null)}
                                        className="font-serif text-neera-text text-base py-2.5 hover:text-neera-accent hover:pl-1 transition-all duration-200 block border-b border-neera-border/50"
                                    >
                                        Everyday at Work
                                    </Link>
                                    <div className="pt-4">
                                        <Link
                                            to="/products"
                                            onClick={() => setActiveDropdown(null)}
                                            className="inline-flex items-center gap-2 text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-accent transition-colors duration-200"
                                        >
                                            All Sarees
                                            <ArrowRightIcon className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/contact-us" className="text-neera-text-soft text-[10px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Contact</Link>
                    </nav>

                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-0.5">
                        <Link to="/">
                            {/* Place the Neera logo PNG (transparent background, deep maroon version) at public/images/neera-logo.png */}
                            <img src="/images/neera-logo.png" alt="Neera" className="h-12 w-auto" />
                        </Link>
                        <span className="text-[7px] tracking-[0.32em] uppercase font-sans" style={{ color: '#A89E98' }}>PURE IN EVERY THREAD</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-neera-text-soft hover:text-neera-text transition-colors duration-300"
                        >
                            <SearchIcon className="w-4 h-4" />
                        </button>
                        <Link
                            to={session ? '/profile' : '/auth'}
                            className="text-neera-text-soft hover:text-neera-text transition-colors duration-300"
                        >
                            <UserIcon className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/cart"
                            className="relative text-neera-text-soft hover:text-neera-text transition-colors duration-300"
                        >
                            <ShoppingBagIcon className="w-4 h-4" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 text-[8px] flex items-center justify-center rounded-full" style={{ backgroundColor: '#5C1F2E', color: '#FAF7F4' }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                <div className="md:hidden flex items-center justify-between px-5 h-14" style={{ backgroundColor: '#F2EDE6', borderBottom: '1px solid #DDD6CE' }}>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-neera-text">
                        <MenuIcon className="w-5 h-5" />
                    </button>
                    <Link to="/" className="flex flex-col items-center">
                        <span className="font-serif text-neera-accent text-lg">Neera</span>
                        <span className="text-[7px] tracking-[0.32em] uppercase font-sans" style={{ color: '#A89E98' }}>PURE IN EVERY THREAD</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSearchOpen(true)} className="text-neera-text">
                            <SearchIcon className="w-4 h-4" />
                        </button>
                        <Link to="/cart" className="relative text-neera-text">
                            <ShoppingBagIcon className="w-4 h-4" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-neera-accent text-white text-[8px] flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};

// --- BRAND HERO (cinematic background with bottom-anchored content) ---
const BrandHero = ({ products }) => {
    return (
        <section className="relative w-screen overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
            <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                src="/neera-hero-section.mp4"
                poster="/neera-home-page.jpeg"
            />
            <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.58) 28%, rgba(0,0,0,0.18) 54%, rgba(0,0,0,0.02) 72%)' }}
            />
            <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-20 pb-8 md:pb-12">
                <div className="max-w-[1320px] mx-auto">
                    <h1
                        className="font-serif text-[#F2EDE6]/92 text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.04] max-w-[92%] md:max-w-[88%] mb-4 md:mb-6"
                        style={{ textShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                    >
                        Breathable Office Wear Sarees for Working Women That Stay Crisp from First Meeting to Last
                    </h1>
                    <p className="text-[#F2EDE6]/76 text-sm md:text-base font-sans mb-7 md:mb-10 max-w-3xl leading-relaxed">
                        Shop Mulmul cotton, pure linen, and Chettinad sarees designed for working women - lightweight drape, all-day comfort, and office-ready elegance.
                    </p>
                    <div className="flex justify-start md:justify-end">
                        <Link
                            to="/products"
                            className="inline-flex items-center gap-3 border border-[#F2EDE6]/35 text-[#F2EDE6]/86 text-[10px] tracking-[0.3em] uppercase font-sans px-8 py-4 hover:border-[#F2EDE6]/70 hover:text-[#F2EDE6] transition-all duration-500"
                        >
                            Shop Office Wear Sarees
                            <ArrowRightIcon className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

const TrustStrip = () => {
    return (
        <div className="w-full overflow-hidden border-y border-neera-border" style={{ backgroundColor: '#EBE4DC' }}>
            <div className="flex animate-marquee whitespace-nowrap" style={{ animation: 'marquee 28s linear infinite' }}>
                <div className="flex items-center shrink-0">
                    <span className="inline-flex items-center gap-3 px-10 py-4">
                        <span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Cotton & Linen Only</span>
                        <span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Breathable. Minimal. Office-appropriate.</span>
                    </span>
                    <span className="text-neera-border text-xs px-6">—</span>
                    <span className="inline-flex items-center gap-3 px-10 py-4">
                        <span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Built for 8-Hour Days</span>
                        <span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Pleats that stay. Fabric that doesn't cling.</span>
                    </span>
                    <span className="text-neera-border text-xs px-6">—</span>
                    <span className="inline-flex items-center gap-3 px-10 py-4">
                        <span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Free Shipping Across India</span>
                        <span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Every order. No minimum.</span>
                    </span>
                </div>
                <div className="flex items-center shrink-0">
                    <span className="inline-flex items-center gap-3 px-10 py-4">
                        <span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Cotton & Linen Only</span>
                        <span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Breathable. Minimal. Office-appropriate.</span>
                    </span>
                    <span className="text-neera-border text-xs px-6">—</span>
                    <span className="inline-flex items-center gap-3 px-10 py-4">
                        <span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Built for 8-Hour Days</span>
                        <span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Pleats that stay. Fabric that doesn't cling.</span>
                    </span>
                    <span className="text-neera-border text-xs px-6">—</span>
                    <span className="inline-flex items-center gap-3 px-10 py-4">
                        <span className="text-neera-accent text-[9px] tracking-[0.35em] uppercase font-sans">Free Shipping Across India</span>
                        <span className="text-neera-text-muted text-[9px] tracking-[0.15em] font-sans">Every order. No minimum.</span>
                    </span>
                </div>
            </div>
        </div>
    );
};

const CollectionEntry = ({ products }) => {
    const productsWithImages = useMemo(
        () => (Array.isArray(products) ? products.filter((p) => p?.images?.[0]) : []),
        [products]
    );

    const presentationProduct = useMemo(() => {
        return (
            productsWithImages.find((p) => {
                const fabric = (p.fabric_type || '').toLowerCase();
                return fabric === 'linen';
            }) || productsWithImages[0] || null
        );
    }, [productsWithImages]);

    const everydayProduct = useMemo(() => {
        return (
            productsWithImages.find((p) => {
                const fabric = (p.fabric_type || '').toLowerCase();
                return fabric === 'mul mul cotton' || fabric.includes('mul');
            }) || productsWithImages[1] || productsWithImages[0] || null
        );
    }, [productsWithImages]);

    return (
        <section className="w-full" style={{ backgroundColor: '#F2EDE6' }}>
            <div className="max-w-screen-xl mx-auto px-8 md:px-16 pt-16 pb-20">
                <p className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-3">THE COLLECTION</p>
                <h2 className="font-serif text-neera-text text-3xl md:text-4xl mb-12">Start here.</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                    <Link to="/fabric/linen" className="group relative block overflow-hidden">
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E2]">
                            {presentationProduct?.images?.[0] ? (
                                <img
                                    src={presentationProduct.images[0]}
                                    alt="Presentation Days - Linen Sarees"
                                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
                                />
                            ) : (
                                <div className="w-full h-full" style={{ backgroundColor: '#DDD6CE' }} />
                            )}
                        </div>
                        <div className="pt-4">
                            <p className="text-neera-text-muted text-[8px] tracking-[0.32em] uppercase font-sans mb-1">PURE LINEN</p>
                            <h3 className="font-serif text-neera-text text-xl md:text-2xl mb-2">Presentation Days</h3>
                            <p className="text-neera-text-soft text-[13px] font-sans leading-relaxed mb-4 max-w-sm">Crisp structure that holds the drape. Looks senior-level from the first meeting to the last.</p>
                            <span className="inline-flex items-center gap-2 text-neera-accent text-[9px] tracking-[0.25em] uppercase font-sans group-hover:gap-4 transition-all duration-300">
                                Shop Now
                                <ArrowRightIcon className="w-3 h-3" />
                            </span>
                        </div>
                    </Link>

                    <Link to="/fabric/Mul Mul Cotton" className="group relative block overflow-hidden">
                        <div className="relative aspect-[4/5] overflow-hidden bg-[#EDE8E2]">
                            {everydayProduct?.images?.[0] ? (
                                <img
                                    src={everydayProduct.images[0]}
                                    alt="Everyday at Work - Mulmul Cotton Sarees"
                                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-103"
                                />
                            ) : (
                                <div className="w-full h-full" style={{ backgroundColor: '#DDD6CE' }} />
                            )}
                        </div>
                        <div className="pt-4">
                            <p className="text-neera-text-muted text-[8px] tracking-[0.32em] uppercase font-sans mb-1">MULMUL COTTON</p>
                            <h3 className="font-serif text-neera-text text-xl md:text-2xl mb-2">Everyday at Work</h3>
                            <p className="text-neera-text-soft text-[13px] font-sans leading-relaxed mb-4 max-w-sm">Feather-light. Doesn't cling. Stays soft after 8 hours in the office.</p>
                            <span className="inline-flex items-center gap-2 text-neera-accent text-[9px] tracking-[0.25em] uppercase font-sans group-hover:gap-4 transition-all duration-300">
                                Shop Now
                                <ArrowRightIcon className="w-3 h-3" />
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    );
};

// --- HOME PRODUCT SECTION ---
const HomeProductSection = ({ title, products }) => {
    if (!products || products.length === 0) return null;
    return (
        <section className="bg-neera-bg pt-12 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-10 text-left">
                <p className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-2">JUST ARRIVED</p>
                <h2 className="font-serif text-neera-text text-3xl mb-10">New In</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-10">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductImage 
                                images={product.images}
                                altText={`${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree`}
                                productUrl={`/products/${product.fabric_type}/${product.slug}`}
                            />
                            <h3 className="font-serif text-neera-text text-sm mb-1">{product.name}</h3>
                            <p className="text-neera-text-muted text-xs font-sans tracking-wide">₹ {product.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                 <div className="text-left">
                    <Link to="/products" className="inline-flex items-center gap-2 text-neera-accent text-[9px] tracking-[0.3em] uppercase font-sans mt-10 hover:gap-4 transition-all duration-300">
                        View All Sarees <ArrowRightIcon className="w-3 h-3" />
                    </Link>
                </div>
            </div>
        </section>
    );
};


// --- CUSTOM SORT DROPDOWN ---
const CustomSortDropdown = ({ sortOption, setSortOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = {
        'newest': 'Sort by: Newest',
        'price-asc': 'Price: Low to High',
        'price-desc': 'Price: High to Low'
    };

    return (
        <div className="relative" onMouseLeave={() => setIsOpen(false)}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-48 border border-neera-border rounded-sm text-neera-text text-xs tracking-wider py-2 px-3 focus:outline-none focus:ring-1 focus:ring-neera-accent"
            >
                <span>{options[sortOption]}</span>
                <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 w-48 mt-2 bg-neera-bg border border-neera-border shadow-lg z-10">
                    {Object.entries(options).map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => {
                                setSortOption(value);
                                setIsOpen(false);
                            }}
                            className="w-full text-left text-xs tracking-wider py-2 px-3 hover:bg-gray-100"
                        >
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

// --- ALL PRODUCTS GRID ---
const AllProductsGrid = ({ products, sortOption, setSortOption }) => {
    return (
        <div className="bg-neera-bg pt-12 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-gray-200 pb-4 gap-4">
                    <h1 className="text-3xl font-serif text-neera-accent">All Sarees</h1>
                    <CustomSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductImage 
                                images={product.images}
                                altText={`${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree`}
                                productUrl={`/products/${product.fabric_type}/${product.slug}`}
                            />
                            <h3 className="font-serif text-neera-text text-sm mb-1">{product.name}</h3>
                            <p className="text-neera-text-muted text-xs font-sans tracking-wide">₹ {product.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- FOOTER ---
const Footer = () => {
    const location = useLocation();

    if (['/auth', '/order-confirmation'].includes(location.pathname)) return null;
    
    return (
     <footer style={{ backgroundColor: '#EBE4DC', borderTop: '1px solid #DDD6CE' }}>
        <div className="max-w-screen-xl mx-auto px-8 py-16 flex flex-col items-center gap-10">
            <div className="flex flex-col items-center gap-2">
                {/* Place the Neera logo PNG (transparent background, deep maroon version) at public/images/neera-logo.png */}
                <img src="/images/neera-logo.png" alt="Neera" className="h-24 w-auto" />
                <span className="text-[7px] tracking-[0.32em] uppercase font-sans" style={{ color: '#A89E98' }}>PURE IN EVERY THREAD</span>
            </div>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
                <Link to="/products" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">All Sarees</Link>
                <Link to="/story" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Our Story</Link>
                <Link to="/contact-us" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Contact Us</Link>
                <Link to="/shipping-policy" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Shipping</Link>
                <Link to="/refund-and-exchange-policy" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Exchanges</Link>
                <Link to="/privacy-policy" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Privacy Policy</Link>
                <Link to="/terms-and-conditions" className="text-neera-text-muted text-[9px] tracking-[0.3em] uppercase font-sans hover:text-neera-text transition-colors duration-300">Terms</Link>
            </nav>
            <div className="w-12 border-t border-neera-border"></div>
            <p className="text-neera-text-muted text-[8px] tracking-[0.3em] uppercase font-sans">© {new Date().getFullYear()} Neera. All rights reserved.</p>
        </div>
     </footer>
    );
};

// --- APP CONTENT & ROUTING ---
function AppContent() {
    const [session, setSession] = useState(null);
    const [products, setProducts] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [prints, setPrints] = useState([]); // New state for prints
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const [sortOption, setSortOption] = useState('newest');
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    
    useEffect(() => {
        if (!supabase) return;
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!supabase) {
                setError("Supabase credentials are not configured.");
                setLoading(false);
                return;
            }
            setLoading(true);
            
            const { data: productsData, error: productsError } = await supabase.from('products').select('*').eq('is_public', true);
            if (productsError) { setError(productsError.message); setLoading(false); return; }

            const { data: fabricsData, error: fabricsError } = await supabase.from('fabrics').select('*').eq('is_public', true);
            if (fabricsError) { setError(fabricsError.message); setLoading(false); return; }

            // Filter products to only those belonging to a public fabric
            const publicFabricNames = (fabricsData || []).map(f => (f.name || '').toLowerCase());
            const visibleProducts = (productsData || []).filter(p =>
              publicFabricNames.length === 0 || publicFabricNames.includes((p.fabric_type || '').toLowerCase())
            );

            const productsWithSlugs = visibleProducts.map(product => ({ ...product, slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '') }));
            
            // Extract unique print types from products table (replaces separate prints table)
            // Ensures print categories auto-update when new print types are added to products
            const uniquePrintTypes = [...new Set(
                productsWithSlugs
                    .map(p => p.print_type)
                    .filter(type => type != null && type.trim() !== '')
            )].sort();
            
            const printsFromProducts = uniquePrintTypes.map((name, index) => ({
                id: index + 1,
                name: name
            }));
            
            setProducts(productsWithSlugs);
            setFabrics(fabricsData || []);
            setPrints(printsFromProducts);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => { window.scrollTo(0, 0); }, [location.pathname]);
    
    const handleOrderSuccess = (orderDetails) => { 
        setLastOrderDetails(orderDetails);
        navigate('/order-confirmation'); 
    };

    const displayedProducts = [...products].sort((a, b) => {
        switch (sortOption) {
            case 'price-asc': return a.price - b.price;
            case 'price-desc': return b.price - a.price;
            case 'newest': default: return new Date(b.created_at) - new Date(a.created_at);
        }
    });
    
    // Curated "Home New Arrivals": prefer admin-selected featured items, fallback to newest
    const homeNewArrivals = useMemo(() => {
        const featured = (products || [])
            .filter(p => p?.is_home_featured)
            .sort((a, b) => {
                const ar = a?.home_featured_rank ?? 999;
                const br = b?.home_featured_rank ?? 999;
                return ar - br;
            })
            .slice(0, 4);
        if (featured.length > 0) return featured;
        return [...(products || [])]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 4);
    }, [products]);
    
    if (loading) return <div className="h-screen flex justify-center items-center bg-neera-bg"><p>Loading Neera...</p></div>;
    if (error && !products.length) return <div className="h-screen flex justify-center items-center bg-neera-bg text-center p-8"><p className="text-red-600 font-semibold">{error}</p></div>

    // Generate meta tags and schema based on current route
    const homeMeta = getHomeMetaTags();
    const allSareesMeta = getAllSareesMetaTags(products.length);

    // Determine meta tags and schema based on route
    const currentMeta = location.pathname === '/products' ? allSareesMeta : 
                       location.pathname === '/' ? homeMeta : homeMeta;
    
    // Get schema markup
    const orgSchema = getOrganizationSchema();
    const isHomepage = location.pathname === '/';
    const isAllSarees = location.pathname === '/products';

    return (
        <div className="font-sans bg-neera-bg text-neera-text">
             <Helmet>
                <title>{currentMeta.title}</title>
                <meta name="description" content={currentMeta.description} />
                <link rel="canonical" href={currentMeta.canonical} />
                <meta property="og:title" content={currentMeta.openGraph.title} />
                <meta property="og:description" content={currentMeta.openGraph.description} />
                <meta property="og:url" content={currentMeta.openGraph.url} />
                <meta property="og:type" content={currentMeta.openGraph.type} />
                <meta property="og:image" content={currentMeta.openGraph.image} />
                <meta property="og:site_name" content={currentMeta.openGraph.siteName} />
                <meta name="twitter:card" content={currentMeta.twitter.card} />
                <meta name="twitter:title" content={currentMeta.twitter.title} />
                <meta name="twitter:description" content={currentMeta.twitter.description} />
                <meta name="twitter:image" content={currentMeta.twitter.image} />
                
                {/* Organization Schema (site-wide) */}
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
                
                {/* Homepage: WebSite schema */}
                {isHomepage && (
                    <script type="application/ld+json">
                        {JSON.stringify(getWebSiteSchema())}
                    </script>
                )}
                
                {/* All Sarees page: CollectionPage and ItemList schema */}
                {isAllSarees && products.length > 0 && (
                    <>
                        <script type="application/ld+json">
                            {JSON.stringify(getCollectionSchema(
                                "Premium Handwoven Sarees Collection",
                                `Discover ${products.length}+ authentic handwoven sarees in Chanderi, Mul Mul, Maheshwari & more.`,
                                "/products",
                                products.length
                            ))}
                        </script>
                        <script type="application/ld+json">
                            {JSON.stringify(getItemListSchema(products, "All Sarees Collection"))}
                        </script>
                    </>
                )}
            </Helmet>
            <Header session={session} />
            {/* Header is not fixed; no top padding required */}
            <main>
                <Routes>
                    <Route path="/" element={<><BrandHero products={products} /><TrustStrip /><CollectionEntry products={products} /><HomeProductSection title="New In" products={homeNewArrivals} /></>} />
                    <Route path="/products" element={<AllProductsGrid products={displayedProducts} sortOption={sortOption} setSortOption={setSortOption} />} />
                    <Route path="/fabric/:fabricName" element={<FabricPage allProducts={products} />} />
                    <Route path="/print/:printName" element={<PrintPage allProducts={products} />} /> {/* New route for prints */}
                    <Route path="/products/:fabric_type/:slug" element={<ProductPage allProducts={products} session={session} />} />
                    <Route path="/story" element={<StoryPage />} />
                    <Route path="/search" element={<SearchPage allProducts={products} />} />
                    <Route path="/cart" element={<CartPage session={session} />} />
                    <Route path="/checkout" element={<CheckoutPage session={session} onOrderSuccess={handleOrderSuccess} />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<ProfilePage session={session} />} />
                    <Route path="/order/:orderId" element={<OrderDetailPage session={session} />} />
                    <Route path="/order-confirmation" element={<OrderConfirmationPage order={lastOrderDetails} />} />
                    <Route path="/refund-and-exchange-policy" element={<RefundAndExchangePolicy />} />
                    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                    <Route path="/shipping-policy" element={<ShippingPolicy />} />
                    <Route path="/contact-us" element={<ContactUs />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
}

export default function App() {
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}