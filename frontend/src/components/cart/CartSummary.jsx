import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartSummary = ({ itemsPrice, shippingPrice, totalPrice, isLoading, onCheckout }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    else navigate('/checkout');
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-50 sticky top-24">
      <h2 className="text-xl font-bold text-blue-950 border-b border-gray-100 pb-4 mb-4">
        Order Summary
      </h2>

      <div className="space-y-3 pb-4 border-b border-gray-100">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal ({itemsPrice ? itemsPrice.toFixed(2) : '0.00'} )</span>
          <span className="font-semibold text-blue-950">Rs. {itemsPrice?.toFixed(2) || '0.00'}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="font-semibold text-blue-950">
            {shippingPrice === 0 ? (
              <span className="text-green-600 font-medium">Free</span>
            ) : (
              `Rs. ${shippingPrice.toFixed(2)}`
            )}
          </span>
        </div>

      </div>

      <div className="flex justify-between text-lg font-bold text-blue-950 py-4 mb-4">
        <span>Total Price</span>
        <span className="text-xl font-extrabold text-blue-900">Rs. {totalPrice?.toFixed(2) || '0.00'}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isLoading ? (
          <RefreshCw className="animate-spin w-5 h-5" />
        ) : (
          <ArrowRight size={18} />
        )}
        {isLoading ? 'Processing...' : 'Proceed to Checkout'}
      </button>
    </div>
  );
};

export default CartSummary;
