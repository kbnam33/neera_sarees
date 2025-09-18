import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { useCart, CartProvider } from './CartContext';
import AuthPage from './AuthPage';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrderConfirmationPage from './OrderConfirmationPage';
import ProfilePage from './ProfilePage';

// ICONS
const SearchIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg> );
const UserIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg> );
const ShoppingBagIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></svg> );
const ChevronDownIcon = ({ className = "w-4 h-4" }) => ( <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m6 9 6 6 6-6"/></svg> );
const ShareIcon = ({ className="w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>);
const HeartIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
const ChevronRightIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg> );
const InstagramIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const FacebookIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>);
const TwitterIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>);
const PinterestIcon = ({className}) => (<svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.28 4.52a9.6 9.6 0 0 0-13.58 0 9.6 9.6 0 0 0 0 13.58 9.6 9.6 0 0 0 13.58 0 9.6 9.6 0 0 0 0-13.58z"></path><path d="M12 2a10 10 0 0 0-10 10c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10z"></path><path d="M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"></path></svg>);

// App Components
const Header = ({ isProductPage, onNavigate, session, setSearchTerm }) => {
    const { cartItems } = useCart();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    
    const isOpaque = isScrolled || isProductPage;
    const headerClasses = `fixed top-0 w-full z-50 transition-all duration-300 ${isOpaque ? 'bg-soft-beige text-charcoal-gray shadow-md' : 'bg-transparent text-white'}`;
    const navLinkClasses = `py-4 transition-colors duration-300 ${isOpaque ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`;
    const iconContainerClasses = `hidden sm:flex items-center px-3 py-2 rounded-sm transition-colors duration-300 ${isOpaque ? 'bg-gray-100 text-charcoal-gray' : 'bg-white/20 text-white'}`;

    const fabricLinks = ["ORGANZA", "VELVET", "CHIFFON", "COTTON SILK", "GEORGETTE", "THE WORLD COLLECTION"];
    const featuredCollections = [
        { name: "Bridal Couture", image: "https://placehold.co/400x500/d1d5db/111827?text=Bridal+Couture" },
        { name: "Summer '24", image: "https://placehold.co/400x500/fef3c7/111827?text=Summer+'24" }
    ];

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if(!error) {
            onNavigate('home');
        }
    };
    
    const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <header className={headerClasses}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
                <div className="w-1/3">
                     <nav className="hidden md:flex items-center justify-start gap-x-8 text-xs tracking-widest font-sans">
                        <button onClick={() => onNavigate('home')} className={navLinkClasses}>NEW COLLECTIONS</button>
                        <button onClick={() => onNavigate('allSarees')} className={navLinkClasses}>ALL SAREES</button>
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
                    <button onClick={() => onNavigate('home')} className="flex items-center">
                        <h1 
                            className="relative text-5xl font-serif tracking-normal text-deep-maroon"
                            style={!isOpaque ? { textShadow: '1px 1px 5px rgba(0,0,0,0.3)' } : {}}
                        >
                            Neera
                            <img src="/Lotus.png" alt="Neera Lotus" className="absolute -top-6 -right-4 w-14 h-auto" />
                        </h1>
                    </button>
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
                                    onNavigate('allSarees');
                                }
                            }}
                            className="bg-transparent text-sm placeholder-current placeholder-opacity-75 focus:outline-none w-24 font-sans" 
                        />
                    </div>
                    {session ? (
                        <>
                            <button onClick={() => onNavigate('profile')} className={navLinkClasses}><UserIcon className="w-5 h-5" /></button>
                            <button onClick={handleLogout} className={navLinkClasses}><p className="text-xs tracking-widest">LOGOUT</p></button>
                        </>
                    ) : (
                        <button onClick={() => onNavigate('auth')} className={navLinkClasses}><UserIcon className="w-5 h-5" /></button>
                    )}
                    <button onClick={() => onNavigate('cart')} className={`${navLinkClasses} relative`}>
                        <ShoppingBagIcon className="w-5 h-5" />
                        {cartItemCount > 0 && (
                            <span className="absolute -top-1 -right-2 bg-lotus-gold text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                {cartItemCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>
        </header>
    );
};

const Hero = () => (
    <section className="relative h-screen bg-cover bg-center flex items-center" style={{ backgroundImage: "url('/maroon saree plain.png')" }}>
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
                <a href="#"
                   className="group relative inline-block text-sm font-semibold tracking-widest text-deep-maroon uppercase bg-soft-beige px-12 py-4 overflow-hidden transition-colors duration-300 hover:bg-lotus-gold hover:text-white shadow-lg"
                >
                    <span className="relative z-10">Explore Collection</span>
                </a>
            </div>
        </div>
    </section>
);

const SectionTitle = ({ title }) => ( <div className="text-center my-12"> <h2 className="text-3xl font-serif tracking-[0.2em] text-black inline-block relative"> <span className="absolute top-1/2 -left-20 w-16 h-px bg-gray-400"></span> {title} <span className="absolute top-1/2 -right-20 w-16 h-px bg-gray-400"></span> </h2> </div> );

const ProductGrid = ({ onProductSelect, products, isAllSareesPage = false, onNavigate, sortOption, setSortOption }) => {
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
                        <div key={product.id} className="group text-center cursor-pointer" onClick={() => onProductSelect(product)}>
                            <div className="overflow-hidden bg-gray-100 mb-4 aspect-[3/4]">
                                <img src={product.image} alt={product.name} className={`w-full h-full object-cover ${product.image?.includes('Blue purple') || product.image?.includes('Bhagalpuri') ? 'object-top' : 'object-center'} transition-transform duration-500 group-hover:scale-105`} />
                            </div>
                            <h3 className="text-sm text-charcoal-gray font-serif tracking-wide">{product.name}</h3>
                            <p className="text-md text-deep-maroon font-sans font-semibold">₹ {product.price}</p>
                        </div>
                    ))}
                </div>
                {!isAllSareesPage && (
                    <div className="text-right mt-8">
                        <button onClick={() => onNavigate('allSarees')} className="font-sans text-sm tracking-widest text-charcoal-gray hover:text-deep-maroon underline">VIEW ALL SAREES</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProductInfoAccordion = () => { const [activeTab, setActiveTab] = useState('DETAILS'); const content = { DETAILS: { title: 'DETAILS', text: 'This is a three-piece look. Kindly note, product tones may vary due to lighting. For queries or customizations, please mail us at: orders@neerasarees.in' }, CARE: { title: 'CARE INSTRUCTIONS', text: 'Dry clean only. Store in a cool, dry place. Avoid direct exposure to sunlight to maintain the vibrancy of the fabric.' }, SHIPPING: { title: 'SHIPPING & RETURNS', text: 'Complimentary shipping within India. For international orders, shipping charges and duties may apply. Returns are accepted within 14 days of receipt for unused items.' } }; return ( <div className="border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-3 gap-8"> <div className="md:col-span-1 flex flex-col gap-y-2 font-sans text-xs tracking-widest"> {Object.keys(content).map(key => ( <button key={key} onClick={() => setActiveTab(key)} className={`text-left p-2 transition-colors flex justify-between items-center w-full ${activeTab === key ? 'text-deep-maroon font-bold' : 'text-gray-500 hover:text-charcoal-gray'}`}> <span>{content[key].title}</span> <ChevronRightIcon className={`w-4 h-4 transition-transform ${activeTab === key ? 'transform rotate-90 md:rotate-0' : ''}`}/> </button> ))} </div> <div className="md:col-span-2 text-sm text-gray-700"> <p>{content[activeTab].text}</p> </div> </div> ); }

const ProductPage = ({ product, onBack, onProductSelect, products, onNavigate, session, setPostLoginNavigate, setProductToBuyNow }) => {
    const { addToCart } = useCart();
    const [mainImage, setMainImage] = useState(product.images ? product.images[0] : '');
    const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);

    useEffect(() => {
        setMainImage(product.images ? product.images[0] : '');
        setSelectedColor(product.colors ? product.colors[0] : null);
    }, [product]);
    
    const handleAddToCart = () => {
        addToCart(product);
    };

    const handleBuyNow = () => {
        if (session) {
            addToCart(product);
            onNavigate('checkout');
        } else {
            setProductToBuyNow(product);
            setPostLoginNavigate('checkout');
            onNavigate('auth');
        }
    };

    return (
        <div className="bg-soft-beige">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 pt-32">
                <button onClick={onBack} className="font-sans text-xs tracking-widest mb-8 text-gray-500 hover:text-black">
                    &larr; BACK TO COLLECTION
                </button>
                <div className="grid md:grid-cols-2 gap-12 lg:gap-24">
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        <div className="flex md:flex-col gap-4">
                            {product.images && product.images.map((img, index) => (
                                <img key={index} src={img} alt={`${product.name} ${index + 1}`} className={`w-20 h-auto object-cover cursor-pointer border ${mainImage === img ? 'border-deep-maroon' : 'border-gray-300'}`} onMouseEnter={() => setMainImage(img)} />
                            ))}
                        </div>
                        <div className="flex-1"><img src={mainImage} alt={product.name} className="w-full h-auto object-cover" /></div>
                    </div>
                    <div className="font-sans">
                        <h1 className="text-3xl font-serif text-deep-maroon mb-4">{product.name}</h1>
                        <p className="text-2xl text-charcoal-gray mb-6">₹ {product.price}</p>
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-gray-600">Color: <span className="font-semibold">{selectedColor}</span></p>
                            <div className="flex gap-x-4">
                                <button className="p-2 hover:bg-gray-200 rounded-full"><ShareIcon className="w-5 h-5 text-gray-600" /></button>
                                <button className="p-2 hover:bg-gray-200 rounded-full"><HeartIcon className="w-5 h-5 text-gray-600" /></button>
                            </div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-8">{product.description}</p>
                        <div className="mb-8">
                            <p className="text-sm font-semibold mb-2 tracking-widest">COLOR</p>
                            <div className="flex gap-x-2">
                                {product.colors && product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-deep-maroon scale-110' : 'border-gray-300'}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">Made to order: 7 - 8 Weeks</p>
                        <div className="flex gap-x-4">
                            <button onClick={handleAddToCart} className="flex-1 bg-deep-maroon text-white py-3 tracking-widest hover:bg-lotus-gold transition-colors duration-300">ADD TO CART</button>
                            <button onClick={handleBuyNow} className="flex-1 border border-charcoal-gray text-charcoal-gray py-3 tracking-widest hover:bg-charcoal-gray hover:text-white transition-colors duration-300">BUY NOW</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
                <ProductInfoAccordion />
                <div className="mt-24">
                    <h2 className="text-center text-2xl font-serif tracking-[0.2em] text-black mb-8">YOU MAY ALSO LIKE</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {relatedProducts.map(relProduct => (
                            <div key={relProduct.id} className="group text-center cursor-pointer" onClick={() => onProductSelect(relProduct)}>
                                <div className="overflow-hidden bg-gray-100 mb-4 aspect-[3/4]">
                                    <img src={relProduct.image} alt={relProduct.name} className={`w-full h-full object-cover ${relProduct.image?.includes('Blue purple') || relProduct.image?.includes('Bhagalpuri') ? 'object-top' : 'object-center'} transition-transform duration-500 group-hover:scale-105`} />
                                </div>
                                <h3 className="text-sm text-charcoal-gray font-serif tracking-wide">{relProduct.name}</h3>
                                <p className="text-md text-deep-maroon font-sans font-semibold">₹ {relProduct.price}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Footer = () => ( <footer className="bg-brand-dark text-gray-400 font-sans"> <div className="max-w-screen-xl mx-auto px-8 py-20"> <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-xs uppercase tracking-wider"> <div> <h5 className="text-white font-semibold mb-6">THE COMPANY</h5> <ul className="space-y-4"> {['About Us', 'Press', 'Sustainability', 'Couture Process', 'Runways', 'Associations', 'Career'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul> </div> <div> <h5 className="text-white font-semibold mb-6">NEED HELP</h5> <ul className="space-y-4"> {['Contact Us', 'Book an Appointment', 'Shipping', "FAQ's", 'Stockist'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul> </div> <div> <h5 className="text-white font-semibold mb-6">LEGAL</h5> <ul className="space-y-4"> {['Privacy & Cookies', 'Fees and Payment', 'Term and Condition'].map(item => (<li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>))} </ul> </div> <div> <h5 className="text-white font-semibold mb-6">NEWSLETTER</h5> <div className="relative"> <input type="email" placeholder="Enter your email Address" className="bg-transparent border-b border-gray-600 py-2 w-full focus:outline-none focus:border-white text-white placeholder-gray-500 pr-10" /> <button className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"> <ChevronRightIcon className="w-5 h-5"/> </button> </div> </div> </div> <div className="border-t border-gray-800 pt-8 mt-16 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-500"> <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} NEERA. ALL RIGHTS RESERVED.</p> <div className="flex items-center space-x-4"> <button className="border border-gray-700 rounded-full px-4 py-1.5 hover:border-white hover:text-white transition-colors">INR ( INDIA )</button> <a href="#" className="hover:text-white"><InstagramIcon className="w-5 h-5" /></a> <a href="#" className="hover:text-white"><FacebookIcon className="w-5 h-5" /></a> <a href="#" className="hover:text-white"><TwitterIcon className="w-5 h-5" /></a> <a href="#" className="hover:text-white"><PinterestIcon className="w-5 h-5" /></a> </div> </div> </div> </footer> );

function AppContent({ session }) {
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { cartItems, addToCart, loadingCart } = useCart();
    
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('newest');
    const [lastOrderDetails, setLastOrderDetails] = useState(null);
    const [postLoginNavigate, setPostLoginNavigate] = useState(null);
    const [productToBuyNow, setProductToBuyNow] = useState(null);

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

    useEffect(() => { 
        window.scrollTo(0, 0); 
        if (session && currentPage === 'auth') {
            if (productToBuyNow) {
                addToCart(productToBuyNow);
                setProductToBuyNow(null);
            }
            if (postLoginNavigate) {
                setCurrentPage(postLoginNavigate);
                setPostLoginNavigate(null); 
            } else {
                setCurrentPage('home');
            }
        }
    }, [currentPage, session, postLoginNavigate, productToBuyNow, addToCart]);
    
    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSelectedProduct(null);
    };

    const handleProductSelect = (product) => {
        setSelectedProduct(product);
        setCurrentPage('product');
    };

    const handleOrderSuccess = (orderDetails) => {
        setLastOrderDetails(orderDetails);
        handleNavigate('orderConfirmation');
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
                    return b.id - a.id; 
            }
        });

    const renderPage = () => {
        switch (currentPage) {
            case 'auth': return <AuthPage onNavigate={handleNavigate} />;
            case 'profile': return <ProfilePage session={session} />;
            case 'orderConfirmation': return <OrderConfirmationPage onNavigate={handleNavigate} order={lastOrderDetails} />;
            case 'product': return <ProductPage product={selectedProduct} onBack={() => handleNavigate('allSarees')} onProductSelect={handleProductSelect} products={products} onNavigate={handleNavigate} session={session} setPostLoginNavigate={setPostLoginNavigate} setProductToBuyNow={setProductToBuyNow} />;
            case 'allSarees': return <ProductGrid onProductSelect={handleProductSelect} products={displayedProducts} isAllSareesPage={true} onNavigate={handleNavigate} sortOption={sortOption} setSortOption={setSortOption} />;
            case 'cart': return <CartPage onNavigate={handleNavigate} session={session} />;
            case 'checkout': return <CheckoutPage onNavigate={handleNavigate} session={session} onOrderSuccess={handleOrderSuccess} />;
            case 'home':
            default:
                if (loading || loadingCart) {
                    return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading...</p></div>;
                }
                if (error) {
                    return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Error fetching products: {error}</p></div>;
                }
                return (
                    <>
                        <Hero />
                        <div className="bg-soft-beige pt-16">
                            <SectionTitle title="NEW COLLECTION" />
                            <ProductGrid onProductSelect={handleProductSelect} products={products.slice(0, 4)} onNavigate={handleNavigate} />
                        </div>
                         <div className="bg-soft-beige pt-8">
                            <SectionTitle title="ALL SAREES" />
                            <ProductGrid onProductSelect={handleProductSelect} products={products.slice(4, 8)} onNavigate={handleNavigate} />
                        </div>
                    </>
                );
        }
    }

    return (
        <div className="font-sans bg-soft-beige">
            {currentPage !== 'auth' && currentPage !== 'orderConfirmation' && 
                <Header 
                    isProductPage={['product', 'allSarees', 'cart', 'checkout', 'profile'].includes(currentPage)} 
                    onNavigate={handleNavigate} 
                    session={session} 
                    setSearchTerm={setSearchTerm}
                />
            }
            <main>{renderPage()}</main>
            {currentPage !== 'auth' && currentPage !== 'orderConfirmation' && currentPage !== 'checkout' && <Footer />}
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