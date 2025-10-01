import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);

// A custom hook to handle scroll animations
const useIntersect = (options) => {
    const [isIntersecting, setIntersecting] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setIntersecting(true);
                observer.unobserve(entry.target);
            }
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return [ref, isIntersecting];
};

const AnimatedSection = ({ children, className }) => {
    const [ref, isIntersecting] = useIntersect({ threshold: 0.2 });
    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out ${className} ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
            {children}
        </div>
    );
};

const StoryPage = () => {
    return (
        <div className="bg-soft-beige text-charcoal-gray font-sans overflow-x-hidden">
            {/* --- Section 1: Opening Statement --- */}
            <section className="h-screen flex items-center justify-center pt-20">
                <div className="text-center p-4">
                    <h1 className="text-6xl md:text-8xl font-serif text-deep-maroon leading-none animate-fadeInUp">
                        Purity in Every Thread.
                    </h1>
                </div>
            </section>

            {/* --- Section 2: The Philosophy --- */}
            <section className="py-20 md:py-32 bg-earthen-tan">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 relative">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8">
                            <AnimatedSection>
                                <img src="/theme-image.png" alt="A rich, textured saree in a traditional setting" className="w-full h-full object-cover shadow-2xl" />
                            </AnimatedSection>
                        </div>
                        <div className="lg:col-span-5">
                             <AnimatedSection className="lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 bg-soft-beige/90 backdrop-blur-sm p-10 shadow-2xl">
                                <h2 className="text-3xl lg:text-4xl font-serif text-brand-dark leading-tight mb-6">
                                    The Meaning of Neera
                                </h2>
                                <p className="text-charcoal-gray/90 leading-relaxed max-w-md">
                                    At Neera, we believe every saree carries the grace of tradition and the freshness of modern style. Inspired by the Sanskrit meaning of Neera—pure water—our brand symbolizes purity, elegance, and timeless beauty.
                                </p>
                            </AnimatedSection>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* --- Section 3: The Fluidity --- */}
             <section className="py-20 md:py-32 bg-soft-beige">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left">
                        <AnimatedSection>
                            <h2 className="text-3xl lg:text-4xl font-serif text-brand-dark leading-tight mb-6">
                                Fluidity and Grace
                            </h2>
                            <p className="text-charcoal-gray/90 leading-relaxed max-w-md mb-8">
                                Just as water flows effortlessly, our sarees are designed to bring fluidity, comfort, and charm to every occasion.
                            </p>
                            <img src="/weavers-hand.png" alt="Close up of a weaver's hands on a loom" className="w-full object-cover shadow-xl mb-8" />
                            <p className="text-charcoal-gray/90 leading-relaxed max-w-md">
                                Heritage weaves blend with contemporary designs, making every woman feel confident and unique.
                            </p>
                        </AnimatedSection>
                    </div>
                    <div>
                       <AnimatedSection>
                         <img src="/flying-saree.png" alt="A flowing saree symbolizing grace" className="w-full h-full object-cover shadow-2xl" />
                       </AnimatedSection>
                    </div>
                </div>
            </section>

            {/* --- Section 4: The Embrace --- */}
            <section className="py-20 md:py-32 bg-earthen-tan">
                 <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                     <AnimatedSection>
                         <div className="max-w-xl">
                            <h2 className="text-4xl lg:text-5xl font-serif text-brand-dark leading-tight mb-6">Embrace a Story</h2>
                            <p className="text-charcoal-gray/90 leading-relaxed">
                               With Neera, you don’t just wear a saree—you embrace a story of purity, tradition, and modern elegance. It is a quiet dialogue between the weaver's patient hand and the timeless grace of your own style.
                            </p>
                         </div>
                     </AnimatedSection>
                </div>
                <div className="w-full mt-16">
                    <AnimatedSection>
                        <img src="/orange-mangalagiri-display.png" alt="A woman wearing a Neera saree with confidence" className="w-full h-auto object-cover" />
                    </AnimatedSection>
                </div>
            </section>
            
            {/* --- Call to Action Section --- */}
            <section className="bg-deep-maroon py-20 md:py-28 text-center">
                 <div className="max-w-2xl mx-auto px-4">
                     <h2 className="text-3xl font-serif text-soft-beige mb-8 animate-fadeInUp">Explore the Collection</h2>
                     <Link to="/products" className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-deep-maroon uppercase bg-soft-beige px-10 py-4 transition-all duration-300 hover:bg-white shadow-lg animate-fadeInUp" style={{animationDelay: '200ms'}}>
                        View All Sarees <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                 </div>
            </section>
        </div>
    );
};

export default StoryPage;

