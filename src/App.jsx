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

// --- ICONS ---
const SearchIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> );
const UserIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const ShoppingBagIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> );
const ChevronDownIcon = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg> );
const ArrowRightIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);
const CloseIcon = ({ className = "w-8 h-8"}) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>);


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

// --- HEADER ---
const Header = ({ session, fabrics, products }) => {
    const { cartItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isOpaque = isScrolled || location.pathname !== '/';
    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isOpaque ? 'bg-soft-beige/95 backdrop-blur-sm text-charcoal-gray shadow-sm' : 'bg-transparent text-white'}`;
    const navLinkClasses = "relative uppercase text-xs tracking-widest after:content-[''] after:absolute after:bottom-[-2px] after:left-1/2 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0";
    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
    const featuredProducts = products.slice(0, 2);

    return (
        <>
            <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
            <header className={headerClasses}>
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex justify-between items-center h-20">
                    <nav className="hidden md:flex items-center gap-x-8 font-sans">
                        <Link to="/products" className={navLinkClasses}>All Sarees</Link>
                        <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                            <button className={`flex items-center gap-x-1.5 ${navLinkClasses}`}>
                               Shop by Fabric <ChevronDownIcon />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-[-200px] pt-5 w-[80vw] max-w-4xl opacity-0 animate-fadeIn" style={{ animationDelay: '50ms' }}>
                                    <div className="bg-soft-beige text-charcoal-gray border border-gray-200 shadow-2xl p-8 grid grid-cols-4 gap-8">
                                        <div className="col-span-1">
                                            <h3 className="font-serif text-lg mb-4">Fabric Types</h3>
                                            <ul className="space-y-3">
                                                {fabrics.map(fabric => (
                                                    <li key={fabric.id}>
                                                        <Link to={`/fabric/${fabric.name}`} className="hover:text-deep-maroon transition-colors text-sm" onClick={() => setIsDropdownOpen(false)}>
                                                            {fabric.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="col-span-3 grid grid-cols-2 gap-6">
                                            {featuredProducts.map(product => {
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
                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                        <Link to="/" className="flex items-center">
                            <h1 className={`text-4xl font-serif tracking-normal ${isOpaque ? 'text-deep-maroon' : 'text-white'}`}>Neera</h1>
                        </Link>
                    </div>
                    <div className="flex items-center justify-end gap-x-6">
                        <button onClick={() => setIsSearchOpen(true)}><SearchIcon /></button>
                         {session ? (<Link to="/profile"><UserIcon /></Link>) : (<Link to="/auth"><UserIcon /></Link>)}
                        <Link to="/cart" className="relative">
                            <ShoppingBagIcon />
                            {cartItemCount > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-lotus-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartItemCount}</span>)}
                        </Link>
                    </div>
                </div>
            </header>
        </>
    );
};

// --- HERO SECTION ---
const Hero = () => (
    <section className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/New hero image.png')" }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 w-full">
            <div className="max-w-screen-xl mx-auto px-8">
                <div className="max-w-xl text-left">
                    <h1 className="text-5xl lg:text-7xl font-serif leading-tight tracking-tight mb-4 text-gray-50 text-shadow-glow animate-fadeInDown">
                        Woven in Legacy
                    </h1>
                    <p className="text-lg text-gray-300 mb-8 text-shadow-glow animate-fadeInDown" style={{ animationDelay: '200ms' }}>
                        Discover timeless elegance, handcrafted for the modern woman. Each thread tells a story of tradition and artistry.
                    </p>
                    <Link
                       to="/products"
                       className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-brand-dark uppercase bg-white/90 px-10 py-4 transition-all duration-300 hover:bg-brand-dark hover:text-white shadow-lg animate-fadeInDown"
                       style={{ animationDelay: '400ms' }}
                    >
                        Explore the Collection <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                    </Link>
                </div>
            </div>
        </div>
    </section>
);


// --- HOME PRODUCT SECTION ---
const HomeProductSection = ({ title, description, products }) => {
    if (!products || products.length === 0) return null;
    return (
        <section className="bg-soft-beige py-20 md:py-28">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 text-center">
                <h2 className="text-3xl font-serif text-deep-maroon tracking-wider mb-4">{title}</h2>
                {description && <p className="text-charcoal-gray max-w-2xl mx-auto mb-12">{description}</p>}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-12">
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
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-20 md:py-32 grid md:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5]">
                <img src="/maroon saree plain.png" alt="Close-up of a handwoven saree" className="w-full h-full object-cover absolute top-0 left-0" />
            </div>
            <div className="text-left">
                <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Our Philosophy</p>
                <h2 className="text-4xl lg:text-5xl font-serif text-deep-maroon leading-tight mb-6">A Confluence of Craft and Purity</h2>
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
                onMouseEnter={() => setIsOpen(true)}
                className="flex items-center justify-between w-48 border border-gray-300 rounded-sm text-charcoal-gray text-xs tracking-wider py-2 px-3 focus:outline-none focus:ring-1 focus:ring-deep-maroon"
            >
                <span>{options[sortOption]}</span>
                <ChevronDownIcon className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full left-0 w-48 mt-2 bg-soft-beige border border-gray-200 shadow-lg z-10">
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
        <div className="bg-soft-beige pt-32 pb-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-serif text-deep-maroon">All Sarees</h1>
                    <CustomSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
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
     <footer className="bg-brand-dark text-gray-400 font-sans">
        <div className="max-w-screen-xl mx-auto px-8 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 text-xs uppercase tracking-wider">
                <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-8 lg:mb-0">
                     <h1 className="text-4xl font-serif tracking-normal text-white">Neera</h1>
                </div>
                <div>
                    <h5 className="text-white font-semibold mb-6">Shop</h5>
                    <ul className="space-y-4"> {['All Sarees', 'Collections', 'New Arrivals', 'Gifting'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul>
                </div>
                <div>
                    <h5 className="text-white font-semibold mb-6">About</h5>
                    <ul className="space-y-4"> {['Our Story', 'Craftsmanship', 'Sustainability', 'Journal'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul>
                </div>
                <div>
                    <h5 className="text-white font-semibold mb-6">Support</h5>
                    <ul className="space-y-4"> {["FAQ's", 'Contact Us', 'Shipping & Returns', 'Book an Appointment'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul>
                </div>
                 <div>
                    <h5 className="text-white font-semibold mb-6">Follow Us</h5>
                    <ul className="space-y-4"> {['Instagram', 'Facebook', 'Pinterest'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul>
                </div>
            </div>
            <div className="border-t border-gray-800 pt-8 mt-16 text-center text-xs text-gray-500">
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

            // Add a URL-friendly slug to each product object. This is crucial for clean URLs.
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
                case 'newest': default: return b.id - a.id;
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
                        <>
                            <Hero />
                            <HomeProductSection title="New Collection" products={products.slice(0, 3)} />
                            <StoryHighlight />
                            <HomeProductSection title="Signature Sarees" products={products.slice(3, 9)} />
                        </>
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