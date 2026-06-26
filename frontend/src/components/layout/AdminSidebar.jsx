import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, Users, LogOut, User, Menu, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/', { replace: true });
    } catch (err) {
      dispatch(logout());
      toast.success('Logged out successfully');
      navigate('/', { replace: true });
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-brand-md transition-all duration-200 text-sm font-medium ${
      isActive
        ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20 font-semibold'
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 md:hidden bg-brand-text-primary border-b border-white/10 px-4 flex items-center justify-between z-40">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-xl font-black text-white tracking-tight">🐾 PetNest <span className="text-brand-primary font-medium text-xs bg-white/10 px-2 py-0.5 rounded-full">Admin</span></span>
        </Link>
        <button
          className="p-2 text-white hover:bg-white/10 rounded-brand-md transition-colors"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 md:hidden z-30"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar container */}
      <aside
        className={`fixed left-0 top-0 bottom-0 bg-brand-text-primary text-white w-64 flex flex-col p-6 shadow-xl border-r border-white/5 transform transition-transform duration-300 z-35 ${
          isOpen ? 'translate-x-0 pt-20' : '-translate-x-full pt-6'
        } md:translate-x-0 md:pt-6`}
      >
        {/* Brand Logo Header */}
        <div className="hidden md:flex flex-col items-center gap-1 mb-8 pb-6 border-b border-white/10">
          <Link to="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            🐾 PetNest
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full border border-brand-primary/20">
            Admin Panel
          </span>
        </div>

        {/* User Card */}
        <div className="mb-6 p-3 bg-white/5 rounded-brand-lg border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shadow-inner overflow-hidden shrink-0">
            {userInfo?.profilePicture ? (
              <img src={userInfo.profilePicture} alt="admin avatar" className="w-full h-full object-cover" />
            ) : (
              userInfo?.name?.charAt(0)?.toUpperCase() || 'A'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{userInfo?.name || 'Administrator'}</p>
            <p className="text-[10px] text-gray-400 truncate">{userInfo?.email}</p>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex flex-col space-y-1.5 flex-1 overflow-y-auto">
          <NavLink to="/admin/dashboard" className={linkClasses} onClick={() => setIsOpen(false)}>
            <LayoutDashboard className="w-4.5 h-4.5" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={linkClasses} onClick={() => setIsOpen(false)}>
            <Users className="w-4.5 h-4.5" /> Customers
          </NavLink>
          <NavLink to="/admin/products" className={linkClasses} onClick={() => setIsOpen(false)}>
            <Box className="w-4.5 h-4.5" /> Catalog Products
          </NavLink>
          <NavLink to="/admin/orders" className={linkClasses} onClick={() => setIsOpen(false)}>
            <ShoppingCart className="w-4.5 h-4.5" /> Customer Orders
          </NavLink>
          <NavLink to="/admin/profile" className={linkClasses} onClick={() => setIsOpen(false)}>
            <User className="w-4.5 h-4.5" /> Edit Profile
          </NavLink>
        </nav>

        {/* Logout Section */}
        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-brand-md hover:bg-brand-danger/10 hover:text-brand-danger text-gray-300 transition-all duration-200 text-sm font-medium cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5" /> Logout Session
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
