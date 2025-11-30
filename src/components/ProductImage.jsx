import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProductImage = ({ images, altText, productUrl }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const loadedIndexesRef = useRef(new Set());
  const prefetchedRef = useRef(new Set());
  const intervalRef = useRef(null);
  const containerRef = useRef(null);

  const prefetchIndex = (index) => {
    if (!images || !images[index]) return;
    const url = images[index];
    if (prefetchedRef.current.has(url)) return;
    prefetchedRef.current.add(url);
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => { loadedIndexesRef.current.add(index); };
    img.src = url;
  };

  const startSlideshow = () => {
    if (images && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % images.length;
          if (loadedIndexesRef.current.has(nextIndex)) {
            return nextIndex;
          }
          // Nudge prefetch if not ready yet
          prefetchIndex(nextIndex);
          return prevIndex;
        });
      }, 1200);
    }
  };

  const stopSlideshow = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentImageIndex(0);
  };

  useEffect(() => {
    if (isHovered) {
      startSlideshow();
    } else {
      stopSlideshow();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isHovered, images]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    // On hover, aggressively prefetch remaining images
    if (images && images.length > 1) {
      images.forEach((_, idx) => prefetchIndex(idx));
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const displayImage = (images && images.length > 0)
    ? images[currentImageIndex]
    : 'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera';

  // Only load/render the image once it is about to enter the viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          // Warm up the first few images so hover is instant
          prefetchIndex(0);
          prefetchIndex(1);
          prefetchIndex(2);
          io.disconnect();
        }
      });
    }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Link to={productUrl} className="group text-left">
      <div 
        ref={containerRef}
        className="overflow-hidden mb-3 bg-gray-100 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {shouldLoad && (
          <img 
            src={displayImage} 
            alt={altText} 
            loading="lazy"
            decoding="async"
            width={900}
            height={1200}
            onLoad={() => {
              if (images && images.length > 0) {
                loadedIndexesRef.current.add(currentImageIndex);
              }
            }}
            className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 transform scale-[1.10] group-hover:scale-[1.15]" 
          />
        )}
        {images && images.length > 1 && (
           <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-1.5">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${isHovered ? 'w-4' : 'w-0'} ${currentImageIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductImage;
