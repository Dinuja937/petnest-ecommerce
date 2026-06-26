import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../store/slices/cartSlice';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/priceUtils';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const qty = item.qty || 1;

  const updateQty = (newQty) => {
    if (!userInfo) {
      toast.error('Session expired. Please login again.');
      return;
    }
    if (newQty < 1) return;
    if (item.countInStock && newQty > item.countInStock) {
      toast.error(`Only ${item.countInStock} items in stock`);
      return;
    }
    dispatch(addToCart({ ...item, qty: newQty }));
  };

  const removeHandler = () => {
    dispatch(removeFromCart(item.product));
    toast.success('Removed from cart');
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border">
      <img
        src={item.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200'}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-brand-md border border-brand-border"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-lg text-brand-text-primary hover:text-brand-primary-hover transition-colors">
          {item.name}
        </h3>
        <p className="text-xs text-brand-text-secondary mt-1">PetNest Certified Item</p>
        <p className="text-lg font-bold text-brand-primary mt-2">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-brand-border rounded-brand-md bg-gray-50/50 p-1 shadow-inner">
        <button
          type="button"
          onClick={() => updateQty(qty - 1)}
          className="p-2 hover:bg-white text-brand-text-secondary hover:text-brand-text-primary rounded-brand-md transition-colors cursor-pointer"
        >
          <Minus size={16} />
        </button>
        <span className="px-4 font-bold text-brand-text-primary w-8 text-center select-none">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => updateQty(qty + 1)}
          className="p-2 hover:bg-white text-brand-text-secondary hover:text-brand-text-primary rounded-brand-md transition-colors cursor-pointer"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={removeHandler}
        className="p-3 text-brand-danger hover:text-white hover:bg-brand-danger rounded-brand-md transition-all cursor-pointer"
        title="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;
