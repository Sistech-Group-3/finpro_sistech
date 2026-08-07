"use client";

import { useRef, useState } from "react";

const FEEDS = [
  { id: 1, title: "Woman Safety in 2026" },
  { id: 2, title: "Woman Safety Tips" },
  { id: 3, title: "Community Stories" },
  { id: 4, title: "Emergency Contacts" },
  { id: 5, title: "Safe Routes Guide" },
];

export default function FeedsCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const getCardWidth = () => {
    const el = scrollerRef.current;
    if (!el || !el.firstElementChild) return 295 + 16;
    return (el.firstElementChild as HTMLElement).offsetWidth + 16;
  };

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;

    const cardWidth = getCardWidth();
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveSlide(index);
  }

  function goToSlide(index: number) {
    const el = scrollerRef.current;
    if (!el) return;

    const cardWidth = getCardWidth();

    el.scrollTo({
      left: index * cardWidth,
      behavior: "smooth",
    });

    setActiveSlide(index);
  }

  return (
    <div>
      <h2 className="font-bold text-[#5B1242] mb-3 text-sm">
        Your Feeds Today
      </h2>

      {/* Carousel Container */}
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="
          flex
          gap-4
          overflow-x-auto
          snap-x snap-mandatory
          scrollbar-hide
          pb-1
        "
      >
        {FEEDS.map((feed) => (
          <div
            key={feed.id}
            className="
              snap-start
              shrink-0
              w-[295px]
              h-[156px]
              rounded-[10px]
              bg-gradient-to-r
              from-[#F075C4]
              to-[#E748B4]
              p-4 sm:p-5
              flex items-end
              shadow-sm
              hover:shadow-md
              transition-shadow
            "
          >
            <p className="text-white font-bold text-lg leading-tight">
              {feed.title}
            </p>
          </div>
        ))}
      </div>

      {/* Dot indicator */}
      <div className="flex items-center justify-center gap-1.5 mt-3">
        {FEEDS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className="p-1 -m-1"
          >
            <span
              className={`block h-2 rounded-full transition-all duration-300 ${
                i === activeSlide
                  ? "w-5 bg-[#CC1893]"
                  : "w-2 bg-pink-300/60"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}