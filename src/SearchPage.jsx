import React, { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SearchPage = ({ allProducts }) => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const filteredProducts = useMemo(() => {
        if (!query || !query.trim()) {
            return [];
        }

        const lowerCaseQuery = query.toLowerCase().trim();
        
        // This regular expression removes the standalone words "saree" or "sarees"
        // to focus on the more important keywords like fabric type or color.
        const primaryTermsQuery = lowerCaseQuery.replace(/\bsarees?\b/g, '').trim();
        
        // If the query was *only* "saree" or "sarees", we fall back to the original query.
        // Otherwise, we use the cleaned query.
        const finalQuery = primaryTermsQuery || lowerCaseQuery;

        // We split the final query into individual words to check for their presence.
        const searchTerms = finalQuery.split(' ').filter(term => term);

        return allProducts.filter(product => {
            // Create a comprehensive, searchable string from product details.
            const searchableText = [
                product.name || '',
                product.description || '',
                product.fabric_type || ''
            ].join(' ').toLowerCase();
            
            // This logic now ensures that *every* important search term exists in the product's text.
            // For example, "blue silk" will find sarees that have both "blue" AND "silk".
            return searchTerms.every(term => searchableText.includes(term));
        });
    }, [query, allProducts]);

    return (
        <div className="bg-soft-beige pt-32 pb-20 min-h-screen">
            <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                <div className="text-center border-b border-gray-200 pb-8 mb-12">
                    <h1 className="text-4xl font-serif text-deep-maroon">Search Results</h1>
                    {query && <p className="mt-2 text-gray-600">Showing results for: <span className="font-semibold text-charcoal-gray">"{query}"</span></p>}
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
                        <p className="text-charcoal-gray text-lg">No products found matching your search.</p>
                        <Link to="/products" className="text-sm text-deep-maroon hover:underline mt-6 inline-block">
                            &larr; Explore All Sarees
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;

