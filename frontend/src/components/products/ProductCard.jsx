import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/priceUtils';

const getCategoryStyle = (cat) => {
  switch (cat?.toLowerCase()) {
    case 'dogs': case 'dog':
      return { pill: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-400' };
    case 'cats': case 'cat':
      return { pill: 'bg-purple-100 text-purple-700 border-purple-200', dot: 'bg-purple-400' };
    case 'birds': case 'bird':
      return { pill: 'bg-sky-100 text-sky-700 border-sky-200', dot: 'bg-sky-400' };
    default:
      return { pill: 'bg-brand-secondary text-brand-primary border-brand-primary/20', dot: 'bg-brand-primary' };
  }
};

const ProductCard = ({ product }) => {
  const { _id, name, price, category, stock, image } = product;
  const isOutOfStock = stock === 0;
  const isLowStock = !isOutOfStock && stock <= 5;
  const { pill } = getCategoryStyle(category);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col bg-white rounded-brand-lg border border-brand-border overflow-hidden shadow-brand-soft hover:shadow-xl hover:border-brand-primary/20 transition-shadow duration-300"
    >
      {/* Image Panel */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400'}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-[1.07] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Category badge */}
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${pill}`}>
          <Tag size={10} />
          {category}
        </span>

        {/* Stock badge */}
        {isOutOfStock ? (
          <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 bg-brand-danger text-white rounded-full shadow-sm">
            Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 bg-amber-500 text-white rounded-full shadow-sm">
            Only {stock} Left
          </span>
        ) : null}

        {/* Hover overlay with quick-view button */}
        <div className="absolute inset-0 bg-blue-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Link
            to={`/product/${_id}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-brand-primary font-semibold text-sm rounded-brand-md shadow-lg hover:bg-brand-primary hover:text-white transition-all duration-200 hover:scale-[1.04]"
            title="Quick View"
          >
            <Eye size={16} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          <h3 className="font-semibold text-brand-text-primary text-sm leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors duration-200">
            <Link to={`/product/${_id}`}>{name}</Link>
          </h3>
          <p className="text-[11px] text-brand-text-secondary/70 mt-1 font-light">PetNest Certified Partner</p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-brand-border">
          <span className="text-lg font-extrabold text-brand-text-primary">
            {formatPrice(price)}
          </span>
          <Link
            to={`/product/${_id}`}
            className="text-[11px] font-bold text-brand-primary hover:text-brand-primary-hover bg-brand-secondary hover:bg-brand-primary/10 px-3 py-1.5 rounded-brand-md transition-all duration-200"
          >
            View Details →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;

