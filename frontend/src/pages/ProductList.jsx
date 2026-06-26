import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import useProduct from '../hooks/useProduct';
import ProductFilter from '../components/products/ProductFilter';
import ProductGrid from '../components/products/ProductGrid';
import SearchBar from '../components/common/SearchBar';
import { RotateCcw, AlertCircle, ShoppingBag } from 'lucide-react';

const ProductList = () => {
  const { category: urlCategory } = useParams();
  const navigate = useNavigate();

  const { products, loading, error, fetchProducts } = useProduct();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Dogs', 'Cats', 'Birds'];

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !urlCategory ||
      urlCategory.toLowerCase() === 'all' ||
      product.category?.toLowerCase() === urlCategory.toLowerCase();

    const matchesSearch =
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const activeCategory = urlCategory
    ? urlCategory.charAt(0).toUpperCase() + urlCategory.slice(1)
    : 'All';

  const handleCategorySelect = (category) => {
    if (category.toLowerCase() === 'all') {
      navigate('/shop');
    } else {
      navigate(`/category/${category.toLowerCase()}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      {/* Banner / Header */}
      <div className="bg-linear-to-r from-blue-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 opacity-10 flex items-center justify-center pointer-events-none">
          <ShoppingBag size={300} />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-blue-500 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            PetNest Store
          </span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 leading-tight">
            Find the Best for Your Furry & Feathered Friends
          </h1>
          <p className="mt-4 text-blue-100 font-light text-base md:text-lg">
            High-quality nutrition, toys, accessories, and grooming essentials curated with care.
          </p>
        </div>
      </div>

      {/* Control Panel (Filters and Search) */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-blue-50/60 flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <ProductFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelect={handleCategorySelect}
        />
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
        />
      </div>

      {/* Main Listing Area */}
      {loading ? (
        /* Loading Skeletons */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white border border-blue-50 rounded-2xl p-5 shadow-sm space-y-4 animate-pulse"
            >
              <div className="aspect-square bg-gray-100 rounded-xl w-full"></div>
              <div className="h-4 bg-gray-100 rounded w-2/3"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
              <div className="pt-3 border-t border-gray-50 flex justify-between">
                <div className="h-5 bg-gray-100 rounded w-1/4"></div>
                <div className="h-5 bg-gray-100 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-blue-50/60 max-w-lg mx-auto p-8">
          <div className="mx-auto h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-blue-950 mb-2">Something went wrong</h3>
          <p className="text-gray-500 mb-8">{error}</p>
          <button
            onClick={fetchProducts}
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md gap-2"
          >
            <RotateCcw size={18} /> Retry Loading
          </button>
        </div>
      ) : filteredProducts.length === 0 ? (
        /* Empty State */
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-blue-50/60 max-w-xl mx-auto p-8">
          <div className="mx-auto h-24 w-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            🐾
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-blue-950 mb-3">
            No products available yet
          </h2>
          <p className="text-gray-500 max-w-md mx-auto mb-8 font-light text-sm md:text-base leading-relaxed">
            {searchQuery
              ? `We couldn't find any match for "${searchQuery}" in our ${activeCategory} catalog.`
              : `We are currently stocking up our shelter! Check back soon or contact support if you need something specific.`}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-md"
            >
              Clear Search Query
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">
                Are you an administrator? Log in to populate products.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-xl transition-all"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      ) : (
        /* Products Grid */
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
};

export default ProductList;
