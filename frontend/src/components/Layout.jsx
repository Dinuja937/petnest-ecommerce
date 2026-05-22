import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../services/api';
import NavBar from './layout/NavBar';

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
      <NavBar />

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
