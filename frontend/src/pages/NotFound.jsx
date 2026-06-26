import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-50/50">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-12 rounded-3xl shadow-xl border border-blue-50/60 transition-all">
        {/* Animated Paw/Icon space */}
        <div className="mx-auto h-28 w-28 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-8 relative animate-pulse">
          <span className="text-6xl select-none">🐾</span>
          <div className="absolute top-0 right-0 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-md">!</div>
        </div>

        <h1 className="text-8xl font-black text-blue-950 tracking-tight">404</h1>
        <h2 className="text-2xl font-extrabold text-blue-900 mt-4 mb-2">Lost in the Shelter?</h2>
        <p className="text-gray-500 font-light leading-relaxed mb-10 text-sm sm:text-base">
          We couldn’t find this page. It may have been moved or is no longer available. Please return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg gap-2 cursor-pointer"
          >
            <Home size={18} />
            Go to Home
          </Link>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-all gap-2 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
