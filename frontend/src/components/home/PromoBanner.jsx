import React from 'react';

const PromoBanner = () => {
  return (
    <div className="relative w-full bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 text-blue-100 py-2.5 overflow-hidden border-b border-blue-800 text-xs sm:text-sm font-medium tracking-wide z-10">
      {/* Scroll Marquee Wrapper */}
      <div className="flex whitespace-nowrap animate-marquee">
        <div className="flex gap-16 shrink-0 items-center justify-around w-full">
          <span>🚚 Free Shipping on Orders Above Rs. 3000</span>
          <span>🐾 Premium Quality Pet Supplies & Treats</span>
          <span>🎁 Save 10% on your first order with code: <strong className="text-white">PETNEST10</strong></span>
          <span>❤️ Loved by pets, trusted by owners</span>
        </div>
        <div className="flex gap-16 shrink-0 items-center justify-around w-full" aria-hidden="true">
          <span>🚚 Free Shipping on Orders Above Rs. 3000</span>
          <span>🐾 Premium Quality Pet Supplies & Treats</span>
          <span>🎁 Save 10% on your first order with code: <strong className="text-white">PETNEST10</strong></span>
          <span>❤️ Loved by pets, trusted by owners</span>
        </div>
      </div>

      {/* Tailwind & keyframe CSS injection */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default PromoBanner;
