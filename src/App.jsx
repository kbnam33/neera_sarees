import React, { useState, useEffect } from 'react';
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
            const logoBarHeight = 96; // h-24 = 6rem = 96px
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
            
            <header className="relative z-50 h-40"> {/* Placeholder to prevent content jump */}
                <div className="fixed top-0 left-0 right-0 bg-soft-beige/95 backdrop-blur-sm shadow-sm">
                    {/* Top row with logo */}
                    <div className="h-24 flex items-center justify-center transition-transform duration-300" style={{ transform: isNavSticky ? 'translateY(-100%)' : 'translateY(0)' }}>
                        <Link to="/" className="flex items-center">
                            <img src="/Neera logo.png" alt="Neera" className="h-24 w-auto" />
                        </Link>
                    </div>
                    {/* Bottom row with navigation and actions */}
                    <div className={`absolute left-0 right-0 bg-soft-beige/95 backdrop-blur-sm transition-transform duration-300 ${isNavSticky ? 'shadow-md' : ''}`} style={{ transform: isNavSticky ? 'translateY(-96px)' : 'translateY(0)' }}>
                        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex justify-between items-center h-16 border-t border-gray-200">
                            {/* Left side */}
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
                            {/* Right side */}
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
const HomeProductSection = ({ title, description, products }) => {
    if (!products || products.length === 0) return null;
    return (
        <section className="bg-soft-beige py-12 md:py-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 text-center">
                <h2 className="text-2xl font-serif text-deep-maroon tracking-wider mb-4">{title}</h2>
                {description && <p className="text-charcoal-gray max-w-2xl mx-auto mb-12">{description}</p>}
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
                                <h3 className="text-sm md:text-md font-serif text-charcoal-gray">{product.name}</h3>
                                <p className="text-sm md:text-md text-deep-maroon font-sans">₹ {product.price.toFixed(2)}</p>
                            </Link>
                        );
                    })}
                </div>
                 <div className="mt-16 text-center">
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
    <section className="bg-white">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-20 md:py-32 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="relative aspect-[4/5] order-last md:order-first">
                <img src="/maroon saree plain.png" alt="Close-up of a handwoven saree" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Our Philosophy</p>
                <h2 className="text-3xl lg:text-5xl font-serif text-deep-maroon leading-tight mb-6">A Confluence of Craft and Purity</h2>
                <p className="text-charcoal-gray leading-relaxed mb-8 max-w-prose">
                    Like its namesake—pure water—Neera embodies an elemental elegance. It is a story told not in words, but in threads; a quiet dialogue between the weaver's patient hand and the timeless grace of tradition. Each drape is a fluid expression of artistry, designed to move with you, becoming a second skin, a whisper of heritage in a modern world.
                </p>
                <Link to="/story" className="group inline-flex items-center gap-x-2 text-sm font-semibold tracking-widest text-deep-maroon uppercase">
                    Discover Our Story <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
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
        <div className="bg-soft-beige pt-48 pb-20">
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
                                <h3 className="text-md font-serif text-charcoal-gray">{product.name}</h3>
                                <p className="text-md text-deep-maroon font-sans">₹ {product.price.toFixed(2)}</p>
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
     <footer className="bg-earthen-brown text-soft-beige font-sans">
        <div className="max-w-screen-xl mx-auto px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-xs uppercase tracking-wider">
                <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
                     <img src="/Neera logo.png" alt="Neera" className="h-20 w-auto brightness-0 invert" />
                </div>
                <div>
                    <h5 className="text-white font-semibold mb-6">Shop</h5>
                    <ul className="space-y-4">
                        <li><Link to="/products" className="hover:text-white transition-colors">All Sarees</Link></li>
                        <li><Link to="/fabric/silk" className="hover:text-white transition-colors">Silk</Link></li>
                        <li><Link to="/fabric/mangalagiri" className="hover:text-white transition-colors">Mangalagiri</Link></li>
                        <li><Link to="/fabric/cotton" className="hover:text-white transition-colors">Cotton</Link></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-white font-semibold mb-6">Our Brand</h5>
                    <ul className="space-y-4">
                        <li><Link to="/story" className="hover:text-white transition-colors">Our Story</Link></li>
                        <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact Us</Link></li>
                    </ul>
                </div>
                 <div>
                    <h5 className="text-white font-semibold mb-6">Customer Care</h5>
                    <ul className="space-y-4">
                        <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping</Link></li>
                        <li><Link to="/refund-and-exchange-policy" className="hover:text-white transition-colors">Exchanges</Link></li>
                        <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                    </ul>
                </div>
                 <div>
                    <h5 className="text-white font-semibold mb-6">Connect</h5>
                    <ul className="space-y-4">
                        <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Facebook</a></li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/20 pt-8 mt-16 text-center text-xs text-white/70">
                <p>&copy; {new Date().getFullYear()} NEERA. ALL RIGHTS RESERVED.</p>
            </div>
        </div>
     </footer>
    );
};

// --- APP CONTENT & ROUTING ---
function AppContent({ session }) {
    const [products, setProducts] = useState([]);
    const [fabrics, setFabrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const [sortOption, setSortOption] = useState('newest');
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            
            const { data: productsData, error: productsError } = await supabase.from('products').select('*');
            if (productsError) { setError(productsError.message); setLoading(false); return; }

            const { data: fabricsData, error: fabricsError } = await supabase.from('fabrics').select('*');
            if (fabricsError) { setError(fabricsError.message); setLoading(false); return; }

            const productsWithSlugs = (productsData || []).map(product => ({
                ...product,
                slug: product.name.toLowerCase()
                             .replace(/\s+/g, '-')      // Replace spaces with -
                             .replace(/[^\w-]+/g, '')   // Remove all non-word chars
                             .replace(/--+/g, '-')       // Replace multiple - with single -
                             .replace(/^-+/, '')         // Trim - from start of text
                             .replace(/-+$/, '')         // Trim - from end of text
            }));

            setProducts(productsWithSlugs);
            setFabrics(fabricsData || []);
            setLoading(false);
        };
        fetchData();
    }, []);

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [location.pathname]);
    
    const handleOrderSuccess = (orderDetails) => {
        setLastOrderDetails(orderDetails);
        navigate('/order-confirmation');
    };

    const displayedProducts = [...products]
        .sort((a, b) => {
            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'newest': default: return new Date(b.created_at) - new Date(a.created_at);
            }
        });
    
    if (loading) { return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading Neera...</p></div>; }
    if (error) { return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Error: {error}</p></div>; }

    return (
        <div className="font-sans bg-soft-beige text-charcoal-gray">
            <Header session={session} fabrics={fabrics} products={products} />
            <main>
                <Routes>
                    <Route path="/" element={
                        <div className="pt-40">
                           <HomeProductSection title="New Arrivals" products={products.slice(0, 3)} />
                           <StoryHighlight />
                        </div>
                    } />
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
    const [session, setSession] = useState(null);
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);
    return (<CartProvider session={session}><AppContent session={session} /></CartProvider>);
}