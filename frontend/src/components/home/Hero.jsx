import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import heroBg from '../../assets/banner.jpg';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const Hero = () => {
  return (
    <section className="relative w-full h-[540px] md:h-[640px] lg:h-[720px] flex items-center justify-start overflow-hidden bg-blue-950">
      {/* Background Image — slow Ken Burns zoom */}
      <motion.div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
        initial={{ scale: 1 }}
        animate={{ scale: 1.06 }}
        transition={{ duration: 16, ease: 'linear' }}
      />

      {/* Deep gradient overlay — left-heavy for text legibility */}
      <div className="absolute inset-0 bg-linear-to-r from-blue-950/92 via-blue-950/65 to-blue-950/10" />
      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-linear-to-t from-white/5 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 z-10 text-white">
        <div className="max-w-2xl space-y-7">

          {/* Eyebrow badge */}
          <motion.span
            {...fadeUp(0.1)}
            className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-200 bg-blue-900/60 backdrop-blur-sm rounded-full border border-blue-700/50"
          >
            <span>🐾</span> Sri Lanka&apos;s Premium Pet Store
          </motion.span>

          {/* Main heading */}
          <motion.h1
            {...fadeUp(0.22)}
            className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold tracking-tight leading-[1.1]"
          >
            Everything Your Pet{' '}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-300 to-white">
              Deserves
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            {...fadeUp(0.34)}
            className="text-base sm:text-lg lg:text-xl text-blue-100/85 leading-relaxed font-light max-w-xl"
          >
            Premium food, toys, accessories and care essentials — curated by pet lovers, delivered to your door.
          </motion.p>

          {/* CTA buttons */}
          <motion.div {...fadeUp(0.46)} className="flex flex-wrap gap-4 pt-1">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold rounded-brand-md shadow-lg shadow-blue-700/30 hover:shadow-blue-600/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-250"
            >
              <ShoppingBag size={18} />
              Shop Now
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-brand-md border border-white/25 backdrop-blur-sm hover:scale-[1.03] active:scale-[0.98] transition-all duration-250"
            >
              Learn More
            </Link>
          </motion.div>

          {/* Social proof stats */}
          <motion.div
            {...fadeUp(0.56)}
            className="flex flex-wrap gap-6 pt-2"
          >
            {[
              { value: '5,000+', label: 'Happy Customers' },
              { value: '200+', label: 'Products' },
              { value: '4.9★', label: 'Avg. Rating' },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col">
                <span className="text-xl font-bold text-white">{stat.value}</span>
                <span className="text-xs text-blue-300 font-medium uppercase tracking-wide">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
