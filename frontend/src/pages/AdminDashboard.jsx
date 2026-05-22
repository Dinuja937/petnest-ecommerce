import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingCart, ShieldAlert, Check, RefreshCw, Trash2 } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/');
    }
  }, [userInfo, navigate]);

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const { data } = await api.get('/orders');
      setOrders(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const { data } = await api.get('/auth/users');
      setUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      if (activeTab === 'orders') {
        fetchOrders();
      } else {
        fetchUsers();
      }
    }
  }, [activeTab, userInfo]);

  const deliverOrderHandler = async (id) => {
    try {
      setUpdatingId(id);
      await api.put(`/orders/${id}/deliver`);
      toast.success('Order marked as delivered!');
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteUserHandler = async (id) => {
    if (id === userInfo._id) {
      toast.error('You cannot delete your own admin account!');
      return;
    }
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950 flex items-center gap-2.5">
            <ShieldAlert className="text-blue-600 w-8 h-8" /> Admin Control Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Manage users, view shop activities, and dispatch pet orders.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-white rounded-xl shadow-sm border border-blue-50 p-1 self-stretch md:self-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'orders'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
          >
            <ShoppingCart className="w-4 h-4" /> Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'users'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
          >
            <Users className="w-4 h-4" /> Users ({users.length})
          </button>
        </div>
      </div>

      {activeTab === 'orders' ? (
        /* Orders tab panel */
        <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-950">Orders Management</h2>
            <button
              onClick={fetchOrders}
              disabled={loadingOrders}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Refresh Orders"
            >
              <RefreshCw className={`w-5 h-5 ${loadingOrders ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingOrders && orders.length === 0 ? (
            <div className="py-20 text-center text-gray-500">Loading order items...</div>
          ) : orders.length === 0 ? (
            <div className="py-20 text-center text-gray-500">No orders placed yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-blue-50/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Paid</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Delivered</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-950 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-950">#{order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.user?.name || 'Deleted User'}</div>
                        <div className="text-xs text-gray-500">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-900">${order.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isPaid ? (
                          <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">
                            Paid
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-800 rounded-full">
                            Pending
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.isDelivered ? (
                          <span className="px-2.5 py-1 text-xs font-bold bg-green-100 text-green-800 rounded-full">
                            Delivered
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 text-xs font-bold bg-yellow-100 text-yellow-800 rounded-full">
                            In Transit
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {!order.isDelivered && (
                          <button
                            disabled={updatingId === order._id}
                            onClick={() => deliverOrderHandler(order._id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1.5 px-3 rounded-lg text-xs transition-colors flex items-center gap-1 mx-auto"
                          >
                            <Check className="w-3.5 h-3.5" /> Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Users tab panel */
        <div className="bg-white rounded-2xl shadow-xl border border-blue-50 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-blue-950">Users Directory</h2>
            <button
              onClick={fetchUsers}
              disabled={loadingUsers}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
              title="Refresh Users"
            >
              <RefreshCw className={`w-5 h-5 ${loadingUsers ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loadingUsers && users.length === 0 ? (
            <div className="py-20 text-center text-gray-500">Loading user profiles...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-blue-50/30">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-blue-950 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">#{user._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-950">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 text-xs font-bold rounded-full ${user.role === 'admin'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                            }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        {user._id !== userInfo._id && (
                          <button
                            onClick={() => deleteUserHandler(user._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
