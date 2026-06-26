import React from 'react';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceUtils';

const CartSummary = ({ itemsPrice, shippingPrice, totalPrice, isLoading, onCheckout }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (onCheckout) onCheckout();
    else navigate('/checkout');
  };

  return (
    <div className="bg-brand-card-background p-6 rounded-brand-lg shadow-brand-soft border border-brand-border sticky top-24">
      <h2 className="text-xl font-extrabold text-brand-text-primary border-b border-brand-border pb-4 mb-4 tracking-tight">
        Order Summary
      </h2>

      <div className="space-y-3 pb-4 border-b border-brand-border">
        <div className="flex justify-between text-brand-text-secondary font-medium text-sm">
          <span>Subtotal</span>
          <span className="font-bold text-brand-text-primary">{formatPrice(itemsPrice)}</span>
        </div>
        <div className="flex justify-between text-brand-text-secondary font-medium text-sm">
          <span>Shipping</span>
          <span className="font-bold text-brand-text-primary">
            {shippingPrice === 0 ? (
              <span className="text-brand-success font-bold">Free</span>
            ) : (
              formatPrice(shippingPrice)
            )}
          </span>
        </div>
      </div>

      <div className="flex justify-between text-lg font-black text-brand-text-primary py-4 mb-4">
        <span>Total Price</span>
        <span className="text-2xl font-black text-brand-primary">{formatPrice(totalPrice)}</span>
      </div>

      <button
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3.5 px-4 rounded-brand-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
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
