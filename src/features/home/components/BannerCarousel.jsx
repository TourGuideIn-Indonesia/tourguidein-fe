import { useRef, useState, useEffect } from "react";

function BannerCarousel({ banners }) {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.children[0]?.offsetWidth || 300;
      const gap = 16;
      const index = Math.round(scrollLeft / (itemWidth + gap));
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="mb-7">
      {/* Scrollable banner */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto px-5 md:px-10 gap-4 scrollbar-hide snap-x snap-mandatory"
      >
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="min-w-[300px] md:min-w-[400px] lg:min-w-[500px] md:flex-1 h-[140px] md:h-[200px] rounded-2xl overflow-hidden snap-center shrink-0"
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5 mt-3">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`rounded-full transition-all duration-300 ${
              index === activeIndex
                ? "w-5 h-1.5 bg-blue-500"
                : "w-1.5 h-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default BannerCarousel;
