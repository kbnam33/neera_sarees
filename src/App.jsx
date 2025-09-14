import React, { useState, useEffect } from 'react';

// ICONS - Using new, robust inline SVGs for clean rendering.
const SearchIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
    <path d="M3 6h18" />
    <path d="M16 10a4 4 0 0 1-8 0" />
  </svg>
);

const FilterIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="21" x2="4" y2="14" /><line x1="4" y1="10" x2="4" y2="3" /><line x1="12" y1="21" x2="12" y2="12" /><line x1="12" y1="8" x2="12" y2="3" /><line x1="20" y1="21" x2="20" y2="16" /><line x1="20" y1="12" x2="20" y2="3" /><line x1="1" y1="14" x2="7" y2="14" /><line x1="9" y1="8" x2="15" y2="8" /><line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const ChevronDownIcon = ({ className = "w-4 h-4" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="m6 9 6 6 6-6"/>
    </svg>
);


// HEADER COMPONENT with Mega Menu
const Header = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const fabricLinks = [
        "ORGANZA", "VELVET", "CHIFFON", "COTTON SILK", "GEORGETTE", "THE WORLD COLLECTION"
    ];

    const featuredCollections = [
        { name: "Bridal Couture", image: "https://placehold.co/400x500/d1d5db/111827?text=Bridal+Couture" },
        { name: "Summer '24", image: "https://placehold.co/400x500/fef3c7/111827?text=Summer+'24" }
    ];

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-soft-beige text-charcoal-gray shadow-md' : 'bg-transparent text-white'}`}>
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
                
                {/* Left: Navigation */}
                <div className="w-1/3">
                    <nav className="hidden md:flex items-center justify-start gap-x-8 text-xs tracking-widest font-sans">
                        <a href="#" className={`py-4 transition-colors duration-300 ${isScrolled ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`}>NEW COLLECTIONS</a>
                        <a href="#" className={`py-4 transition-colors duration-300 ${isScrolled ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`}>ALL SAREES</a>
                        <div className="relative flex items-center py-4" onMouseEnter={() => setIsDropdownOpen(true)} onMouseLeave={() => setIsDropdownOpen(false)}>
                            <button className={`flex items-center gap-x-1.5 transition-colors duration-300 ${isScrolled ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`}>
                                SHOP BY FABRIC
                                <ChevronDownIcon />
                            </button>
                            {isDropdownOpen && (
                                <div className="absolute top-full left-0 pt-5 w-[50vw] max-w-3xl">
                                   <div className="bg-soft-beige text-charcoal-gray border border-gray-200 shadow-xl p-8">
                                    <div className="grid grid-cols-3 gap-8">
                                        {/* Column 1: Links */}
                                        <div className="col-span-1">
                                            <h3 className="font-bold tracking-widest text-sm mb-4">FABRICS</h3>
                                            <ul className="space-y-3 text-xs text-gray-600">
                                                {fabricLinks.map(link => (
                                                    <li key={link}><a href="#" className="hover:text-deep-maroon">{link}</a></li>
                                                ))}
                                            </ul>
                                        </div>
                                        {/* Columns 2 & 3: Images */}
                                        {featuredCollections.map(collection => (
                                            <div key={collection.name} className="col-span-1">
                                                <div className="bg-gray-100 mb-2">
                                                     <img src={collection.image} alt={collection.name} className="w-full h-full object-cover" />
                                                </div>
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

                {/* Center: Logo */}
                <div className="w-1/3 flex justify-center">
                    <a href="/" className="flex items-center">
                        <h1 className={`relative text-5xl font-serif tracking-normal transition-colors duration-300 ${isScrolled ? 'text-deep-maroon' : 'text-white'}`}>
                            Neera
                            <img 
                                src="/Lotus.png" 
                                alt="Neera Lotus" 
                                className="absolute -top-2 -right-1 w-7 h-auto" 
                            />
                        </h1>
                    </a>
                </div>

                {/* Right: Icons & Search */}
                <div className="w-1/3 flex items-center justify-end gap-x-4">
                    <div className={`hidden sm:flex items-center px-3 py-2 rounded-sm transition-colors duration-300 ${isScrolled ? 'bg-gray-100' : 'bg-white/20'}`}>
                        <SearchIcon className="w-4 h-4 text-inherit opacity-75 mr-2" />
                        <input type="text" placeholder="saree" className="bg-transparent text-sm placeholder-current placeholder-opacity-75 focus:outline-none w-24 font-sans"/>
                    </div>
                    <a href="#" className={`transition-colors duration-300 ${isScrolled ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`}><UserIcon className="w-5 h-5" /></a>
                    <a href="#" className={`transition-colors duration-300 ${isScrolled ? 'hover:text-deep-maroon' : 'hover:opacity-75'}`}><ShoppingBagIcon className="w-5 h-5" /></a>
                </div>
            </div>
        </header>
    );
};

// HERO COMPONENT
const Hero = () => {
    return (
        <section 
            className="relative h-screen bg-cover bg-center flex items-center" 
            style={{ backgroundImage: "url('/maroon saree plain.png')" }}
        >
            {/* Gradient Overlay to enhance text visibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
            
            {/* Content Container */}
            <div className="relative z-10 text-left max-w-2xl px-4 sm:px-8 md:px-16 lg:px-24">
                <h1 className="text-5xl lg:text-7xl font-serif text-white leading-tight mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
                    The Art of Drape
                </h1>
                <p className="text-gray-200 mb-8 text-lg max-w-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.6)'}}>
                    Each saree in our collection is a testament to the timeless beauty of Indian craftsmanship. Woven with passion, designed for the modern woman.
                </p>
                <a 
                    href="#" 
                    className="inline-block bg-soft-beige text-deep-maroon font-sans tracking-widest text-sm px-10 py-3 hover:bg-opacity-90 transition-colors duration-300 shadow-lg"
                >
                    DISCOVER THE STORY
                </a>
            </div>
        </section>
    );
};

// PRODUCT GRID COMPONENT
const ProductGrid = () => {
    const products = [
        { id: 1, name: "Light Blue Mangalagiri Saree", price: "Rs 1500", image: "/New light blue.png" },
        { id: 2, name: "Midnight Bloom Sequin Saree", price: "Rs 2500", image: "https://placehold.co/600x800/2a2a2a/ffffff?text=Saree+2" },
        { id: 3, name: "Citrus Garden Organza Saree", price: "Rs 1800", image: "https://placehold.co/600x800/d4ffb0/000000?text=Saree+3" },
        { id: 4, name: "Mint Green Embroidered Saree", price: "Rs 2200", image: "https://placehold.co/600x800/c8f7e1/000000?text=Saree+4" },
        { id: 5, name: "Scarlet Red Georgette Saree", price: "Rs 1950", image: "https://placehold.co/600x800/ff6b6b/ffffff?text=Saree+5" },
        { id: 6, name: "Ivory & Gold Chikankari Saree", price: "Rs 3200", image: "https://placehold.co/600x800/f0e9e9/000000?text=Saree+6" },
        { id: 7, name: "Royal Blue Velvet Saree", price: "Rs 2800", image: "https://placehold.co/600x800/2c3e50/ffffff?text=Saree+7" },
        { id: 8, name: "Pastel Pink Tulle Saree", price: "Rs 1600", image: "https://placehold.co/600x800/f8c2c2/000000?text=Saree+8" },
    ];

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12 bg-soft-beige">
            <h2 className="text-center text-3xl font-serif tracking-[0.2em] text-black mb-8">THE COLLECTION</h2>
            
            {/* Filter and Sort Bar */}
            <div className="flex justify-between items-center mb-8 border-y border-gray-200 py-4 font-sans text-xs">
                <button className="flex items-center gap-x-2 tracking-widest">
                    <FilterIcon className="w-4 h-4"/>
                    SHOW FILTERS
                </button>
                <div className="flex items-center gap-x-6">
                    <span className="text-gray-500 tracking-wider">357 LOOKS</span>
                    <div className="flex items-center gap-x-2">
                        <label htmlFor="sort" className="text-gray-500 tracking-wider">SORT BY</label>
                        <select id="sort" className="bg-transparent focus:outline-none">
                            <option>Newest</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="group text-center">
                        <div className="overflow-hidden bg-gray-100 mb-4 aspect-[3/4]">
                            <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        </div>
                        <h3 className="text-sm text-charcoal-gray font-serif tracking-wide">{product.name}</h3>
                        <p className="text-md text-deep-maroon font-sans font-semibold">{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


// FOOTER COMPONENT
const Footer = () => (
    <footer className="bg-charcoal-gray text-gray-300 font-sans">
        <div className="max-w-screen-xl mx-auto px-4 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 text-sm">
                <div>
                    <h5 className="text-white font-semibold tracking-wider mb-4">SHOP</h5>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-white">New Arrivals</a></li>
                        <li><a href="#" className="hover:text-white">Sarees</a></li>
                        <li><a href="#" className="hover:text-white">Lehengas</a></li>
                        <li><a href="#" className="hover:text-white">Gowns</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-white font-semibold tracking-wider mb-4">ABOUT NEERA</h5>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-white">Our Story</a></li>
                        <li><a href="#" className="hover:text-white">Craftsmanship</a></li>
                        <li><a href="#" className="hover:text-white">Careers</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-white font-semibold tracking-wider mb-4">CUSTOMER CARE</h5>
                    <ul className="space-y-3">
                        <li><a href="#" className="hover:text-white">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white">FAQs</a></li>
                        <li><a href="#" className="hover:text-white">Shipping & Returns</a></li>
                        <li><a href="#" className="hover:text-white">Terms & Conditions</a></li>
                    </ul>
                </div>
                <div>
                    <h5 className="text-white font-semibold tracking-wider mb-4">EXCLUSIVE UPDATES</h5>
                    <p className="mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
                    <div className="flex">
                        <input type="email" placeholder="Enter your email" className="bg-gray-800 border border-gray-700 p-2 w-full focus:outline-none focus:border-lotus-gold text-white placeholder-gray-500" />
                        <button className="bg-lotus-gold text-charcoal-gray px-4 font-semibold tracking-wider hover:bg-amber-300 transition-colors duration-300">JOIN</button>
                    </div>
                </div>
            </div>
             <div className="border-t border-gray-700 pt-8 mt-8 text-center text-xs text-gray-500">
                <p>&copy; {new Date().getFullYear()} Neera. All Rights Reserved.</p>
            </div>
        </div>
    </footer>
);


// MAIN APP COMPONENT
export default function App() {
  return (
    <div className="font-sans bg-soft-beige">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  )
}