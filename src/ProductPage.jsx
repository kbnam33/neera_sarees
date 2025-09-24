import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

// ICONS
const ShareIcon = ({ className="w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>);
const HeartIcon = ({ className = "w-6 h-6" }) => (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>);
const ChevronRightIcon = ({ className = "w-6 h-6" }) => ( <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="9 18 15 12 9 6"></polyline></svg> );

const ProductInfoAccordion = () => { const [activeTab, setActiveTab] = useState('DETAILS'); const content = { DETAILS: { title: 'DETAILS', text: 'This is a three-piece look. Kindly note, product tones may vary due to lighting. For queries or customizations, please mail us at: orders@neerasarees.in' }, CARE: { title: 'CARE INSTRUCTIONS', text: 'Dry clean only. Store in a cool, dry place. Avoid direct exposure to sunlight to maintain the vibrancy of the fabric.' }, SHIPPING: { title: 'SHIPPING & RETURNS', text: 'Complimentary shipping within India. For international orders, shipping charges and duties may apply. Returns are accepted within 14 days of receipt for unused items.' } }; return ( <div className="border border-gray-200 p-8 grid grid-cols-1 md:grid-cols-3 gap-8"> <div className="md:col-span-1 flex flex-col gap-y-2 font-sans text-xs tracking-widest"> {Object.keys(content).map(key => ( <button key={key} onClick={() => setActiveTab(key)} className={`text-left p-2 transition-colors flex justify-between items-center w-full ${activeTab === key ? 'text-deep-maroon font-bold' : 'text-gray-500 hover:text-charcoal-gray'}`}> <span>{content[key].title}</span> <ChevronRightIcon className={`w-4 h-4 transition-transform ${activeTab === key ? 'transform rotate-90 md:rotate-0' : ''}`}/> </button> ))} </div> <div className="md:col-span-2 text-sm text-gray-700"> <p>{content[activeTab].text}</p> </div> </div> ); }

const ProductPage = ({ products, session }) => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching product:', error);
            } else {
                const prices = [3800, 1900, 4200, 2900, 5500, 3200, 4800, 2900, 6100, 2200];
                const colorSets = [
                    ['Crimson', 'Beige'], ['SkyBlue', 'Silver'], ['Crimson', 'Gold', 'Maroon'],
                    ['ForestGreen', 'Olive'], ['RoyalBlue', 'Navy'], ['Lavender', 'Orchid'],
                    ['Coral', 'Peach'], ['Charcoal', 'SlateGray'], ['Teal', 'Turquoise'], ['Mustard', 'Yellow']
                ];
                const augmentedProduct = {
                    ...data,
                    price: prices[data.id % prices.length] || 4200,
                    colors: colorSets[data.id % colorSets.length]
                };
                setProduct(augmentedProduct);
                setSelectedColor(augmentedProduct.colors ? augmentedProduct.colors[0] : null);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAddToCart = () => {
        if(product) addToCart(product);
    };

    const handleBuyNow = () => {
        if (session) {
            if(product) addToCart(product);
            navigate('/checkout');
        } else {
            if(product) sessionStorage.setItem('buyNowProduct', JSON.stringify(product));
            navigate('/auth', { state: { from: { pathname: '/checkout' } } });
        }
    };
    
    if (!product) {
        return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading product...</p></div>;
    }

    const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 4);
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/900x1200';

    return (
        <div className="bg-soft-beige">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-32 pb-16">
                 <Link to="/products" className="font-sans text-xs tracking-widest mb-8 text-gray-500 hover:text-black inline-block">
                    &larr; BACK TO COLLECTION
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
                    {/* Left Column: Main Image */}
                    <div className="w-full h-[calc(100vh-10rem)] max-h-[800px]">
                         <img src={mainImage} alt={product.name} className="w-full h-full object-cover object-top" />
                    </div>

                    {/* Right Column: Details */}
                    <div className="w-full flex flex-col font-sans h-[calc(100vh-10rem)] max-h-[800px]">
                        <div className="flex-grow overflow-y-auto pr-4">
                            <h1 className="text-4xl font-serif text-deep-maroon mb-3">{product.name}</h1>
                            <p className="text-2xl text-charcoal-gray mb-6 font-semibold">₹ {product.price.toFixed(2)}</p>
                            <p className="text-sm text-gray-600 mb-6">Color: <span className="font-semibold">{selectedColor}</span></p>

                            <p className="text-sm text-gray-700 leading-relaxed mb-8 max-w-prose">{product.description}</p>
                            
                            <div className="mb-8">
                                <p className="text-sm font-semibold mb-3 tracking-widest uppercase">Color</p>
                                <div className="flex flex-wrap gap-4">
                                    {product.colors && product.colors.map(color => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-9 h-9 transition-all duration-200 ease-in-out border border-gray-200 ${selectedColor === color ? 'shadow-[inset_0_0_0_3px_#a1a1aa]' : ''}`}
                                            style={{ backgroundColor: color.toLowerCase() }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex-shrink-0 pt-6 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-4">Made to order: 7 - 8 Weeks</p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button onClick={handleAddToCart} className="flex-1 bg-deep-maroon text-white py-3 tracking-widest hover:bg-lotus-gold transition-colors duration-300">ADD TO CART</button>
                                <button onClick={handleBuyNow} className="flex-1 border border-charcoal-gray text-charcoal-gray py-3 tracking-widest hover:bg-charcoal-gray hover:text-white transition-colors duration-300">BUY NOW</button>
                            </div>
                                <div className="flex gap-x-4 mt-6 justify-end">
                                <button className="p-2 hover:bg-gray-200 rounded-full"><ShareIcon className="w-5 h-5 text-gray-600" /></button>
                                <button className="p-2 hover:bg-gray-200 rounded-full"><HeartIcon className="w-5 h-5 text-gray-600" /></button>
                            </div>
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
                            <a href={`/product/${relProduct.id}`} key={relProduct.id} className="group text-center cursor-pointer">
                                <div className="overflow-hidden bg-gray-100 mb-4 aspect-[3/4]">
                                    <img src={relProduct.image} alt={relProduct.name} className={`w-full h-full object-cover ${relProduct.image?.includes('Blue purple') || relProduct.image?.includes('Bhagalpuri') ? 'object-top' : 'object-center'} transition-transform duration-500 group-hover:scale-105`} />
                                </div>
                                <h3 className="text-sm text-charcoal-gray font-serif tracking-wide">{relProduct.name}</h3>
                                <p className="text-md text-deep-maroon font-sans font-semibold">₹ {relProduct.price}</p>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ProductPage;