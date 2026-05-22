import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Box, ShoppingCart, Users, LogOut, User, Menu } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      toast.success('Logged out');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Logout failed');
    }
  };

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded transition-colors ${
      isActive ? 'bg-blue-800 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
    }`;

  return (
    <div className="flex">
      {/* Mobile toggle button */}
      <button
        className="p-2 md:hidden text-blue-200"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <Menu className="w-6 h-6" />
      </button>
      {/* Fixed Sidebar */}
      <aside
        className={`bg-blue-950 text-blue-50 w-64 flex flex-col p-6 shadow-xl transform transition-transform duration-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
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
          <button
            onClick={() => navigate('/profile')}
            className={linkClasses({ isActive: false })}
          >
            <User className="w-5 h-5" /> Edit Profile
          </button>
        </nav>
        <button
          onClick={logoutHandler}
          className="flex items-center gap-3 px-4 py-2 rounded hover:bg-blue-800 text-blue-200 mt-4"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </aside>
    </div>
  );
};

export default AdminSidebar;
