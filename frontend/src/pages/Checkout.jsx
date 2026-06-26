import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCartItems } from '../store/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import CheckoutForm from '../components/cart/CheckoutForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

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
    const shippingPrice = checkoutItems.reduce((sum, item) => {
    const itemShipping = item.price > 3000 ? 0 : 299 * (item.qty || 1);
    return sum + itemShipping;
  }, 0);

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
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <LoadingSpinner />
                </div>
            )}
            <h1 className="text-3xl font-extrabold text-blue-950 mb-8">Checkout</h1>

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
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-blue-50 sticky top-24">
                        <h2 className="text-xl font-bold text-blue-950 border-b border-gray-100 pb-4 mb-4">
                            Checkout Summary
                        </h2>

                        {/* Items List Mini */}
                        <div className="max-h-48 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-thin">
                            {checkoutItems.map((item) => (
                                <div key={item.product} className="flex justify-between items-center text-sm gap-2">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold text-blue-950">{item.qty || 1}x</span>
                                        <span className="text-gray-600 truncate max-w-40">{item.name}</span>
                                    </div>
                                    <span className="font-semibold text-blue-900">
                                        Rs. {(item.price * (item.qty || 1)).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Price Calculations */}
                        <div className="space-y-3 pb-4 border-t border-b border-gray-100 pt-4 mb-4">
                            <div className="flex justify-between text-gray-600">
                                <span>Items Subtotal</span>
                                <span className="font-semibold text-blue-950">Rs. {itemsPrice.toFixed(2)}</span>
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

                        <div className="flex justify-between text-lg font-bold text-blue-950 mb-6">
                            <span>Total Price</span>
                            <span className="text-xl font-extrabold text-blue-900">Rs. {totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;

