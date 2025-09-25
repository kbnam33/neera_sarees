import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';

// --- ICONS ---
const ChevronRightIcon = ({ className = "w-5 h-5" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg> );

// --- PRODUCT INFO TABS ---
const ProductInfoTabs = ({product}) => {
    const [activeTab, setActiveTab] = useState('DETAILS');
    const tabs = {
        DETAILS: { title: 'Details & Craftsmanship', text: product.description || 'This exquisite piece is handcrafted by master artisans, featuring traditional weaving techniques passed down through generations. Made from the finest silk, its unique texture and drape are a testament to its quality. Kindly note, product tones may vary slightly due to the natural dyeing process and lighting.' },
        CARE: { title: 'Care Instructions', text: 'To preserve the beauty of your saree, we recommend dry cleaning only. Store in a cool, dry place away from direct sunlight. Fold carefully and avoid using metal hangers to maintain the integrity of the fabric.' },
        SHIPPING: { title: 'Shipping & Returns', text: 'Enjoy complimentary shipping within India. For international orders, charges and duties may apply. We accept returns for unused items within 14 days of receipt. Please refer to our detailed policy for more information.' }
    };

    return (
        <div className="mt-12">
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    {Object.keys(tabs).map((key) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`${
                                activeTab === key
                                    ? 'border-deep-maroon text-deep-maroon'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-serif text-md transition-colors duration-300 focus:outline-none`}
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
            // Find the product by matching the slug from the URL parameter.
            const foundProduct = allProducts.find(p => p.slug === slug);

            if (foundProduct) {
                setProduct(foundProduct);
                setSelectedColor(foundProduct.colors ? foundProduct.colors[0] : null);
                if (foundProduct.images && foundProduct.images.length > 0) {
                    setMainImage(foundProduct.images[0]);
                }
            } else {
                // If no product is found for this slug, redirect to the main products page.
                navigate('/products', { replace: true });
            }
        }
    }, [slug, allProducts, navigate]);

    const handleAddToCart = () => { if(product) addToCart(product); };
    const handleBuyNow = () => {
        if (session) {
            if(product) addToCart(product);
            navigate('/checkout');
        } else {
            if(product) sessionStorage.setItem('buyNowProduct', JSON.stringify(product));
            navigate('/auth', { state: { from: { pathname: `/products/${product.fabric_type}/${product.slug}` } } });
        }
    };
    
    if (!product) {
        return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading Product...</p></div>;
    }

    const relatedProducts = allProducts
        .filter(p => p.fabric_type === product.fabric_type && p.id !== product.id)
        .slice(0, 4);

    return (
        <div className="bg-soft-beige">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pt-28 pb-16">
                 <div className="mb-8 font-sans text-xs tracking-widest text-gray-500">
                    <Link to="/products" className="hover:text-black">All Sarees</Link>
                    <span> / </span>
                    <Link to={`/fabric/${product.fabric_type}`} className="hover:text-black capitalize">{product.fabric_type}</Link>
                 </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
                    <div className="w-full">
                        <div className="bg-gray-100 mb-4">
                            <img src={mainImage} alt={product.name} className="w-full h-full object-cover aspect-[3/4]" />
                        </div>
                        <div className="flex gap-4">
                            {product.images && product.images.map((img, index) => (
                                <div key={index} className="w-24 h-32 bg-gray-100 cursor-pointer" onClick={() => setMainImage(img)}>
                                    <img src={img} alt={`${product.name} thumbnail ${index + 1}`} className={`w-full h-full object-cover transition-opacity duration-300 ${mainImage === img ? 'opacity-100' : 'opacity-50 hover:opacity-100'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full lg:sticky top-28 self-start">
                        <h1 className="text-4xl lg:text-5xl font-serif text-deep-maroon mb-4">{product.name}</h1>
                        <p className="text-2xl text-charcoal-gray mb-8 font-semibold font-sans">₹ {product.price.toFixed(2)}</p>
                        
                        <div className="mb-8">
                            <p className="text-sm font-semibold mb-3 tracking-widest uppercase">Color: <span className="font-normal normal-case">{selectedColor}</span></p>
                            <div className="flex flex-wrap gap-4">
                                {product.colors && product.colors.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`w-8 h-8 rounded-full transition-all duration-200 ease-in-out border border-gray-300 ${selectedColor === color ? 'ring-2 ring-offset-2 ring-charcoal-gray' : ''}`}
                                        style={{ backgroundColor: color.toLowerCase() }}
                                        title={color}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="space-y-4">
                            <button onClick={handleAddToCart} className="w-full bg-deep-maroon text-white py-4 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300">Add to Bag</button>
                            <button onClick={handleBuyNow} className="w-full border border-charcoal-gray text-charcoal-gray py-4 tracking-widest uppercase text-sm hover:bg-charcoal-gray hover:text-white transition-colors duration-300">Buy Now</button>
                        </div>
                        <ProductInfoTabs product={product} />
                    </div>
                </div>
            </div>
            
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-24 border-t border-gray-200">
                <div className="mb-12">
                    <h2 className="text-3xl lg:text-4xl font-serif text-deep-maroon tracking-wider">You May Also Like</h2>
                    <p className="text-sm text-gray-500 mt-2">Discover other pieces from our curated collection.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-16">
                    {relatedProducts.map(relProduct => {
                        const imageUrl = relProduct.images && relProduct.images.length > 0 ? relProduct.images[0] : 'https://placehold.co/900x1200';
                        return(
                            <Link to={`/products/${relProduct.fabric_type}/${relProduct.slug}`} key={relProduct.id} className="group text-left">
                                <div className="overflow-hidden bg-gray-100 mb-4">
                                    <img src={imageUrl} alt={relProduct.name} className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105" />
                                </div>
                                <h3 className="text-md font-serif text-charcoal-gray">{relProduct.name}</h3>
                                <p className="text-md text-deep-maroon font-sans">₹ {relProduct.price.toFixed(2)}</p>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProductPage;
