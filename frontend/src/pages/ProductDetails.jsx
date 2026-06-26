import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import useAuth from '../hooks/useAuth';
import useProduct from '../hooks/useProduct';
import { addToCart } from '../store/slices/cartSlice';
import { ShoppingCart, ArrowLeft, ShieldCheck, Heart, Info, RefreshCw, Truck, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/priceUtils';


const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useAuth();
  const { product, loading, error, fetchProduct } = useProduct();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetchProduct(id);
  }, [id, fetchProduct]);

  const addToCartHandler = () => {
    if (!userInfo) {
      toast.error('Please login first to add items to cart');
      navigate('/login');
      return;
    }
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

  const buyNowHandler = () => {
    if (!userInfo) {
      toast.error('Please login first to proceed');
      navigate('/login');
      return;
    }
    if (!product) return;
    navigate('/checkout', { state: { buyNowProduct: product } });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-brand-primary w-10 h-10" />
          <p className="text-brand-text-secondary font-medium">Fetching product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center bg-brand-card-background p-12 rounded-brand-lg shadow-brand-soft border border-brand-border max-w-lg mx-auto"
        >
          <div className="mx-auto h-20 w-20 bg-brand-danger/10 text-brand-danger rounded-full flex items-center justify-center mb-6">
            <Info size={40} />
          </div>
          <h2 className="text-2xl font-black text-brand-text-primary mb-2">Product Not Found</h2>
          <p className="text-brand-text-secondary mb-8">{error || 'The product you are looking for does not exist.'}</p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover transition-all shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  const isOutOfStock = product.stock === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen"
    >
      {/* Breadcrumbs */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-brand-text-secondary font-medium">
        <Link to="/" className="hover:text-brand-primary transition-colors">Home</Link>
        <span className="text-gray-300">/</span>
        <Link to="/shop" className="hover:text-brand-primary transition-colors">Shop</Link>
        <span className="text-gray-300">/</span>
        <Link to={`/category/${product.category?.toLowerCase()}`} className="hover:text-brand-primary transition-colors capitalize">
          {product.category}
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-brand-text-primary font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Product Card */}
      <div className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Image */}
          <div className="lg:col-span-6 flex items-center justify-center bg-gray-50/70 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-brand-border min-h-80">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600'}
              alt={product.name}
              className="w-full h-auto max-h-[420px] object-contain rounded-brand-md hover:scale-[1.02] transition-transform duration-500"
            />
          </div>

          {/* Right Column: Details */}
          <div className="lg:col-span-6 flex flex-col p-8 md:p-10">
            {/* Category + Rating row */}
            <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
              <span className="inline-block bg-brand-secondary text-brand-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-brand-border">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                {[1,2,3,4,5].map(s => <Star key={s} size={13} fill="currentColor" />)}
                <span className="text-brand-text-secondary text-xs ml-1 font-medium">PetNest Verified</span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-brand-text-primary leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-3xl font-black text-brand-primary">{formatPrice(product.price)}</span>
              <span className="text-xs text-brand-success bg-brand-success/10 px-2.5 py-1 rounded-full font-bold border border-brand-success/20">
                Best Price
              </span>
            </div>

            {/* Stock status */}
            <div className="mt-4 flex items-center gap-2">
              <span className="text-sm text-brand-text-secondary font-medium">Availability:</span>
              {isOutOfStock ? (
                <span className="text-sm font-bold text-brand-danger bg-brand-danger/10 px-3 py-1 rounded-full border border-brand-danger/20">
                  Out of Stock
                </span>
              ) : (
                <span className="text-sm font-bold text-brand-success bg-brand-success/10 px-3 py-1 rounded-full border border-brand-success/20">
                  In Stock &mdash; {product.stock} units
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-brand-border" />

            {/* Description */}
            <div>
              <h3 className="font-bold text-brand-text-primary text-sm uppercase tracking-wide mb-3">Description</h3>
              <p className="text-brand-text-secondary leading-relaxed text-sm md:text-base whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Divider */}
            <div className="my-6 border-t border-brand-border" />

            {/* Quantity + Actions */}
            <div className="space-y-5">
              {!isOutOfStock && (
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-brand-text-primary">Quantity:</span>
                  <div className="flex items-center border border-brand-border rounded-brand-md bg-gray-50 p-1 shadow-inner">
                    <button
                      type="button"
                      disabled={qty <= 1}
                      onClick={() => setQty(qty - 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-white text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-brand-md transition-colors font-bold text-lg cursor-pointer"
                    >
                      &minus;
                    </button>
                    <span className="w-12 text-center font-black text-brand-text-primary select-none text-base">
                      {qty}
                    </span>
                    <button
                      type="button"
                      disabled={qty >= product.stock}
                      onClick={() => setQty(qty + 1)}
                      className="w-9 h-9 flex items-center justify-center hover:bg-white text-brand-text-secondary hover:text-brand-text-primary disabled:opacity-40 disabled:cursor-not-allowed rounded-brand-md transition-colors font-bold text-lg cursor-pointer"
                    >
                      &#43;
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={addToCartHandler}
                  aria-label={isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                  className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3.5 px-6 rounded-brand-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ShoppingCart size={18} />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </button>

                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={buyNowHandler}
                  aria-label="Proceed to Checkout"
                  className="flex-1 bg-brand-text-primary hover:bg-brand-text-primary/90 text-white font-bold py-3.5 px-6 rounded-brand-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Truck size={18} />
                  Buy Now
                </button>

                <button
                  type="button"
                  className="px-4 py-3.5 border border-brand-border hover:border-brand-danger hover:bg-brand-danger/5 text-brand-text-secondary hover:text-brand-danger rounded-brand-md transition-all flex items-center justify-center cursor-pointer"
                  title="Add to Wishlist"
                  aria-label="Add to Wishlist"
                  onClick={() => toast.success('Added to wishlist!')}
                >
                  <Heart size={18} />
                </button>
              </div>
            </div>

            {/* Trust badges */}
            <div className="mt-6 pt-5 border-t border-brand-border flex flex-wrap gap-5">
              <div className="flex items-center gap-2 text-xs text-brand-text-secondary font-medium">
                <ShieldCheck className="text-brand-success w-4 h-4 shrink-0" />
                Secure Checkout
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-text-secondary font-medium">
                <Truck className="text-brand-primary w-4 h-4 shrink-0" />
                Nationwide Delivery
              </div>
              <div className="flex items-center gap-2 text-xs text-brand-text-secondary font-medium">
                🐾 100% Pet-safe Products
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
