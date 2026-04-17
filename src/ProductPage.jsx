import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useCart } from './CartContext';
import ProductImage from './components/ProductImage.jsx';
import { getProductMetaTags } from './utils/metaTags.js';
import { getProductSchema, getOrganizationSchema, getBreadcrumbSchema } from './utils/schemaMarkup.js';

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
    const [shouldLoad, setShouldLoad] = useState(false);
    const prefetchedRef = useRef(new Set());
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const sliderRef = useRef(null);
    const containerRef = useRef(null);

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

    const prefetch = (idx) => {
        if (!images || !images[idx]) return;
        const url = images[idx];
        if (prefetchedRef.current.has(url)) return;
        prefetchedRef.current.add(url);
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    // Preload the first couple of frames for snappy swipes
                    prefetch(0);
                    prefetch(1);
                    prefetch(2);
                    io.disconnect();
                }
            });
        }, { rootMargin: '600px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    return (
        <div className="neera-product-detail__img-wrap relative">
            <div
                ref={sliderRef}
                className="flex transition-transform duration-300 ease-in-out"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {images.map((img, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                        {shouldLoad && (
                            <img 
                                src={img} 
                                alt={`${productName} view ${index + 1}`} 
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="neera-product-detail__img" 
                            />
                        )}
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
            <div className="border-b border-neera-border">
                <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto" aria-label="Tabs">
                    {Object.keys(tabs).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`${
                                activeTab === key
                                    ? 'border-neera-accent text-neera-accent'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-serif text-sm md:text-md transition-colors duration-300 focus:outline-none`}
                        >
                            {tabs[key].title}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="py-8 h-64 overflow-y-auto hover:pr-2 transition-all duration-200" 
                style={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#D1D5DB transparent'
                }}>
                <div className="text-sm leading-relaxed max-w-prose animate-fadeIn pr-2"
                    style={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{
                        __html: tabs[activeTab].text
                            // Section headers (lines ending with colon at the start or lines like "Product Details:")
                            .replace(/^([A-Z][^:\n]*:)$/gm, '<div class="font-serif text-base font-semibold text-neera-text mt-5 mb-1.5 tracking-wide first:mt-0">$1</div>')
                            // Label-value pairs (e.g., "Fabric: 100% Pure Cotton")
                            .replace(/^([A-Za-z\s&]+):\s*(.+)$/gm, '<div class="mb-1"><span class="font-semibold text-neera-text tracking-wider text-xs uppercase">$1:</span> <span class="text-gray-600 ml-1">$2</span></div>')
                            // Bullet points
                            .replace(/^[•·]\s*(.+)$/gm, '<div class="flex items-start mb-0.5 ml-1"><span class="text-neera-accent mr-2 flex-shrink-0">•</span><span class="text-gray-600">$1</span></div>')
                            // Regular paragraphs (lines that don't match above patterns)
                            .replace(/^(?!<div)([^<\n].+)$/gm, '<p class="text-gray-600 mb-1.5">$1</p>')
                    }}
                />
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
    const [isAddToBagHovered, setIsAddToBagHovered] = useState(false);
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
            navigate('/checkout');
        }
    };
    
    if (!product) {
        return <div className="h-screen flex justify-center items-center bg-neera-bg"><p>Loading Product...</p></div>;
    }

    const relatedProducts = allProducts
        .filter(p => p.id !== product.id && p.fabric_type === product.fabric_type)
        .slice(0, 4);

    // Generate comprehensive meta tags for product
    const productMeta = getProductMetaTags(product);
    const productSchema = getProductSchema(product);
    const orgSchema = getOrganizationSchema();
    
    // Breadcrumb data
    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'All Sarees', path: '/products' },
        { name: product.fabric_type, path: `/fabric/${product.fabric_type}` },
        { name: product.name, path: `/products/${product.fabric_type}/${product.slug}` }
    ];
    const breadcrumbSchema = getBreadcrumbSchema(breadcrumbs);

    return (
        // FIX: Removed pt-16, added pt-8 for breadcrumb spacing
        <div className="bg-neera-bg pt-8">
            <Helmet>
                <title>{productMeta.title}</title>
                <meta name="description" content={productMeta.description} />
                <link rel="canonical" href={productMeta.canonical} />
                <meta property="og:title" content={productMeta.openGraph.title} />
                <meta property="og:description" content={productMeta.openGraph.description} />
                <meta property="og:url" content={productMeta.openGraph.url} />
                <meta property="og:type" content={productMeta.openGraph.type} />
                <meta property="og:image" content={productMeta.openGraph.image} />
                <meta property="og:site_name" content={productMeta.openGraph.siteName} />
                <meta property="product:price:amount" content={product.selling_price || product.mrp} />
                <meta property="product:price:currency" content="INR" />
                <meta name="twitter:card" content={productMeta.twitter.card} />
                <meta name="twitter:title" content={productMeta.twitter.title} />
                <meta name="twitter:description" content={productMeta.twitter.description} />
                <meta name="twitter:image" content={productMeta.twitter.image} />
                
                {/* Product Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(productSchema)}
                </script>
                
                {/* BreadcrumbList Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
                
                {/* Organization Schema */}
                <script type="application/ld+json">
                    {JSON.stringify(orgSchema)}
                </script>
            </Helmet>
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-8 lg:gap-y-0">
                    {/* --- Image Section --- */}
                    <div className="w-full">
                        {/* Mobile Carousel */}
                        <div className="lg:hidden">
                            {product.images && product.images.length > 0 ? (
                                <ProductImageCarousel images={product.images} productName={product.name} />
                            ) : (
                                <div className="neera-product-detail__img-wrap"><img src={'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera'} alt={product.name} loading="lazy" decoding="async" width={900} height={1200} className="neera-product-detail__img" /></div>
                            )}
                        </div>

                        {/* Desktop Thumbnails */}
                        <div className="hidden lg:block">
                            <div className="neera-product-detail__img-wrap mb-4">
                                <img src={mainImage} alt={product.name} decoding="async" className="neera-product-detail__img" />
                            </div>
                            <div className="flex gap-4">
                                {product.images && product.images.map((img, index) => (
                                    <div key={index} className="w-20 aspect-[9/16] bg-gray-100 cursor-pointer" onMouseEnter={() => setMainImage(img)}>
                                        <img src={img} alt={`${product.name} thumbnail ${index + 1}`} loading="lazy" decoding="async" className={`w-full h-full object-contain transition-opacity duration-300 ${mainImage === img ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                     {/* --- Details Section --- */}
                    <div className="w-full lg:sticky top-28 self-start">
                        <h1 className="text-4xl lg:text-5xl font-serif text-neera-accent leading-tight">
                            {product.name}
                            <span className="sr-only"> – {product.fabric_type} Saree for Working Women</span>
                        </h1>
                        
                        {/* --- MODIFICATION: Using product.short_description --- */}
                        <p className="text-md text-neera-text/80 mt-3 mb-6 max-w-prose">
                            {/* This now reads from the database FIRST, then shows the fallback text */}
                            {product.short_description || 'A timeless piece of artistry, this saree is handwoven with passion and precision, embodying both tradition and modernity.'}
                        </p>
                        {/* --- END MODIFICATION --- */}

                        <p className="neera-product-detail__price">
                            ₹{Number(product.price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </p>
                        
                        <div className="border-y border-neera-border py-8">
                            <dl className="space-y-6">
                                <div className="grid grid-cols-3 gap-4 items-center">
                                    <dt className="text-sm font-semibold text-neera-text tracking-wider uppercase col-span-1">FABRIC</dt>
                                    <dd className="text-md text-neera-text/90 capitalize col-span-2">{product.fabric_type}</dd>
                                </div>
                                {product.colors && product.colors.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        <dt className="text-sm font-semibold text-neera-text tracking-wider uppercase col-span-1 self-start pt-1">COLOR</dt>
                                        <dd className="col-span-2">
                                            <p className="text-md text-neera-text/90 capitalize mb-3">{selectedColor}</p>
                                            <div className="flex flex-wrap gap-3">
                                                {product.colors.map(color => (
                                                    <button
                                                        key={color}
                                                        onClick={() => setSelectedColor(color)}
                                                        className={`w-8 h-8 rounded-full transition-all duration-200 ease-in-out border-2 shadow-sm hover:shadow-md focus:outline-none ${selectedColor === color ? 'ring-2 ring-offset-2 ring-neera-accent border-white' : 'border-gray-300'}`}
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
                                <button
                                    onClick={handleAddToCart}
                                    onMouseEnter={() => setIsAddToBagHovered(true)}
                                    onMouseLeave={() => setIsAddToBagHovered(false)}
                                    className="w-full py-4 tracking-widest uppercase text-sm transition-colors duration-300"
                                    style={{ backgroundColor: isAddToBagHovered ? '#8B3A4A' : '#5C1F2E', color: '#FAF7F4' }}
                                >
                                    Add to Bag
                                </button>
                                <button onClick={handleBuyNow} className="w-full border border-neera-text text-neera-text py-4 tracking-widest uppercase text-sm hover:bg-neera-text hover:text-white transition-colors duration-300">Buy Now</button>
                            </div>
                        </div>

                        {/* This component will now pass the full product object to the tabs */}
                        <ProductInfoTabs product={product} />
                    </div>
                </div>
            </div>
            
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-24 border-t border-neera-border">
                <div className="mb-12 text-center md:text-left">
                    <p className="text-neera-text-muted text-[9px] tracking-[0.4em] uppercase font-sans mb-2">YOU MAY ALSO LIKE</p>
                    <h3 className="font-serif text-neera-text text-2xl mb-8">From the same collection</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-12">
                    {relatedProducts.map(relProduct => (
                         <div key={relProduct.id}>
                            <ProductImage 
                                images={relProduct.images}
                                altText={relProduct.name}
                                productUrl={`/products/${relProduct.fabric_type}/${relProduct.slug}`}
                            />
                            <h3 className="text-lg font-serif text-neera-text group-hover:text-neera-accent transition-colors">{relProduct.name}</h3>
                            <p className="text-md text-neera-accent/90 font-sans mt-1">₹ {relProduct.price.toFixed(2)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;