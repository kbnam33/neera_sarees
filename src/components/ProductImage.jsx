import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const ProductImage = ({ images, altText, productUrl }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const intervalRef = useRef(null);

  const startSlideshow = () => {
    if (images && images.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 800);
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
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const displayImage = (images && images.length > 0)
    ? images[currentImageIndex]
    : 'https://placehold.co/900x1200/F8F5EF/5B1A32?text=Neera';

  return (
    <Link to={productUrl} className="group text-left">
      <div 
        className="overflow-hidden mb-3 bg-gray-100 relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img 
          src={displayImage} 
          alt={altText} 
          className="w-full h-full object-cover aspect-[3/4] transition-transform duration-500 group-hover:scale-105" 
        />
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
