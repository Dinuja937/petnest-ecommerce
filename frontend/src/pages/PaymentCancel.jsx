import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCancel = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-linear-to-b from-brand-secondary/40 to-white px-4 py-12">
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border p-8 text-center"
        >
            <div className="relative flex items-center justify-center mb-6">
                <div className="absolute w-20 h-20 bg-brand-danger/10 rounded-full animate-pulse opacity-50"></div>
                <div className="relative w-16 h-16 bg-brand-danger/5 rounded-full flex items-center justify-center text-brand-danger">
                    <XCircle size={36} />
                </div>
            </div>

            <h1 className="text-2xl font-black text-brand-text-primary mb-2 tracking-tight">
                Payment Cancelled
            </h1>
            <p className="text-brand-text-secondary text-sm mb-8 leading-relaxed">
                You have cancelled the Stripe checkout process, or an error occurred during payment. No funds were charged.
            </p>

            <Link
                to="/cart"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 border border-transparent text-sm font-bold rounded-brand-md text-white bg-brand-primary hover:bg-brand-primary-hover transition-all shadow-md hover:shadow-lg gap-2 cursor-pointer"
            >
                <ArrowLeft size={16} /> Return to Cart
            </Link>
        </motion.div>
    </div>
);

export default PaymentCancel;
