import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { RefreshCw, Check, ShoppingBag, Eye, X, ShieldCheck, Clock } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/');
    } else {
      fetchOrders();
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/orders');
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const deliverOrder = async (id) => {
    try {
      setUpdatingId(id);
      await api.put(`/orders/${id}/deliver`);
      toast.success('Order marked as delivered');
      fetchOrders();
      // If the currently open modal is the one being delivered, update it in local modal view state
      if (selectedOrder && selectedOrder._id === id) {
        setSelectedOrder(prev => ({ ...prev, isDelivered: true, deliveredAt: Date.now() }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6 pb-12"
    >
      {/* Order Details Modal overlay */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border w-full max-w-3xl overflow-hidden relative flex flex-col my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Customer Order Details</h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Order ID: <span className="font-semibold text-brand-primary select-all">#{selectedOrder._id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-brand-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
                {/* User & Status Details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-brand-md border border-brand-border bg-gray-50/50 flex flex-col justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">Customer Account</p>
                    <p className="text-sm font-black text-brand-text-primary mt-1 truncate">{selectedOrder.user?.name || 'N/A'}</p>
                    <p className="text-xs text-brand-text-secondary truncate mt-0.5">{selectedOrder.user?.email || 'N/A'}</p>
                  </div>

                  <div className={`p-4 rounded-brand-md border flex items-center gap-3 ${
                    selectedOrder.isPaid
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Payment Clearance</p>
                      <p className="text-sm font-black mt-0.5">
                        {selectedOrder.isPaid
                          ? `Paid on ${new Date(selectedOrder.paidAt).toLocaleDateString()}`
                          : 'Pending Payment'}
                      </p>
                    </div>
                  </div>

                  <div className={`p-4 rounded-brand-md border flex items-center gap-3 ${
                    selectedOrder.isDelivered
                      ? 'bg-blue-50 text-blue-800 border-blue-200'
                      : 'bg-gray-50 text-gray-800 border-gray-200'
                  }`}>
                    <Clock className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider opacity-85">Fulfillment Status</p>
                      <p className="text-sm font-black mt-0.5">
                        {selectedOrder.isDelivered
                          ? `Delivered on ${new Date(selectedOrder.deliveredAt).toLocaleDateString()}`
                          : 'Awaiting shipment'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid Split */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Item List */}
                  <div className="md:col-span-7 space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">Cart Items</h3>
                    <div className="divide-y divide-brand-border border border-brand-border rounded-brand-md overflow-hidden bg-white">
                      {selectedOrder.orderItems?.map((item) => (
                        <div key={item._id} className="p-4 flex gap-4 items-center hover:bg-gray-50/30 transition-colors">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded-brand-md border border-brand-border bg-gray-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-brand-text-primary truncate">{item.name}</p>
                            <p className="text-xs text-brand-text-secondary mt-0.5">
                              {item.quantity} x Rs. {item.price?.toLocaleString()}
                            </p>
                          </div>
                          <span className="text-sm font-black text-brand-text-primary shrink-0">
                            Rs. {(item.quantity * item.price)?.toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Pricing summary */}
                  <div className="md:col-span-5 space-y-6">
                    <div className="bg-gray-50/50 border border-brand-border p-4 rounded-brand-lg space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">Delivery Address</h3>
                      <div className="text-xs text-brand-text-secondary leading-relaxed">
                        <p className="font-bold text-brand-text-primary">{selectedOrder.user?.name || 'Customer'}</p>
                        <p className="mt-1">{selectedOrder.shippingAddress?.address}</p>
                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                        <p className="font-bold text-brand-text-primary mt-1">{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 border border-brand-border p-4 rounded-brand-lg space-y-3">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-brand-text-primary">Billing Overview</h3>
                      <div className="space-y-2 text-xs text-brand-text-secondary">
                        <div className="flex justify-between">
                          <span>Gateway:</span>
                          <span className="font-bold text-brand-text-primary capitalize">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-brand-border">
                          <span>Shipping Charge:</span>
                          <span className="font-semibold text-brand-text-primary">
                            {selectedOrder.shippingPrice === 0 ? 'Free' : `Rs. ${selectedOrder.shippingPrice?.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-brand-border text-sm font-black text-brand-text-primary">
                          <span>Revenue Total:</span>
                          <span className="text-brand-primary">Rs. {selectedOrder.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-4 bg-gray-50/60 border-t border-brand-border flex justify-between items-center gap-4">
                <div>
                  {!selectedOrder.isDelivered && (
                    <button
                      onClick={() => deliverOrder(selectedOrder._id)}
                      disabled={updatingId === selectedOrder._id}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-brand-md bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Check className="w-4 h-4" /> Mark as Shipped
                    </button>
                  )}
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-brand-text-primary font-bold rounded-brand-md text-xs transition-all border border-brand-border cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header control row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text-primary tracking-tight flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-brand-primary" />
            Order Fulfillment
          </h1>
          <p className="text-brand-text-secondary text-sm mt-1">
            Track customer invoices, review transaction status, and process deliveries.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-brand-md bg-brand-secondary text-brand-primary font-bold border border-brand-border hover:border-brand-primary transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Orders
        </button>
      </div>

      {/* Orders Table Container */}
      <section className="bg-brand-card-background rounded-brand-lg border border-brand-border shadow-brand-soft overflow-hidden">
        <div className="p-5 border-b border-brand-border">
          <h2 className="text-lg font-black text-brand-text-primary tracking-tight">Active Invoices</h2>
          <p className="text-xs text-brand-text-secondary mt-0.5">Fulfillment workflow and payout statuses</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-brand-border">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Order ID</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Customer Account</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Order Date</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Total Paid</th>
                <th className="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Fulfillment</th>
                <th className="px-6 py-3.5 text-right text-xs font-bold uppercase tracking-wider text-brand-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-brand-text-secondary font-medium">
                    <div className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin text-brand-primary w-5 h-5" />
                      Fetching sales orders...
                    </div>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-brand-text-secondary text-sm">
                    No customer orders found in the database.
                  </td>
                </tr>
              ) : (
                orders.map(order => {
                  const statusBadge = order.isDelivered
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : order.isPaid
                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                    : 'bg-amber-50 text-amber-700 border-amber-100';

                  const statusText = order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending Payment';

                  return (
                    <tr key={order._id} className="hover:bg-gray-50/40 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-brand-text-primary uppercase tracking-wide text-xs">
                        #{order._id?.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-text-secondary">
                        <div className="font-semibold text-brand-text-primary">{order.user?.name || 'Deleted Account'}</div>
                        <div className="text-xs text-gray-400 mt-0.5">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-brand-text-secondary">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        }) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-black text-brand-text-primary">
                        Rs. {order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-bold border ${statusBadge}`}>
                          {statusText}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-brand-md bg-brand-secondary text-brand-primary border border-transparent hover:border-brand-primary text-xs font-bold transition-all cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View Details
                          </button>
                          
                          {!order.isDelivered && (
                            <button
                              onClick={() => deliverOrder(order._id)}
                              disabled={updatingId === order._id}
                              className="inline-flex items-center gap-1 px-3 py-2 rounded-brand-md bg-brand-primary hover:bg-brand-primary-hover text-white text-xs font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                            >
                              <Check className="w-3.5 h-3.5" /> Mark Shipped
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
};

export default OrderManagement;
