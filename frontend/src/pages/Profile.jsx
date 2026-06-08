import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) return;
      try {
        setLoading(true);
        const { data } = await api.get('/orders/mine');
        setOrders(data);
      } catch (err) {
        const msg = err.response?.data?.message || 'Failed to load orders';
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userInfo]);

  // Handler for updating profile
  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/auth/profile', { name, email, password });
      dispatch(setCredentials(data));
      toast.success('Profile updated');
      setEditMode(false);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    }
  };

  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Edit Profile</h2>
            <form onSubmit={updateProfileHandler} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password (leave blank to keep)</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-blue-900 mb-4">My Profile</h2>
      <div className="mb-6">
        <p className="text-gray-700"><strong>Name:</strong> {userInfo.name}</p>
        <p className="text-gray-700"><strong>Email:</strong> {userInfo.email}</p>
        <p className="text-gray-700"><strong>Role:</strong> {userInfo.role}</p>
        <button
          onClick={() => setEditMode(true)}
          className="mt-2 text-blue-600 hover:underline font-medium"
        >
          Edit Profile
        </button>
      </div>
      <h3 className="text-xl font-semibold text-blue-800 mb-3">Order History</h3>
      {loading ? (
        <p className="text-gray-600">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-600">You have no orders yet.</p>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order._id} className="border p-4 rounded-md bg-gray-50">
              <p className="font-medium">Order ID: {order._id}</p>
              <p>Status: {order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending'}</p>
              <p>Total: Rs. {order.totalPrice?.toFixed(2) || order.totalPrice}</p>
              <Link
                to={`/order/${order._id}`}
                className="text-blue-600 hover:underline mt-2 inline-block"
              >
                View Details
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Profile;
