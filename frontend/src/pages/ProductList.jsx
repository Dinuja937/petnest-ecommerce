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
      {/* Premium Store Banner */}
      <section className="relative overflow-hidden rounded-xl bg-linear-to-r from-blue-600 to-indigo-950 p-8 md:p-12 text-white mb-10 shadow-2xl">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <ShoppingBag size={320} className="text-white/30" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="bg-white/15 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">PetNest Store</span>
          <h1 className="text-4xl md:text-5xl font-black mt-4 leading-tight">Find the Best for Your Furry &amp; Feathered Friends</h1>
          <p className="mt-4 text-white/90 font-light text-base md:text-lg">
            Curated premium nutrition, toys, accessories, and grooming essentials for every pet.
          </p>
        </div>
      </section>

      {/* Control Panel (Filters and Search) */}
      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
        <ProductFilter categories={categories} activeCategory={activeCategory} onSelect={handleCategorySelect} />
        <SearchBar value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products..." />
      </div>

      {/* Main Listing Area */}
      {loading ? (
        /* Loading Skeletons – premium card placeholders */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-md border border-gray-200 p-5 animate-pulse space-y-4">
              <div className="aspect-square bg-blue-50/10 rounded-lg" />
              <div className="h-4 bg-blue-50/15 rounded w-2/3" />
              <div className="h-3 bg-blue-50/15 rounded w-1/2" />
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <div className="h-5 w-1/4 bg-blue-50/15 rounded" />
                <div className="h-5 w-1/4 bg-blue-50/15 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        /* Error State */
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200 max-w-lg mx-auto p-8">
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
        /* Empty State – styled card with brand theme */
        <section className="text-center py-20 bg-blue-50/5 rounded-xl shadow-sm border border-gray-200 max-w-xl mx-auto p-8">
          <div className="mx-auto h-24 w-24 bg-blue-600 text-white rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18M3 12h18M3 17h18" />
            </svg>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-blue-600 mb-3">No products available yet</h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8 font-light text-sm md:text-base leading-relaxed">
            {searchQuery
              ? `We couldn't find any match for "${searchQuery}" in our ${activeCategory} catalog.`
              : `We are currently stocking up our shelter! Check back soon or contact support if you need something specific.`}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-all shadow-md"
            >
              Clear Search Query
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-gray-400">Are you an administrator? Log in to populate products.</p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-6 py-2.5 border border-blue-600 text-blue-600 hover:bg-blue-600/10 font-bold rounded-md transition-all"
              >
                Go to Login
              </Link>
            </div>
          )}
        </section>
      ) : (
        /* Products Grid */
        <ProductGrid products={filteredProducts} />
      )}
    </div>
  );
};

export default ProductList;
