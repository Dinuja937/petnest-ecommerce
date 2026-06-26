import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import { Link } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Shield, ShieldCheck, ChevronRight, Edit3, ShoppingBag, Clock, X, Lock, Eye, Check } from 'lucide-react';

const Profile = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(userInfo?.profilePicture || '');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo || userInfo.role === 'admin') return;
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

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append('name', name);
      form.append('email', email);
      if (password) form.append('password', password);
      
      if (imageFile) {
        form.append('image', imageFile);
      } else if (imagePreview === '') {
        form.append('profilePicture', '');
      }

      const { data } = await api.put('/auth/profile', form);
      dispatch(setCredentials({ ...data, token: userInfo.token }));
      toast.success('Profile updated successfully');
      setEditMode(false);
      setPassword('');
      setImageFile(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      toast.error(msg);
    }
  };

  if (!userInfo) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-6xl mx-auto px-4 py-8 min-h-screen space-y-8"
    >
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {editMode && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-55 p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border p-6 w-full max-w-md overflow-hidden relative"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-black text-brand-text-primary">Edit Profile</h2>
                  <p className="text-xs text-brand-text-secondary">Update your personal account details</p>
                </div>
                <button
                  onClick={() => setEditMode(false)}
                  className="p-2 hover:bg-gray-100 rounded-brand-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={updateProfileHandler} className="space-y-4">
                {/* Profile Picture Gallery Upload */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <div className="w-20 h-20 rounded-full border border-brand-border bg-gray-50 overflow-hidden flex items-center justify-center relative shadow-sm">
                    {imagePreview ? (
                      <img src={imagePreview} alt="avatar preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <label className="text-xs font-bold text-brand-primary bg-brand-secondary border border-brand-primary/20 px-3 py-1.5 rounded-brand-md hover:bg-brand-primary hover:text-white transition-all cursor-pointer">
                      Choose Picture
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    
                    {imagePreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                        className="text-xs font-bold text-brand-danger bg-brand-danger/10 border border-brand-danger/20 px-3 py-1.5 rounded-brand-md hover:bg-brand-danger hover:text-white transition-all cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4.5 h-4.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Leave blank to keep current"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-brand-md border border-gray-300 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all text-sm placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-brand-text-primary font-bold rounded-brand-md transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-brand-md shadow-md hover:shadow-lg transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-55 p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border w-full max-w-3xl overflow-hidden relative flex flex-col my-8"
            >
              {/* Header */}
              <div className="p-6 border-b border-brand-border flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Order Details</h2>
                  <p className="text-xs text-brand-text-secondary mt-0.5">Order ID: <span className="font-semibold text-brand-primary select-all">#{selectedOrder._id}</span></p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-gray-100 rounded-brand-md text-brand-text-secondary hover:text-brand-text-primary transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-6 max-h-[60vh]">
                {/* Status Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-brand-md border flex items-center gap-3 ${
                    selectedOrder.isPaid
                      ? 'bg-green-50 text-green-800 border-green-200'
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    <ShieldCheck className="w-5 h-5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider opacity-85">Payment Status</p>
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
                      <p className="text-xs font-bold uppercase tracking-wider opacity-85">Delivery Status</p>
                      <p className="text-sm font-black mt-0.5">
                        {selectedOrder.isDelivered
                          ? `Shipped on ${new Date(selectedOrder.deliveredAt).toLocaleDateString()}`
                          : 'Preparing for shipment'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Split grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  {/* Items - 7 cols */}
                  <div className="md:col-span-7 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-primary">Items Ordered</h3>
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

                  {/* Summary & Shipping - 5 cols */}
                  <div className="md:col-span-5 space-y-6">
                    <div className="bg-gray-50/50 border border-brand-border p-4 rounded-brand-lg space-y-4">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-primary">Shipping Address</h3>
                      <div className="text-xs text-brand-text-secondary leading-relaxed">
                        <p className="font-semibold text-brand-text-primary">{userInfo.name}</p>
                        <p className="mt-1">{selectedOrder.shippingAddress?.address}</p>
                        <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}</p>
                        <p className="font-bold text-brand-text-primary mt-1">{selectedOrder.shippingAddress?.country}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50/50 border border-brand-border p-4 rounded-brand-lg space-y-3">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-brand-text-primary">Billing Summary</h3>
                      <div className="space-y-2 text-xs text-brand-text-secondary">
                        <div className="flex justify-between">
                          <span>Payment Method:</span>
                          <span className="font-bold text-brand-text-primary capitalize">{selectedOrder.paymentMethod}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-dashed border-brand-border">
                          <span>Shipping:</span>
                          <span className="font-semibold text-brand-text-primary">
                            {selectedOrder.shippingPrice === 0 ? 'Free' : `Rs. ${selectedOrder.shippingPrice?.toLocaleString()}`}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-brand-border text-sm font-black text-brand-text-primary">
                          <span>Grand Total:</span>
                          <span className="text-brand-primary">Rs. {selectedOrder.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 bg-gray-50/60 border-t border-brand-border flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-brand-md text-xs transition-all shadow-md cursor-pointer"
                >
                  Close View
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Grid Layout: Profile Card (1/3) + Orders History (2/3) */}
      <div className={`grid grid-cols-1 ${userInfo.role === 'admin' ? 'max-w-xl mx-auto' : 'lg:grid-cols-12'} gap-8 items-start`}>
        {/* Left Side: Profile Information */}
        <div className={userInfo.role === 'admin' ? 'w-full' : 'lg:col-span-4 space-y-6'}>
          <div className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border overflow-hidden">
            {/* Header background decoration */}
            <div className="h-24 bg-linear-to-r from-brand-primary to-indigo-600 relative" />
            
            <div className="px-6 pb-6 relative">
              {/* User Avatar Circle */}
              <div className="w-20 h-20 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center font-black text-2xl text-brand-primary absolute -top-10 left-6 overflow-hidden">
                {userInfo.profilePicture ? (
                  <img src={userInfo.profilePicture} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  userInfo.name?.charAt(0)?.toUpperCase()
                )}
              </div>

              <div className="pt-12 space-y-4">
                <div>
                  <h2 className="text-xl font-black text-brand-text-primary leading-tight">{userInfo.name}</h2>
                  <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-secondary rounded-full border border-brand-primary/20">
                    <Shield className="w-3 h-3" />
                    {userInfo.role === 'admin' ? 'Administrator' : 'Customer'}
                  </span>
                </div>

                <div className="space-y-3.5 pt-2 text-sm border-t border-brand-border">
                  <div className="flex items-center gap-3 text-brand-text-secondary">
                    <Mail className="w-4.5 h-4.5 text-gray-400 shrink-0" />
                    <span className="truncate">{userInfo.email}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setName(userInfo.name || '');
                    setEmail(userInfo.email || '');
                    setPassword('');
                    setImageFile(null);
                    setImagePreview(userInfo.profilePicture || '');
                    setEditMode(true);
                  }}
                  className="w-full py-3 border border-brand-border hover:border-brand-primary hover:bg-brand-secondary text-brand-primary font-bold rounded-brand-md transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
                >
                  <Edit3 className="w-4.5 h-4.5" />
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Order History (Only if user is not Admin) */}
        {userInfo.role !== 'admin' && (
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-brand-card-background rounded-brand-lg shadow-brand-soft border border-brand-border p-6 md:p-8">
              <div className="flex items-center justify-between border-b border-brand-border pb-5 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-secondary rounded-brand-md flex items-center justify-center text-brand-primary border border-brand-border">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Order History</h2>
                    <p className="text-xs text-brand-text-secondary mt-0.5">Track your purchases and delivery updates</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-brand-text-secondary">{orders.length} Order(s)</span>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <Clock className="w-8 h-8 text-brand-primary animate-spin" />
                  <p className="text-sm font-medium text-brand-text-secondary">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="py-16 text-center max-w-sm mx-auto">
                  <div className="mx-auto h-16 w-16 bg-brand-secondary text-brand-primary rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-7 h-7" />
                  </div>
                  <h3 className="text-base font-black text-brand-text-primary">No Orders Found</h3>
                  <p className="text-xs text-brand-text-secondary mt-1 mb-6">
                    You haven&apos;t placed any orders yet. Visit our catalog and find the best items for your pet!
                  </p>
                  <Link
                    to="/shop"
                    className="inline-flex items-center justify-center px-5 py-3 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold rounded-brand-md text-sm transition-all shadow-md"
                  >
                    Browse Shop
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const statusColors = order.isDelivered
                      ? 'bg-brand-success/10 text-brand-success border-brand-success/20'
                      : order.isPaid
                      ? 'bg-blue-50 text-blue-700 border-blue-100'
                      : 'bg-amber-50 text-amber-700 border-amber-100';

                    const statusText = order.isDelivered ? 'Delivered' : order.isPaid ? 'Paid' : 'Pending Payment';

                    return (
                      <div
                        key={order._id}
                        className="border border-brand-border hover:border-brand-primary rounded-brand-lg p-5 bg-gray-50/40 hover:bg-white transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 group"
                      >
                        <div className="space-y-1">
                          <p className="text-xs text-brand-text-secondary font-medium">
                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="text-sm font-black text-brand-text-primary uppercase tracking-wide">
                            Order ID: <span className="font-semibold text-xs select-all text-gray-500">#{order._id?.slice(-8)}</span>
                          </p>
                          <p className="text-sm font-extrabold text-brand-primary pt-1">
                            Rs. {order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="flex sm:flex-col items-start sm:items-end gap-3 sm:gap-2 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-brand-border">
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${statusColors}`}>
                            {statusText}
                          </span>

                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-brand-text-primary group-hover:text-brand-primary transition-colors hover:underline mt-1 cursor-pointer"
                          >
                            View Details
                            <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;
