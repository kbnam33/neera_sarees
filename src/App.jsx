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

// --- ICONS (Minimalist & Refined) ---
const SearchIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> );
const UserIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const ShoppingBagIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> );
const ChevronDownIcon = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg> );
const ArrowRightIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);


// --- HEADER ---
const Header = ({ session, fabrics }) => {
    const { cartItems } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isOpaque = isScrolled || location.pathname !== '/';
    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isOpaque ? 'bg-soft-beige/95 backdrop-blur-sm text-charcoal-gray shadow-sm' : 'bg-transparent text-white'}`;
    const navLinkClasses = "relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-[1px] after:bg-current after:transition-all after:duration-300 hover:after:w-full hover:after:left-0";
    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <header className={headerClasses}>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 flex justify-between items-center h-20">
                <nav className="hidden md:flex items-center gap-x-8 text-xs tracking-widest font-sans uppercase">
                    <Link to="/products" className={navLinkClasses}>All Sarees</Link>
                    <div className="relative" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                        <button className={`flex items-center gap-x-1.5 ${navLinkClasses}`}>
                           Shop by Fabric <ChevronDownIcon />
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute top-full left-0 pt-5 w-96 opacity-0 animate-fadeIn" style={{ animationDelay: '50ms' }}>
                                <div className="bg-soft-beige text-charcoal-gray border border-gray-200 shadow-xl p-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        {fabrics.map(fabric => (
                                            <Link key={fabric.id} to={`/fabric/${fabric.name}`} className="group text-center" onClick={() => setIsDropdownOpen(false)}>
                                                <div className="overflow-hidden bg-gray-100 mb-2">
                                                    <img src={fabric.image_url} alt={fabric.name} className="w-full h-full object-cover aspect-square transition-transform duration-300 group-hover:scale-105" />
                                                </div>
                                                <h4 className="text-xs tracking-wider group-hover:text-deep-maroon transition-colors">{fabric.name}</h4>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                     <Link to="/story" className={navLinkClasses}>Our Story</Link>
                </nav>
                <div className="md:absolute md:left-1/2 md:-translate-x-1/2">
                    <Link to="/" className="flex items-center">
                        <h1 className={`text-4xl font-serif tracking-normal ${isOpaque ? 'text-deep-maroon' : 'text-white'}`}>
                           Neera
                        </h1>
                    </Link>
                </div>
                <div className="flex items-center justify-end gap-x-6">
                    <button><SearchIcon /></button>
                     {session ? (<Link to="/profile"><UserIcon /></Link>) : (<Link to="/auth"><UserIcon /></Link>)}
                    <Link to="/cart" className="relative">
                        <ShoppingBagIcon />
                        {cartItemCount > 0 && (<span className="absolute -top-1.5 -right-1.5 bg-lotus-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">{cartItemCount}</span>)}
                    </Link>
                </div>
            </div>
        </header>
    );
};


// --- HERO SECTION ---
const Hero = () => (
    <section className="relative h-screen bg-cover bg-center flex items-end" style={{ backgroundImage: "url('/New maroon saree.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div className="relative z-10 p-8 md:p-16 text-white w-full">
            <div className="max-w-screen-xl mx-auto">
                <h1 className="text-5xl lg:text-7xl font-serif leading-tight tracking-tight mb-4" style={{ textShadow: '1px 1px 15px rgba(0,0,0,0.5)' }}>
                    Woven in Legacy
                </h1>
                <p className="text-lg text-gray-200 mb-8 max-w-md" style={{ textShadow: '1px 1px 10px rgba(0,0,0,0.7)' }}>
                    Discover timeless elegance, handcrafted for the modern woman. Each thread tells a story of tradition and artistry.
                </p>
                <Link
                   to="/products"
                   className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-brand-dark uppercase bg-soft-beige px-10 py-4 transition-colors duration-300 hover:bg-lotus-gold hover:text-white shadow-lg"
                >
                    Explore the Collection <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2" />
                </Link>
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
                             <a href={`/product/${product.id}`} key={product.id} className="group text-left">
                                <div className="overflow-hidden mb-4 bg-gray-100">
                                    <img src={imageUrl} alt={product.name} className={`w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105`} />
                                </div>
                                <h3 className="text-md font-serif text-charcoal-gray">{product.name}</h3>
                                <p className="text-md text-deep-maroon font-sans">₹ {product.price.toFixed(2)}</p>
                            </a>
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


// --- BRAND STORY SECTION ---
const BrandStory = () => (
    <section className="bg-white py-20 md:py-32">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-8 grid md:grid-cols-2 gap-12 items-center">
            <div>
                <img src="/Blue purple.png" alt="Artisan weaving a saree" className="w-full object-cover" />
            </div>
            <div className="text-left">
                <h2 className="text-3xl font-serif text-deep-maroon tracking-wider mb-6">The Heart of Craft</h2>
                <p className="text-charcoal-gray leading-relaxed mb-4">Neera is more than just a brand; it is a celebration of heritage. We partner with master weavers across India, preserving centuries-old techniques passed down through generations.</p>
                <p className="text-charcoal-gray leading-relaxed mb-8">Each saree is a masterpiece of patience and skill, woven from the finest natural threads. We believe in sustainable luxury—creating pieces that are not only beautiful but also honour the artisans and the environment.</p>
                <Link to="/story" className="group inline-flex items-center gap-x-2 text-sm font-semibold tracking-widest text-deep-maroon uppercase">
                    Our Philosophy <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </div>
    </section>
);


// --- ALL PRODUCTS GRID ---
const AllProductsGrid = ({ products, sortOption, setSortOption }) => {
    return (
        <div className="bg-soft-beige pt-32 pb-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <div className="flex justify-between items-center mb-12 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-serif text-deep-maroon">All Sarees</h1>
                    <div className="relative">
                        <select
                            id="sort"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="bg-transparent border border-gray-300 rounded-sm text-charcoal-gray text-xs tracking-wider py-2 pl-3 pr-8 focus:outline-none focus:ring-1 focus:ring-deep-maroon appearance-none"
                        >
                            <option value="newest">Sort by: Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <ChevronDownIcon className="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                    {products.map((product) => {
                         const imageUrl = product.images && product.images.length > 0
                            ? product.images[0]
                            : 'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera';
                        return (
                            <a href={`/product/${product.id}`} key={product.id} className="group text-left">
                                <div className="overflow-hidden mb-4 bg-gray-100">
                                    <img src={imageUrl} alt={product.name} className={`w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105`} />
                                </div>
                                <h3 className="text-md font-serif text-charcoal-gray">{product.name}</h3>
                                <p className="text-md text-deep-maroon font-sans">₹ {product.price.toFixed(2)}</p>
                            </a>
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
            if (productsError) {
                setError(productsError.message);
                setLoading(false);
                return;
            }

            const { data: fabricsData, error: fabricsError } = await supabase.from('fabrics').select('*');
            if (fabricsError) {
                setError(fabricsError.message);
                setLoading(false);
                return;
            }

            setProducts(productsData || []);
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
            <Header session={session} fabrics={fabrics} />
            <main>
                <Routes>
                    <Route path="/" element={
                        <>
                            <Hero />
                            <HomeProductSection title="New Collection" products={products.slice(0, 3)} />
                            <BrandStory />
                            <HomeProductSection title="All Sarees" description="Our complete collection of signature sarees, celebrating timeless design and exquisite craftsmanship." products={products.slice(3, 9)} />
                        </>
                    } />
                    <Route path="/products" element={<AllProductsGrid products={displayedProducts} sortOption={sortOption} setSortOption={setSortOption} />} />
                    <Route path="/fabric/:fabricName" element={<FabricPage allProducts={products} />} />
                    <Route path="/product/:id" element={<ProductPage products={products} session={session} />} />
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