import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, ShoppingBag } from 'lucide-react';
import { formatPrice } from '../../utils/priceUtils';

const ProductCard = ({ product }) => {
  const { _id, name, price, category, stock, image } = product;

  const isOutOfStock = stock === 0;

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'dogs':
      case 'dog':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cats':
      case 'cat':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'birds':
      case 'bird':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-blue-50/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-100 transition-all duration-300 transform hover:-translate-y-1">
      {/* Product Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-gray-50/50">
        <img
          src={image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Floating Category Badge */}
        <span className={`absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full border shadow-sm ${getCategoryColor(category)}`}>
          {category}
        </span>

        {/* Stock Status Badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 text-xs font-extrabold px-2.5 py-1 bg-red-500 text-white rounded-full shadow-sm">
            Out of Stock
          </span>
        ) : stock <= 5 ? (
          <span className="absolute top-3 right-3 text-xs font-extrabold px-2.5 py-1 bg-amber-500 text-white rounded-full shadow-sm">
            Only {stock} Left
          </span>
        ) : null}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-blue-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <Link
            to={`/product/${_id}`}
            className="p-3 bg-white text-blue-900 rounded-full hover:bg-blue-600 hover:text-white transition-all transform hover:scale-110 shadow-md"
            title="View Details"
          >
            <Eye size={20} />
          </Link>
        </div>
      </div>

      {/* Product Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-blue-950 text-base leading-tight hover:text-blue-600 transition-colors line-clamp-2">
            <Link to={`/product/${_id}`}>{name}</Link>
          </h3>
          <p className="text-xs text-gray-400 mt-1 font-light">PetNest Certified Partner</p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <span className="text-xl font-black text-blue-900">
            {formatPrice(price)}
          </span>
          <Link
            to={`/product/${_id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
          >
            Details &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
