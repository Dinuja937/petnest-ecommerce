import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import NavBar from './NavBar';
import Footer from './Footer';


const Layout = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen min-w-0 overflow-x-hidden bg-blue-50/50">
      <Toaster position="top-right" />
      {!isAdminRoute && <NavBar />}

      <main className={`grow w-full min-w-0 ${isHome ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'}`}>
        <Outlet />
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;

