import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
            Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-6">
            You have cancelled the payment or an error occurred.
        </p>
        <Link
            to="/cart"
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition"
        >
            Return to Cart
        </Link>
    </div>
);

export default PaymentCancel;
