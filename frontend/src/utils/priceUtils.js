// Format a number as "Rs. X.XX"
export const formatPrice = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;


// Calculate shipping cost based on items array (matching Checkout's formula)
export const calculateShipping = (items) => {
  return items.reduce((sum, item) => {
    const itemShipping = item.price > 3000 ? 0 : 299 * (item.qty || 1);
    return sum + itemShipping;
  }, 0);
};
