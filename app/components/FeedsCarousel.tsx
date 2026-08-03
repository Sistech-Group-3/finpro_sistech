"use client";

import { useRef, useState } from "react";

const FEEDS = [
  { id: 1, title: "Woman Safety in 2026" },
  { id: 2, title: "Woman Safety Tips" },
  { id: 3, title: "Community Stories" },
];

export default function FeedsCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 1;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveSlide(index);
  }

  function goToSlide(index: number) {
    const el = scrollerRef.current;
    if (!el) return;
    const cardWidth = el.firstElementChild
      ? (el.firstElementChild as HTMLElement).offsetWidth + 16
      : 1;
    el.scrollTo({ left: index * cardWidth, behavior: "smooth" });
    setActiveSlide(index);
  }

  return (
    <div>
      <h2 className="font-bold text-indigo-900 mb-3">Your Feeds Today</h2>

      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-1"
      >
        {FEEDS.map((feed) => (
          <div
            key={feed.id}
            className="snap-start shrink-0 w-[78%] h-40 rounded-2xl bg-gradient-to-br from-[#F45FA6] to-[#D6217E] p-4 flex items-end shadow-sm"
          >
            <p className="text-white font-extrabold text-lg leading-tight">
              {feed.title}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3">
        {FEEDS.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Ke slide ${i + 1}`}
            className="p-1 -m-1"
          >
            <span
              className={`block h-1.5 rounded-full transition-all ${
                i === activeSlide ? "w-4 bg-indigo-800" : "w-1.5 bg-indigo-300"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}