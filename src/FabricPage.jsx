import React from 'react';
import { useParams, Link } from 'react-router-dom';

const FabricPage = ({ allProducts }) => {
    const { fabricName } = useParams();

    const filteredProducts = allProducts.filter(p => p.fabric_type === fabricName);

    return (
        <div className="bg-soft-beige pt-32 pb-20">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <div className="text-center border-b border-gray-200 pb-8 mb-12">
                    <h1 className="text-4xl font-serif text-deep-maroon capitalize">{fabricName}</h1>
                </div>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12">
                        {filteredProducts.map((product) => {
                            const imageUrl = product.images && product.images.length > 0
                                ? product.images[0]
                                : 'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera';
                            return (
                                 <Link to={`/products/${product.fabric_type}/${product.slug}`} key={product.id} className="group text-left">
                                    <div className="overflow-hidden mb-4 bg-gray-100">
                                        <img src={imageUrl} alt={product.name} className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105" />
                                    </div>
                                    <h3 className="text-md font-serif text-charcoal-gray">{product.name}</h3>
                                    <p className="text-md text-deep-maroon font-sans">₹ {product.price.toFixed(2)}</p>
                                </Link>
                            );
                        })}
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
