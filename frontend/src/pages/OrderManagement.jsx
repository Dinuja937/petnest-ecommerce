import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Trash2, Check } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector(state => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

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
      setOrders(data);
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
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-blue-950 mb-4">Order Management</h2>
      <button
        onClick={fetchOrders}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
      >
        <RefreshCw className={loading ? 'animate-spin' : ''} size={16} />
        Refresh
      </button>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">ID</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Date</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-700">{order._id}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{order.user?.email || 'N/A'}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-sm font-medium text-blue-900">
                  Rs. {order.totalPrice?.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-sm">
                  {order.isDelivered ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                  ) : (
                    <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                  )}
                </td>
                <td className="px-4 py-2 text-center">
                  {!order.isDelivered && (
                    <button
                      onClick={() => deliverOrder(order._id)}
                      disabled={updatingId === order._id}
                      className="flex items-center gap-1 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                    >
                      <Check size={14} /> Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderManagement;
