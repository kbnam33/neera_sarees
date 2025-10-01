import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart, CartProvider } from './CartContext';
import AuthPage from './AuthPage.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import OrderConfirmationPage from './OrderConfirmationPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import ProductPage from './ProductPage.jsx';
import FabricPage from './FabricPage.jsx';
import SearchPage from './SearchPage.jsx';
import StoryPage from './StoryPage.jsx';
import RefundAndExchangePolicy from './RefundAndExchangePolicy.jsx';
import PrivacyPolicy from './PrivacyPolicy.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import ShippingPolicy from './ShippingPolicy.jsx';
import ContactUs from './ContactUs.jsx';


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
const MobileMenu = ({ isOpen, onClose, fabrics, session }) => {
    const [isFabricOpen, setIsFabricOpen] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleNavigate = (path) => {
        onClose();
        navigate(path);
    };

    return (
        <div className="fixed inset-0 bg-soft-beige z-[100] flex flex-col animate-fadeIn" onClick={onClose}>
            <div className="flex justify-end p-8">
                <button className="text-charcoal-gray hover:text-deep-maroon" onClick={onClose}>
                    <CloseIcon />
                </button>
            </div>
            <nav className="flex flex-col h-full px-8 pb-8" onClick={(e) => e.stopPropagation()}>
                <div className="flex-grow space-y-4 text-left">
                    <Link to="/products" className="block text-3xl font-serif text-deep-maroon py-4 border-b border-gray-200" onClick={onClose}>All Sarees</Link>
                    <div>
                        <button onClick={() => setIsFabricOpen(!isFabricOpen)} className="w-full flex justify-between items-center text-3xl font-serif text-deep-maroon py-4 border-b border-gray-200">
                           <span>Shop by Fabric</span>
                           <ChevronDownIcon className={`w-6 h-6 transition-transform duration-300 ${isFabricOpen ? 'rotate-180' : ''}`} />
                        </button>
                        {isFabricOpen && (
                             <ul className="pl-4 pt-4 space-y-3 animate-fadeInDown" style={{animationDuration: '0.3s'}}>
                                {fabrics.map(fabric => (
                                    <li key={fabric.id}>
                                        <Link to={`/fabric/${fabric.name}`} className="text-charcoal-gray hover:text-deep-maroon transition-colors text-lg" onClick={onClose}>
                                            {fabric.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Link to="/story" className="block text-3xl font-serif text-deep-maroon py-4 border-b border-gray-200" onClick={onClose}>Our Story</Link>
                </div>
                <div className="flex-shrink-0 pt-6 flex justify-center items-center gap-x-8">
                     <button onClick={() => handleNavigate(session ? '/profile' : '/auth')} className="flex items-center gap-x-2 text-charcoal-gray">
                        <UserIcon />
                        <span className="text-sm">{session ? 'Profile' : 'Sign In'}</span>
                    </button>
                    <button onClick={() => setIsSearchOpen(true)} className="flex items-center gap-x-2 text-charcoal-gray">
                        <SearchIcon />
                        <span className="text-sm">Search</span>
                    </button>
                </div>
            </nav>
        </div>
    );
};


// --- HEADER ---
const Header = ({ session, fabrics, products }) => {
    const { cartItems } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hoveredFabric, setHoveredFabric] = useState(null);
    const [isNavSticky, setIsNavSticky] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        const handleScroll = () => {
            const logoBarHeight = 128; // Corresponds to h-32
            setIsNavSticky(window.scrollY > logoBarHeight);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinkClasses = "relative uppercase text-xs tracking-widest after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0";
    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    const latestProducts = [...products]
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .slice(0, 2);

    const dropdownProducts = hoveredFabric
        ? products.filter(p => p.fabric_type === hoveredFabric).slice(0, 2)
        : latestProducts;

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} fabrics={fabrics} session={session} />
            
            <header className="relative z-50 h-48">
                <div className="fixed top-0 left-0 right-0 bg-soft-beige/95 backdrop-blur-sm shadow-sm">
                    <div className="h-32 flex items-center justify-center transition-transform duration-300" style={{ transform: isNavSticky ? 'translateY(-100%)' : 'translateY(0)' }}>
                        <Link to="/" className="flex items-center">
                            <img src="/Neera logo.png" alt="Neera" className="h-32 w-auto" />
                        </Link>
                    </div>
                    <div className={`absolute left-0 right-0 bg-soft-beige/95 backdrop-blur-sm transition-all duration-300 ${isNavSticky ? 'shadow-md' : ''}`} style={{ transform: isNavSticky ? 'translateY(-128px)' : 'translateY(0)' }}>
                        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16 border-t border-gray-200">
                            <div className="flex-1 flex justify-start">
                                <div className="md:hidden">
                                    <button onClick={() => setIsMobileMenuOpen(true)}>
                                        <MenuIcon />
                                    </button>
                                </div>
                                <nav className="hidden md:flex items-center gap-x-8 font-sans">
                                    <Link to="/products" className={navLinkClasses}>All Sarees</Link>
                                    <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                                        <button className={`flex items-center gap-x-1.5 ${navLinkClasses}`}>
                                           Shop by Fabric <ChevronDownIcon />
                                        </button>
                                        {isDropdownOpen && (
                                            <div className="absolute top-full left-[-200px] pt-5 w-[80vw] max-w-4xl opacity-0 animate-fadeIn" style={{ animationDelay: '50ms' }}>
                                                <div className="bg-soft-beige text-charcoal-gray border border-gray-200 shadow-2xl p-8 grid grid-cols-3 gap-8">
                                                    <div className="col-span-1" onMouseLeave={() => setHoveredFabric(null)}>
                                                        <h3 className="font-serif text-lg mb-4">Fabric Types</h3>
                                                        <ul className="space-y-3">
                                                            {fabrics.map(fabric => (
                                                                <li key={fabric.id} onMouseEnter={() => setHoveredFabric(fabric.name)}>
                                                                    <Link to={`/fabric/${fabric.name}`} className="hover:text-deep-maroon transition-colors text-sm" onClick={() => setIsDropdownOpen(false)}>
                                                                        {fabric.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div className="col-span-2 grid grid-cols-2 gap-6">
                                                        {dropdownProducts.map(product => {
                                                             const imageUrl = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/400x500';
                                                             return(
                                                                <Link key={product.id} to={`/products/${product.fabric_type}/${product.slug}`} className="group" onClick={() => setIsDropdownOpen(false)}>
                                                                    <div className="overflow-hidden bg-gray-100 mb-2">
                                                                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover aspect-[4/5] transition-transform duration-300 group-hover:scale-105" />
                                                                    </div>
                                                                    <h4 className="text-sm font-serif group-hover:text-deep-maroon transition-colors">{product.name}</h4>
                                                                    <p className="text-xs text-gray-500">Shop Now</p>
                                                                </Link>
                                                             );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                     <Link to="/story" className={navLinkClasses}>Our Story</Link>
                                </nav>
                            </div>
                            <div className="flex-1 flex justify-end items-center gap-x-4 sm:gap-x-6">
                                <button onClick={() => setIsSearchOpen(true)}><SearchIcon /></button>
                                {session ? (<Link to="/profile"><UserIcon /></Link>) : (<Link to="/auth"><UserIcon /></Link>)}
                                <Link to="/cart" className="relative">
                                    <ShoppingBagIcon />
                                    {cartItemCount > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-lotus-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartItemCount}</span>)}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

// --- HOME PRODUCT SECTION ---
const HomeProductSection = ({ title, products }) => {
    if (!products || products.length === 0) return null;
    return (
        <section className="bg-soft-beige pt-12 pb-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 text-left">
                <h2 className="text-2xl font-serif text-deep-maroon tracking-wider mb-8">{title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                    {products.map((product) => {
                        const imageUrl = product.images && product.images.length > 0
                            ? product.images[0]
                            : 'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera';
                        return (
                             <Link to={`/products/${product.fabric_type}/${product.slug}`} key={product.id} className="group text-left">
                                <div className="overflow-hidden mb-3 bg-gray-100">
                                    <img src={imageUrl} alt={product.name} className={`w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105`} />
                                </div>
                                <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{product.name}</h3>
                                <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
                            </Link>
                        );
                    })}
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


// --- STORY HIGHLIGHT SECTION ---
const StoryHighlight = () => (
    <section className="bg-soft-beige py-20 md:py-32 overflow-hidden">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-center">
                
                {/* Image */}
                <div className="lg:col-span-10">
                    <AnimatedUncrop>
                        <div className="p-2 border border-black">
                            <img 
                                src="/cinemtic-bg.png" 
                                alt="A serene, sunlit room with a draped saree."
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </AnimatedUncrop>
                </div>
                <div className="lg:col-span-8 lg:col-start-3 -mt-16 lg:-mt-24 relative z-10">
                    <AnimatedUncrop delay={200}>
                        <div className="p-8 md:p-12 border border-black bg-soft-beige">
                            <div className="max-w-xl">
                                <h2 className="text-4xl lg:text-5xl font-serif text-black leading-tight mb-6 font-normal">
                                    Purity in every thread.
                                </h2>
                                <p className="text-charcoal-gray-dark leading-relaxed mb-10">
                                    Inspired by the Sanskrit word for 'pure water,' our sarees are designed to drape with the effortless grace of flowing water—a fluid expression of artistry that is both timeless and modern.
                                </p>
                                <Link 
                                    to="/story" 
                                    className="group inline-block text-sm font-semibold tracking-widest text-deep-maroon uppercase"
                                >
                                    <span className="relative pb-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-px after:bg-deep-maroon after:transition-all after:duration-300 group-hover:after:w-full">
                                        Discover Our Story
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </AnimatedUncrop>
                </div>
            </div>
        </div>
    </section>
);


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
        <div className="bg-soft-beige pb-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 border-b border-gray-200 pb-4 gap-4">
                    <h1 className="text-3xl font-serif text-deep-maroon">All Sarees</h1>
                    <CustomSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-12">
                    {products.map((product) => {
                         const imageUrl = product.images && product.images.length > 0
                            ? product.images[0]
                            : 'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera';
                        return (
                            <Link to={`/products/${product.fabric_type}/${product.slug}`} key={product.id} className="group text-left">
                                <div className="overflow-hidden mb-4 bg-gray-100">
                                    <img src={imageUrl} alt={product.name} className={`w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105`} />
                                </div>
                                <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{product.name}</h3>
                                <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
                            </Link>
                        );
                    })}
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
                     <img src="/Neera logo.png" alt="Neera" className="h-32 w-auto mx-auto mb-8" />
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
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
                setError("Supabase credentials are not configured. Please check your .env file and restart the server.");
                setLoading(false);
                return;
            }
            setLoading(true);
            const { data: productsData, error: productsError } = await supabase.from('products').select('*');
            if (productsError) { setError(productsError.message); setLoading(false); return; }
            const { data: fabricsData, error: fabricsError } = await supabase.from('fabrics').select('*');
            if (fabricsError) { setError(fabricsError.message); setLoading(false); return; }
            const productsWithSlugs = (productsData || []).map(product => ({ ...product, slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-').replace(/^-+/, '').replace(/-+$/, '') }));
            setProducts(productsWithSlugs);
            setFabrics(fabricsData || []);
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
    
    if (loading) return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading Neera...</p></div>;
    if (error && !products.length) return <div className="h-screen flex justify-center items-center bg-soft-beige text-center p-8"><p className="text-red-600 font-semibold">{error}</p></div>

    const shouldHavePadding = !['/story', '/', '/auth', '/order-confirmation'].includes(location.pathname);


    return (
        <div className="font-sans bg-soft-beige text-charcoal-gray">
            <Header session={session} fabrics={fabrics} products={products} />
            <main className={shouldHavePadding ? 'pt-48' : ''}>
                <Routes>
                    <Route path="/" element={<><HomeProductSection title="New Arrivals" products={products.slice(0, 3)} /><StoryHighlight /></>} />
                    <Route path="/products" element={<AllProductsGrid products={displayedProducts} sortOption={sortOption} setSortOption={setSortOption} />} />
                    <Route path="/fabric/:fabricName" element={<FabricPage allProducts={products} />} />
                    <Route path="/products/:fabric_type/:slug" element={<ProductPage allProducts={products} session={session} />} />
                    <Route path="/story" element={<StoryPage />} />
                    <Route path="/search" element={<SearchPage allProducts={products} />} />
                    <Route path="/cart" element={<CartPage session={session} />} />
                    <Route path="/checkout" element={<CheckoutPage session={session} onOrderSuccess={handleOrderSuccess} />} />
                    <Route path="/auth" element={<AuthPage />} />
                    <Route path="/profile" element={<ProfilePage session={session} />} />
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
    const navigate = useNavigate(); // This hook can only be used in a Router context.
    
    return (
        <CartProvider>
            <AppContent />
        </CartProvider>
    );
}