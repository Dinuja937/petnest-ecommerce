import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [orders, setOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

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

  if (!userInfo) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-900 mb-4">My Profile</h2>
      <div className="mb-6">
        <p className="text-gray-700"><strong>Name:</strong> {userInfo.name}</p>
        <p className="text-gray-700"><strong>Email:</strong> {userInfo.email}</p>
        <p className="text-gray-700"><strong>Role:</strong> {userInfo.role}</p>
        <Link to="/" className="inline-block mt-2 text-blue-600 hover:underline">
          Edit Profile (coming soon)
        </Link>
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
              <p>Total: ${order.totalPrice?.toFixed(2) || order.totalPrice}</p>
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
