import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../services/api';

const Layout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-blue-50/50">
      <Toaster position="top-right" />
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-900 tracking-tight">PetNest</Link>
          <nav className="flex gap-4 items-center">
            <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link to="/cart" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Cart</Link>
            {userInfo ? (
              <>
                <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                  {userInfo.name}
                </Link>
                {userInfo.role === 'admin' && (
                  <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
                    Admin
                  </Link>
                )}
                <button
                  onClick={logoutHandler}
                  className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <footer className="bg-blue-950 text-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} PetNest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
