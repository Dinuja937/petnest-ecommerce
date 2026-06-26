import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCartItems } from '../store/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import { CheckCircle, AlertCircle, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionId = searchParams.get('session_id');

    const [status, setStatus] = useState('verifying'); // 'verifying' | 'success' | 'error'
    const [errorMessage, setErrorMessage] = useState('');
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        const verify = async () => {
            try {
                await api.get(`/payments/success?session_id=${sessionId}`);
                toast.success('Payment Successful! Order created.');
                dispatch(clearCartItems());
                setStatus('success');
            } catch (err) {
                const msg = err.response?.data?.message || 'Payment verification failed';
                toast.error(msg);
                setErrorMessage(msg);
                setStatus('error');
            }
        };
        if (sessionId) {
            verify();
        } else {
            setStatus('error');
            setErrorMessage('Payment session ID is missing.');
        }
    }, [sessionId, dispatch]);

    useEffect(() => {
        if (status !== 'success') return;

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    navigate('/profile');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [status, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-linear-to-b from-brand-secondary/40 to-white px-4 py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-lg bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border p-8 text-center transition-all duration-300"
            >
                {status === 'verifying' && (
                    <div className="flex flex-col items-center py-6">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute w-20 h-20 bg-blue-100 rounded-full animate-ping opacity-25"></div>
                            <div className="relative w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-black text-brand-text-primary mb-2 tracking-tight">
                            Verifying your payment...
                        </h1>
                        <p className="text-brand-text-secondary text-sm max-w-sm">
                            We are processing your payment with Stripe. Please do not close or refresh this page.
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center py-4">
                        <div className="relative flex items-center justify-center mb-6 animate-scale-up">
                            <div className="absolute w-24 h-24 bg-emerald-100 rounded-full animate-pulse opacity-50"></div>
                            <div className="relative w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-emerald-500" />
                            </div>
                        </div>

                        <h1 className="text-3xl font-black text-brand-primary mb-2 tracking-tight">
                            Payment Successful!
                        </h1>

                        <p className="text-brand-text-secondary font-medium mb-6">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>

                        <div className="w-full bg-brand-secondary/45 border border-brand-border rounded-brand-md p-5 mb-8 text-left space-y-3">
                            <div className="flex items-center gap-3 text-sm text-brand-text-primary">
                                <span className="w-2 h-2 rounded-full bg-brand-success"></span>
                                <span>Order processed successfully</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-brand-text-primary">
                                <span className="w-2 h-2 rounded-full bg-brand-success"></span>
                                <span>Order details sent to your profile</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-brand-text-primary">
                                <span className="w-2 h-2 rounded-full bg-brand-success"></span>
                                <span>Preparing shipment for dispatch</span>
                            </div>
                        </div>

                        <div className="text-sm text-brand-text-primary font-semibold mb-6 flex items-center justify-center gap-1.5 bg-brand-secondary/45 px-4 py-2 rounded-full border border-brand-border">
                            <span>Redirecting to your profile in</span>
                            <span className="inline-flex items-center justify-center bg-brand-primary text-white w-6 h-6 rounded-full font-bold text-xs">
                                {countdown}
                            </span>
                            <span>seconds...</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => navigate('/profile')}
                                className="flex-1 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold py-3.5 px-6 rounded-brand-md transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                View Orders <ArrowRight className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => navigate('/shop')}
                                className="flex-1 bg-white hover:bg-gray-50 text-brand-text-secondary border border-brand-border font-bold py-3.5 px-6 rounded-brand-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <ShoppingBag className="w-4 h-4" /> Continue Shopping
                            </button>
                        </div>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center py-4">
                        <div className="relative flex items-center justify-center mb-6">
                            <div className="absolute w-20 h-20 bg-rose-100 rounded-full animate-pulse opacity-50"></div>
                            <div className="relative w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-10 h-10 text-rose-500" />
                            </div>
                        </div>

                        <h1 className="text-2xl font-black text-brand-danger mb-2 tracking-tight">
                            Payment Verification Failed
                        </h1>

                        <p className="text-brand-text-secondary text-sm max-w-sm mb-8">
                            {errorMessage || 'Something went wrong while confirming your payment with Stripe.'}
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full">
                            <button
                                onClick={() => navigate('/cart')}
                                className="flex-1 bg-brand-danger hover:bg-red-650 text-white font-bold py-3 px-6 rounded-brand-md transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Return to Cart
                            </button>
                            <button
                                onClick={() => navigate('/contact')}
                                className="flex-1 bg-white hover:bg-gray-50 text-brand-text-secondary border border-brand-border font-bold py-3 px-6 rounded-brand-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                                Contact Support
                            </button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
