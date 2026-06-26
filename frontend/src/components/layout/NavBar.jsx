import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NavBar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const closDrawer = () => setDrawerOpen(false);

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error(error);
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } finally {
      closDrawer();
    }
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-200 py-2 px-3 rounded-brand-md ${
      isActive
        ? 'text-brand-primary bg-brand-secondary'
        : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary/40'
    }`;

  const drawerLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3 px-4 rounded-brand-md text-base font-semibold transition-all duration-200 ${
      isActive
        ? 'text-brand-primary bg-brand-secondary'
        : 'text-brand-text-primary hover:text-brand-primary hover:bg-brand-secondary/50'
    }`;

  const cartCount = cartItems.reduce((acc, item) => acc + (item.qty || 1), 0);

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-brand-border shadow-brand-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closDrawer} className="text-2xl font-bold tracking-tight shrink-0 flex items-center">
            <span className="text-brand-text-primary">Pet</span>
            <span className="text-brand-primary">Nest</span>
            <span className="text-brand-primary ml-0.5">🐾</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-2 lg:gap-4 items-center">
            <NavLink to="/" className={linkClass} end>Home</NavLink>
            <NavLink to="/about" className={linkClass}>About Us</NavLink>
            <NavLink to="/shop" className={linkClass}>Shop</NavLink>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 hover:bg-brand-secondary text-brand-text-secondary hover:text-brand-primary rounded-brand-md transition-colors relative flex items-center justify-center shrink-0"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold leading-none text-white bg-brand-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {userInfo ? (
              <>
                <NavLink to="/profile" className={(props) => `${linkClass(props)} flex items-center gap-2 py-1.5`}>
                  {userInfo.profilePicture ? (
                    <img src={userInfo.profilePicture} alt="avatar" className="w-7 h-7 rounded-full object-cover border border-brand-border shrink-0" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0 border border-brand-primary/30">
                      {userInfo.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                  <span className="max-w-[90px] truncate">{userInfo.name}</span>
                </NavLink>
                {userInfo.role === 'admin' && (
                  <NavLink to="/admin" className={linkClass}>Admin</NavLink>
                )}
                <button
                  onClick={logoutHandler}
                  className="bg-brand-secondary text-brand-primary hover:bg-brand-primary hover:text-white px-4 py-2 rounded-brand-md font-medium text-sm transition-all duration-200 cursor-pointer shrink-0"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-brand-primary text-white hover:bg-brand-primary-hover px-4 py-2 rounded-brand-md font-medium text-sm transition-all duration-200 shadow-brand-soft cursor-pointer hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                Login
              </Link>
            )}
          </nav>

          {/* Mobile right: cart + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <Link
              to="/cart"
              className="p-2 hover:bg-brand-secondary text-brand-text-secondary hover:text-brand-primary rounded-brand-md transition-colors relative flex items-center justify-center"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold leading-none text-white bg-brand-primary rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setDrawerOpen(true)}
              className="p-2 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary rounded-brand-md transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closDrawer}
              className="fixed inset-0 bg-black/40 z-[60] md:hidden"
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="fixed top-0 right-0 bottom-0 w-72 max-w-[85vw] bg-white z-[70] md:hidden shadow-2xl flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-brand-border">
                <Link to="/" onClick={closDrawer} className="text-xl font-bold tracking-tight flex items-center">
                  <span className="text-brand-text-primary">Pet</span>
                  <span className="text-brand-primary">Nest</span>
                  <span className="text-brand-primary ml-0.5">🐾</span>
                </Link>
                <button
                  onClick={closDrawer}
                  className="p-2 text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary rounded-brand-md transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User info strip (if logged in) */}
              {userInfo && (
                <div className="px-5 py-3 bg-brand-secondary/40 border-b border-brand-border flex items-center gap-3">
                  {userInfo.profilePicture ? (
                    <img src={userInfo.profilePicture} alt="avatar" className="w-9 h-9 rounded-full object-cover border-2 border-brand-primary/30 shrink-0" />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {userInfo.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-brand-text-primary truncate">{userInfo.name}</p>
                    <p className="text-xs text-brand-text-secondary truncate">{userInfo.email}</p>
                  </div>
                </div>
              )}

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
                <NavLink to="/" className={drawerLinkClass} end onClick={closDrawer}>Home</NavLink>
                <NavLink to="/about" className={drawerLinkClass} onClick={closDrawer}>About Us</NavLink>
                <NavLink to="/shop" className={drawerLinkClass} onClick={closDrawer}>Shop</NavLink>
                <NavLink to="/contact" className={drawerLinkClass} onClick={closDrawer}>Contact</NavLink>

                {userInfo && (
                  <>
                    <div className="pt-3 pb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-brand-text-secondary px-1">Account</p>
                    </div>
                    <NavLink to="/profile" className={drawerLinkClass} onClick={closDrawer}>My Profile</NavLink>
                    {userInfo.role === 'admin' && (
                      <NavLink to="/admin" className={drawerLinkClass} onClick={closDrawer}>Admin Panel</NavLink>
                    )}
                  </>
                )}
              </nav>

              {/* Bottom action */}
              <div className="px-4 py-5 border-t border-brand-border">
                {userInfo ? (
                  <button
                    onClick={logoutHandler}
                    className="w-full py-3 bg-brand-secondary text-brand-primary hover:bg-brand-primary hover:text-white font-bold rounded-brand-md transition-all text-sm cursor-pointer"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/login"
                    onClick={closDrawer}
                    className="block w-full py-3 text-center bg-brand-primary text-white hover:bg-brand-primary-hover font-bold rounded-brand-md transition-all text-sm shadow-md"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;
