import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from './CartContext';
import ProductImage from './components/ProductImage.jsx';

// --- ICONS ---
const ChevronRightIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg> );

// Helper function to format color names for CSS
const formatCssColor = (colorName) => {
  if (!colorName) return 'transparent';
  // Removes spaces and converts to lower case. E.g., "Dark Blue" -> "darkblue"
  return colorName.replace(/\s+/g, '').toLowerCase();
};

// --- SWIPEABLE IMAGE CAROUSEL FOR MOBILE ---
const ProductImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const sliderRef = useRef(null);

    const handleTouchStart = (e) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 75) { // Min swipe distance
            setCurrentIndex(prevIndex => prevIndex === images.length - 1 ? prevIndex : prevIndex + 1);
        }

        if (touchStartX.current - touchEndX.current < -75) { // Min swipe distance
            setCurrentIndex(prevIndex => prevIndex === 0 ? 0 : prevIndex - 1);
        }
    };

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    return (
        <div className="relative overflow-hidden w-full bg-gray-100">
            <div
                ref={sliderRef}
                className="flex transition-transform duration-300 ease-in-out"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((img, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        <img src={img} alt={`${productName} view ${index + 1}`} className="w-full h-full object-cover aspect-[3/4]" />
                    </div>
                ))}
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${currentIndex === index ? 'bg-white scale-125' : 'bg-white/50'}`}
                    />
                ))}
            </div>
        </div>
    );
};


// --- PRODUCT INFO TABS ---
const ProductInfoTabs = ({product}) => {
    const [activeTab, setActiveTab] = useState('DETAILS');

    // --- MODIFICATION: Tabs now read from product properties with fallbacks ---
    const tabs = {
        DETAILS: { 
            title: 'Details & Craftsmanship', 
            // This reads from product.description. If it's empty, it shows the default text.
            text: product.description || 'This exquisite piece is handcrafted by master artisans, featuring traditional weaving techniques passed down through generations. Made from the finest silk, its unique texture and drape are a testament to its quality. Kindly note, product tones may vary slightly due to the natural dyeing process and lighting.' 
        },
        CARE: { 
            title: 'Care Instructions', 
            // This reads from product.care_instructions. If it's empty, it shows the default text.
            text: product.care_instructions || 'To preserve the beauty of your saree, we recommend dry cleaning only. Store in a cool, dry place away from direct sunlight. Fold carefully and avoid using metal hangers to maintain the integrity of the fabric.' 
        },
        SHIPPING: { 
            title: 'Shipping & Returns', 
            // This reads from product.shipping_returns. If it's empty, it shows the default text.
            text: product.shipping_returns || 'Enjoy complimentary shipping within India. For international orders, charges and duties may apply. We only offer exchanges for products that are defective or damaged upon receipt. Please refer to our detailed Refund and Exchange Policy for more information.'
        }
    };
    // --- END MODIFICATION ---

    return (
        <div className="mt-16">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                    {Object.keys(tabs).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`${
                                activeTab === key
                                    ? 'border-deep-maroon text-deep-maroon'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-serif text-sm md:text-md transition-colors duration-300 focus:outline-none`}
                        >
                            {tabs[key].title}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="py-8">
                <p className="text-sm text-gray-600 leading-relaxed max-w-prose animate-fadeIn">
                    {tabs[activeTab].text}
                </p>
            </div>
        </div>
    );
};


// --- PRODUCT PAGE ---
const ProductPage = ({ allProducts, session }) => {
    const { slug } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        if (allProducts.length > 0 && slug) {
            const foundProduct = allProducts.find(p => p.slug === slug);

            if (foundProduct) {
                setProduct(foundProduct);
                setSelectedColor(foundProduct.colors ? foundProduct.colors[0] : null);
                if (foundProduct.images && foundProduct.images.length > 0) {
                    setMainImage(foundProduct.images[0]);
                }
            } else {
                navigate('/products', { replace: true });
            }
        }
    }, [slug, allProducts, navigate]);

    const handleAddToCart = () => { if(product) addToCart(product); };
    
    const handleBuyNow = () => {
        if (product) {
            addToCart(product);
            if (session) {
                navigate('/checkout');
            } else {
                navigate('/auth', { state: { from: { pathname: '/checkout' } } });
            }
        }
    };
    
    if (!product) {
        return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading Product...</p></div>;
    }

    const relatedProducts = allProducts
        .filter(p => p.id !== product.id && p.fabric_type === product.fabric_type)
        .slice(0, 4);

    // Truncate description for meta tag
    const metaDescription = product.description 
        ? (product.description.length > 160 ? product.description.substring(0, 157) + '...' : product.description)
        : 'Discover beautiful, handwoven sarees from Neera.';

    return (
        <div className="bg-soft-beige pt-16">
            <Helmet>
                <title>{`${product.name} - Neera`}</title>
                <meta name="description" content={metaDescription} />
            </Helmet>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pb-16">
                 <div className="mb-8 font-sans text-xs tracking-widest text-gray-500">
                    <Link to="/products" className="hover:text-black">All Sarees</Link>
                    <span> / </span>
                    <Link to={`/fabric/${product.fabric_type}`} className="hover:text-black capitalize">{product.fabric_type}</Link>
                 </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 lg:gap-y-0">
                    {/* --- Image Section --- */}
                    <div className="w-full">
                        {/* Mobile Carousel */}
                        <div className="lg:hidden">
                            {product.images && product.images.length > 0 ? (
                                <ProductImageCarousel images={product.images} productName={product.name} />
                            ) : (
                                <div className="bg-gray-100"><img src={'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera'} alt={product.name} className="w-full h-full object-cover aspect-[3/4]" /></div>
                            )}
                        </div>

                        {/* Desktop Thumbnails */}
                        <div className="hidden lg:block">
                            <div className="bg-gray-100 mb-4">
                                <img src={mainImage} alt={product.name} className="w-full h-full object-cover aspect-[3/4]" />
                            </div>
                            <div className="flex gap-4">
                                {product.images && product.images.map((img, index) => (
                                    <div key={index} className="w-24 h-32 bg-gray-100 cursor-pointer" onMouseEnter={() => setMainImage(img)}>
                                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className={`w-full h-full object-cover transition-opacity duration-300 ${mainImage === img ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     {/* --- Details Section --- */}
                    <div className="w-full lg:sticky top-28 self-start">
                        <h1 className="text-4xl lg:text-5xl font-serif text-deep-maroon leading-tight">{product.name}</h1>
                        
                        {/* --- MODIFICATION: Using product.short_description --- */}
                        <p className="text-md text-charcoal-gray/80 mt-3 mb-6 max-w-prose">
                            {/* This now reads from the database FIRST, then shows the fallback text */}
                            {product.short_description || 'A timeless piece of artistry, this saree is handwoven with passion and precision, embodying both tradition and modernity.'}
                        </p>
                        {/* --- END MODIFICATION --- */}

                        <p className="text-2xl text-charcoal-gray mb-10 font-sans tracking-wide">₹ {product.price.toFixed(2)}</p>
                        
                        <div className="border-y border-gray-200 py-8">
                            <dl className="space-y-6">
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <dt className="text-sm font-semibold text-charcoal-gray tracking-wider uppercase col-span-1">FABRIC</dt>
                                    <dd className="text-md text-charcoal-gray/90 capitalize col-span-2">{product.fabric_type}</dd>
                                </div>
                                {product.colors && product.colors.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt className="text-sm font-semibold text-charcoal-gray tracking-wider uppercase col-span-1 self-start pt-1">COLOR</dt>
                                        <dd className="col-span-2">
                                            <p className="text-md text-charcoal-gray/90 capitalize mb-3">{selectedColor}</p>
                                            <div className="flex flex-wrap gap-3">
                                                {product.colors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-8 h-8 rounded-full transition-all duration-200 ease-in-out border-2 shadow-sm hover:shadow-md focus:outline-none ${selectedColor === color ? 'ring-2 ring-offset-2 ring-deep-maroon border-white' : 'border-gray-300'}`}
                                                        style={{ backgroundColor: formatCssColor(color) }}
                                                        title={color}
                                                    >
                                                        <span className="sr-only">{color}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                        
                        <div className="mt-8">
                             <p className="text-xs text-gray-600 mb-6">
                                <strong>Please note:</strong> The actual product color may vary by 2-5% from the image displayed due to differences in screen resolution and lighting.
                            </p>
                            <div className="space-y-4">
                                <button onClick={handleAddToCart} className="w-full bg-deep-maroon text-white py-4 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300">Add to Bag</button>
                                <button onClick={handleBuyNow} className="w-full border border-charcoal-gray text-charcoal-gray py-4 tracking-widest uppercase text-sm hover:bg-charcoal-gray hover:text-white transition-colors duration-300">Buy Now</button>
                            </div>
                        </div>

                        {/* This component will now pass the full product object to the tabs */}
                        <ProductInfoTabs product={product} />
                    </div>
                </div>
            </div>
            
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-24 border-t border-gray-200">
                <div className="mb-12 text-center md:text-left">
                    <h2 className="text-3xl lg:text-4xl font-serif text-deep-maroon tracking-wider">You May Also Like</h2>
                    <p className="text-sm text-gray-500 mt-2">Discover other pieces from our curated collection.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                    {relatedProducts.map(relProduct => (
                         <div key={relProduct.id}>
                            <ProductImage 
                                images={relProduct.images}
                                altText={relProduct.name}
                                productUrl={`/products/${relProduct.fabric_type}/${relProduct.slug}`}
                            />
                            <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{relProduct.name}</h3>
                            <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {relProduct.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;