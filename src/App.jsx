import React, { useState } from 'react';

// ICONS - Using inline SVGs for simplicity and performance.
const SearchIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const UserIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ShoppingBagIcon = ({ className = "w-6 h-6" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <path d="M16 10a4 4 0 0 1-8 0"></path>
  </svg>
);

const FilterIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
    </svg>
);

const GridIcon = ({ className = "w-6 h-6" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="3" y="3" width="7" height="7"></rect>
        <rect x="14" y="3" width="7" height="7"></rect>
        <rect x="14" y="14" width="7" height="7"></rect>
        <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
);

// HEADER COMPONENT
const Header = () => {
    return (
        <header className="bg-soft-beige text-charcoal-gray sticky top-0 z-50 border-b border-gray-200">
            {/* Top Tier */}
            <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-4 flex justify-between items-center">
                <div className="hidden md:flex items-center gap-x-6 text-xs tracking-widest font-sans">
                    <a href="#" className="hover:text-black">COUTURE</a>
                    <a href="#" className="hover:text-black">DIFFUSE</a>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2">
                    <h1 className="text-4xl font-serif tracking-[0.2em] text-black">NEERA</h1>
                </div>
                <div className="flex items-center gap-x-4">
                    <div className="hidden sm:flex items-center bg-gray-100 px-3 py-2 rounded-sm">
                        <SearchIcon className="w-4 h-4 text-gray-500 mr-2" />
                        <input type="text" placeholder="saree" className="bg-transparent text-sm placeholder-gray-500 focus:outline-none w-24 font-sans"/>
                    </div>
                    <a href="#" className="hover:text-black transition-colors duration-300"><UserIcon className="w-5 h-5" /></a>
                    <a href="#" className="hover:text-black transition-colors duration-300"><ShoppingBagIcon className="w-5 h-5" /></a>
                </div>
            </div>
            {/* Bottom Tier Navigation */}
            <nav className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-3 flex justify-center items-center gap-x-8 text-xs tracking-widest font-sans border-t border-gray-200">
                <a href="#" className="hover:text-black">NEW IN</a>
                <a href="#" className="hover:text-black">WOMEN</a>
                <a href="#" className="hover:text-black">MEN</a>
                <a href="#" className="hover:text-black">COLLECTIONS</a>
                <a href="#" className="hover:text-black">STARS OF NEERA</a>
                <a href="#" className="hover:text-black">RUNWAYS</a>
                <a href="#" className="hover:text-black">ABOUT</a>
            </nav>
        </header>
    );
};

// PRODUCT GRID COMPONENT
const ProductGrid = () => {
    const products = [
        { id: 1, name: "Obsidian Floral Embroidered Saree", image: "https://placehold.co/600x800/1a1a1a/ffffff?text=Saree+1" },
        { id: 2, name: "Midnight Bloom Sequin Saree", image: "https://placehold.co/600x800/2a2a2a/ffffff?text=Saree+2" },
        { id: 3, name: "Citrus Garden Organza Saree", image: "https://placehold.co/600x800/d4ffb0/000000?text=Saree+3" },
        { id: 4, name: "Mint Green Embroidered Saree", image: "https://placehold.co/600x800/c8f7e1/000000?text=Saree+4" },
        { id: 5, name: "Scarlet Red Georgette Saree", image: "https://placehold.co/600x800/ff6b6b/ffffff?text=Saree+5" },
        { id: 6, name: "Ivory & Gold Chikankari Saree", image: "https://placehold.co/600x800/f0e9e9/000000?text=Saree+6" },
        { id: 7, name: "Royal Blue Velvet Saree", image: "https://placehold.co/600x800/2c3e50/ffffff?text=Saree+7" },
        { id: 8, name: "Pastel Pink Tulle Saree", image: "https://placehold.co/600x800/f8c2c2/000000?text=Saree+8" },
    ];

    return (
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 py-12">
            <h2 className="text-center text-3xl font-serif tracking-[0.2em] text-black mb-8">SAREE</h2>
            
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
                    <div className="flex items-center gap-x-2">
                         <GridIcon className="w-5 h-5 cursor-pointer text-black"/>
                         <GridIcon className="w-4 h-4 cursor-pointer text-gray-400"/>
                    </div>
                </div>
            </div>

            {/* Products */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-1">
                {products.map((product) => (
                    <div key={product.id} className="group text-left p-2">
                        <div className="overflow-hidden bg-gray-100">
                            <img src={product.image} alt={product.name} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
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
    <div className="bg-soft-beige font-sans">
      <Header />
      <main>
        <ProductGrid />
      </main>
      <Footer />
    </div>
  )
}
