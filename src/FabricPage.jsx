import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ProductImage from './components/ProductImage.jsx';

const FabricPage = ({ allProducts }) => {
    const { fabricName } = useParams();

    const filteredProducts = allProducts.filter(p => p.fabric_type.toLowerCase() === fabricName.toLowerCase());

    return (
        <div className="bg-soft-beige pt-16 pb-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <div className="text-center border-b border-gray-200 pb-8 mb-12">
                    <h1 className="text-4xl font-serif text-deep-maroon capitalize">{fabricName}</h1>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 sm:gap-x-6 gap-y-12">
                        {filteredProducts.map((product) => (
                             <div key={product.id}>
                                <ProductImage 
                                    images={product.images}
                                    altText={product.name}
                                    productUrl={`/products/${product.fabric_type}/${product.slug}`}
                                />
                                <h3 className="text-lg font-serif text-charcoal-gray group-hover:text-deep-maroon transition-colors">{product.name}</h3>
                                <p className="text-md text-deep-maroon/90 font-sans mt-1">₹ {product.price.toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        <p className="text-charcoal-gray">No products found in this collection yet.</p>
                        <Link to="/products" className="text-sm text-deep-maroon hover:underline mt-4 inline-block">
                            &larr; Back to All Sarees
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FabricPage;
