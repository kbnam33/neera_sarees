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
    const [ref, isIntersecting] = useIntersect({ threshold: 0.2, triggerOnce: true });
    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            <div
                className="transition-transform duration-1000 ease-out"
                style={{
                    transform: isIntersecting ? 'translateY(0)' : 'translateY(100%)',
                }}
            >
                {children}
            </div>
        </div>
    );
};

const StoryPage = () => {
    return (
        <div className="bg-soft-beige text-charcoal-gray font-sans overflow-x-hidden">
            <AnimatedSection>
                <section className="h-screen flex items-center justify-center pt-20">
                    <div className="text-center p-4">
                        <h1 className="text-6xl md:text-8xl font-serif text-deep-maroon leading-none">
                            Purity in Every Thread.
                        </h1>
                    </div>
                </section>
            </AnimatedSection>

            <AnimatedSection>
                <section className="py-20 md:py-32 bg-soft-beige">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="p-2 border border-charcoal-gray-dark shadow-2xl">
                                 <img src="/theme-image.png" alt="A rich, textured saree in a traditional setting" className="w-full h-full object-cover" />
                            </div>
                        </div>
                        <div className="flex flex-col justify-center h-full">
                            <h2 className="text-3xl lg:text-4xl font-serif text-brand-dark leading-tight mb-6">
                                The Meaning of Neera
                            </h2>
                            <p className="text-charcoal-gray/90 leading-relaxed max-w-md">
                                At Neera, we believe every saree carries the grace of tradition and the freshness of modern style. Inspired by the Sanskrit meaning of Neera—pure water—our brand symbolizes purity, elegance, and timeless beauty.
                            </p>
                        </div>
                    </div>
                </section>
            </AnimatedSection>
            
            <AnimatedSection>
                 <section className="py-20 md:py-32 bg-soft-beige">
                    <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                        <div className="max-w-xl">
                           <h2 className="text-4xl lg:text-5xl font-serif text-brand-dark leading-tight mb-6">
                               Fluidity and Grace
                           </h2>
                           <p className="text-charcoal-gray/90 leading-relaxed">
                               Just as water flows effortlessly, our sarees are designed to bring fluidity, comfort, and charm to every occasion.
                           </p>
                        </div>
                   </div>
                   <div className="w-full mt-16">
                       <img src="/flying-saree.png" alt="A flowing saree symbolizing grace" className="w-full h-auto object-cover" />
                   </div>
               </section>
            </AnimatedSection>

            <AnimatedSection>
                <section className="py-20 md:py-32 bg-soft-beige">
                     <div className="max-w-screen-xl mx-auto px-4 sm:px-8">
                         <div className="max-w-xl">
                            <h2 className="text-4xl lg:text-5xl font-serif text-brand-dark leading-tight mb-6">Embrace a Story</h2>
                            <p className="text-charcoal-gray/90 leading-relaxed">
                               With Neera, you don’t just wear a saree—you embrace a story of purity, tradition, and modern elegance. It is a quiet dialogue between the weaver's patient hand and the timeless grace of your own style.
                            </p>
                         </div>
                    </div>
                    <div className="w-full mt-16">
                        <img src="/orange-mangalagiri-display.png" alt="A woman wearing a Neera saree with confidence" className="w-full h-auto object-cover" />
                    </div>
                </section>
            </AnimatedSection>
            
            <section className="bg-gray-100 py-20 md:py-28 text-center">
                 <div className="max-w-2xl mx-auto px-4">
                     <h2 className="text-3xl font-serif text-deep-maroon mb-8">Explore the Collection</h2>
                     <Link to="/products" className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-white uppercase bg-deep-maroon px-10 py-4 transition-all duration-300 hover:bg-deep-maroon-dark shadow-lg">
                        View All Sarees <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                 </div>
            </section>
        </div>
    );
};

export default StoryPage;