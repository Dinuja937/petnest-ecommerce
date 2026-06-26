import React from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/banner.jpg';

const Hero = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] flex items-center justify-start overflow-hidden bg-blue-950">
      {/* Background Image with Parallax-like fit */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat scale-105 animate-zoom-in"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Premium Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-950/90 via-blue-900/60 to-transparent" />

      {/* Hero content container */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-10 text-white animate-fade-in-up">
        <div className="max-w-2xl space-y-6">
          <span className="inline-block px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-200 bg-blue-900/55 backdrop-blur-sm rounded-full border border-blue-700/50">
            🐶 Your Premium Pet Partner
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-200 to-white">PetNest</span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-blue-100/90 leading-relaxed font-light">
            Your trusted online pet store for premium food, toys, accessories, and pet care essentials. Give your pets the love and quality they deserve.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/shop"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2"
            >
              Shop Now
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>

          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-blue-50/50 to-transparent pointer-events-none" />

      {/* Tailwind & keyframe CSS injection */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes zoomIn {
          from {
            transform: scale(1);
          }
          to {
            transform: scale(1.05);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-zoom-in {
          animation: zoomIn 15s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Hero;
