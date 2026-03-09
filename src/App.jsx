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
import { ASSETS } from './assets.js';
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
        <div className="fixed inset-0 bg-soft-beige z-[100] flex flex-col items-center justify-center animate-fadeIn" onClick={onClose}>
            <button className="absolute top-8 right-8 text-charcoal-gray hover:text-deep-maroon" onClick={onClose}>
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
                    className="w-full bg-transparent border-b border-gray-400 text-3xl md:text-5xl text-center font-serif text-deep-maroon placeholder-gray-400 focus:outline-none focus:border-deep-maroon"
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
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
            <div className="flex items-center justify-between px-5 h-14 border-b border-[#EDE8E2]">
                <span className="font-serif text-deep-maroon text-lg">Neera</span>
                <button onClick={onClose} className="text-charcoal-gray">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
            <nav className="flex flex-col px-6 pt-8 gap-1 overflow-y-auto">
                <p className="text-[9px] tracking-[0.35em] text-charcoal-gray/35 uppercase font-sans mb-3">COLLECTION</p>
                <button
                    onClick={() => handleNavigate('/fabric/linen')}
                    className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"
                >
                    Presentation Days
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>
                <button
                    onClick={() => handleNavigate('/fabric/Mul Mul Cotton')}
                    className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"
                >
                    Everyday at Work
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>

                <div className="mt-6 mb-2">
                    <p className="text-[9px] tracking-[0.35em] text-charcoal-gray/35 uppercase font-sans">EXPLORE</p>
                </div>
                <button
                    onClick={() => handleNavigate('/products')}
                    className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"
                >
                    All Sarees
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>
                <button
                    onClick={() => handleNavigate('/story')}
                    className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"
                >
                    Our Story
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>
                <button
                    onClick={() => handleNavigate('/contact-us')}
                    className="text-left font-serif text-deep-maroon text-2xl py-3 border-b border-[#F0EAE2] w-full flex items-center justify-between"
                >
                    Contact
                    <ArrowRightIcon className="w-4 h-4 opacity-40" />
                </button>

                <div className="mt-auto px-6 pb-10 pt-6 flex items-center gap-6 border-t border-[#EDE8E2]">
                    <button
                        onClick={() => handleNavigate(session ? '/profile' : '/auth')}
                        className="text-xs tracking-[0.2em] uppercase text-charcoal-gray/60 font-sans hover:text-deep-maroon transition-colors duration-200"
                    >
                        {session ? 'My Account' : 'Sign In'}
                    </button>
                    <button
                        onClick={() => {
                            onClose();
                            onOpenSearch();
                        }}
                        className="text-xs tracking-[0.2em] uppercase text-charcoal-gray/60 font-sans hover:text-deep-maroon transition-colors duration-200"
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
    const dropdownTimeoutRef = useRef(null);

    const handleDropdownEnter = (type) => {
        clearTimeout(dropdownTimeoutRef.current);
        setActiveDropdown(type);
    };

    const handleDropdownLeave = () => {
        dropdownTimeoutRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    }, [location.pathname]);

    const navLinkClasses = "relative text-charcoal-gray hover:text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans transition-colors duration-200 after:content-[''] after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[1px] after:bg-deep-maroon after:transition-all after:duration-300 hover:after:w-full";
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

            <header className="w-full bg-white border-b border-[#EDE8E2] z-50">
                <div className="hidden md:flex max-w-screen-xl mx-auto px-6 h-16 items-center justify-between relative">
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className={navLinkClasses}>Home</Link>
                        <div
                            className="relative"
                            onMouseEnter={() => handleDropdownEnter('shop')}
                            onMouseLeave={handleDropdownLeave}
                        >
                            <button className={`${navLinkClasses} flex items-center gap-1.5 bg-transparent border-none cursor-pointer`}>
                                Shop
                                <ChevronDownIcon className="w-3 h-3" />
                            </button>
                            <div className={`absolute top-full left-0 mt-3 w-64 bg-white border border-[#EDE8E2] shadow-sm transition-all duration-200 ${activeDropdown === 'shop' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
                                <div className="p-5 flex flex-col gap-1">
                                    <p className="text-[10px] tracking-[0.3em] text-charcoal-gray/40 uppercase mb-2 font-sans">COLLECTION</p>
                                    <Link
                                        to="/fabric/linen"
                                        onClick={() => setActiveDropdown(null)}
                                        className="text-deep-maroon font-serif text-base py-1.5 hover:translate-x-1 transition-transform duration-200 block"
                                    >
                                        Presentation Days
                                    </Link>
                                    <Link
                                        to="/fabric/Mul Mul Cotton"
                                        onClick={() => setActiveDropdown(null)}
                                        className="text-deep-maroon font-serif text-base py-1.5 hover:translate-x-1 transition-transform duration-200 block"
                                    >
                                        Everyday at Work
                                    </Link>
                                    <div className="border-t border-[#EDE8E2] mt-3 pt-3">
                                        <Link
                                            to="/products"
                                            onClick={() => setActiveDropdown(null)}
                                            className="inline-flex items-center gap-2 text-[10px] tracking-[0.25em] uppercase text-deep-maroon/60 hover:text-deep-maroon transition-colors duration-200 font-sans"
                                        >
                                            View All Sarees
                                            <ArrowRightIcon className="w-3 h-3" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/contact-us" className={navLinkClasses}>Contact</Link>
                    </nav>

                    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <Link to="/" className="font-serif text-deep-maroon text-xl tracking-wide">Neera</Link>
                        <span className="text-[8px] tracking-[0.3em] text-deep-maroon/40 uppercase font-sans mt-0.5">SAREES FOR WORKING WOMEN</span>
                    </div>

                    <div className="flex items-center gap-5">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-charcoal-gray hover:text-deep-maroon transition-colors duration-200"
                        >
                            <SearchIcon className="w-4 h-4" />
                        </button>
                        <Link
                            to={session ? '/profile' : '/auth'}
                            className="text-charcoal-gray hover:text-deep-maroon transition-colors duration-200"
                        >
                            <UserIcon className="w-4 h-4" />
                        </Link>
                        <Link
                            to="/cart"
                            className="relative text-charcoal-gray hover:text-deep-maroon transition-colors duration-200"
                        >
                            <ShoppingBagIcon className="w-4 h-4" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-deep-maroon text-white text-[8px] flex items-center justify-center rounded-full">
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                <div className="md:hidden flex items-center justify-between px-5 h-14 border-b border-[#EDE8E2]">
                    <button onClick={() => setIsMobileMenuOpen(true)} className="text-charcoal-gray">
                        <MenuIcon className="w-5 h-5" />
                    </button>
                    <Link to="/" className="flex flex-col items-center">
                        <span className="font-serif text-deep-maroon text-lg">Neera</span>
                        <span className="text-[7px] tracking-[0.25em] text-deep-maroon/40 uppercase font-sans">SAREES FOR WORKING WOMEN</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsSearchOpen(true)} className="text-charcoal-gray">
                            <SearchIcon className="w-4 h-4" />
                        </button>
                        <Link to="/cart" className="relative text-charcoal-gray">
                            <ShoppingBagIcon className="w-4 h-4" />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-deep-maroon text-white text-[8px] flex items-center justify-center rounded-full">
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
        <section className="relative w-screen h-screen overflow-hidden">
            {/* Place neera-hero-section.mp4 in public/ for this hero video background */}
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
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0.0) 100%)' }}
            />
            <div className="absolute bottom-0 left-0 w-full px-8 md:px-16 pb-14 md:pb-20">
                <p className="text-white/60 text-xs tracking-[0.35em] uppercase mb-4 font-sans">FOR THE WOMAN WHO WORKS</p>
                <h1 className="text-white font-serif text-4xl md:text-6xl lg:text-7xl leading-tight mb-5 max-w-2xl">Sarees built for your 9 to 5.</h1>
                <p className="text-white/75 text-base md:text-lg font-sans font-light mb-9 max-w-md leading-relaxed">Cotton. Linen. All day.</p>
                <Link
                    to="/products"
                    className="inline-flex items-center gap-3 bg-white text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans px-8 py-4 hover:bg-deep-maroon hover:text-white transition-all duration-300"
                >
                    Shop Office Wear Sarees
                    <ArrowRightIcon className="w-4 h-4" />
                </Link>
            </div>
        </section>
    );
};

const TrustStrip = () => {
    return (
        <section className="w-full bg-[#F5EFE8] border-y border-[#E0D5C8]">
            <div className="max-w-screen-xl mx-auto px-6 py-7 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#E0D5C8]">
                <div className="flex flex-col items-center md:items-start justify-center px-8 py-5 md:py-0 gap-1">
                    <p className="text-deep-maroon text-xs tracking-[0.25em] uppercase font-sans font-semibold">Cotton & Linen Only</p>
                    <p className="text-charcoal-gray/70 text-sm font-sans leading-snug">Breathable. Minimal. Office-appropriate.</p>
                </div>
                <div className="flex flex-col items-center md:items-start justify-center px-8 py-5 md:py-0 gap-1">
                    <p className="text-deep-maroon text-xs tracking-[0.25em] uppercase font-sans font-semibold">Built for 8-Hour Days</p>
                    <p className="text-charcoal-gray/70 text-sm font-sans leading-snug">Pleats that stay. Fabric that doesn&apos;t cling.</p>
                </div>
                <div className="flex flex-col items-center md:items-start justify-center px-8 py-5 md:py-0 gap-1">
                    <p className="text-deep-maroon text-xs tracking-[0.25em] uppercase font-sans font-semibold">Free Shipping Across India</p>
                    <p className="text-charcoal-gray/70 text-sm font-sans leading-snug">Every order. No minimum.</p>
                </div>
            </div>
        </section>
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
        <section className="w-full bg-white">
            <div className="max-w-screen-xl mx-auto px-6 md:px-16 pt-20 pb-24">
                <p className="text-deep-maroon/50 text-xs tracking-[0.35em] uppercase font-sans mb-3">SHOP THE COLLECTION</p>
                <h2 className="font-serif text-deep-maroon text-3xl md:text-4xl mb-14">Start here.</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                    <Link to="/fabric/linen" className="group relative block overflow-hidden">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#F0EAE2]">
                            <img
                                src="/neera-home-page.jpeg"
                                alt="Presentation Days - Linen Sarees for Office"
                                className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                        </div>
                        <div className="pt-5">
                            <p className="text-deep-maroon/50 text-xs tracking-[0.3em] uppercase font-sans mb-1">Pure Linen</p>
                            <h3 className="font-serif text-deep-maroon text-xl md:text-2xl mb-2">Presentation Days</h3>
                            <p className="text-charcoal-gray/65 text-sm font-sans leading-relaxed mb-4">Crisp structure that holds the drape. Looks senior-level from the first meeting to the last.</p>
                            <span className="inline-flex items-center gap-2 text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans group-hover:gap-4 transition-all duration-300">
                                Shop Now
                                <ArrowRightIcon className="w-3.5 h-3.5" />
                            </span>
                        </div>
                    </Link>

                    <Link to="/fabric/Mul Mul Cotton" className="group relative block overflow-hidden">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#EDE8E2]">
                            {everydayProduct?.images?.[0] ? (
                                <img
                                    src={everydayProduct.images[0]}
                                    alt="Everyday at Work - Mulmul Cotton Sarees"
                                    className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-[#E5DDD5]" />
                            )}
                        </div>
                        <div className="pt-5">
                            <p className="text-deep-maroon/50 text-xs tracking-[0.3em] uppercase font-sans mb-1">Mulmul Cotton</p>
                            <h3 className="font-serif text-deep-maroon text-xl md:text-2xl mb-2">Everyday at Work</h3>
                            <p className="text-charcoal-gray/65 text-sm font-sans leading-relaxed mb-4">Feather-light. Doesn&apos;t cling. Stays soft after 8 hours in the office.</p>
                            <span className="inline-flex items-center gap-2 text-deep-maroon text-xs tracking-[0.2em] uppercase font-sans group-hover:gap-4 transition-all duration-300">
                                Shop Now
                                <ArrowRightIcon className="w-3.5 h-3.5" />
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
        <section className="bg-soft-beige pt-12 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-10 text-left">
                <h2 className="text-2xl font-serif text-deep-maroon tracking-wider mb-8">{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-10 sm:gap-y-12">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductImage 
                                images={product.images}
                                altText={`${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree`}
                                productUrl={`/products/${product.fabric_type}/${product.slug}`}
                            />
                            <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{product.name}</h3>
                            <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
                 <div className="mt-16 text-left">
                    <Link to="/products" className="group inline-flex items-center gap-x-2 text-sm font-semibold tracking-widest text-deep-maroon uppercase">
                        View All Sarees <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
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
                className="flex items-center justify-between w-48 border border-gray-300 rounded-sm text-charcoal-gray text-xs tracking-wider py-2 px-3 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
            >
                <span>{options[sortOption]}</span>
                <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full right-0 w-48 mt-2 bg-soft-beige border border-gray-200 shadow-lg z-10">
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
        <div className="bg-soft-beige pt-12 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 sm:px-10">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-gray-200 pb-4 gap-4">
                    <h1 className="text-3xl font-serif text-deep-maroon">All Sarees</h1>
                    <CustomSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-12">
                    {products.map((product) => (
                        <div key={product.id}>
                            <ProductImage 
                                images={product.images}
                                altText={`${product.name} - ${product.fabric_type} ${product.print_type || ''} Saree`}
                                productUrl={`/products/${product.fabric_type}/${product.slug}`}
                            />
                            <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{product.name}</h3>
                            <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
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
     <footer className="bg-soft-beige text-charcoal-gray font-sans border-t border-gray-200">
        <div className="max-w-screen-xl mx-auto px-8 py-16">
            <div className="text-center mb-12">
                <Link to="/">
                     <picture>
                        <source type="image/webp" srcSet={ASSETS.LOGO_WEBP_URL} />
                        <img src={ASSETS.LOGO_PNG_URL} alt="Neera" decoding="async" width={256} height={256} className="h-32 w-auto mx-auto mb-8" />
                     </picture>
                </Link>
                <nav className="flex justify-center flex-wrap gap-x-6 gap-y-3 text-xs uppercase tracking-widest text-charcoal-gray/80">
                    <Link to="/products" className="hover:text-deep-maroon transition-colors">ALL SAREES</Link>
                    <Link to="/story" className="hover:text-deep-maroon transition-colors">OUR STORY</Link>
                    <Link to="/contact-us" className="hover:text-deep-maroon transition-colors">CONTACT US</Link>
                    <Link to="/shipping-policy" className="hover:text-deep-maroon transition-colors">SHIPPING</Link>
                    <Link to="/refund-and-exchange-policy" className="hover:text-deep-maroon transition-colors">EXCHANGES</Link>
                    <Link to="/privacy-policy" className="hover:text-deep-maroon transition-colors">PRIVACY POLICY</Link>
                    <Link to="/terms-and-conditions" className="hover:text-deep-maroon transition-colors">TERMS & CONDITIONS</Link>
                </nav>
            </div>

            <div className="pt-12 mt-12 text-center text-xs text-charcoal-gray/50 uppercase tracking-widest border-t border-gray-200">
                <p>&copy; {new Date().getFullYear()} NEERA. ALL RIGHTS RESERVED.</p>
            </div>
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
    
    if (loading) return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading Neera...</p></div>;
    if (error && !products.length) return <div className="h-screen flex justify-center items-center bg-soft-beige text-center p-8"><p className="text-red-600 font-semibold">{error}</p></div>

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
        <div className="font-sans bg-soft-beige text-charcoal-gray">
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