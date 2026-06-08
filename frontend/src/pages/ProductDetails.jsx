import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, ArrowLeft, ShieldCheck, Heart, Info, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Product could not be retrieved.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (!product) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.stock,
        qty,
      })
    );
    toast.success(`${product.name} added to cart!`);
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-blue-600 w-10 h-10" />
          <p className="text-gray-500 font-medium">Fetching details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-screen">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-blue-50 max-w-lg mx-auto">
          <div className="mx-auto h-20 w-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
            <Info size={40} />
          </div>
          <h2 className="text-2xl font-black text-blue-950 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-blue-600 transition-colors">Shop</Link>
        <span>/</span>
        <Link to={`/category/${product.category?.toLowerCase()}`} className="hover:text-blue-600 transition-colors capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Split Grid */}
      <div className="bg-white rounded-3xl shadow-xl border border-blue-50/60 overflow-hidden p-6 md:p-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-6 flex items-center justify-center bg-gray-50/50 rounded-2xl p-4 overflow-hidden border border-blue-50/40">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600'}
              alt={product.name}
              className="w-full h-auto max-h-125 object-cover rounded-xl shadow-md hover:scale-102 transition-transform duration-300"
            />
          </div>

          {/* Right Column: Details Info */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <div>
              {/* Category Tag */}
              <span className="inline-block bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-blue-100 mb-4">
                {product.category}
              </span>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-blue-950 leading-tight">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-black text-blue-900">Rs. {product.price.toFixed(2)}</span>
                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-semibold">PetNest Best Price</span>
              </div>

              {/* Stock status indicator */}
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                {isOutOfStock ? (
                  <span className="text-sm font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-lg">Out of Stock</span>
                ) : (
                  <span className="text-sm font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>

              {/* Description */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <h3 className="font-bold text-blue-950 text-base mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed font-light text-sm md:text-base whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-6">
              {/* Quantity selector (Only if in stock) */}
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-blue-950">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                    <button
                      type="button"
                      disabled={qty <= 1}
                      onClick={() => setQty(qty - 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg transition-colors font-bold text-lg cursor-pointer"
                    >
                      &minus;
                    </button>
                    <span className="w-12 text-center font-bold text-blue-950 select-none">
                      {qty}
                    </span>
                    <button
                      type="button"
                      disabled={qty >= product.stock}
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent rounded-lg transition-colors font-bold text-lg cursor-pointer"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={addToCartHandler}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none cursor-pointer"
                >
                  <ShoppingCart size={20} />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>
                <button
                  type="button"
                  className="px-5 py-4 border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-xl transition-all flex items-center justify-center"
                  title="Add to Wishlist"
                  onClick={() => toast.success('Added to wishlist!')}
                >
                  <Heart size={20} />
                </button>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="text-green-600 w-4.5 h-4.5" /> Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  🐾 100% Pet-safe Products
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
