import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import { calculateShipping } from '../utils/priceUtils';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo) {
      toast.error('Please login to access your cart');
      navigate('/login');
    }
  }, [userInfo, navigate]);

  const { cartItems } = useSelector((state) => state.cart);

  const updateQuantityHandler = (item, qty) => {
    if (!userInfo) {
      toast.error('Session expired. Please login again.');
      return;
    }
    if (qty <= 0) return;
    if (item.countInStock && qty > item.countInStock) {
      toast.error(`Only ${item.countInStock} items in stock`);
      return;
    }
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    if (!userInfo) {
      toast.error('Session expired. Please login again.');
      return;
    }
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
  const shippingPrice = calculateShipping(cartItems);

  const totalPrice = itemsPrice + shippingPrice;

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 min-h-[70vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center bg-brand-card-background p-10 md:p-12 rounded-brand-lg shadow-brand-soft border border-brand-border max-w-lg mx-auto"
        >
          <div className="mx-auto h-20 w-20 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center mb-6 shadow-inner">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-3xl font-black text-brand-text-primary mb-2 tracking-tight">Your Cart is Empty</h2>
          <p className="text-brand-text-secondary mb-8">
            Looks like you haven't added anything to your cart yet. Let's find some amazing treats and essentials for your pets!
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-6 py-3 border.5 border-transparent text-base font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover transition-all shadow-md hover:shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-[80vh]"
    >
      <h1 className="text-3xl font-black text-brand-text-primary mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.product} item={item} />
          ))}

          <div className="pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center text-brand-primary hover:text-brand-primary-hover font-semibold transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <CartSummary
            itemsPrice={itemsPrice}
            shippingPrice={shippingPrice}
            totalPrice={totalPrice}
            onCheckout={checkoutHandler}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
