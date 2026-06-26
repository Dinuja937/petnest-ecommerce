import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { clearCartItems } from '../store/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import CheckoutForm from '../components/cart/CheckoutForm';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { calculateShipping } from '../utils/priceUtils';

const Checkout = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();

    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    // Retrieve product passed via Proceed to Checkout (buy now)
    const buyNowProduct = location.state?.buyNowProduct;

    // Determine which items to checkout: either the buy‑now product alone, or the existing cart items.
    const checkoutItems = buyNowProduct
        ? [
            {
                product: buyNowProduct._id,
                name: buyNowProduct.name,
                image: buyNowProduct.image,
                price: buyNowProduct.price,
                qty: 1,
            },
          ]
        : cartItems;

    // If there are no items to checkout, redirect back to cart page.
    React.useEffect(() => {
        if (checkoutItems.length === 0) {
            navigate('/cart');
        }
    }, [checkoutItems, navigate]);

    // ==== Form state ====
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [country, setCountry] = useState('Sri Lanka'); // default country for backend compatibility
    const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
    const [isLoading, setIsLoading] = useState(false);

    const itemsPrice = checkoutItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);
    const shippingPrice = calculateShipping(checkoutItems);

    const totalPrice = itemsPrice + shippingPrice;

    const submitHandler = async (e) => {
        e.preventDefault();

        // ---- validation ----
        if (!fullName || !phone || !address || !city || !postalCode) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            setIsLoading(true);

            const orderItems = checkoutItems.map((item) => ({
                product: item.product,
                name: item.name,
                image: item.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=200',
                price: item.price,
                quantity: item.qty || 1,
            }));

            const orderData = {
                orderItems,
                shippingAddress: {
                    fullName,
                    phone,
                    address,
                    city,
                    postalCode,
                    country,
                },
                paymentMethod,
                itemsPrice,
                shippingPrice,
                totalPrice,
            };

            if (paymentMethod === 'Card (Stripe)') {
                const { data } = await api.post('/payments/create-checkout-session', orderData);
                window.location.href = data.url;
            } else {
                await api.post('/orders', orderData);
                toast.success('Order placed successfully! Redirecting to order history...');
                
                // Only clear cart if it wasn't a "buy now" order
                if (!buyNowProduct) {
                    dispatch(clearCartItems());
                }
                
                setTimeout(() => {
                    navigate('/profile');
                }, 2000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || 'Failed to place order';
            toast.error(errorMsg);
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen"
        >
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <LoadingSpinner />
                </div>
            )}
            <h1 className="text-3xl font-black text-brand-text-primary mb-8 tracking-tight">Checkout</h1>

            <form onSubmit={submitHandler} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* ---------- LEFT SIDE ---------- */}
                <div className="lg:col-span-8 space-y-6">
                    <CheckoutForm
                        fullName={fullName} setFullName={setFullName}
                        phone={phone} setPhone={setPhone}
                        address={address} setAddress={setAddress}
                        city={city} setCity={setCity}
                        postalCode={postalCode} setPostalCode={setPostalCode}
                        country={country} setCountry={setCountry}
                        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
                        isLoading={isLoading}
                        checkoutItems={checkoutItems}
                        itemsPrice={itemsPrice}
                        shippingPrice={shippingPrice}
                        totalPrice={totalPrice}
                    />
                </div>

                {/* ---------- RIGHT SIDE (Summary) ---------- */}
                <div className="lg:col-span-4">
                    <div className="bg-brand-card-background p-6 rounded-brand-lg shadow-brand-soft border border-brand-border sticky top-24">
                        <h2 className="text-xl font-extrabold text-brand-text-primary border-b border-brand-border pb-4 mb-4 tracking-tight">
                            Checkout Summary
                        </h2>

                        {/* Items List Mini */}
                        <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
                            {checkoutItems.map((item) => (
                                <div key={item.product} className="flex justify-between items-center text-sm gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-brand-text-primary">{item.qty || 1}x</span>
                                        <span className="text-brand-text-secondary truncate max-w-40">{item.name}</span>
                                    </div>
                                    <span className="font-bold text-brand-primary">
                                        Rs. {(item.price * (item.qty || 1)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price Calculations */}
                        <div className="space-y-3 pb-4 border-t border-b border-brand-border pt-4 mb-4">
                            <div className="flex justify-between text-brand-text-secondary font-medium">
                                <span>Items Subtotal</span>
                                <span className="font-bold text-brand-text-primary">Rs. {itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-brand-text-secondary font-medium">
                                <span>Shipping</span>
                                <span className="font-bold text-brand-text-primary">
                                    {shippingPrice === 0 ? (
                                        <span className="text-brand-success font-bold">Free</span>
                                    ) : (
                                        `Rs. ${shippingPrice.toFixed(2)}`
                                    )}
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between text-lg font-black text-brand-text-primary mb-6">
                            <span>Total Price</span>
                            <span className="text-xl font-black text-brand-primary">Rs. {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </form>
        </motion.div>
    );
};

export default Checkout;

