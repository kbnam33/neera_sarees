ProductImageCarousel component that fixes all three problems at once — the containerRef, the passive touch events, and the dots z-index. Replace the entire component:
jsxconst ProductImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shouldLoad, setShouldLoad] = useState(false);
    const containerRef = useRef(null);
    const sliderRef = useRef(null);
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const isHorizontalSwipe = useRef(false);
    const prefetchedRef = useRef(new Set());

    const prefetch = (idx) => {
        if (!images?.[idx]) return;
        const url = images[idx];
        if (prefetchedRef.current.has(url)) return;
        prefetchedRef.current.add(url);
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
    };

    // Lazy load trigger
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    prefetch(0); prefetch(1); prefetch(2);
                    io.disconnect();
                }
            });
        }, { rootMargin: '600px 0px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // Slide on index change
    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.style.transform = `translateX(-${currentIndex * 100}%)`;
        }
    }, [currentIndex]);

    // Native non-passive touch listeners — must be native to use preventDefault
    useEffect(() => {
        const el = sliderRef.current;
        if (!el || !images?.length) return;

        const onTouchStart = (e) => {
            touchStartX.current = e.touches[0].clientX;
            touchStartY.current = e.touches[0].clientY;
            isHorizontalSwipe.current = false;
        };

        const onTouchMove = (e) => {
            const dx = e.touches[0].clientX - touchStartX.current;
            const dy = e.touches[0].clientY - touchStartY.current;
            if (!isHorizontalSwipe.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 8) {
                isHorizontalSwipe.current = true;
            }
            // Only block page scroll if user is clearly swiping horizontally
            if (isHorizontalSwipe.current) e.preventDefault();
        };

        const onTouchEnd = (e) => {
            const dx = touchStartX.current - e.changedTouches[0].clientX;
            if (Math.abs(dx) > 50) {
                if (dx > 0) setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
                else        setCurrentIndex(prev => Math.max(prev - 1, 0));
            }
            isHorizontalSwipe.current = false;
        };

        el.addEventListener('touchstart', onTouchStart, { passive: true });
        el.addEventListener('touchmove',  onTouchMove,  { passive: false }); // non-passive = can preventDefault
        el.addEventListener('touchend',   onTouchEnd,   { passive: true });

        return () => {
            el.removeEventListener('touchstart', onTouchStart);
            el.removeEventListener('touchmove',  onTouchMove);
            el.removeEventListener('touchend',   onTouchEnd);
        };
    }, [images]);

    return (
        <div
            ref={containerRef}
            className="neera-product-detail__img-wrap"
            style={{ position: 'relative', overflow: 'hidden' }}
        >
            {/* Slider track */}
            <div
                ref={sliderRef}
                style={{
                    display: 'flex',
                    width: '100%',
                    height: '100%',
                    transition: 'transform 0.3s ease',
                    willChange: 'transform',
                }}
            >
                {images.map((img, index) => (
                    <div key={index} style={{ minWidth: '100%', height: '100%', flexShrink: 0 }}>
                        {shouldLoad && (
                            <img
                                src={img}
                                alt={`${productName} view ${index + 1}`}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                className="neera-product-detail__img"
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Dot indicators — explicit z-index so they sit above the slider */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                gap: '8px',
                zIndex: 10,
            }}>
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`View image ${index + 1}`}
                        style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            backgroundColor: currentIndex === index
                                ? 'white'
                                : 'rgba(255,255,255,0.45)',
                            transition: 'background-color 0.3s',
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
Key fixes in this version:

ref={containerRef} on the outer div — IntersectionObserver now actually fires
Native touchmove with { passive: false } — e.preventDefault() now works, blocking page scroll only when user is clearly swiping horizontally
Direction detection — checks Math.abs(dx) > Math.abs(dy) before locking horizontal, so vertical scrolling the page still works naturally
zIndex: 10 on dots — dots render above the transformed slider track
Inline styles for all layout-critical rules — removes any CSS class conflict risk