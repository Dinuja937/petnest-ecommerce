import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { ShoppingCart } from 'lucide-react';

const NavBar = () => {
  const { userInfo, logout } = useAuth();
  const { cartItems } = useSelector((state) => state.cart);
  const navigate = useNavigate();

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
    }
  };

  const linkClass = ({ isActive }) =>
    `text-sm font-medium transition-all duration-200 py-2 px-3 rounded-brand-md ${
      isActive
        ? 'text-brand-primary bg-brand-secondary'
        : 'text-brand-text-secondary hover:text-brand-primary hover:bg-brand-secondary/40'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-brand-border shadow-brand-soft overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between min-w-0">
        <Link to="/" className="text-2xl font-bold tracking-tight shrink-0 flex items-center">
          <span className="text-brand-text-primary">Pet</span>
          <span className="text-brand-primary">Nest</span>
          <span className="text-brand-primary ml-0.5">🐾</span>
        </Link>
        <nav className="flex gap-2 sm:gap-4 items-center min-w-0 overflow-x-auto py-1">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          <NavLink to="/contact" className={linkClass}>
            Contact
          </NavLink>
          
          {/* Cart Icon Link */}
          <Link
            to="/cart"
            className="p-2 hover:bg-brand-secondary text-brand-text-secondary hover:text-brand-primary rounded-brand-md transition-colors relative flex items-center justify-center shrink-0"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold leading-none text-white bg-brand-primary rounded-full">
                {cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)}
              </span>
            )}
          </Link>

          {/* Auth Section */}
          {userInfo ? (
            <>
              <NavLink to="/profile" className={(props) => `${linkClass(props)} flex items-center gap-2 py-1.5`}>
                {userInfo.profilePicture ? (
                  <img
                    src={userInfo.profilePicture}
                    alt="avatar"
                    className="w-7 h-7 rounded-full object-cover border border-brand-border shrink-0"
                  />
                ) : (
                  <span className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center font-bold text-xs shrink-0 border border-brand-primary/30">
                    {userInfo.name?.charAt(0)?.toUpperCase() || '?'}
                  </span>
                )}
                <span className="max-w-[90px] truncate">{userInfo.name}</span>
              </NavLink>
              {userInfo.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
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
      </div>
    </header>
  );
};

export default NavBar;
