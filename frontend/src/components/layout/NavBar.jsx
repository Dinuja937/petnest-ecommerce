import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import api from '../../services/api';
import { ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const NavBar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [categoryOpen, setCategoryOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const linkClass = 'text-gray-600 hover:text-blue-600 font-medium transition-colors';

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-900 tracking-tight">
          PetNest
        </Link>
        <nav className="flex gap-4 items-center">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop
          </NavLink>
          {/* Category dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setCategoryOpen(true)}
            onMouseLeave={() => setCategoryOpen(false)}
          >
            <button className={`${linkClass} flex items-center`}>Categories</button>
            {categoryOpen && (
              <div className="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
                <Link to="/category/dogs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  Dogs
                </Link>
                <Link to="/category/cats" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  Cats
                </Link>
                <Link to="/category/birds" className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
                  Birds
                </Link>
              </div>
            )}
          </div>
          {/* Cart icon */}
          <Link to="/cart" className="relative text-gray-600 hover:text-blue-600 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            {/* Badge placeholder */}
            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
              0
            </span>
          </Link>
          {/* Auth section */}
          {userInfo ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {userInfo.name}
              </NavLink>
              {userInfo.role === 'admin' && (
                <NavLink to="/admin" className={linkClass}>
                  Admin
                </NavLink>
              )}
              <button
                onClick={logoutHandler}
                className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
