import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useCart } from './CartContext';

// ... (Icons and ProductInfoTabs components remain the same) ...

const ProductPage = ({ products, session }) => {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [mainImage, setMainImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchProduct = async () => {
            // Fetch the specific product from Supabase
            const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
            if (error) {
                console.error('Error fetching product:', error);
            } else {
                setProduct(data);
                setSelectedColor(data.colors ? data.colors[0] : null);
                if (data.images && data.images.length > 0) {
                    setMainImage(data.images[0]);
                }
            }
        };
        if (id) fetchProduct();
    }, [id]);

    // ... (handleAddToCart, handleBuyNow, and return statement logic remain the same) ...
    
    if (!product) {
        return <div className="h-screen flex justify-center items-center bg-soft-beige"><p>Loading...</p></div>;
    }

    const relatedProducts = products.filter(p => p.id !== product.id && p.fabric_type === product.fabric_type).slice(0, 4);

    return (
        <div className="bg-soft-beige">
             <div className="max-w-screen-xl mx-auto px-4 sm:px-8 pt-28 pb-16">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
                     {/* Left Column: Image Gallery */}
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
 
                     {/* Right Column: Details */}
                     <div className="w-full lg:sticky top-28 self-start">
                         <h1 className="text-4xl lg:text-5xl font-serif text-deep-maroon mb-4">{product.name}</h1>
                         <p className="text-2xl text-charcoal-gray mb-8 font-semibold font-sans">₹ {product.price.toFixed(2)}</p>
                         
                         <p className="text-sm text-gray-700 leading-relaxed mb-10 max-w-prose">{product.description}</p>
                         
                         <div className="mb-8">
                             <p className="text-sm font-semibold mb-3 tracking-widest uppercase">Color: <span className="font-normal normal-case">{selectedColor}</span></p>
                             <div className="flex flex-wrap gap-3">
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
 
                         <div className="space-y-4">
                             <button onClick={handleAddToCart} className="w-full bg-deep-maroon text-white py-4 tracking-widest uppercase text-sm hover:bg-deep-maroon-dark transition-colors duration-300">Add to Bag</button>
                             <button onClick={handleBuyNow} className="w-full border border-charcoal-gray text-charcoal-gray py-4 tracking-widest uppercase text-sm hover:bg-charcoal-gray hover:text-white transition-colors duration-300">Buy Now</button>
                         </div>
                         
                         <ProductInfoTabs />
                     </div>
                 </div>
             </div>
             
             <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-24 border-t border-gray-200">
                 <h2 className="text-center text-3xl font-serif text-deep-maroon tracking-wider mb-12">You May Also Like</h2>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
                     {relatedProducts.map(relProduct => (
                         <a href={`/product/${relProduct.id}`} key={relProduct.id} className="group text-left">
                             <div className="overflow-hidden bg-gray-100 mb-4">
                                 <img src={relProduct.images[0]} alt={relProduct.name} className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105" />
                             </div>
                             <h3 className="text-md font-serif text-charcoal-gray">{relProduct.name}</h3>
                             <p className="text-md text-deep-maroon font-sans">₹ {relProduct.price.toFixed(2)}</p>
                         </a>
                     ))}
                 </div>
             </div>
         </div>
    );
};

// ... (ProductInfoTabs component remains the same) ...

export default ProductPage;