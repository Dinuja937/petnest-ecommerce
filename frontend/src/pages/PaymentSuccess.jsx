import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCartItems } from '../store/slices/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sessionId = searchParams.get('session_id');

    useEffect(() => {
        const verify = async () => {
            try {
                await api.get(`/payments/success?session_id=${sessionId}`);
                toast.success('Payment Successful! Order created.');
                dispatch(clearCartItems());
                setTimeout(() => navigate('/profile'), 2500);
            } catch (err) {
                toast.error(err.response?.data?.message || 'Payment verification failed');
                navigate('/cart');
            }
        };
        if (sessionId) verify();
    }, [sessionId, dispatch, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
            <LoadingSpinner />
            <h1 className="text-2xl font-bold text-blue-900 mt-4">
                Verifying your payment…
            </h1>
        </div>
    );
};

export default PaymentSuccess;
