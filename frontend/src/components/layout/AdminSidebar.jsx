import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, Users, LogOut, User, Menu } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      toast.success('Logged out');
      navigate('/', { replace: true });
    } catch (err) {
      // Even if API fails, still logout locally and redirect
      dispatch(logout());
      toast.success('Logged out');
      navigate('/', { replace: true });
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded transition-colors ${isActive ? 'bg-blue-800 text-white font-semibold' : 'text-blue-200 hover:bg-blue-900 hover:text-white'
    }`;

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 p-2 md:hidden text-blue-950 z-40 bg-white rounded-lg shadow"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      {/* Fixed Sidebar */}
      <aside
        className={`fixed left-0 top-0 bg-blue-950 text-blue-50 w-64 h-screen flex flex-col p-6 shadow-xl transform transition-transform duration-200 z-35 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          } md:translate-x-0`}
      >
        <h1 className="text-2xl font-bold mb-8 text-center">Admin Panel</h1>
        <nav className="flex flex-col space-y-2 flex-1">
          <NavLink to="/admin/dashboard" className={linkClasses}>
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </NavLink>
          <NavLink to="/admin/users" className={linkClasses}>
            <Users className="w-5 h-5" /> User Management
          </NavLink>
          <NavLink to="/admin/products" className={linkClasses}>
            <Box className="w-5 h-5" /> Product Management
          </NavLink>
          <NavLink to="/admin/orders" className={linkClasses}>
            <ShoppingCart className="w-5 h-5" /> Order Management
          </NavLink>
          <NavLink to="/admin/profile" className={linkClasses}>
            <User className="w-5 h-5" /> Edit Profile
          </NavLink>
        </nav>
        <button
          onClick={logoutHandler}
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-800 text-blue-200 mt-4"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>
    </>
  );
};

export default AdminSidebar;
