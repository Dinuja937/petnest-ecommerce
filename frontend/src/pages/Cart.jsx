import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ArrowLeft, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const updateQuantityHandler = (item, qty) => {
    if (qty <= 0) return;
    if (item.countInStock && qty > item.countInStock) {
      toast.error(`Only ${item.countInStock} items in stock`);
      return;
    }
    dispatch(addToCart({ ...item, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.success('Item removed from cart');
  };

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
  const shippingPrice = itemsPrice > 3000 || itemsPrice === 0 ? 0 : 299;

  const totalPrice = itemsPrice + shippingPrice;

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center bg-white p-12 rounded-2xl shadow-xl border border-blue-50 max-w-lg mx-auto">
          <div className="mx-auto h-20 w-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <ShoppingBag size={40} />
          </div>
          <h2 className="text-3xl font-extrabold text-blue-950 mb-2">Your Cart is Empty</h2>
          <p className="text-gray-500 mb-8">
            Looks like you haven't added anything to your cart yet. Let's find some amazing treats and essentials for your pets!
          </p>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-blue-950 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.product} item={item} />
          ))}

          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
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
    </div>
  );
};

export default Cart;
