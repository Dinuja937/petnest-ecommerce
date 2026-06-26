import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-linear-to-b from-brand-secondary/40 to-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full text-center"
      >
        {/* Paw icon */}
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 180 }}
          className="mx-auto h-28 w-28 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center mb-8 relative border border-brand-border shadow-brand-soft"
        >
          <span className="text-6xl select-none" role="img" aria-label="paw">🐾</span>
          <span className="absolute -top-1 -right-1 w-7 h-7 bg-brand-danger rounded-full flex items-center justify-center text-white text-xs font-black shadow-md">
            !
          </span>
        </motion.div>

        {/* 404 number */}
        <h1 className="text-[7rem] sm:text-[9rem] font-black text-brand-text-primary leading-none tracking-tighter">
          404
        </h1>

        {/* Text */}
        <h2 className="text-2xl font-black text-brand-text-primary mt-3 mb-3 tracking-tight">
          Lost in the Shelter?
        </h2>
        <p className="text-brand-text-secondary font-light leading-relaxed mb-10 text-sm sm:text-base max-w-sm mx-auto">
          We couldn&apos;t find this page. It may have been moved, renamed, or is no longer
          available. Please return to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-brand-md transition-all shadow-md hover:shadow-lg gap-2 cursor-pointer"
          >
            <Home size={17} />
            Go to Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-7 py-3.5 bg-brand-card-background hover:bg-brand-secondary text-brand-primary border border-brand-border hover:border-brand-primary font-bold rounded-brand-md transition-all gap-2 cursor-pointer"
          >
            <ShoppingBag size={17} />
            Browse Shop
          </Link>
        </div>

        {/* Back link */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-brand-text-secondary hover:text-brand-primary font-medium transition-colors cursor-pointer"
        >
          <ArrowLeft size={14} />
          Go back to previous page
        </button>
      </motion.div>
    </div>
  );
};

export default NotFound;
