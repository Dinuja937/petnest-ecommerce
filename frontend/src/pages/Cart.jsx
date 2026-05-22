import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag } from 'lucide-react';
import { addToCart, removeFromCart } from '../store/slices/cartSlice';
import toast from 'react-hot-toast';

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
  const shippingPrice = itemsPrice > 50 || itemsPrice === 0 ? 0 : 5.99;
  const taxPrice = itemsPrice * 0.08;
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

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
            <div
              key={item.product}
              className="flex flex-col sm:flex-row items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-blue-50/50 hover:shadow-md transition-shadow"
            >
              {/* Product Image */}
              <img
                src={item.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200'}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-xl bg-blue-50/50"
              />

              {/* Product Details */}
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg text-blue-950 hover:text-blue-600 transition-colors">
                  <Link to={`/product/${item.product}`}>{item.name}</Link>
                </h3>
                <p className="text-sm text-gray-500 mt-1">PetNest Certified Item</p>
                <p className="text-lg font-extrabold text-blue-900 mt-2">
                  ${item.price.toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
                <button
                  type="button"
                  onClick={() => updateQuantityHandler(item, (item.qty || 1) - 1)}
                  className="p-2 hover:bg-white text-gray-600 rounded-lg transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-4 font-semibold text-blue-950 w-8 text-center select-none">
                  {item.qty || 1}
                </span>
                <button
                  type="button"
                  onClick={() => updateQuantityHandler(item, (item.qty || 1) + 1)}
                  className="p-2 hover:bg-white text-gray-600 rounded-lg transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>

              {/* Action Buttons */}
              <button
                type="button"
                onClick={() => removeFromCartHandler(item.product)}
                className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                title="Remove item"
              >
                <Trash2 size={20} />
              </button>
            </div>
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
          <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-50 sticky top-24">
            <h2 className="text-xl font-bold text-blue-950 border-b border-gray-100 pb-4 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)} items)</span>
                <span className="font-semibold text-blue-950">${itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-blue-950">
                  {shippingPrice === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `$${shippingPrice.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-blue-950">${taxPrice.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-blue-950 py-4 mb-4">
              <span>Total Price</span>
              <span className="text-xl font-extrabold text-blue-900">${totalPrice.toFixed(2)}</span>
            </div>

            {shippingPrice > 0 && (
              <p className="text-xs text-blue-600 bg-blue-50 p-2.5 rounded-lg mb-6 text-center">
                Add <strong>${(50 - itemsPrice).toFixed(2)}</strong> more to unlock <strong>Free Shipping</strong>!
              </p>
            )}

            <button
              onClick={checkoutHandler}
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
