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
    <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-50/30">
      <img
        src={item.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200'}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg"
      />
      <div className="flex-1 text-center sm:text-left">
        <h3 className="font-semibold text-lg text-blue-950 hover:text-blue-600 transition-colors">
          {item.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">PetNest Certified Item</p>
        <p className="text-lg font-bold text-blue-900 mt-2">{formatPrice(item.price)}</p>
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50/50 p-1">
        <button
          type="button"
          onClick={() => updateQty(qty - 1)}
          className="p-2 hover:bg-white text-gray-600 rounded-lg transition-colors"
        >
          <Minus size={16} />
        </button>
        <span className="px-4 font-medium text-blue-950 w-8 text-center select-none">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => updateQty(qty + 1)}
          className="p-2 hover:bg-white text-gray-600 rounded-lg transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={removeHandler}
        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
        title="Remove item"
      >
        <Trash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;
