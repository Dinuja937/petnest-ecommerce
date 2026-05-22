import React from 'react';
import Hero from '../components/home/Hero';
import CategoryBanners from '../components/home/CategoryBanners';

const Home = () => {
  return (
    <main className="w-full flex flex-col min-h-screen bg-blue-50/10">
      {/* Hero Banner — full width directly below navbar */}
      <Hero />

      {/* Categories Grid Section */}
      <CategoryBanners />

      {/* Optional Brand Features Section (Extra Visual wow/premium design) */}
      <section className="w-full py-16 bg-white border-t border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <article className="flex gap-4 items-start p-4 hover:bg-blue-50/30 rounded-xl transition-all duration-300">
              <span className="text-3xl text-blue-600">📦</span>
              <div>
                <h4 className="font-semibold text-blue-950 text-base">Same-Day Delivery</h4>
                <p className="text-sm text-blue-900/60 font-light mt-1">Available for all local Negombo & Colombo orders.</p>
              </div>
            </article>
            <article className="flex gap-4 items-start p-4 hover:bg-blue-50/30 rounded-xl transition-all duration-300">
              <span className="text-3xl text-blue-600">🛡️</span>
              <div>
                <h4 className="font-semibold text-blue-950 text-base">Secure Payments</h4>
                <p className="text-sm text-blue-900/60 font-light mt-1">100% secure checkout with card and bank transfers.</p>
              </div>
            </article>
            <article className="flex gap-4 items-start p-4 hover:bg-blue-50/30 rounded-xl transition-all duration-300">
              <span className="text-3xl text-blue-600">📞</span>
              <div>
                <h4 className="font-semibold text-blue-950 text-base">24/7 Premium Support</h4>
                <p className="text-sm text-blue-900/60 font-light mt-1">Dedicated helpline for all your pet care queries.</p>
              </div>
            </article>
            <article className="flex gap-4 items-start p-4 hover:bg-blue-50/30 rounded-xl transition-all duration-300">
              <span className="text-3xl text-blue-600">🌱</span>
              <div>
                <h4 className="font-semibold text-blue-950 text-base">100% Organic Products</h4>
                <p className="text-sm text-blue-900/60 font-light mt-1">Sourced from certified natural pet-friendly brands.</p>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
