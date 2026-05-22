import React from 'react';

const WelcomeSection = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-white text-center border-b border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Decorative emblem */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 text-blue-600 mb-4 shadow-sm border border-blue-100/50">
          <span className="text-xl">🐾</span>
        </div>

        {/* Centered Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-blue-950 tracking-tight leading-tight">
          Welcome to <span className="text-blue-600">PetNest</span>
        </h1>

        {/* Centered Subtitle */}
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light">
          Your trusted online pet store for premium food, toys, accessories, and pet care essentials. Sourcing only the best brands for your furry, feathered, and scaled friends.
        </p>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-gray-500 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span> 100% Pet-Safe Materials
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span> Vet-Recommended Brands
          </span>
          <span className="flex items-center gap-1.5">
            <span className="text-emerald-500">✓</span> High-Quality Ingredients
          </span>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;
