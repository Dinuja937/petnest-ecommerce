import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  onClick,
  disabled,
  isLoading,
  children,
  type = 'button',
  variant = 'primary',
  className = '',
}) => {
  const baseClasses = 'font-medium py-3 px-5 rounded-brand-md transition-colors flex items-center justify-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-brand-primary/20 duration-200';
  
  const variantClasses = variant === 'secondary' 
    ? 'bg-transparent border border-brand-primary text-brand-primary hover:bg-brand-secondary shadow-sm'
    : 'bg-brand-primary hover:bg-brand-primary-hover text-white shadow-brand-soft border border-transparent';

  const disabledClasses = 'disabled:bg-gray-100 disabled:text-gray-400 disabled:border-transparent disabled:cursor-not-allowed disabled:shadow-none';

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      whileHover={(!disabled && !isLoading) ? { scale: 1.01 } : {}}
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
    >
      {isLoading ? (
        <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
