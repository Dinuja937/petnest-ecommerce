import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  Users,
  ShoppingCart,
  RefreshCw,
  DollarSign,
  Box,
  AlertTriangle,
  TrendingUp,
  ArrowRight,
  Clock,
  UserPlus,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get('/orders'),
        api.get('/products'),
        api.get('/auth/users'),
      ]);

      setOrders(ordersRes.data || []);
      setProducts(productsRes.data || []);
      setUsers(usersRes.data || []);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to fetch dashboard data. Please try again.');
      toast.error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Access denied. Admins only.');
      navigate('/');
    } else {
      fetchDashboardData();
    }
  }, [userInfo, navigate]);

  // Statistics calculation
  const stats = useMemo(() => {
    const paidOrders = orders.filter((o) => o.isPaid);
    const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);
    const pendingRevenue = orders.filter((o) => !o.isPaid).reduce((sum, o) => sum + Number(o.totalPrice || 0), 0);

    const totalOrdersCount = orders.length;
    const deliveredOrdersCount = orders.filter((o) => o.isDelivered).length;
    const pendingDeliveryCount = orders.filter((o) => !o.isDelivered).length;

    const totalProductsCount = products.length;
    const lowStockCount = products.filter((p) => Number(p.stock || 0) <= 5 && Number(p.stock || 0) > 0).length;
    const outOfStockCount = products.filter((p) => Number(p.stock || 0) === 0).length;

    const totalCustomersCount = users.filter((u) => u.role !== 'admin').length;
    const totalAdminsCount = users.filter((u) => u.role === 'admin').length;

    // Category distribution
    const categoriesCount = {};
    products.forEach((p) => {
      const cat = p.category || 'Other';
      categoriesCount[cat] = (categoriesCount[cat] || 0) + 1;
    });

    return {
      totalRevenue,
      pendingRevenue,
      totalOrdersCount,
      deliveredOrdersCount,
      pendingDeliveryCount,
      totalProductsCount,
      lowStockCount,
      outOfStockCount,
      totalCustomersCount,
      totalAdminsCount,
      categoriesCount,
      paidOrdersCount: paidOrders.length,
    };
  }, [orders, products, users]);

  // Recent lists
  const recentOrders = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [orders]);

  const recentUsers = useMemo(() => {
    return [...users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [users]);

  const lowStockAlerts = useMemo(() => {
    return products
      .filter((p) => Number(p.stock || 0) <= 5)
      .sort((a, b) => Number(a.stock || 0) - Number(b.stock || 0))
      .slice(0, 5);
  }, [products]);

  if (loading && orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-semibold">Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center max-w-md mx-auto px-4">
        <AlertTriangle className="w-16 h-16 text-red-500" />
        <h2 className="text-2xl font-bold text-blue-950">Something went wrong</h2>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow transition-colors"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-blue-950 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            Admin Overview
          </h1>
          <p className="text-gray-500 mt-1">
            Real-time shop statistics, inventory level updates, and recent activity logs.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 font-semibold hover:bg-blue-100 disabled:opacity-60 transition-colors border border-blue-100 cursor-pointer self-stretch md:self-auto justify-center"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Welcome Banner Card */}
      <div className="bg-linear-to-r from-blue-900 via-blue-950 to-indigo-950 text-white rounded-2xl p-6 shadow-md border border-blue-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-bold">Welcome back, {userInfo?.name || 'Admin'}!</h2>
          <p className="text-blue-200 mt-2 text-sm max-w-xl">
            PetNest is active. Currently, there are <span className="font-bold text-white">{stats.pendingDeliveryCount}</span> orders awaiting shipment, and <span className="font-bold text-white">{stats.lowStockCount + stats.outOfStockCount}</span> items triggering inventory stock warnings.
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/admin/products"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition-colors flex items-center gap-1.5"
          >
            Manage Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5"
          >
            Review Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales Revenue */}
        <article className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales (Paid)</p>
              <p className="text-2xl font-extrabold text-blue-950 mt-2">
                Rs. {stats.totalRevenue.toFixed(2)}
              </p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-yellow-500" /> Pending: Rs. {stats.pendingRevenue.toFixed(2)}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </article>

        {/* Total Orders */}
        <article className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Orders Processed</p>
              <p className="text-2xl font-extrabold text-blue-950 mt-2">{stats.totalOrdersCount}</p>
              <p className="text-xs text-gray-400 mt-1">
                {stats.deliveredOrdersCount} delivered · {stats.pendingDeliveryCount} pending
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </article>

        {/* Total Products */}
        <article className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Store Products</p>
              <p className="text-2xl font-extrabold text-blue-950 mt-2">{stats.totalProductsCount}</p>
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1.5">
                {stats.lowStockCount > 0 && (
                  <span className="text-yellow-600 font-medium">{stats.lowStockCount} Low stock</span>
                )}
                {stats.outOfStockCount > 0 && (
                  <span className="text-red-600 font-bold">{stats.outOfStockCount} Out of stock</span>
                )}
                {stats.lowStockCount === 0 && stats.outOfStockCount === 0 && (
                  <span className="text-green-600">All items well stocked</span>
                )}
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Box className="w-6 h-6" />
            </div>
          </div>
        </article>

        {/* Total Customers */}
        <article className="bg-white border border-blue-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Customers</p>
              <p className="text-2xl font-extrabold text-blue-950 mt-2">{stats.totalCustomersCount}</p>
              <p className="text-xs text-gray-400 mt-1">
                Plus {stats.totalAdminsCount} administrators
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>
        </article>
      </section>

      {/* Visual Analytics & Low Stock Column Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Fulfillment Statuses & Product Categories */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-bold text-blue-950">Analytics Summary</h3>
            <p className="text-xs text-gray-500 mt-0.5">Order fulfillment metrics and category stock breakdown.</p>
          </div>

          <div className="space-y-4">
            {/* Payment Status Bar */}
            <div>
              <div className="flex justify-between items-center mb-1 text-sm font-semibold">
                <span className="text-gray-600">Payment Clearance</span>
                <span className="text-emerald-700">
                  {stats.totalOrdersCount > 0
                    ? Math.round((stats.paidOrdersCount / stats.totalOrdersCount) * 100)
                    : 0}
                  % Paid
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalOrdersCount > 0
                        ? (stats.paidOrdersCount / stats.totalOrdersCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* Delivery Status Bar */}
            <div>
              <div className="flex justify-between items-center mb-1 text-sm font-semibold">
                <span className="text-gray-600">Delivery Fulfillment</span>
                <span className="text-blue-700">
                  {stats.totalOrdersCount > 0
                    ? Math.round((stats.deliveredOrdersCount / stats.totalOrdersCount) * 100)
                    : 0}
                  % Dispatched
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${
                      stats.totalOrdersCount > 0
                        ? (stats.deliveredOrdersCount / stats.totalOrdersCount) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Category product stock distribution */}
          <div className="pt-4 border-t border-gray-100 space-y-3.5">
            <h4 className="text-sm font-bold text-blue-950 uppercase tracking-wider">Product Categories</h4>
            <div className="space-y-3">
              {['Dogs', 'Cats', 'Birds'].map((cat) => {
                const count = stats.categoriesCount[cat] || 0;
                const percentage = stats.totalProductsCount > 0 ? (count / stats.totalProductsCount) * 100 : 0;
                const colors = {
                  Dogs: { bar: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50' },
                  Cats: { bar: 'bg-pink-500', text: 'text-pink-700', bg: 'bg-pink-50' },
                  Birds: { bar: 'bg-sky-500', text: 'text-sky-700', bg: 'bg-sky-50' },
                }[cat] || { bar: 'bg-gray-500', text: 'text-gray-700', bg: 'bg-gray-50' };

                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className={`w-16 text-xs font-bold ${colors.text} px-2 py-0.5 rounded-md ${colors.bg} text-center capitalize`}>
                      {cat}
                    </span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${colors.bar} h-full rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-gray-500 w-8 text-right">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Stock Warnings */}
        <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-blue-950">Inventory Warnings</h3>
                <p className="text-xs text-gray-500 mt-0.5">Products running low or out of stock.</p>
              </div>
              {stats.lowStockCount + stats.outOfStockCount > 0 && (
                <span className="bg-red-50 text-red-600 px-2.5 py-1 rounded-full text-xs font-bold border border-red-100">
                  {stats.lowStockCount + stats.outOfStockCount} Warning(s)
                </span>
              )}
            </div>

            {lowStockAlerts.length === 0 ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-sm font-semibold text-gray-600">All products are healthy</p>
                <p className="text-xs text-gray-400 mt-0.5">Every product has at least 6 items in stock.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {lowStockAlerts.map((product) => (
                  <div key={product._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || 'https://placehold.co/100x100?text=PetNest'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-lg border border-gray-100 bg-gray-50"
                      />
                      <div>
                        <p className="text-sm font-bold text-blue-950 line-clamp-1 max-w-50 sm:max-w-xs">{product.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{product.category}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                          Number(product.stock) === 0
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {product.stock} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin/products"
            className="mt-4 pt-3 border-t border-gray-100 text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center gap-1.5 hover:underline"
          >
            Update Catalog Inventory <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Recent Orders & Users Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders - takes 2 cols on wide screens */}
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden xl:col-span-2">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-blue-950">Recent Orders</h3>
              <p className="text-xs text-gray-500 mt-0.5">Lately placed orders on PetNest.</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              All Orders <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-100">
                <thead className="bg-blue-50/20">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">ID</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Customer</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-blue-950 uppercase tracking-wider">Price</th>
                    <th className="px-5 py-3 text-center text-xs font-bold text-blue-950 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100 text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/10 transition-colors">
                      <td className="px-5 py-3 whitespace-nowrap font-semibold text-blue-950">
                        #{order._id?.slice(-6)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap">
                        <div className="text-xs font-medium text-gray-900">{order.user?.name || 'Deleted'}</div>
                        <div className="text-[10px] text-gray-500">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap font-bold text-blue-900">
                        ${order.totalPrice?.toFixed(2)}
                      </td>
                      <td className="px-5 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {order.isPaid ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-green-100 text-green-800 rounded-full">
                              Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-yellow-100 text-yellow-800 rounded-full">
                              Pending
                            </span>
                          )}
                          {order.isDelivered ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-100 text-blue-800 rounded-full">
                              Delivered
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 rounded-full">
                              Transit
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recently Registered Users - takes 1 col on wide screens */}
        <div className="bg-white border border-blue-100 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-blue-950">New Customers</h3>
                <p className="text-xs text-gray-500 mt-0.5">Recently registered accounts.</p>
              </div>
              <Link
                to="/admin/users"
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
              >
                All Users <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No customers found.</div>
            ) : (
              <div className="p-5 space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs uppercase shadow-inner">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-blue-950">{user.name}</p>
                        <p className="text-[10px] text-gray-400 truncate max-w-35">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
            <span className="text-[11px] text-gray-500">
              Admin members can manage and revoke roles.
            </span>
          </div>
        </div>
      </section>

      {/* Quick Actions Shortcuts */}
      <footer className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-blue-950 mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-50 bg-blue-50/20 text-center hover:bg-blue-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-950">Add/Edit Products</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-50 bg-blue-50/20 text-center hover:bg-blue-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-950">Fulfill Orders</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-50 bg-blue-50/20 text-center hover:bg-blue-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-950">Manage Access</span>
          </Link>

          <Link
            to="/admin/profile"
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-blue-50 bg-blue-50/20 text-center hover:bg-blue-50 transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-blue-950">My Admin Profile</span>
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default AdminDashboard;
