import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart, CartProvider } from './CartContext';
import AuthPage from './AuthPage.jsx';
import CartPage from './CartPage.jsx';
import CheckoutPage from './CheckoutPage.jsx';
import OrderConfirmationPage from './OrderConfirmationPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import ProductPage from './ProductPage.jsx'; // Corrected the import path

// ICONS
const SearchIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> );
const UserIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const ShoppingBagIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> );
const ChevronDownIcon = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg> );
const ChevronRightIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg> );
const InstagramIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const FacebookIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const TwitterIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>);
const PinterestIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.28 4.52a9.6 9.6 0 0 0-13.58 0 9.6 9.6 0 0 0 0 13.58 9.6 9.6 0 0 0 13.58 0 9.6 9.6 0 0 0 0-13.58z"></path><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10z"></path><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>);


const Header = ({ session, setSearchTerm }) => {
    const { cartItems } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    // Determine if header should be opaque based on page and scroll position
    const isOpaque = isScrolled || !['/'].includes(location.pathname);

    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${isOpaque ? 'bg-soft-beige text-charcoal-gray shadow-md' : 'bg-transparent text-white'}`;
    const navLinkClasses = `py-4 transition-colors duration-300 ${isOpaque ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`;
    const iconContainerClasses = `hidden sm:flex items-center px-3 py-2 rounded-sm transition-colors duration-300 ${isOpaque ? 'bg-gray-100 text-charcoal-gray' : 'bg-white/20 text-white'}`;

    const fabricLinks = ["ORGANZA", "VELVET", "CHIFFON", "COTTON SILK", "GEORGETTE", "THE WORLD COLLECTION"];
    const featuredCollections = [
        { name: "Bridal Couture", image: "https://placehold.co/400x500/d1d5db/111827?text=Bridal+Couture" },
        { name: "Summer '24", image: "https://placehold.co/400x500/fef3c7/111827?text=Summer+'24" }
    ];

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };

    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <header className={headerClasses}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
                <div className="w-1/3">
                     <nav className="hidden md:flex items-center justify-start gap-x-8 text-xs tracking-widest font-sans">
                        <Link to="/" className={navLinkClasses}>NEW COLLECTIONS</Link>
                        <Link to="/products" className={navLinkClasses}>ALL SAREES</Link>
                        <div className="relative flex items-center py-4" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                            <button className={`flex items-center gap-x-1.5 ${navLinkClasses}`}><p>SHOP BY FABRIC</p><ChevronDownIcon /></button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 pt-5 w-[50vw] max-w-3xl">
                                    <div className="bg-soft-beige text-charcoal-gray border border-gray-200 shadow-xl p-8">
                                        <div className="grid grid-cols-3 gap-8">
                                            <div className="col-span-1">
                                                <h3 className="font-bold tracking-widest text-sm mb-4">FABRICS</h3>
                                                <ul className="space-y-3 text-xs text-gray-600">{fabricLinks.map(link => <li key={link}><a href="#" className="hover:text-deep-maroon">{link}</a></li>)}</ul>
                                            </div>
                                            {featuredCollections.map(collection => (
                                                <div key={collection.name} className="col-span-1">
                                                    <div className="bg-gray-100 mb-2"><img src={collection.image} alt={collection.name} className="w-full h-full object-cover" /></div>
                                                    <h4 className="text-xs tracking-wider text-center">{collection.name}</h4>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </nav>
                </div>
                 <div className="w-1/3 flex justify-center">
                    <Link to="/" className="flex items-center">
                        <h1
                            className={`relative text-5xl font-serif tracking-normal ${isOpaque ? 'text-deep-maroon' : 'text-white'}`}
                            style={!isOpaque ? { textShadow: '1px 1px 5px rgba(0,0,0,0.3)' } : {}}
                        >
                            Neera
                            <img src="/Lotus.png" alt="Neera Lotus" className="absolute -top-6 -right-4 w-14 h-auto" />
                        </h1>
                    </Link>
                </div>
                <div className="w-1/3 flex items-center justify-end gap-x-4">
                    <div className={iconContainerClasses}>
                        <SearchIcon className="w-4 h-4 opacity-75 mr-2" />
                        <input
                            type="text"
                            placeholder="Search..."
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                if (e.target.value) {
                                    navigate('/products');
                                }
                            }}
                            className="bg-transparent text-sm placeholder-current placeholder-opacity-75 focus:outline-none w-24 font-sans"
                        />
                    </div>
                    {session ? (
                        <>
                            <Link to="/profile" className={navLinkClasses}><UserIcon className="w-5 h-5" /></Link>
                            <button onClick={handleLogout} className={navLinkClasses}><p className="text-xs tracking-widest">LOGOUT</p></button>
                        </>
                    ) : (
                        <Link to="/auth" className={navLinkClasses}><UserIcon className="w-5 h-5" /></Link>
                    )}
                    <Link to="/cart" className={`${navLinkClasses} relative`}>
                        <ShoppingBagIcon className="w-5 h-5" />
                        {cartItemCount > 0 && (
                            <span className={`absolute -top-1 -right-2 bg-lotus-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center`}>
                                {cartItemCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

const Hero = () => (
    <section className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/Maroon saree with dark bg.png')" }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="relative z-10 max-w-screen-2xl mx-auto px-4 sm:px-8 w-full">
            <div className="max-w-xl text-left">
                <h1 className="text-6xl lg:text-8xl font-serif text-white leading-tight tracking-tight mb-6" style={{ textShadow: '2px 2px 20px rgba(0,0,0,0.5)' }}>
                    Timeless
                    <br />
                    Tradition
                </h1>
                <p className="text-lg text-gray-200 mb-10 max-w-md border-l-2 border-lotus-gold pl-6" style={{ textShadow: '1px 1px 10px rgba(0,0,0,0.7)' }}>
                    Carry the grace of tradition in a modern style.
                </p>
                <Link
                   to="/products"
                   className="group relative inline-block text-sm font-semibold tracking-widest text-deep-maroon uppercase bg-soft-beige px-12 py-4 overflow-hidden transition-colors duration-300 hover:bg-lotus-gold hover:text-white shadow-lg"
                >
                    <span className="relative z-10">Explore Collection</span>
                </Link>
            </div>
        </div>
    </section>
);

const SectionTitle = ({ title }) => ( <div className="text-center my-12"> <h2 className="text-3xl font-serif tracking-[0.2em] text-black inline-block relative"> <span className="absolute top-1/2 -left-20 w-16 h-px bg-gray-400"></span> {title} <span className="absolute top-1/2 -right-20 w-16 h-px bg-gray-400"></span> </h2> </div> );

const ProductGrid = ({ products, isAllSareesPage = false, sortOption, setSortOption }) => {
    return (
        <div className={`bg-soft-beige ${isAllSareesPage ? 'pt-32' : ''}`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12">
                {isAllSareesPage && (
                    <div className="flex justify-end items-center mb-8 border-y border-gray-200 py-4 font-sans text-xs">
                        <div className="flex items-center gap-x-6">
                            <span className="text-gray-500 tracking-wider">{products.length} PRODUCTS</span>
                            <div className="relative">
                                <select
                                    id="sort"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="bg-soft-beige border border-gray-300 rounded-sm text-charcoal-gray text-xs tracking-wider py-2 pl-3 pr-8 focus:outline-none focus:border-deep-maroon appearance-none"
                                >
                                    <option value="newest">Sort by: Newest</option>
                                    <option value="price-asc">Sort by: Price Low to High</option>
                                    <option value="price-desc">Sort by: Price High to Low</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDownIcon className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <a href={`/product/${product.id}`} target="_blank" rel="noopener noreferrer" key={product.id} className="group text-center cursor-pointer">
                            <div className="overflow-hidden bg-gray-100 mb-4 aspect-[3/4]">
                                <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${product.image?.includes('Blue purple') || product.image?.includes('Bhagalpuri') ? 'object-top' : 'object-center'} transition-transform duration-500 group-hover:scale-105`} />
                            </div>
                            <h3 className="text-sm text-charcoal-gray font-serif tracking-wide">{product.name}</h3>
                            <p className="text-md text-deep-maroon font-sans font-semibold">₹ {product.price}</p>
                        </a>
                    ))}
                </div>
                {!isAllSareesPage && (
                    <div className="text-right mt-8">
                        <Link to="/products" className="font-sans text-sm tracking-widest text-charcoal-gray hover:text-deep-maroon underline">VIEW ALL SAREES</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

const Footer = () => {
    const location = useLocation();
    // Do not render footer on auth or order confirmation pages
    if (['/auth', '/order-confirmation'].includes(location.pathname)) {
        return null;
    }
    return (
     <footer className="bg-brand-dark text-gray-400 font-sans"> <div className="max-w-screen-xl mx-auto px-8 py-20"> <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-xs uppercase tracking-wider"> <div> <h5 className="text-white font-semibold mb-6">THE COMPANY</h5> <ul className="space-y-4"> {['About Us', 'Press', 'Sustainability', 'Couture Process', 'Runways', 'Associations', 'Career'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul> </div> <div> <h5 className="text-white font-semibold mb-6">NEED HELP</h5> <ul className="space-y-4"> {['Contact Us', 'Book an Appointment', 'Shipping', "FAQ's", 'Stockist'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul> </div> <div> <h5 className="text-white font-semibold mb-6">LEGAL</h5> <ul className="space-y-4"> {['Privacy & Cookies', 'Fees and Payment', 'Term and Condition'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul> </div> <div> <h5 className="text-white font-semibold mb-6">NEWSLETTER</h5> <div className="relative"> <input type="email" placeholder="Enter your email Address" className="bg-transparent border-b border-gray-600 py-2 w-full focus:outline-none focus:border-white text-white placeholder-gray-500 pr-10" /> <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"> <ChevronRightIcon className="w-5 h-5"/> </button> </div> </div> </div> <div className="border-t border-gray-800 pt-8 mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500"> <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} NEERA. ALL RIGHTS RESERVED.</p> <div className="flex items-center space-x-4"> <button className="border border-gray-700 rounded-full px-4 py-1.5 hover:border-white hover:text-white transition-colors">INR ( INDIA )</button> <a href="#" className="hover:text-white"><InstagramIcon className="w-5 h-5" /></a> <a href="#" className="hover:text-white"><FacebookIcon className="w-5 h-5" /></a> <a href="#" className="hover:text-white"><TwitterIcon className="w-5 h-5" /></a> <a href="#" className="hover:text-white"><PinterestIcon className="w-5 h-5" /></a> </div> </div> </div> </footer>
    );
};

function AppContent({ session }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loadingCart } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            const { data, error } = await supabase.from('products').select('*');
            if (error) {
                setError(error.message);
            } else if (data) {
                const augmentedData = data.map((p, index) => {
                    const prices = [3800, 1900, 4200, 2500, 5500, 3200, 4800, 2900, 6100, 2200];
                    const colorSets = [
                        ['RosePink', 'Gold', 'Maroon'], ['SkyBlue', 'Silver'], ['Crimson', 'Beige'],
                        ['ForestGreen', 'Olive'], ['RoyalBlue', 'Navy'], ['Lavender', 'Orchid'],
                        ['Coral', 'Peach'], ['Charcoal', 'SlateGray'], ['Teal', 'Turquoise'], ['Mustard', 'Yellow']
                    ];
                    return {
                        ...p,
                        price: prices[index % prices.length],
                        colors: colorSets[index % colorSets.length]
                    };
                });
                setProducts(augmentedData);
            }
            setLoading(false);
        };
        fetchProducts();
    }, []);
    
    const handleOrderSuccess = (orderDetails) => {
        setLastOrderDetails(orderDetails);
        navigate('/order-confirmation');
    };

    const displayedProducts = products
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            switch (sortOption) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'newest':
                default:
                    // Assuming higher ID is newer
                    return b.id - a.id;
            }
        });

    // Do not render header on auth or order confirmation pages
    const showHeader = !['/auth', '/order-confirmation'].includes(location.pathname);

    return (
        <div className="font-sans bg-soft-beige">
            {showHeader && <Header session={session} setSearchTerm={setSearchTerm} />}
            <main>
                <Routes>
                    <Route path="/" element={
                        loading || loadingCart ? <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading...</p></div> :
                        error ? <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Error fetching products: {error}</p></div> :
                        <>
                            <Hero />
                            <div className="bg-soft-beige pt-16">
                                <SectionTitle title="NEW COLLECTION" />
                                <ProductGrid products={products.slice(0, 4)} />
                            </div>
                             <div className="bg-soft-beige pt-8">
                                <SectionTitle title="ALL SAREES" />
                                <ProductGrid products={products.slice(4, 8)} />
                            </div>
                        </>
                    } />
                    <Route path="/products" element={<ProductGrid products={displayedProducts} isAllSareesPage={true} sortOption={sortOption} setSortOption={setSortOption} />} />
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
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <CartProvider session={session}>
            <AppContent session={session} />
        </CartProvider>
    );
}