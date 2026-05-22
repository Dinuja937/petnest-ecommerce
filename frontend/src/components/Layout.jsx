import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../services/api';
import NavBar from './layout/NavBar';
import Footer from './layout/Footer';

const Layout = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const logoutHandler = async () => {
    try {
      await api.post('/auth/logout');
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
  };

  const isHome = location.pathname === '/';

  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-blue-50/50">
      <Toaster position="top-right" />
      {!isAdminRoute && <NavBar />}

      <main className={`flex-grow w-full ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;
