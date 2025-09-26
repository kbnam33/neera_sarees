import React from 'react';
import { Link } from 'react-router-dom';

const ArrowRightIcon = ({ className = "w-5 h-5" }) => (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" /></svg>);

const StoryPage = () => {
    return (
        <div className="bg-soft-beige text-charcoal-gray font-sans">
            {/* --- Hero Section --- */}
            <section className="relative h-[60vh] bg-cover bg-center flex items-center justify-center text-center text-white" style={{ backgroundImage: "url('/Maroon saree with dark bg.png')" }}>
                <div className="absolute inset-0 bg-black/50"></div>
                <div className="relative z-10 p-4">
                    <p className="text-sm uppercase tracking-widest text-gray-300 mb-2 animate-fadeInDown">The Neera Narrative</p>
                    <h1 className="text-5xl lg:text-7xl font-serif leading-tight tracking-tight text-shadow-glow animate-fadeInDown" style={{ animationDelay: '200ms' }}>
                        Purity in Every Thread
                    </h1>
                </div>
            </section>
            
            {/* --- Introduction Section --- */}
            <section className="py-20 md:py-28">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-4xl font-serif text-deep-maroon leading-tight mb-6">
                        Neera is a whisper of tradition, a breath of modernity.
                    </h2>
                    <p className="text-lg leading-relaxed text-charcoal-gray">
                        Inspired by the Sanskrit word for 'pure water,' our name is our promise. It speaks to the clarity of our design, the authenticity of our craft, and the fluid grace that defines every woman who drapes a Neera saree. We don't just create garments; we weave stories of timeless elegance meant to flow through the moments of your life.
                    </p>
                </div>
            </section>
            
            {/* --- Image & Text Split Section --- */}
            <section className="bg-white">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-20 md:py-24 grid md:grid-cols-2 gap-16 items-center">
                    <div className="relative aspect-[4/5]">
                         <img src="/Light blue mangalagiri.png" alt="A woman smiling in a Neera saree" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-3xl font-serif text-deep-maroon leading-tight mb-4">The Weaver's Hand</h3>
                        <p className="text-charcoal-gray leading-relaxed mb-6">
                            Our journey begins in the heart of India's weaving communities. We collaborate with master artisans who possess a profound, generational knowledge of their craft. The gentle clatter of the loom, the patient selection of each thread—these are the sounds and rituals that give birth to a Neera saree. It is a slow, deliberate art, a celebration of human touch in a world of automation.
                        </p>
                         <p className="text-charcoal-gray leading-relaxed">
                            By choosing Neera, you become a patron of this heritage, helping to sustain a legacy of unparalleled craftsmanship and empowering the families who keep it alive.
                        </p>
                    </div>
                </div>
            </section>

             {/* --- Full-Width Image Banner --- */}
            <section className="h-[50vh] bg-cover bg-center" style={{ backgroundImage: "url('/New maroon saree.png')" }}>
                {/* This is a visual break, purely for atmosphere */}
            </section>

            {/* --- Text & Image Split Section (Reversed) --- */}
            <section className="bg-soft-beige">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-8 py-20 md:py-24 grid md:grid-cols-2 gap-16 items-center">
                     <div className="text-left md:order-2">
                        <h3 className="text-3xl font-serif text-deep-maroon leading-tight mb-4">The River's Grace</h3>
                        <p className="text-charcoal-gray leading-relaxed mb-6">
                            Fluidity and comfort are the cornerstones of our design philosophy. A saree should not confine; it should liberate. We select the finest natural fabrics that breathe and move, draping with the effortless grace of flowing water. Our contemporary designs are balanced with heritage weaves, creating a unique harmony that feels both classic and current.
                        </p>
                        <p className="text-charcoal-gray leading-relaxed">
                            To wear Neera is to feel confident and unburdened, to carry a piece of art that complements your own unique story with elegance and ease.
                        </p>
                    </div>
                    <div className="relative aspect-[4/5] md:order-1">
                         <img src="/wmremove-transformed.png" alt="A saree draped elegantly" className="w-full h-full object-cover" />
                    </div>
                </div>
            </section>
            
            {/* --- Call to Action Section --- */}
            <section className="bg-white py-20 md:py-28 text-center">
                 <div className="max-w-2xl mx-auto px-4">
                     <h2 className="text-3xl font-serif text-deep-maroon mb-8">Embrace Your Story</h2>
                     <Link to="/products" className="group inline-flex items-center gap-x-3 text-sm font-semibold tracking-widest text-white uppercase bg-deep-maroon px-10 py-4 transition-all duration-300 hover:bg-brand-dark shadow-lg">
                        Explore the Collection <ArrowRightIcon className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                 </div>
            </section>
        </div>
    );
};

export default StoryPage;