**Step 1 — Add this one line temporarily inside `ProductImageCarousel`, right at the top of the component:**

```jsx
const ProductImageCarousel = ({ images, productName }) => {
    console.log('🖼 images received:', images); // ADD THIS
    ...
```

Open DevTools → Console on mobile simulation, reload the product page, and tell me what it logs. Specifically: is it an array? How many items? Are they URLs?

---

While you check that, here is also the most likely reason scroll-snap fails even when the code looks right — **the `overflow: hidden` on the wrapper blocks native touch scroll on the inner track in WebKit**. The fix is to remove it from the wrapper and let the track clip itself. Here's the corrected final version:

**`src/ProductPage.jsx` — replace `ProductImageCarousel`:**

```jsx
const ProductImageCarousel = ({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shouldLoad, setShouldLoad]     = useState(false);
    const outerRef = useRef(null);
    const trackRef = useRef(null);

    // ── Lazy load ──────────────────────────────────────────
    useEffect(() => {
        const el = outerRef.current;
        if (!el) return;
        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setShouldLoad(true); io.disconnect(); }
        }, { rootMargin: '400px' });
        io.observe(el);
        return () => io.disconnect();
    }, []);

    // ── Sync dots with scroll position ─────────────────────
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const onScroll = () =>
            setCurrentIndex(Math.round(el.scrollLeft / el.clientWidth));
        el.addEventListener('scroll', onScroll, { passive: true });
        return () => el.removeEventListener('scroll', onScroll);
    }, []);

    const goTo = (idx) =>
        trackRef.current?.scrollTo({
            left: idx * trackRef.current.clientWidth,
            behavior: 'smooth',
        });

    if (!images?.length) return null;

    return (
        /*
         * IMPORTANT: no overflow:hidden here — it blocks WebKit touch-scroll
         * on the inner track. The track is absolutely inset so nothing leaks.
         */
        <div
            ref={outerRef}
            className="neera-product-detail__img-wrap"
            style={{ position: 'relative', overflow: 'visible' }}
        >
            <div
                ref={trackRef}
                style={{
                    position : 'absolute',
                    top      : 0, left: 0, right: 0, bottom: 0,
                    display  : 'flex',
                    /* scroll-snap — browser owns ALL touch handling */
                    overflowX           : 'auto',
                    overflowY           : 'hidden',
                    scrollSnapType      : 'x mandatory',
                    WebkitOverflowScrolling: 'touch',   /* smooth momentum on iOS */
                    touchAction         : 'pan-x',      /* hint: this element handles horizontal panning */
                    /* hide scrollbar */
                    scrollbarWidth      : 'none',
                    msOverflowStyle     : 'none',
                }}
            >
                {/* hide webkit scrollbar — injected once */}
                <style>{`.neera-snap-track::-webkit-scrollbar{display:none}`}</style>

                {images.map((img, i) => (
                    <div
                        key={i}
                        style={{
                            minWidth       : '100%',
                            height         : '100%',
                            flexShrink     : 0,
                            scrollSnapAlign: 'start',
                        }}
                    >
                        {shouldLoad && (
                            <img
                                src={img}
                                alt={`${productName} view ${i + 1}`}
                                loading={i === 0 ? 'eager' : 'lazy'}
                                decoding="async"
                                style={{
                                    width          : '100%',
                                    height         : '100%',
                                    objectFit      : 'contain',
                                    objectPosition : 'center top',
                                    background     : '#e8e0d8',
                                    display        : 'block',
                                }}
                            />
                        )}
                    </div>
                ))}
            </div>

            {/* Dots — only render when there is something to swipe to */}
            {images.length > 1 && (
                <div style={{
                    position : 'absolute',
                    bottom   : 16,
                    left     : '50%',
                    transform: 'translateX(-50%)',
                    display  : 'flex',
                    gap      : 8,
                    zIndex   : 10,
                }}>
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            aria-label={`View image ${i + 1}`}
                            style={{
                                width       : 8,
                                height      : 8,
                                borderRadius: '50%',
                                border      : 'none',
                                padding     : 0,
                                cursor      : 'pointer',
                                background  : i === currentIndex
                                    ? '#ffffff'
                                    : 'rgba(255,255,255,0.45)',
                                transition  : 'background 0.3s',
                            }}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
```

**`src/styles/products.css` — update the wrapper rule:**

```css
/* Remove overflow:hidden — it blocks WebKit touch scroll on child track */
.neera-product-detail__img-wrap {
  width: 100%;
  aspect-ratio: 9 / 16;
  height: auto;
  overflow: visible;   /* ← was hidden */
  background: #e8e0d8;
  position: relative;
}
```

The two critical differences from every previous attempt: `overflow: visible` on the wrapper (not `hidden`) and `touchAction: 'pan-x'` on the track. Together these ensure WebKit on iOS/Android actually hands the touch gesture to the scroll container instead of intercepting it for page scroll.

Then check the `console.log` output — if the images array only has 1 item, the problem is in the database, not the carousel.