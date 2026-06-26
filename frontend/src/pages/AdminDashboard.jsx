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
  ArrowRight,
  Clock,
  ShoppingBag,
  ShieldCheck,
  ChevronRight,
  Package,
  LayoutDashboard,
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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
        <RefreshCw className="w-10 h-10 text-brand-primary animate-spin" />
        <p className="text-brand-text-secondary font-medium text-sm">Loading dashboard metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center max-w-md mx-auto px-4">
        <AlertTriangle className="w-12 h-12 text-brand-danger" />
        <h2 className="text-xl font-black text-brand-text-primary">Something went wrong</h2>
        <p className="text-xs text-brand-text-secondary">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-5 py-2.5 rounded-brand-md bg-brand-primary hover:bg-brand-primary-hover text-white font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-7xl mx-auto space-y-6 pb-12"
    >
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text-primary tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-brand-primary" />
            Dashboard Overview
          </h1>
          <p className="text-brand-text-secondary text-sm mt-1">
            Real-time analytics metrics, active stock alerts, and store logs.
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-brand-md bg-brand-secondary text-brand-primary font-bold border border-brand-border hover:border-brand-primary transition-all cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Stats
        </button>
      </div>

      {/* Welcome Banner Card */}
      <div className="bg-linear-to-r from-brand-text-primary to-indigo-950 text-white rounded-brand-lg p-6 shadow-brand-soft border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-black">Welcome back, {userInfo?.name || 'Admin'}!</h2>
          <p className="text-gray-300 mt-2 text-sm max-w-xl leading-relaxed">
            PetNest is active. Currently, there are <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{stats.pendingDeliveryCount}</span> orders awaiting shipment, and <span className="font-bold text-white bg-white/10 px-2 py-0.5 rounded">{stats.lowStockCount + stats.outOfStockCount}</span> items triggering inventory stock warnings.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 bg-brand-primary hover:bg-brand-primary-hover text-white font-bold text-xs rounded-brand-md shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Manage Products <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/admin/orders"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/25 text-white font-bold text-xs rounded-brand-md transition-all flex items-center gap-1.5 cursor-pointer"
          >
            Review Orders
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales Revenue */}
        <article className="bg-brand-card-background border border-brand-border rounded-brand-lg p-5 shadow-brand-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Total Sales (Paid)</p>
              <p className="text-2xl font-black text-brand-text-primary mt-2">
                Rs. {stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </p>
              <p className="text-[10px] text-brand-text-secondary mt-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Pending: Rs. {stats.pendingRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-11 h-11 rounded-brand-md bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </article>

        {/* Total Orders */}
        <article className="bg-brand-card-background border border-brand-border rounded-brand-lg p-5 shadow-brand-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Orders Processed</p>
              <p className="text-2xl font-black text-brand-text-primary mt-2">{stats.totalOrdersCount}</p>
              <p className="text-[10px] text-brand-text-secondary mt-1.5">
                {stats.deliveredOrdersCount} delivered · {stats.pendingDeliveryCount} pending
              </p>
            </div>
            <div className="w-11 h-11 rounded-brand-md bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </article>

        {/* Total Products */}
        <article className="bg-brand-card-background border border-brand-border rounded-brand-lg p-5 shadow-brand-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Store Products</p>
              <p className="text-2xl font-black text-brand-text-primary mt-2">{stats.totalProductsCount}</p>
              <p className="text-[10px] text-brand-text-secondary mt-1.5 flex items-center gap-1.5">
                {stats.lowStockCount > 0 && (
                  <span className="text-amber-600 font-bold">{stats.lowStockCount} Low stock</span>
                )}
                {stats.outOfStockCount > 0 && (
                  <span className="text-brand-danger font-black">{stats.outOfStockCount} Sold out</span>
                )}
                {stats.lowStockCount === 0 && stats.outOfStockCount === 0 && (
                  <span className="text-brand-success font-bold">Catalog Healthy</span>
                )}
              </p>
            </div>
            <div className="w-11 h-11 rounded-brand-md bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center">
              <Box className="w-5 h-5" />
            </div>
          </div>
        </article>

        {/* Total Customers */}
        <article className="bg-brand-card-background border border-brand-border rounded-brand-lg p-5 shadow-brand-soft">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Active Customers</p>
              <p className="text-2xl font-black text-brand-text-primary mt-2">{stats.totalCustomersCount}</p>
              <p className="text-[10px] text-brand-text-secondary mt-1.5">
                Plus {stats.totalAdminsCount} administrators
              </p>
            </div>
            <div className="w-11 h-11 rounded-brand-md bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </article>
      </section>

      {/* Visual Analytics & Low Stock Column Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Fulfillment Statuses & Product Categories */}
        <div className="bg-brand-card-background border border-brand-border rounded-brand-lg p-6 shadow-brand-soft space-y-6">
          <div>
            <h3 className="text-lg font-black text-brand-text-primary tracking-tight">Analytics Summary</h3>
            <p className="text-xs text-brand-text-secondary mt-0.5">Order fulfillment metrics and category stock distribution.</p>
          </div>

          <div className="space-y-4">
            {/* Payment Status Bar */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs font-bold">
                <span className="text-brand-text-secondary">Payment Clearance Rate</span>
                <span className="text-emerald-700">
                  {stats.totalOrdersCount > 0
                    ? Math.round((stats.paidOrdersCount / stats.totalOrdersCount) * 100)
                    : 0}
                  % Paid
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
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
              <div className="flex justify-between items-center mb-1 text-xs font-bold">
                <span className="text-brand-text-secondary">Fulfillment Rate</span>
                <span className="text-brand-primary">
                  {stats.totalOrdersCount > 0
                    ? Math.round((stats.deliveredOrdersCount / stats.totalOrdersCount) * 100)
                    : 0}
                  % Shipped
                </span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-brand-primary h-full rounded-full transition-all duration-500"
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
          <div className="pt-4 border-t border-brand-border space-y-3">
            <h4 className="text-xs font-bold text-brand-text-primary uppercase tracking-wider">Product Category Mix</h4>
            <div className="space-y-3.5">
              {['Dogs', 'Cats', 'Birds'].map((cat) => {
                const count = stats.categoriesCount[cat] || 0;
                const percentage = stats.totalProductsCount > 0 ? (count / stats.totalProductsCount) * 100 : 0;
                const colors = {
                  Dogs: { bar: 'bg-amber-500', text: 'text-amber-700 border-amber-100 bg-amber-50' },
                  Cats: { bar: 'bg-pink-500', text: 'text-pink-700 border-pink-100 bg-pink-50' },
                  Birds: { bar: 'bg-sky-500', text: 'text-sky-700 border-sky-100 bg-sky-50' },
                }[cat] || { bar: 'bg-gray-500', text: 'text-gray-700 border-gray-100 bg-gray-50' };

                return (
                  <div key={cat} className="flex items-center gap-3">
                    <span className={`w-16 text-[10px] font-bold ${colors.text} py-0.5 rounded text-center capitalize border`}>
                      {cat}
                    </span>
                    <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${colors.bar} h-full rounded-full`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-brand-text-secondary w-16 text-right">
                      {count} items
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Inventory Stock Warnings */}
        <div className="bg-brand-card-background border border-brand-border rounded-brand-lg p-6 shadow-brand-soft flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-black text-brand-text-primary tracking-tight">Stock Alerts</h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">Products running low or out of stock.</p>
              </div>
              {stats.lowStockCount + stats.outOfStockCount > 0 && (
                <span className="bg-brand-danger/10 text-brand-danger px-2.5 py-1 rounded-full text-[10px] font-black border border-brand-danger/20 tracking-wider uppercase">
                  {stats.lowStockCount + stats.outOfStockCount} Alerts
                </span>
              )}
            </div>

            {lowStockAlerts.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <ShieldCheck className="w-10 h-10 text-brand-success mb-2" />
                <p className="text-sm font-bold text-brand-text-primary">Stock levels healthy</p>
                <p className="text-xs text-brand-text-secondary mt-0.5">Every catalog item is well-supplied.</p>
              </div>
            ) : (
              <div className="divide-y divide-brand-border">
                {lowStockAlerts.map((product) => (
                  <div key={product._id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || 'https://placehold.co/100x100?text=PetNest'}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded-brand-md border border-brand-border bg-gray-50 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-text-primary truncate max-w-[150px] sm:max-w-xs">{product.name}</p>
                        <p className="text-[10px] text-brand-text-secondary capitalize">{product.category}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${
                        Number(product.stock) === 0
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}
                    >
                      {product.stock} left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/admin/products"
            className="mt-4 pt-3 border-t border-brand-border text-xs font-bold text-brand-primary hover:text-brand-primary-hover flex items-center justify-center gap-1 hover:underline cursor-pointer"
          >
            Update Catalog Inventory <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* Recent Orders & Users Grid */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="bg-brand-card-background border border-brand-border rounded-brand-lg shadow-brand-soft overflow-hidden xl:col-span-2">
          <div className="p-5 border-b border-brand-border flex justify-between items-center">
            <div>
              <h3 className="text-lg font-black text-brand-text-primary tracking-tight">Recent Orders</h3>
              <p className="text-xs text-brand-text-secondary mt-0.5">Latest transactions on PetNest.</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-0.5 cursor-pointer"
            >
              All Orders <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-brand-text-secondary text-sm">No orders found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-brand-border">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-brand-text-secondary uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3.5 text-left text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3.5 text-center text-xs font-bold text-brand-text-secondary uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border bg-white text-sm">
                  {recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50/40 transition-colors">
                      <td className="px-6 py-3 whitespace-nowrap font-bold text-brand-text-primary uppercase tracking-wide text-xs">
                        #{order._id?.slice(-6)}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap">
                        <div className="text-xs font-bold text-brand-text-primary">{order.user?.name || 'Deleted'}</div>
                        <div className="text-[10px] text-brand-text-secondary">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap font-black text-brand-text-primary">
                        Rs. {order.totalPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-3 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {order.isPaid ? (
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border bg-green-50 text-green-700 border-green-100 rounded-full">
                              Paid
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border bg-amber-50 text-amber-700 border-amber-100 rounded-full">
                              Pending
                            </span>
                          )}
                          {order.isDelivered ? (
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border bg-blue-50 text-blue-700 border-blue-100 rounded-full">
                              Delivered
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider border bg-gray-50 text-gray-600 border-gray-200 rounded-full">
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

        {/* Recently Registered Users */}
        <div className="bg-brand-card-background border border-brand-border rounded-brand-lg shadow-brand-soft overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-brand-border flex justify-between items-center">
              <div>
                <h3 className="text-lg font-black text-brand-text-primary tracking-tight">New Members</h3>
                <p className="text-xs text-brand-text-secondary mt-0.5">Recently registered profiles.</p>
              </div>
              <Link
                to="/admin/users"
                className="text-xs font-bold text-brand-primary hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                All Users <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentUsers.length === 0 ? (
              <div className="py-12 text-center text-brand-text-secondary text-sm">No customers found.</div>
            ) : (
              <div className="p-5 space-y-4">
                {recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-brand-secondary text-brand-primary flex items-center justify-center font-bold text-xs uppercase shadow-inner shrink-0 border border-brand-border">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-brand-text-primary truncate">{user.name}</p>
                        <p className="text-[10px] text-brand-text-secondary truncate">{user.email}</p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border shrink-0 ${
                        user.role === 'admin'
                          ? 'bg-purple-50 text-purple-700 border-purple-100'
                          : 'bg-green-50 text-green-700 border-green-100'
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-gray-50/50 border-t border-brand-border text-center">
            <span className="text-[10px] font-medium text-brand-text-secondary">
              Update profiles and grant/revoke access.
            </span>
          </div>
        </div>
      </section>

      {/* Quick Actions Shortcuts */}
      <footer className="bg-brand-card-background border border-brand-border rounded-brand-lg p-6 shadow-brand-soft">
        <h3 className="text-sm font-bold text-brand-text-primary uppercase tracking-wider mb-4">Quick Management Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/admin/products"
            className="flex flex-col items-center justify-center p-4 rounded-brand-md border border-brand-border bg-gray-50/40 text-center hover:bg-brand-secondary hover:border-brand-primary transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-brand-md bg-white border border-brand-border text-brand-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-text-primary">Manage Catalog</span>
          </Link>

          <Link
            to="/admin/orders"
            className="flex flex-col items-center justify-center p-4 rounded-brand-md border border-brand-border bg-gray-50/40 text-center hover:bg-brand-secondary hover:border-brand-primary transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-brand-md bg-white border border-brand-border text-brand-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-text-primary">Fulfill Orders</span>
          </Link>

          <Link
            to="/admin/users"
            className="flex flex-col items-center justify-center p-4 rounded-brand-md border border-brand-border bg-gray-50/40 text-center hover:bg-brand-secondary hover:border-brand-primary transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-brand-md bg-white border border-brand-border text-brand-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
              <Users className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-text-primary">Customer Accounts</span>
          </Link>

          <Link
            to="/admin/profile"
            className="flex flex-col items-center justify-center p-4 rounded-brand-md border border-brand-border bg-gray-50/40 text-center hover:bg-brand-secondary hover:border-brand-primary transition-all group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-brand-md bg-white border border-brand-border text-brand-primary flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold text-brand-text-primary">My Profile settings</span>
          </Link>
        </div>
      </footer>
    </motion.div>
  );
};

export default AdminDashboard;
