import React from 'react';
import { Link } from 'react-router-dom';

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);

const StoryPage = () => {
    return (
        <div className="bg-soft-beige text-charcoal-gray font-sans overflow-x-hidden">
            {/* --- Section 1: Opening Statement --- */}
            <section className="h-screen flex items-center justify-center pt-20">
                <div className="text-center p-4">
                    <h1 className="text-6xl md:text-8xl font-serif text-deep-maroon leading-none animate-fadeInUp">
                        Purity in Every Thread.
                    </h1>
                    <p className="text-lg text-charcoal-gray max-w-2xl mx-auto mt-8 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
                        Inspired by the Sanskrit word for 'pure water,' Neera is a promise of clarity, authenticity, and the fluid grace that defines every woman.
                    </p>
                </div>
            </section>

            {/* --- Section 2: The Weaver's Hand --- */}
            <section className="py-20 md:py-32">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="text-left animate-fadeInUp">
                        <h2 className="text-4xl lg:text-5xl font-serif text-deep-maroon leading-tight mb-6">
                            The Weaver's Hand
                        </h2>
                        <p className="text-charcoal-gray leading-relaxed max-w-md">
                            Our journey begins in the heart of India's weaving communities. We collaborate with master artisans who possess a profound, generational knowledge of their craft. The gentle clatter of the loom, the patient selection of each thread—these are the sounds and rituals that give birth to a Neera saree.
                        </p>
                    </div>
                    <div className="relative h-[80vh] animate-fadeIn">
                         <img src="/weavers-hand.png" alt="A rich, textured saree in a traditional setting" className="w-full h-full object-cover shadow-2xl" />
                    </div>
                </div>
            </section>
            
            {/* --- Section 3: Parallax Visual Break --- */}
            <section className="h-[70vh] bg-cover bg-center bg-fixed" style={{ backgroundImage: "url('/cinematic-bg.png')" }}>
                 <div className="h-full flex items-center justify-center bg-black/40">
                    <div className="text-center text-white p-8">
                         <h3 className="text-4xl lg:text-5xl font-serif text-shadow-glow animate-fadeIn">The Art of the Drape</h3>
                    </div>
                 </div>
            </section>

            {/* --- Section 4: The River's Grace --- */}
            <section className="bg-white py-20 md:py-32">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="relative h-[80vh] order-last lg:order-first animate-fadeIn">
                        <img src="/flying-saree.png" alt="A flowing saree symbolizing grace" className="w-full h-full object-cover shadow-2xl" />
                    </div>
                    <div className="text-left lg:pl-12 animate-fadeInUp">
                        <h3 className="text-4xl lg:text-5xl font-serif text-deep-maroon leading-tight mb-6">The River's Grace</h3>
                        <p className="text-charcoal-gray leading-relaxed max-w-md">
                           A saree should not confine; it should liberate. We select the finest natural fabrics that breathe and move, draping with the effortless grace of flowing water, creating a harmony that feels both classic and current.
                        </p>
                    </div>
                </div>
            </section>
            
            {/* --- Call to Action Section --- */}
            <section className="bg-soft-beige py-20 md:py-28 text-center">
                 <div className="max-w-2xl mx-auto px-4">
                     <h2 className="text-3xl font-serif text-deep-maroon mb-8 animate-fadeInUp">Embrace Your Story</h2>
                     <Link to="/products" className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-white uppercase bg-deep-maroon px-10 py-4 transition-all duration-300 hover:bg-brand-dark shadow-lg animate-fadeInUp" style={{animationDelay: '200ms'}}>
                        Explore the Collection <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                 </div>
            </section>
        </div>
    );
};

export default StoryPage;